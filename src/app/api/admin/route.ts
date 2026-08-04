import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { deleteUser, getAdminStats } from "@/lib/admin";
import { updateCampaigns } from "@/lib/seed-campaigns";
import {
  sendManualBroadbandSwitchEmail,
  sendManualSwitchEmail,
} from "@/lib/notifications";
import { getEmailConfigStatus } from "@/lib/email";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getAdminStats();
  const [campaigns, broadbandCampaigns, users, broadbandUsers, notificationLogs] =
    await Promise.all([
      db.campaign.findMany({
        orderBy: [{ operator: "asc" }, { dataGB: "asc" }],
      }),
      db.broadbandCampaign.findMany({
        orderBy: [{ operator: "asc" }, { speedMbps: "asc" }],
      }),
      db.user.findMany({
        orderBy: [{ active: "desc" }, { contractEndDate: "asc" }],
        select: {
          id: true,
          email: true,
          active: true,
          currentOperator: true,
          contractEndDate: true,
          campaignStartDate: true,
          campaignLengthMonths: true,
          minDataGB: true,
          createdAt: true,
          notifications: {
            where: { type: "switch_reminder" },
            orderBy: { sentAt: "desc" },
            take: 1,
            select: { sentAt: true, campaignId: true },
          },
          _count: { select: { notifications: true } },
        },
      }),
      db.broadbandUser.findMany({
        orderBy: [{ active: "desc" }, { contractEndDate: "asc" }],
        select: {
          id: true,
          email: true,
          active: true,
          currentOperator: true,
          contractEndDate: true,
          minSpeedMbps: true,
          technology: true,
          createdAt: true,
          notifications: {
            where: { type: "broadband_switch_reminder" },
            orderBy: { sentAt: "desc" },
            take: 1,
            select: { sentAt: true, broadbandCampaignId: true },
          },
        },
      }),
      db.notificationLog.findMany({
        orderBy: { sentAt: "desc" },
        take: 50,
        include: {
          user: { select: { email: true, currentOperator: true } },
          broadbandUser: { select: { email: true, currentOperator: true } },
        },
      }),
    ]);

  const campaignIds = [
    ...new Set(
      notificationLogs
        .map((log) => log.campaignId)
        .filter((id): id is string => Boolean(id))
    ),
  ];
  const broadbandCampaignIds = [
    ...new Set(
      notificationLogs
        .map((log) => log.broadbandCampaignId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const [notifiedCampaigns, notifiedBroadbandCampaigns] = await Promise.all([
    campaignIds.length
      ? db.campaign.findMany({
          where: { id: { in: campaignIds } },
          select: {
            id: true,
            operator: true,
            name: true,
            campaignPrice: true,
          },
        })
      : Promise.resolve([]),
    broadbandCampaignIds.length
      ? db.broadbandCampaign.findMany({
          where: { id: { in: broadbandCampaignIds } },
          select: {
            id: true,
            operator: true,
            name: true,
            campaignPrice: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const campaignMap = Object.fromEntries(
    notifiedCampaigns.map((campaign) => [campaign.id, campaign])
  );
  const broadbandCampaignMap = Object.fromEntries(
    notifiedBroadbandCampaigns.map((campaign) => [campaign.id, campaign])
  );

  const usersWithStatus = users.map((user) => {
    const lastNotification = user.notifications[0] ?? null;
    const lastCampaign = lastNotification?.campaignId
      ? campaignMap[lastNotification.campaignId]
      : null;

    return {
      id: user.id,
      email: user.email,
      active: user.active,
      currentOperator: user.currentOperator,
      contractEndDate: user.contractEndDate,
      campaignStartDate: user.campaignStartDate,
      campaignLengthMonths: user.campaignLengthMonths,
      minDataGB: user.minDataGB,
      createdAt: user.createdAt,
      notificationCount: user._count.notifications,
      lastNotificationAt: lastNotification?.sentAt ?? null,
      lastCampaignOperator: lastCampaign?.operator ?? null,
      lastCampaignName: lastCampaign?.name ?? null,
    };
  });

  const broadbandUsersWithStatus = broadbandUsers.map((user) => {
    const lastNotification = user.notifications[0] ?? null;
    const lastCampaign = lastNotification?.broadbandCampaignId
      ? broadbandCampaignMap[lastNotification.broadbandCampaignId]
      : null;

    return {
      id: user.id,
      email: user.email,
      active: user.active,
      currentOperator: user.currentOperator,
      contractEndDate: user.contractEndDate,
      minSpeedMbps: user.minSpeedMbps,
      technology: user.technology,
      createdAt: user.createdAt,
      lastNotificationAt: lastNotification?.sentAt ?? null,
      lastCampaignOperator: lastCampaign?.operator ?? null,
      lastCampaignName: lastCampaign?.name ?? null,
    };
  });

  const notifications = notificationLogs.map((log) => {
    const person = log.user ?? log.broadbandUser;
    const mobileCampaign = log.campaignId ? campaignMap[log.campaignId] : null;
    const bbCampaign = log.broadbandCampaignId
      ? broadbandCampaignMap[log.broadbandCampaignId]
      : null;
    const campaign = mobileCampaign ?? bbCampaign;

    return {
      id: log.id,
      type: log.type,
      sentAt: log.sentAt,
      email: person?.email ?? "–",
      currentOperator: person?.currentOperator ?? "–",
      vertical: log.broadbandUserId ? "broadband" : "mobile",
      campaignOperator: campaign?.operator ?? null,
      campaignName: campaign?.name ?? null,
      campaignPrice: campaign?.campaignPrice ?? null,
    };
  });

  return NextResponse.json({
    stats,
    campaigns,
    broadbandCampaigns,
    users: usersWithStatus,
    broadbandUsers: broadbandUsersWithStatus,
    notifications,
    emailConfig: getEmailConfigStatus(),
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action as string;

  if (action === "refresh_campaigns") {
    const result = await updateCampaigns();
    return NextResponse.json({ success: true, result });
  }

  if (action === "send_user_email") {
    const { userId, campaignId } = body;
    if (!userId || !campaignId) {
      return NextResponse.json(
        { error: "Välj användare och kampanj." },
        { status: 400 }
      );
    }

    const result = await sendManualSwitchEmail(userId, campaignId);
    return NextResponse.json({
      success: result.success,
      error: result.error,
    });
  }

  if (action === "send_broadband_user_email") {
    const { userId, campaignId } = body;
    if (!userId || !campaignId) {
      return NextResponse.json(
        { error: "Välj användare och kampanj." },
        { status: 400 }
      );
    }

    const result = await sendManualBroadbandSwitchEmail(userId, campaignId);
    return NextResponse.json({
      success: result.success,
      error: result.error,
    });
  }

  if (action === "delete_user") {
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: "Användare saknas." }, { status: 400 });
    }

    const success = await deleteUser(userId);
    if (!success) {
      return NextResponse.json(
        { error: "Användaren hittades inte." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Okänd action." }, { status: 400 });
}
