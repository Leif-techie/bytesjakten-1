import { NextRequest, NextResponse } from "next/server";
import { updateCampaigns } from "@/lib/seed-campaigns";
import { processUserNotifications } from "@/lib/notifications";

export const runtime = "nodejs";

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaignResult = await updateCampaigns();
    const notificationResult = await processUserNotifications();

    return NextResponse.json({
      success: true,
      campaigns: campaignResult,
      notifications: notificationResult,
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
