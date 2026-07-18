import { db } from "./db";
import { findBestCampaign } from "./campaigns";
import { sendSwitchReminderEmail } from "./email";
import { getActiveCampaigns } from "./seed-campaigns";

export async function sendManualSwitchEmail(
  userId: string,
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.active) {
    return { success: false, error: "Användaren hittades inte." };
  }

  const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) {
    return { success: false, error: "Kampanjen hittades inte." };
  }

  const result = await sendSwitchReminderEmail({
    email: user.email,
    operator: campaign.operator,
    campaignName: campaign.name,
    campaignPrice: campaign.campaignPrice,
    regularPrice: campaign.regularPrice,
    campaignUrl: campaign.url,
    contractEndDate: user.contractEndDate,
    network: campaign.network ?? "any",
    unsubscribeToken: user.unsubscribeToken,
  });

  if (result.success) {
    await db.notificationLog.create({
      data: {
        userId: user.id,
        type: "switch_reminder",
        campaignId: campaign.id,
      },
    });
  }

  return { success: result.success, error: result.error };
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
  // Inga automatiska mejl – utskick sker manuellt via admin.
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
