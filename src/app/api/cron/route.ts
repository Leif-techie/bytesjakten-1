import { NextRequest, NextResponse } from "next/server";
import { updateCampaigns } from "@/lib/seed-campaigns";

export const runtime = "nodejs";

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

/** Optional campaign refresh only – no automatic emails. */
export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaignResult = await updateCampaigns();

    return NextResponse.json({
      success: true,
      campaigns: campaignResult,
      notifications: { skipped: true, reason: "Mejl skickas endast manuellt via admin." },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
