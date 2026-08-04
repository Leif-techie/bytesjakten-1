import { db } from "./db";
import { sendPrefsConfirmationEmail } from "./email";

export async function unsubscribeUser(token: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { unsubscribeToken: token } });
  if (user) {
    await db.user.update({
      where: { id: user.id },
      data: { active: false },
    });
    return true;
  }

  const broadbandUser = await db.broadbandUser.findUnique({
    where: { unsubscribeToken: token },
  });
  if (!broadbandUser) return false;

  await db.broadbandUser.update({
    where: { id: broadbandUser.id },
    data: { active: false },
  });
  return true;
}

export async function getUserByToken(token: string) {
  return db.user.findUnique({ where: { unsubscribeToken: token } });
}

export async function completeSwitch(params: {
  token: string;
  currentOperator: string;
  contractEndDate: Date;
  campaignStartDate: Date;
  campaignLengthMonths: number;
  campaignId?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const user = await db.user.findUnique({
    where: { unsubscribeToken: params.token },
  });
  if (!user) {
    return { success: false, error: "Ogiltig länk." };
  }

  let switchedCampaignPrice: number | null = user.switchedCampaignPrice;
  let switchedRegularPrice: number | null = user.switchedRegularPrice;
  let resolvedCampaignId: string | null = params.campaignId ?? null;

  if (params.campaignId) {
    const fromLink = await db.campaign.findUnique({
      where: { id: params.campaignId },
      select: { id: true, campaignPrice: true, regularPrice: true },
    });
    if (fromLink) {
      switchedCampaignPrice = fromLink.campaignPrice;
      switchedRegularPrice = fromLink.regularPrice;
      resolvedCampaignId = fromLink.id;
    }
  }

  if (switchedCampaignPrice == null || switchedRegularPrice == null) {
    const reminders = await db.notificationLog.findMany({
      where: { userId: user.id, type: "switch_reminder", campaignId: { not: null } },
      orderBy: { sentAt: "desc" },
      take: 10,
      select: { campaignId: true },
    });
    const campaignIds = reminders
      .map((r) => r.campaignId)
      .filter((id): id is string => Boolean(id));

    if (campaignIds.length > 0) {
      const campaigns = await db.campaign.findMany({
        where: { id: { in: campaignIds } },
        select: {
          id: true,
          operator: true,
          campaignPrice: true,
          regularPrice: true,
        },
      });
      const byId = Object.fromEntries(campaigns.map((c) => [c.id, c]));
      const matching =
        campaignIds
          .map((id) => byId[id])
          .find(
            (c) =>
              c &&
              c.operator.toLowerCase() === params.currentOperator.toLowerCase()
          ) ?? campaignIds.map((id) => byId[id]).find(Boolean);

      if (matching) {
        switchedCampaignPrice = matching.campaignPrice;
        switchedRegularPrice = matching.regularPrice;
        resolvedCampaignId = matching.id;
      }
    }
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      currentOperator: params.currentOperator,
      contractEndDate: params.contractEndDate,
      campaignStartDate: params.campaignStartDate,
      campaignLengthMonths: params.campaignLengthMonths,
      switchedCampaignPrice,
      switchedRegularPrice,
      active: true,
    },
  });

  const emailResult = await sendPrefsConfirmationEmail({
    email: updated.email,
    currentOperator: updated.currentOperator,
    contractEndDate: updated.contractEndDate,
    minDataGB: updated.minDataGB,
    networkPreference: updated.networkPreference,
    isStudent: updated.isStudent,
    unsubscribeToken: updated.unsubscribeToken,
    kind: "update",
  });

  await db.notificationLog.create({
    data: {
      userId: updated.id,
      type: "switch_complete",
      campaignId: resolvedCampaignId,
    },
  });

  if (emailResult.success) {
    await db.notificationLog.create({
      data: {
        userId: updated.id,
        type: "prefs_update_confirmation",
      },
    });
  }

  return { success: true };
}

export async function deleteUser(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user) {
    await db.user.delete({ where: { id: userId } });
    return true;
  }

  const broadbandUser = await db.broadbandUser.findUnique({
    where: { id: userId },
  });
  if (!broadbandUser) return false;

  await db.broadbandUser.delete({ where: { id: userId } });
  return true;
}

export async function getAdminStats() {
  const [
    userCount,
    activeUsers,
    broadbandUserCount,
    activeBroadbandUsers,
    campaignCount,
    activeCampaigns,
    broadbandCampaignCount,
    activeBroadbandCampaigns,
    meta,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { active: true } }),
    db.broadbandUser.count(),
    db.broadbandUser.count({ where: { active: true } }),
    db.campaign.count(),
    db.campaign.count({ where: { active: true } }),
    db.broadbandCampaign.count(),
    db.broadbandCampaign.count({ where: { active: true } }),
    db.systemMeta.findUnique({ where: { id: "singleton" } }),
  ]);

  const recentNotifications = await db.notificationLog.count({
    where: {
      sentAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });

  return {
    userCount,
    activeUsers,
    broadbandUserCount,
    activeBroadbandUsers,
    campaignCount,
    activeCampaigns,
    broadbandCampaignCount,
    activeBroadbandCampaigns,
    recentNotifications,
    lastCampaignUpdate: meta?.lastCampaignUpdate ?? null,
  };
}
