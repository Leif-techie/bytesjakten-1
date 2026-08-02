import { NextRequest, NextResponse } from "next/server";
import { findBestCampaign } from "@/lib/campaigns";
import { ensureCampaignsSeeded, getActiveCampaigns } from "@/lib/seed-campaigns";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await ensureCampaignsSeeded();
    const { searchParams } = new URL(request.url);

    const minDataGB = Number(searchParams.get("minDataGB") ?? 25);
    const networkPreference = searchParams.get("network") ?? "any";
    const currentOperator = searchParams.get("currentOperator") ?? "";
    const isStudent = searchParams.get("isStudent") === "true";
    const bestOnly = searchParams.get("best") === "true";

    const [campaigns, meta] = await Promise.all([
      getActiveCampaigns(),
      db.systemMeta.findUnique({ where: { id: "singleton" } }),
    ]);
    const activeCount = campaigns.length;
    const lastCampaignUpdate = meta?.lastCampaignUpdate?.toISOString() ?? null;

    if (bestOnly) {
      const best = findBestCampaign(
        campaigns,
        minDataGB,
        networkPreference,
        currentOperator || undefined,
        { isStudent }
      );
      return NextResponse.json({
        campaign: best,
        activeCount,
        lastCampaignUpdate,
      });
    }

    return NextResponse.json({ campaigns, activeCount, lastCampaignUpdate });
  } catch (error) {
    console.error("Campaigns error:", error);
    return NextResponse.json({ error: "Kunde inte hämta kampanjer." }, { status: 500 });
  }
}
