import { db } from "./db";
import { getCampaignAffiliateUrl } from "./campaigns";
import { sendSamlingReminderEmail } from "./email";
import {
  formatReminderTitle,
  reminderCategoryLabel,
  reminderSubtypeLabel,
} from "./samling-constants";
import { unsubscribeAllForEmail } from "./samling";

export type EmailProfileItem =
  | {
      kind: "mobile" | "broadband" | "electricity";
      id: string;
      label: string;
      provider: string;
      endDate: string | null;
      detail: string;
      active: boolean;
      unsubscribeToken: string;
    }
  | {
      kind: "reminder";
      id: string;
      category: string;
      subtype: string;
      label: string;
      provider: string;
      endDate: string | null;
      detail: string;
      active: boolean;
      unsubscribeToken: string;
      objectLabel: string | null;
    };

export type EmailProfile = {
  email: string;
  items: EmailProfileItem[];
};

export async function listReminderSubscriptions() {
  return db.reminderSubscription.findMany({
    orderBy: [{ active: "desc" }, { renewalDate: "asc" }, { email: "asc" }],
  });
}

export async function getEmailProfile(
  email: string,
): Promise<EmailProfile | null> {
  const normalized = email.trim().toLowerCase();
  const [mobile, broadband, electricity, reminders] = await Promise.all([
    db.user.findUnique({ where: { email: normalized } }),
    db.broadbandUser.findUnique({ where: { email: normalized } }),
    db.electricityUser.findUnique({ where: { email: normalized } }),
    db.reminderSubscription.findMany({
      where: { email: normalized },
      orderBy: [{ active: "desc" }, { renewalDate: "asc" }],
    }),
  ]);

  if (!mobile && !broadband && !electricity && reminders.length === 0) {
    return null;
  }

  const items: EmailProfileItem[] = [];

  if (mobile) {
    items.push({
      kind: "mobile",
      id: mobile.id,
      label: "Mobilabonnemang",
      provider: mobile.currentOperator,
      endDate: mobile.contractEndDate.toISOString(),
      detail: `${mobile.minDataGB} GB`,
      active: mobile.active,
      unsubscribeToken: mobile.unsubscribeToken,
    });
  }
  if (broadband) {
    items.push({
      kind: "broadband",
      id: broadband.id,
      label: "Mobilt bredband",
      provider: broadband.currentOperator,
      endDate: broadband.contractEndDate.toISOString(),
      detail: `${broadband.minSpeedMbps} Mbit/s`,
      active: broadband.active,
      unsubscribeToken: broadband.unsubscribeToken,
    });
  }
  if (electricity) {
    items.push({
      kind: "electricity",
      id: electricity.id,
      label: "Elavtal",
      provider: electricity.currentOperator,
      endDate: electricity.contractEndDate.toISOString(),
      detail: electricity.priceTypePreference,
      active: electricity.active,
      unsubscribeToken: electricity.unsubscribeToken,
    });
  }
  for (const r of reminders) {
    items.push({
      kind: "reminder",
      id: r.id,
      category: r.category,
      subtype: r.subtype,
      label: formatReminderTitle(r),
      provider: r.provider || reminderSubtypeLabel(r.category, r.subtype),
      endDate: r.renewalDate?.toISOString() ?? null,
      detail: reminderCategoryLabel(r.category),
      active: r.active,
      unsubscribeToken: r.unsubscribeToken,
      objectLabel: r.objectLabel,
    });
  }

  return { email: normalized, items };
}

export async function listEmailProfiles(): Promise<EmailProfile[]> {
  const [users, broadbandUsers, electricityUsers, reminders] =
    await Promise.all([
      db.user.findMany({ select: { email: true } }),
      db.broadbandUser.findMany({ select: { email: true } }),
      db.electricityUser.findMany({ select: { email: true } }),
      db.reminderSubscription.findMany({ select: { email: true } }),
    ]);

  const emails = [
    ...new Set([
      ...users.map((u) => u.email),
      ...broadbandUsers.map((u) => u.email),
      ...electricityUsers.map((u) => u.email),
      ...reminders.map((u) => u.email),
    ]),
  ].sort((a, b) => a.localeCompare(b, "sv"));

  const profiles: EmailProfile[] = [];
  for (const email of emails) {
    const profile = await getEmailProfile(email);
    if (profile) profiles.push(profile);
  }
  return profiles;
}

export async function deleteReminderSubscription(
  id: string,
): Promise<boolean> {
  const row = await db.reminderSubscription.findUnique({ where: { id } });
  if (!row) return false;
  await db.reminderSubscription.delete({ where: { id } });
  return true;
}

export async function unsubscribeReminderSubscription(
  id: string,
): Promise<boolean> {
  const row = await db.reminderSubscription.findUnique({ where: { id } });
  if (!row) return false;
  await db.reminderSubscription.update({
    where: { id },
    data: { active: false },
  });
  return true;
}

export async function deleteAllForEmail(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  await Promise.all([
    db.user.deleteMany({ where: { email: normalized } }),
    db.broadbandUser.deleteMany({ where: { email: normalized } }),
    db.electricityUser.deleteMany({ where: { email: normalized } }),
    db.reminderSubscription.deleteMany({ where: { email: normalized } }),
  ]);
}

