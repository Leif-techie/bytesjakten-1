import { NextRequest, NextResponse } from "next/server";
import { findTopElectricityCampaigns } from "@/lib/campaigns";
import {
  ensureElectricityCampaignsSeeded,
  getActiveElectricityCampaigns,
} from "@/lib/seed-campaigns";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await ensureElectricityCampaignsSeeded();
    const { searchParams } = new URL(request.url);

    const priceTypePreference =
      searchParams.get("priceTypePreference") ?? "any";
    const maxBindingRaw = searchParams.get("maxBindingMonths");
    const maxBindingMonths =
      maxBindingRaw == null || maxBindingRaw === "" || maxBindingRaw === "any"
        ? null
        : Number(maxBindingRaw);
    const currentOperator = searchParams.get("currentOperator") ?? "";
    const bestOnly = searchParams.get("best") === "true";
    const topLimit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("top") ?? 3) || 3)
    );

    const [campaigns, meta] = await Promise.all([
      getActiveElectricityCampaigns(),
      db.systemMeta.findUnique({ where: { id: "singleton" } }),
    ]);
    const activeCount = campaigns.length;
    const lastCampaignUpdate = meta?.lastCampaignUpdate?.toISOString() ?? null;

    if (bestOnly) {
      const top = findTopElectricityCampaigns(
        campaigns,
        priceTypePreference,
        Number.isFinite(maxBindingMonths as number)
          ? (maxBindingMonths as number)
          : null,
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
    console.error("Electricity campaigns error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta elavtalskampanjer." },
      { status: 500 }
    );
  }
}
