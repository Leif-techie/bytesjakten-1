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

/** Rolling window so refreshed seed campaigns stay active after "Uppdatera kampanjer". */
function campaignWindow(now: Date, monthsOpen: number): { start: Date; end: Date } {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(start);
  end.setMonth(end.getMonth() + monthsOpen);
  end.setDate(0); // last day of the final open month
  return { start, end };
}

/**
 * Current no-binding campaigns from operator sites (snapshot).
 * Checked against hallon.se, vimla.se, comviq.se (utan bindning), fello.se — Jul 2026.
 * Replace `url` with Addrevenue tracking links in admin after refresh.
 */
function buildCampaigns(now: Date): SeedCampaign[] {
  const { start, end } = campaignWindow(now, 4);

  return [
    // Hallon – Tres nät, ingen bindningstid (dubbel surf-kampanj)
    {
      operator: "Hallon",
      name: "Hallon – 5 GB",
      dataGB: 5,
      campaignPrice: 29,
      regularPrice: 109,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Hallon",
      name: "Hallon – 10 GB",
      dataGB: 10,
      campaignPrice: 39,
      regularPrice: 159,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Hallon",
      name: "Hallon – 25 GB",
      dataGB: 25,
      campaignPrice: 49,
      regularPrice: 259,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Hallon",
      name: "Hallon – 50 GB",
      dataGB: 50,
      campaignPrice: 59,
      regularPrice: 309,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
    },
    {
      operator: "Hallon",
      name: "Hallon – 100 GB",
      dataGB: 100,
      campaignPrice: 69,
      regularPrice: 359,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
    },

    // Vimla – Telenors nät, ingen bindningstid
    {
      operator: "Vimla",
      name: "Vimla – 5 GB",
      dataGB: 5,
      campaignPrice: 20,
      regularPrice: 120,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
    },
    {
      operator: "Vimla",
      name: "Vimla – 10 GB",
      dataGB: 10,
      campaignPrice: 20,
      regularPrice: 170,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
    },
    {
      operator: "Vimla",
      name: "Vimla – 15 GB",
      dataGB: 15,
      campaignPrice: 20,
      regularPrice: 210,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
    },
    {
      operator: "Vimla",
      name: "Vimla – 25 GB",
      dataGB: 25,
      campaignPrice: 20,
      regularPrice: 260,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
    },
    {
      operator: "Vimla",
      name: "Vimla – 100 GB",
      dataGB: 100,
      campaignPrice: 20,
      regularPrice: 370,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
    },

    // Comviq – Tele2-nät, utan bindningstid (halva priset i 6 mån)
    {
      operator: "Comviq",
      name: "Comviq – 5 GB",
      dataGB: 5,
      campaignPrice: 59,
      regularPrice: 129,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
    },
    {
      operator: "Comviq",
      name: "Comviq – 20 GB",
      dataGB: 20,
      campaignPrice: 109,
      regularPrice: 229,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
    },
    {
      operator: "Comviq",
      name: "Comviq – 100 GB",
      dataGB: 100,
      campaignPrice: 179,
      regularPrice: 359,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
    },

    // Fello – Telias nät, ingen bindningstid
    {
      operator: "Fello",
      name: "Fello – 5 GB",
      dataGB: 5,
      campaignPrice: 20,
      regularPrice: 120,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/mobilabonnemang",
      network: "telia",
    },
    {
      operator: "Fello",
      name: "Fello – 10 GB",
      dataGB: 10,
      campaignPrice: 20,
      regularPrice: 180,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/mobilabonnemang",
      network: "telia",
    },
    {
      operator: "Fello",
      name: "Fello – 20 GB",
      dataGB: 20,
      campaignPrice: 20,
      regularPrice: 230,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/mobilabonnemang",
      network: "telia",
    },
  ];
}

export async function updateCampaigns(): Promise<{ updated: number; active: number }> {
  const now = new Date();
  const seedData = buildCampaigns(now);

  // Full replace so old demo rows do not linger as inactive clutter.
  await db.campaign.deleteMany({});

  let updated = 0;
  for (const item of seedData) {
    await db.campaign.create({
      data: {
        ...item,
        noBinding: true,
        active: now >= item.campaignStart && now <= item.campaignEnd,
      },
    });
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
