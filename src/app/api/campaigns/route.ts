import { NextRequest, NextResponse } from "next/server";
import { findBestCampaign } from "@/lib/campaigns";
import { ensureCampaignsSeeded, getActiveCampaigns } from "@/lib/seed-campaigns";

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

    const campaigns = await getActiveCampaigns();

    if (bestOnly) {
      const best = findBestCampaign(
        campaigns,
        minDataGB,
        networkPreference,
        currentOperator || undefined,
        { isStudent }
      );
      return NextResponse.json({ campaign: best });
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Campaigns error:", error);
    return NextResponse.json({ error: "Kunde inte hämta kampanjer." }, { status: 500 });
  }
}
