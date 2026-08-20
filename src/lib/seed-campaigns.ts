import type { Campaign, BroadbandCampaign } from "@/generated/prisma/client";
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
  isStudent: boolean;
};

type SeedBroadbandCampaign = {
  operator: string;
  name: string;
  speedMbps: number;
  campaignPrice: number;
  regularPrice: number;
  campaignStart: Date;
  campaignEnd: Date;
  url: string;
  technology: string;
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
 * Regular + student plans (Hallon, Vimla, Comviq, Fello) — checked 20 Aug 2026.
 * `dataGB` = effective surf during campaign (dubbel surf / extra pott).
 * Replace `url` with Addrevenue tracking links in admin after refresh.
 */
function buildCampaigns(now: Date): SeedCampaign[] {
  const { start, end } = campaignWindow(now, 4);

  const regular: SeedCampaign[] = [
    // Hallon – Tres nät, ingen bindningstid
    {
      operator: "Hallon",
      name: "Hallon – 5 GB",
      dataGB: 5,
      campaignPrice: 9,
      regularPrice: 109,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
      isStudent: false,
    },
    {
      operator: "Hallon",
      name: "Hallon – 10 GB",
      dataGB: 10,
      campaignPrice: 19,
      regularPrice: 159,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
      isStudent: false,
    },
    {
      operator: "Hallon",
      name: "Hallon – 25 GB",
      dataGB: 25,
      campaignPrice: 39,
      regularPrice: 259,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
      isStudent: false,
    },
    {
      operator: "Hallon",
      name: "Hallon – 50 GB",
      dataGB: 50,
      campaignPrice: 49,
      regularPrice: 309,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
      isStudent: false,
    },
    {
      operator: "Hallon",
      name: "Hallon – 100 GB",
      dataGB: 100,
      campaignPrice: 59,
      regularPrice: 359,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/",
      network: "tre",
      isStudent: false,
    },

    // Vimla – Telenors nät, 20 kr/mån i 3 mån + dubbel surf i 24 mån
    {
      operator: "Vimla",
      name: "Vimla – 10 GB",
      dataGB: 10,
      campaignPrice: 20,
      regularPrice: 120,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
      isStudent: false,
    },
    {
      operator: "Vimla",
      name: "Vimla – 20 GB",
      dataGB: 20,
      campaignPrice: 20,
      regularPrice: 170,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
      isStudent: false,
    },
    {
      operator: "Vimla",
      name: "Vimla – 30 GB",
      dataGB: 30,
      campaignPrice: 20,
      regularPrice: 210,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
      isStudent: false,
    },
    {
      operator: "Vimla",
      name: "Vimla – 50 GB",
      dataGB: 50,
      campaignPrice: 20,
      regularPrice: 260,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
      isStudent: false,
    },
    {
      operator: "Vimla",
      name: "Vimla – 200 GB",
      dataGB: 200,
      campaignPrice: 20,
      regularPrice: 370,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.vimla.se/bestall/",
      network: "telenor",
      isStudent: false,
    },

    // Comviq – Tele2-nät, 45 kr/mån i 3 mån utan bindningstid
    {
      operator: "Comviq",
      name: "Comviq – 5 GB",
      dataGB: 5,
      campaignPrice: 45,
      regularPrice: 129,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
      isStudent: false,
    },
    {
      operator: "Comviq",
      name: "Comviq – 20 GB",
      dataGB: 20,
      campaignPrice: 45,
      regularPrice: 229,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
      isStudent: false,
    },
    {
      operator: "Comviq",
      name: "Comviq – 100 GB",
      dataGB: 100,
      campaignPrice: 45,
      regularPrice: 359,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang-utan-bindning",
      network: "tele2",
      isStudent: false,
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
      isStudent: false,
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
      isStudent: false,
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
      isStudent: false,
    },
    {
      operator: "Fello",
      name: "Fello – 40 GB",
      dataGB: 40,
      campaignPrice: 20,
      regularPrice: 290,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/mobilabonnemang",
      network: "telia",
      isStudent: false,
    },
    {
      operator: "Fello",
      name: "Fello – 100 GB",
      dataGB: 100,
      campaignPrice: 20,
      regularPrice: 370,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/mobilabonnemang",
      network: "telia",
      isStudent: false,
    },
  ];

  // Student plans — checked 20 Aug 2026
  const student: SeedCampaign[] = [
    // Hallon Student – 4 månader kampanj
    {
      operator: "Hallon",
      name: "Hallon Student – 10 GB",
      dataGB: 10,
      campaignPrice: 9,
      regularPrice: 109,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/student",
      network: "tre",
      isStudent: true,
    },
    {
      operator: "Hallon",
      name: "Hallon Student – 20 GB",
      dataGB: 20,
      campaignPrice: 19,
      regularPrice: 159,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/student",
      network: "tre",
      isStudent: true,
    },
    {
      operator: "Hallon",
      name: "Hallon Student – 50 GB",
      dataGB: 50,
      campaignPrice: 39,
      regularPrice: 259,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/student",
      network: "tre",
      isStudent: true,
    },
    {
      operator: "Hallon",
      name: "Hallon Student – 100 GB",
      dataGB: 100,
      campaignPrice: 49,
      regularPrice: 309,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/student",
      network: "tre",
      isStudent: true,
    },
    {
      operator: "Hallon",
      name: "Hallon Student – 200 GB",
      dataGB: 200,
      campaignPrice: 59,
      regularPrice: 359,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/student",
      network: "tre",
      isStudent: true,
    },
    // Vimla student: dubbel surf (10→20, 15→30, …)
    {
      operator: "Vimla",
      name: "Vimla Student – 20 GB",
      dataGB: 20,
      campaignPrice: 20,
      regularPrice: 120,
      campaignStart: start,
      campaignEnd: end,
      url: "https://vimla.se/bestall/student/",
      network: "telenor",
      isStudent: true,
    },
    {
      operator: "Vimla",
      name: "Vimla Student – 30 GB",
      dataGB: 30,
      campaignPrice: 20,
      regularPrice: 160,
      campaignStart: start,
      campaignEnd: end,
      url: "https://vimla.se/bestall/student/",
      network: "telenor",
      isStudent: true,
    },
    {
      operator: "Vimla",
      name: "Vimla Student – 50 GB",
      dataGB: 50,
      campaignPrice: 20,
      regularPrice: 200,
      campaignStart: start,
      campaignEnd: end,
      url: "https://vimla.se/bestall/student/",
      network: "telenor",
      isStudent: true,
    },
    {
      operator: "Vimla",
      name: "Vimla Student – 80 GB",
      dataGB: 80,
      campaignPrice: 20,
      regularPrice: 240,
      campaignStart: start,
      campaignEnd: end,
      url: "https://vimla.se/bestall/student/",
      network: "telenor",
      isStudent: true,
    },
    {
      operator: "Vimla",
      name: "Vimla Student – 160 GB",
      dataGB: 160,
      campaignPrice: 20,
      regularPrice: 320,
      campaignStart: start,
      campaignEnd: end,
      url: "https://vimla.se/bestall/student/",
      network: "telenor",
      isStudent: true,
    },
    {
      operator: "Comviq",
      name: "Comviq Student – 14 GB",
      dataGB: 14,
      campaignPrice: 45,
      regularPrice: 129,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang/student",
      network: "tele2",
      isStudent: true,
    },
    {
      operator: "Comviq",
      name: "Comviq Student – 40 GB",
      dataGB: 40,
      campaignPrice: 45,
      regularPrice: 209,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang/student",
      network: "tele2",
      isStudent: true,
    },
    {
      operator: "Comviq",
      name: "Comviq Student – 100 GB",
      dataGB: 100,
      campaignPrice: 45,
      regularPrice: 309,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.comviq.se/mobilabonnemang/student",
      network: "tele2",
      isStudent: true,
    },
    {
      operator: "Fello",
      name: "Fello Student – 10 GB",
      dataGB: 10,
      campaignPrice: 20,
      regularPrice: 120,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/student",
      network: "telia",
      isStudent: true,
    },
    {
      operator: "Fello",
      name: "Fello Student – 20 GB",
      dataGB: 20,
      campaignPrice: 20,
      regularPrice: 160,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/student",
      network: "telia",
      isStudent: true,
    },
    {
      operator: "Fello",
      name: "Fello Student – 30 GB",
      dataGB: 30,
      campaignPrice: 20,
      regularPrice: 200,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/student",
      network: "telia",
      isStudent: true,
    },
    {
      operator: "Fello",
      name: "Fello Student – 50 GB",
      dataGB: 50,
      campaignPrice: 20,
      regularPrice: 250,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/student",
      network: "telia",
      isStudent: true,
    },
    {
      operator: "Fello",
      name: "Fello Student – 100 GB",
      dataGB: 100,
      campaignPrice: 20,
      regularPrice: 320,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.fello.se/student",
      network: "telia",
      isStudent: true,
    },
  ];

  return [...regular, ...student];
}

function buildBroadbandCampaigns(now: Date): SeedBroadbandCampaign[] {
  const { start, end } = campaignWindow(now, 3);

  return [
    {
      operator: "Hallon",
      name: "Hallon – Mobilt bredband 5 GB",
      speedMbps: 100,
      campaignPrice: 29,
      regularPrice: 89,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/bredband",
      technology: "5g",
    },
    {
      operator: "Hallon",
      name: "Hallon – Mobilt bredband 20 GB",
      speedMbps: 100,
      campaignPrice: 39,
      regularPrice: 149,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/bredband",
      technology: "5g",
    },
    {
      operator: "Hallon",
      name: "Hallon – Mobilt bredband 100 GB",
      speedMbps: 150,
      campaignPrice: 69,
      regularPrice: 249,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/bredband",
      technology: "5g",
    },
    {
      operator: "Hallon",
      name: "Hallon – Mobilt bredband 200 GB",
      speedMbps: 150,
      campaignPrice: 79,
      regularPrice: 299,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/bredband",
      technology: "5g",
    },
    {
      operator: "Hallon",
      name: "Hallon – Obegränsat 5G-bredband",
      speedMbps: 150,
      campaignPrice: 99,
      regularPrice: 399,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.hallon.se/bredband",
      technology: "5g",
    },
    {
      operator: "Tre",
      name: "Tre – Bredband Max 150",
      speedMbps: 150,
      campaignPrice: 399,
      regularPrice: 399,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.tre.se/handla/bredband",
      technology: "5g",
    },
    {
      operator: "Tre",
      name: "Tre – Bredband Max 1000",
      speedMbps: 1000,
      campaignPrice: 499,
      regularPrice: 499,
      campaignStart: start,
      campaignEnd: end,
      url: "https://www.tre.se/handla/bredband",
      technology: "5g",
    },
  ];
}

export async function updateCampaigns(): Promise<{
  updated: number;
  broadbandUpdated: number;
  active: number;
  activeBroadband: number;
}> {
  const now = new Date();
  const seedData = buildCampaigns(now);
  const broadbandSeedData = buildBroadbandCampaigns(now);

  // Full replace so old demo rows do not linger as inactive clutter.
  await db.campaign.deleteMany({});
  await db.broadbandCampaign.deleteMany({});

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

  let broadbandUpdated = 0;
  for (const item of broadbandSeedData) {
    await db.broadbandCampaign.create({
      data: {
        ...item,
        noBinding: true,
        active: now >= item.campaignStart && now <= item.campaignEnd,
      },
    });
    broadbandUpdated++;
  }

  await db.systemMeta.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", lastCampaignUpdate: now },
    update: { lastCampaignUpdate: now },
  });

  const [active, activeBroadband] = await Promise.all([
    db.campaign.count({ where: { active: true } }),
    db.broadbandCampaign.count({ where: { active: true } }),
  ]);
  return { updated, broadbandUpdated, active, activeBroadband };
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  return db.campaign.findMany({
    where: { active: true, noBinding: true },
    orderBy: [{ campaignPrice: "asc" }],
  });
}

export async function getActiveBroadbandCampaigns(): Promise<BroadbandCampaign[]> {
  return db.broadbandCampaign.findMany({
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

export async function ensureBroadbandCampaignsSeeded(): Promise<void> {
  const count = await db.broadbandCampaign.count();
  if (count === 0) {
    await updateCampaigns();
  }
}
