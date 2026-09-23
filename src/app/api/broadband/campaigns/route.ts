import { NextRequest, NextResponse } from "next/server";
import { findTopBroadbandCampaigns } from "@/lib/campaigns";
import {
  ensureBroadbandCampaignsSeeded,
  getActiveBroadbandCampaigns,
} from "@/lib/seed-campaigns";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await ensureBroadbandCampaignsSeeded();
    const { searchParams } = new URL(request.url);

    const minSpeedMbps = Number(searchParams.get("minSpeedMbps") ?? 100);
    const technology = searchParams.get("technology") ?? "any";
    const currentOperator = searchParams.get("currentOperator") ?? "";
    const bestOnly = searchParams.get("best") === "true";
    const topLimit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("top") ?? 3) || 3)
    );

    const [campaigns, meta] = await Promise.all([
      getActiveBroadbandCampaigns(),
      db.systemMeta.findUnique({ where: { id: "singleton" } }),
    ]);
    const activeCount = campaigns.length;
    const lastCampaignUpdate = meta?.lastCampaignUpdate?.toISOString() ?? null;

    if (bestOnly) {
      const top = findTopBroadbandCampaigns(
        campaigns,
        minSpeedMbps,
        technology,
        currentOperator || undefined,
        { limit: topLimit }
      );
      return NextResponse.json({
        campaign: top[0] ?? null,
        campaigns: top,
        activeCount,
        lastCampaignUpdate,
      });
    }

    return NextResponse.json({ campaigns, activeCount, lastCampaignUpdate });
  } catch (error) {
    console.error("Broadband campaigns error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta bredbandskampanjer." },
      { status: 500 }
    );
  }
}