export async function deactivateAllForEmail(email: string): Promise<void> {
  await unsubscribeAllForEmail(email.trim().toLowerCase());
}

type PrimaryKind = "mobile" | "broadband" | "electricity" | "reminder";

export async function sendManualSamlingEmail(params: {
  email: string;
  primaryKind: PrimaryKind;
  primaryId: string;
  campaignId?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const profile = await getEmailProfile(params.email);
  if (!profile) {
    return { success: false, error: "Ingen användare med den e-posten." };
  }

  const primary = profile.items.find(
    (item) => item.kind === params.primaryKind && item.id === params.primaryId,
  );
  if (!primary || !primary.active) {
    return { success: false, error: "Primär tjänst hittades inte eller är avregistrerad." };
  }

  const secondary = profile.items.filter(
    (item) =>
      item.active &&
      !(item.kind === primary.kind && item.id === primary.id),
  );

  let offer: {
    operator: string;
    campaignName: string;
    campaignPrice: number;
    regularPrice: number;
    campaignUrl: string;
    network?: string;
    speedMbps?: number;
    technology?: string;
    priceUnit: "kr" | "ore";
  } | null = null;

  if (
    (params.primaryKind === "mobile" ||
      params.primaryKind === "broadband" ||
      params.primaryKind === "electricity") &&
    params.campaignId
  ) {
    if (params.primaryKind === "mobile") {
      const campaign = await db.campaign.findUnique({
        where: { id: params.campaignId },
      });
      if (!campaign) {
        return { success: false, error: "Kampanjen hittades inte." };
      }
      offer = {
        operator: campaign.operator,
        campaignName: campaign.name,
        campaignPrice: campaign.campaignPrice,
        regularPrice: campaign.regularPrice,
        campaignUrl: getCampaignAffiliateUrl(campaign),
        network: campaign.network,
        priceUnit: "kr",
      };
    } else if (params.primaryKind === "broadband") {
      const campaign = await db.broadbandCampaign.findUnique({
        where: { id: params.campaignId },
      });
      if (!campaign) {
        return { success: false, error: "Kampanjen hittades inte." };
      }
      offer = {
        operator: campaign.operator,
        campaignName: campaign.name,
        campaignPrice: campaign.campaignPrice,
        regularPrice: campaign.regularPrice,
        campaignUrl: campaign.url,
        speedMbps: campaign.speedMbps,
        technology: campaign.technology,
        priceUnit: "kr",
      };
    } else {
      const campaign = await db.electricityCampaign.findUnique({
        where: { id: params.campaignId },
      });
      if (!campaign) {
        return { success: false, error: "Kampanjen hittades inte." };
      }
      offer = {
        operator: campaign.operator,
        campaignName: campaign.name,
        campaignPrice: campaign.campaignPrice,
        regularPrice: campaign.regularPrice,
        campaignUrl: campaign.url,
        priceUnit: "ore",
      };
    }
  }

  const result = await sendSamlingReminderEmail({
    email: profile.email,
    primary: {
      kind: primary.kind,
      label: primary.label,
      provider: primary.provider,
      endDate: primary.endDate ? new Date(primary.endDate) : null,
      detail: primary.detail,
      unsubscribeToken: primary.unsubscribeToken,
      category: primary.kind === "reminder" ? primary.category : undefined,
    },
    secondary: secondary.map((item) => ({
      label: item.label,
      provider: item.provider,
      endDate: item.endDate ? new Date(item.endDate) : null,
      detail: item.detail,
      unsubscribeToken: item.unsubscribeToken,
    })),
    offer,
    unsubscribeAllToken: primary.unsubscribeToken,
  });

  if (result.success) {
    const logData: {
      type: string;
      userId?: string;
      broadbandUserId?: string;
      electricityUserId?: string;
      campaignId?: string;
      broadbandCampaignId?: string;
      electricityCampaignId?: string;
    } = { type: "samling_reminder" };

    if (params.primaryKind === "mobile") {
      logData.userId = params.primaryId;
      if (params.campaignId) logData.campaignId = params.campaignId;
    } else if (params.primaryKind === "broadband") {
      logData.broadbandUserId = params.primaryId;
      if (params.campaignId) logData.broadbandCampaignId = params.campaignId;
    } else if (params.primaryKind === "electricity") {
      logData.electricityUserId = params.primaryId;
      if (params.campaignId) {
        logData.electricityCampaignId = params.campaignId;
      }
    } else {
      const mobile = profile.items.find(
        (i) => i.kind === "mobile" && i.active,
      );
      const broadband = profile.items.find(
        (i) => i.kind === "broadband" && i.active,
      );
      const electricity = profile.items.find(
        (i) => i.kind === "electricity" && i.active,
      );
      if (mobile) logData.userId = mobile.id;
      else if (broadband) logData.broadbandUserId = broadband.id;
      else if (electricity) logData.electricityUserId = electricity.id;
    }

    await db.notificationLog.create({ data: logData });
  }

  return { success: result.success, error: result.error };
}
