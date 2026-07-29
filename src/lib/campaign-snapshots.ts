import type { Campaign } from "@/generated/prisma/client";
import { db } from "./db";

type SnapshotSource = "seed_refresh" | "admin_create" | "admin_update";

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
