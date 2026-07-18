import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/admin";
import { updateCampaigns } from "@/lib/seed-campaigns";
import { sendManualSwitchEmail } from "@/lib/notifications";
import { sendSwitchReminderEmail, getEmailConfigStatus } from "@/lib/email";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getAdminStats();
  const campaigns = await db.campaign.findMany({ orderBy: [{ operator: "asc" }, { dataGB: "asc" }] });
  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { contractEndDate: "asc" },
    select: {
      id: true,
      email: true,
      currentOperator: true,
      contractEndDate: true,
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
  });

  const notificationLogs = await db.notificationLog.findMany({
    orderBy: { sentAt: "desc" },
    take: 50,
    include: {
      user: {
        select: { email: true, currentOperator: true },
      },
    },
  });

  const campaignIds = [
    ...new Set(
      notificationLogs
        .map((log) => log.campaignId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const notifiedCampaigns = campaignIds.length
    ? await db.campaign.findMany({
        where: { id: { in: campaignIds } },
        select: { id: true, operator: true, name: true, campaignPrice: true },
      })
    : [];

  const campaignMap = Object.fromEntries(
    notifiedCampaigns.map((campaign) => [campaign.id, campaign])
  );

  const usersWithStatus = users.map((user) => {
    const lastNotification = user.notifications[0] ?? null;
    const lastCampaign = lastNotification?.campaignId
      ? campaignMap[lastNotification.campaignId]
      : null;

    return {
      id: user.id,
      email: user.email,
      currentOperator: user.currentOperator,
      contractEndDate: user.contractEndDate,
      minDataGB: user.minDataGB,
      createdAt: user.createdAt,
      notificationCount: user._count.notifications,
      lastNotificationAt: lastNotification?.sentAt ?? null,
      lastCampaignOperator: lastCampaign?.operator ?? null,
      lastCampaignName: lastCampaign?.name ?? null,
    };
  });

  const notifications = notificationLogs.map((log) => {
    const campaign = log.campaignId ? campaignMap[log.campaignId] : null;
    return {
      id: log.id,
      type: log.type,
      sentAt: log.sentAt,
      email: log.user.email,
      currentOperator: log.user.currentOperator,
      campaignOperator: campaign?.operator ?? null,
      campaignName: campaign?.name ?? null,
      campaignPrice: campaign?.campaignPrice ?? null,
    };
  });

  return NextResponse.json({
    stats,
    campaigns,
    users: usersWithStatus,
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

  if (action === "test_email") {
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: "E-post saknas." }, { status: 400 });
    }

    const result = await sendSwitchReminderEmail({
      email,
      operator: "Hallon",
      campaignName: "Hallon – 25 GB (test)",
      campaignPrice: 49,
      regularPrice: 199,
      campaignUrl: "https://www.hallon.se/",
      contractEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      network: "tre",
      unsubscribeToken: "test-token",
    });

    return NextResponse.json({ success: result.success, error: result.error });
  }

  return NextResponse.json({ error: "Okänd action." }, { status: 400 });
}
