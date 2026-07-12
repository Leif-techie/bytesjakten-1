import { db } from "./db";

export async function unsubscribeUser(token: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { unsubscribeToken: token } });
  if (!user) return false;

  await db.user.update({
    where: { id: user.id },
    data: { active: false },
  });

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
