import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminStats } from "@/lib/admin";
import { updateCampaigns } from "@/lib/seed-campaigns";
import { processUserNotifications } from "@/lib/notifications";
import { sendSwitchReminderEmail } from "@/lib/email";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getAdminStats();
  const campaigns = await db.campaign.findMany({ orderBy: [{ operator: "asc" }, { dataGB: "asc" }] });
  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { contractEndDate: "asc" },
    select: {
      id: true,
      email: true,
      currentOperator: true,
      contractEndDate: true,
      minDataGB: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ stats, campaigns, users });
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action as string;

  if (action === "refresh_campaigns") {
    const result = await updateCampaigns();
    return NextResponse.json({ success: true, result });
  }

  if (action === "run_notifications") {
    const result = await processUserNotifications();
    return NextResponse.json({ success: true, result });
  }

  if (action === "test_email") {
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: "E-post saknas." }, { status: 400 });
    }

    const result = await sendSwitchReminderEmail({
      email,
      operator: "Hallon",
      campaignName: "Hallon – 25 GB (test)",
      campaignPrice: 49,
      regularPrice: 199,
      campaignUrl: "https://www.hallon.se/",
      contractEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      network: "tre",
      unsubscribeToken: "test-token",
    });

    return NextResponse.json({ success: result.success, error: result.error });
  }

  return NextResponse.json({ error: "Okänd action." }, { status: 400 });
}
