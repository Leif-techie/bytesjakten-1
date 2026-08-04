import { db } from "./db";
import { findBestCampaign, getCampaignAffiliateUrl } from "./campaigns";
import {
  sendBroadbandSwitchReminderEmail,
  sendPrefsConfirmationEmail,
  sendSwitchReminderEmail,
} from "./email";
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
    campaignUrl: getCampaignAffiliateUrl(campaign),
    contractEndDate: user.contractEndDate,
    network: campaign.network ?? "any",
    unsubscribeToken: user.unsubscribeToken,
    campaignId: campaign.id,
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

export async function sendManualBroadbandSwitchEmail(
  userId: string,
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await db.broadbandUser.findUnique({ where: { id: userId } });
  if (!user || !user.active) {
    return { success: false, error: "Användaren hittades inte." };
  }

  const campaign = await db.broadbandCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) {
    return { success: false, error: "Kampanjen hittades inte." };
  }

  const result = await sendBroadbandSwitchReminderEmail({
    email: user.email,
    operator: campaign.operator,
    campaignName: campaign.name,
    campaignPrice: campaign.campaignPrice,
    regularPrice: campaign.regularPrice,
    campaignUrl: campaign.url,
    contractEndDate: user.contractEndDate,
    speedMbps: campaign.speedMbps,
    technology: campaign.technology,
    unsubscribeToken: user.unsubscribeToken,
  });

  if (result.success) {
    await db.notificationLog.create({
      data: {
        broadbandUserId: user.id,
        type: "broadband_switch_reminder",
        broadbandCampaignId: campaign.id,
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
  isStudent?: boolean;
}): Promise<{ userId: string; isNew: boolean; emailSent: boolean }> {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  const isStudent = Boolean(data.isStudent);

  if (existing) {
    const updated = await db.user.update({
      where: { id: existing.id },
      data: {
        currentOperator: data.currentOperator,
        contractEndDate: data.contractEndDate,
        minDataGB: data.minDataGB,
        networkPreference: data.networkPreference,
        isStudent,
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

    if (emailResult.success) {
      await db.notificationLog.create({
        data: { userId: updated.id, type: "prefs_update_confirmation" },
      });
    }

    return { userId: updated.id, isNew: false, emailSent: emailResult.success };
  }

  const user = await db.user.create({
    data: {
      email: data.email,
      currentOperator: data.currentOperator,
      contractEndDate: data.contractEndDate,
      minDataGB: data.minDataGB,
      networkPreference: data.networkPreference,
      isStudent,
    },
  });

  const emailResult = await sendPrefsConfirmationEmail({
    email: user.email,
    currentOperator: user.currentOperator,
    contractEndDate: user.contractEndDate,
    minDataGB: user.minDataGB,
    networkPreference: user.networkPreference,
    isStudent: user.isStudent,
    unsubscribeToken: user.unsubscribeToken,
    kind: "register",
  });

  if (emailResult.success) {
    await db.notificationLog.create({
      data: { userId: user.id, type: "registration_confirmation" },
    });
  }

  return { userId: user.id, isNew: true, emailSent: emailResult.success };
}

export async function getPersonalizedOffer(
  minDataGB: number,
  networkPreference: string,
  currentOperator: string,
  isStudent = false
) {
  await getActiveCampaigns();
  const campaigns = await db.campaign.findMany({
    where: { active: true, noBinding: true },
  });

  return findBestCampaign(campaigns, minDataGB, networkPreference, currentOperator, {
    isStudent,
  });
}
