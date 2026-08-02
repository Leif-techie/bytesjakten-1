import { db } from "./db";
import { sendPrefsConfirmationEmail } from "./email";

export async function unsubscribeUser(token: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { unsubscribeToken: token } });
  if (!user) return false;

  await db.user.update({
    where: { id: user.id },
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
}): Promise<{ success: boolean; error?: string }> {
  const user = await db.user.findUnique({
    where: { unsubscribeToken: params.token },
  });
  if (!user) {
    return { success: false, error: "Ogiltig länk." };
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      currentOperator: params.currentOperator,
      contractEndDate: params.contractEndDate,
      campaignStartDate: params.campaignStartDate,
      campaignLengthMonths: params.campaignLengthMonths,
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
  if (!user) return false;

  await db.user.delete({ where: { id: userId } });
  return true;
}

export async function getAdminStats() {
  const [userCount, activeUsers, campaignCount, activeCampaigns, meta] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { active: true } }),
      db.campaign.count(),
      db.campaign.count({ where: { active: true } }),
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
    campaignCount,
    activeCampaigns,
    recentNotifications,
    lastCampaignUpdate: meta?.lastCampaignUpdate ?? null,
  };
}
