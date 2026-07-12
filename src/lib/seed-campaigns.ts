import type { Campaign } from "@/generated/prisma/client";
import { db } from "./db";

type SeedCampaign = {
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  campaignStart: Date;
  campaignEnd: Date;
  url: string;
  network: string;
};

function buildCampaigns(now: Date): SeedCampaign[] {
  const year = now.getFullYear();
  const julyStart = new Date(year, 6, 1);
  const novEnd = new Date(year, 10, 30);
  const springStart = new Date(year, 2, 1);
  const springEnd = new Date(year, 5, 30);

  return [
    {
      operator: "Telia",
      name: "Telia – 25 GB",
      dataGB: 25,
      campaignPrice: 39,
      regularPrice: 259,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.telia.se/privat/mobil/mobilabonnemang/",
      network: "telia",
    },
    {
      operator: "Hallon",
      name: "Hallon – 25 GB",
      dataGB: 25,
      campaignPrice: 49,
      regularPrice: 199,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Comviq",
      name: "Comviq – 25 GB",
      dataGB: 25,
      campaignPrice: 59,
      regularPrice: 229,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.comviq.se/",
      network: "telenor",
    },
    {
      operator: "Telenor",
      name: "Telenor – 25 GB",
      dataGB: 25,
      campaignPrice: 69,
      regularPrice: 249,
      campaignStart: springStart,
      campaignEnd: springEnd,
      url: "https://www.telenor.se/privat/mobil/mobilabonnemang/",
      network: "telenor",
    },
    {
      operator: "Tre",
      name: "Tre – 25 GB",
      dataGB: 25,
      campaignPrice: 79,
      regularPrice: 269,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.tre.se/privat/mobil/mobilabonnemang/",
      network: "tre",
    },
    {
      operator: "Vimla",
      name: "Vimla – 25 GB",
      dataGB: 25,
      campaignPrice: 55,
      regularPrice: 189,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.vimla.se/",
      network: "telenor",
    },
    {
      operator: "Fello",
      name: "Fello – 25 GB",
      dataGB: 25,
      campaignPrice: 45,
      regularPrice: 179,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.fello.se/",
      network: "telenor",
    },
    {
      operator: "Telia",
      name: "Telia – 10 GB",
      dataGB: 10,
      campaignPrice: 29,
      regularPrice: 199,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.telia.se/privat/mobil/mobilabonnemang/",
      network: "telia",
    },
    {
      operator: "Hallon",
      name: "Hallon – 10 GB",
      dataGB: 10,
      campaignPrice: 39,
      regularPrice: 149,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Comviq",
      name: "Comviq – 40 GB",
      dataGB: 40,
      campaignPrice: 79,
      regularPrice: 279,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.comviq.se/",
      network: "telenor",
    },
    {
      operator: "Halebop",
      name: "Halebop – 25 GB",
      dataGB: 25,
      campaignPrice: 52,
      regularPrice: 219,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.halebop.se/",
      network: "telia",
    },
    {
      operator: "Chilimobil",
      name: "Chilimobil – 25 GB",
      dataGB: 25,
      campaignPrice: 42,
      regularPrice: 169,
      campaignStart: julyStart,
      campaignEnd: novEnd,
      url: "https://www.chilimobil.se/",
      network: "telenor",
    },
  ];
}

export async function updateCampaigns(): Promise<{ updated: number; active: number }> {
  const now = new Date();
  const seedData = buildCampaigns(now);

  await db.campaign.updateMany({ data: { active: false } });

  let updated = 0;
  for (const item of seedData) {
    const existing = await db.campaign.findFirst({
      where: {
        operator: item.operator,
        name: item.name,
        dataGB: item.dataGB,
      },
    });

    if (existing) {
      await db.campaign.update({
        where: { id: existing.id },
        data: {
          ...item,
          noBinding: true,
          active: now >= item.campaignStart && now <= item.campaignEnd,
        },
      });
    } else {
      await db.campaign.create({
        data: {
          ...item,
          noBinding: true,
          active: now >= item.campaignStart && now <= item.campaignEnd,
        },
      });
    }
    updated++;
  }

  await db.systemMeta.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", lastCampaignUpdate: now },
    update: { lastCampaignUpdate: now },
  });

  const active = await db.campaign.count({ where: { active: true } });
  return { updated, active };
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  return db.campaign.findMany({
    where: { active: true, noBinding: true },
    orderBy: [{ campaignPrice: "asc" }],
  });
}

export async function ensureCampaignsSeeded(): Promise<void> {
  const count = await db.campaign.count();
  if (count === 0) {
    await updateCampaigns();
  }
}
