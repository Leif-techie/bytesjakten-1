import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { publishActiveCampaignsToLab } from "@/lib/campaign-snapshots";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await publishActiveCampaignsToLab();

  if (result.published === 0) {
    return NextResponse.json(
      { error: "Inga aktiva kampanjer att föra över.", ...result },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: `${result.published} aktiva kampanjer förda över till labbet.`,
    ...result,
  });
}
