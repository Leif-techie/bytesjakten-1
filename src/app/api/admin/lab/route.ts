import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import {
  buildFrequency,
  buildTimeline,
  scoreCampaigns,
} from "@/lib/campaign-lab";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const operator = searchParams.get("operator") || undefined;
  const isStudentParam = searchParams.get("isStudent");
  const isStudent =
    isStudentParam === "true" ? true : isStudentParam === "false" ? false : undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 500), 1000);

  const historyWhere = {
    ...(operator ? { operator } : {}),
    ...(isStudent !== undefined ? { isStudent } : {}),
  };

  const [totalSnapshots, latestCapturedAt, history, grouped] = await Promise.all([
    db.campaignSnapshot.count(),
    db.campaignSnapshot.findFirst({
      orderBy: { capturedAt: "desc" },
      select: { capturedAt: true },
    }),
    db.campaignSnapshot.findMany({
      where: historyWhere,
      orderBy: [{ capturedAt: "desc" }, { operator: "asc" }],
      take: limit,
      select: {
        id: true,
        operator: true,
        name: true,
        dataGB: true,
        campaignPrice: true,
        regularPrice: true,
        network: true,
        isStudent: true,
        source: true,
        capturedAt: true,
        campaignStart: true,
        campaignEnd: true,
        campaignId: true,
      },
    }),
    db.campaignSnapshot.groupBy({
      by: ["operator"],
      _count: { _all: true },
      _min: { campaignPrice: true, capturedAt: true },
      _max: { campaignPrice: true, capturedAt: true },
      _avg: { campaignPrice: true, regularPrice: true },
    }),
  ]);

  const studentCounts = await db.campaignSnapshot.groupBy({
    by: ["operator", "isStudent"],
    _count: { _all: true },
  });

  const summary = grouped.map((row) => {
    const counts = studentCounts.filter((c) => c.operator === row.operator);
    const studentSnapshots =
      counts.find((c) => c.isStudent === true)?._count._all ?? 0;
    const standardSnapshots =
      counts.find((c) => c.isStudent === false)?._count._all ?? 0;

    return {
      operator: row.operator,
      snapshots: row._count._all,
      studentSnapshots,
      standardSnapshots,
      lowestCampaignPrice: row._min.campaignPrice,
      highestCampaignPrice: row._max.campaignPrice,
      avgCampaignPrice: row._avg.campaignPrice,
      avgRegularPrice: row._avg.regularPrice,
      firstSeenAt: row._min.capturedAt,
      latestSeenAt: row._max.capturedAt,
    };
  });

  const analysisRows = history.map((row) => ({
    operator: row.operator,
    name: row.name,
    dataGB: row.dataGB,
    campaignPrice: row.campaignPrice,
    regularPrice: row.regularPrice,
    isStudent: row.isStudent,
    capturedAt: row.capturedAt,
    campaignId: row.campaignId,
  }));

  const timeline = buildTimeline(analysisRows);
  const frequency = buildFrequency(analysisRows);
  const scores = scoreCampaigns(analysisRows);

  return NextResponse.json({
    meta: {
      totalSnapshots,
      latestCapturedAt: latestCapturedAt?.capturedAt ?? null,
      appliedFilters: {
        operator: operator ?? null,
        isStudent: isStudent ?? null,
        limit,
      },
      scoring: {
        max: 100,
        weights: {
          price: 35,
          discount: 25,
          gbValue: 25,
          frequency: 15,
        },
        grades: { A: "80+", B: "65–79", C: "50–64", D: "<50" },
      },
    },
    summary,
    timeline,
    frequency,
    scores,
    history,
  });
}
