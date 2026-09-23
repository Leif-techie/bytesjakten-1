import type { Campaign } from "@/generated/prisma/client";
import { db } from "./db";

export type SnapshotSource =
  | "seed_refresh"
  | "admin_create"
  | "admin_update"
  | "admin_publish";

export async function createCampaignSnapshot(
  campaign: Campaign,
  source: SnapshotSource
) {
  return db.campaignSnapshot.create({
    data: {
      campaignId: campaign.id,
      operator: campaign.operator,
      name: campaign.name,
      dataGB: campaign.dataGB,
      campaignPrice: campaign.campaignPrice,
      regularPrice: campaign.regularPrice,
      campaignStart: campaign.campaignStart,
      campaignEnd: campaign.campaignEnd,
      url: campaign.url,
      network: campaign.network,
      noBinding: campaign.noBinding,
      isStudent: campaign.isStudent,
      active: campaign.active,
      source,
    },
  });
}

export async function createCampaignSnapshots(
  campaigns: Campaign[],
  source: SnapshotSource
) {
  if (campaigns.length === 0) return;

  await db.campaignSnapshot.createMany({
    data: campaigns.map((campaign) => ({
      campaignId: campaign.id,
      operator: campaign.operator,
      name: campaign.name,
      dataGB: campaign.dataGB,
      campaignPrice: campaign.campaignPrice,
      regularPrice: campaign.regularPrice,
      campaignStart: campaign.campaignStart,
      campaignEnd: campaign.campaignEnd,
      url: campaign.url,
      network: campaign.network,
      noBinding: campaign.noBinding,
      isStudent: campaign.isStudent,
      active: campaign.active,
      source,
    })),
  });
}

/** Publish current active campaigns into lab history after admin review. */
export async function publishActiveCampaignsToLab() {
  const campaigns = await db.campaign.findMany({
    where: { active: true },
    orderBy: [{ operator: "asc" }, { campaignPrice: "asc" }],
  });

  await createCampaignSnapshots(campaigns, "admin_publish");

  return {
    published: campaigns.length,
    campaigns: campaigns.map((c) => ({
      id: c.id,
      operator: c.operator,
      name: c.name,
      dataGB: c.dataGB,
      campaignPrice: c.campaignPrice,
    })),
  };
}
