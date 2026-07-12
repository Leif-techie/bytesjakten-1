import { db } from "./db";
import { findBestCampaign, shouldNotifyUser } from "./campaigns";
import { sendSwitchReminderEmail, sendWelcomeEmail } from "./email";
import { getActiveCampaigns } from "./seed-campaigns";

export async function processUserNotifications(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
}> {
  const now = new Date();
  const users = await db.user.findMany({ where: { active: true } });
  const campaigns = await db.campaign.findMany({ where: { active: true, noBinding: true } });

  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    if (!shouldNotifyUser(user.contractEndDate, now)) {
      skipped++;
      continue;
    }

    const alreadySent = await db.notificationLog.findFirst({
      where: {
        userId: user.id,
        type: "switch_reminder",
        sentAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
        },
      },
    });

    if (alreadySent) {
      skipped++;
      continue;
    }

    const best = findBestCampaign(
      campaigns,
      user.minDataGB,
      user.networkPreference,
      user.currentOperator,
      now
    );

    if (!best) {
      skipped++;
      continue;
    }

    const result = await sendSwitchReminderEmail({
      email: user.email,
      operator: best.operator,
      campaignName: best.name,
      campaignPrice: best.campaignPrice,
      regularPrice: best.regularPrice,
      campaignUrl: best.url,
      contractEndDate: user.contractEndDate,
      network: best.network ?? "any",
      unsubscribeToken: user.unsubscribeToken,
    });

    if (result.success) {
      await db.notificationLog.create({
        data: {
          userId: user.id,
          type: "switch_reminder",
          campaignId: best.id,
        },
      });
      sent++;
    } else {
      skipped++;
    }
  }

  return { processed: users.length, sent, skipped };
}

export async function registerUser(data: {
  email: string;
  currentOperator: string;
  contractEndDate: Date;
  minDataGB: number;
  networkPreference: string;
}): Promise<{ userId: string; isNew: boolean }> {
  const existing = await db.user.findUnique({ where: { email: data.email } });

  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: {
        currentOperator: data.currentOperator,
        contractEndDate: data.contractEndDate,
        minDataGB: data.minDataGB,
        networkPreference: data.networkPreference,
      },
    });
    return { userId: existing.id, isNew: false };
  }

  const user = await db.user.create({ data });
  await sendWelcomeEmail(data.email, data.contractEndDate, user.unsubscribeToken);
  return { userId: user.id, isNew: true };
}

export async function getPersonalizedOffer(
  minDataGB: number,
  networkPreference: string,
  currentOperator: string
) {
  await getActiveCampaigns();
  const campaigns = await db.campaign.findMany({
    where: { active: true, noBinding: true },
  });

  return findBestCampaign(
    campaigns,
    minDataGB,
    networkPreference,
    currentOperator
  );
}
