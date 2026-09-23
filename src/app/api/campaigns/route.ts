import { NextRequest, NextResponse } from "next/server";
import { findTopCampaigns } from "@/lib/campaigns";
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
    const topLimit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("top") ?? 3) || 3)
    );

    const [campaigns, meta] = await Promise.all([
      getActiveCampaigns(),
      db.systemMeta.findUnique({ where: { id: "singleton" } }),
    ]);
    const activeCount = campaigns.length;
    const lastCampaignUpdate = meta?.lastCampaignUpdate?.toISOString() ?? null;

    if (bestOnly) {
      const top = findTopCampaigns(
        campaigns,
        minDataGB,
        networkPreference,
        currentOperator || undefined,
        { isStudent, limit: topLimit }
      );
      const best = top[0] ?? null;
      return NextResponse.json({
        campaign: best,
        campaigns: top,
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
