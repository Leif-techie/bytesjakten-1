export type SnapshotLike = {
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  isStudent: boolean;
  capturedAt: Date | string;
  campaignId?: string | null;
};

export type GbSegmentId = "5-15" | "15-30" | "30-50" | "50-plus";

export const GB_SEGMENTS: {
  id: GbSegmentId;
  label: string;
  matches: (dataGB: number) => boolean;
}[] = [
  { id: "5-15", label: "5–15 GB", matches: (gb) => gb >= 5 && gb <= 15 },
  { id: "15-30", label: ">15–30 GB", matches: (gb) => gb > 15 && gb <= 30 },
  { id: "30-50", label: ">30–50 GB", matches: (gb) => gb > 30 && gb <= 50 },
  { id: "50-plus", label: ">50 GB", matches: (gb) => gb > 50 },
];

export function getGbSegment(dataGB: number): (typeof GB_SEGMENTS)[number] | null {
  return GB_SEGMENTS.find((segment) => segment.matches(dataGB)) ?? null;
}

export type TimelinePoint = {
  date: string;
  seriesKey: string;
  seriesLabel: string;
  segment: GbSegmentId | null;
  avgCampaignPrice: number;
  minCampaignPrice: number;
  maxCampaignPrice: number;
  count: number;
};

export type FrequencyRow = {
  operator: string;
  snapshots: number;
  uniqueDays: number;
  last7Days: number;
  last30Days: number;
  avgDaysBetween: number | null;
  firstSeenAt: string | null;
  latestSeenAt: string | null;
};

export type CampaignScore = {
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  isStudent: boolean;
  score: number;
  grade: "A" | "B" | "C" | "D";
  breakdown: {
    price: number;
    discount: number;
    gbValue: number;
  };
  capturedAt: string;
};

function toDateKey(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toISOString().slice(0, 10);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function percentileRank(sortedAsc: number[], value: number) {
  if (sortedAsc.length === 0) return 0.5;
  let below = 0;
  for (const item of sortedAsc) {
    if (item < value) below += 1;
    else break;
  }
  return below / sortedAsc.length;
}

export function filterByGbSegments(
  snapshots: SnapshotLike[],
  segmentIds: GbSegmentId[],
) {
  if (segmentIds.length === 0) return [];
  const allowed = new Set(segmentIds);
  return snapshots.filter((snap) => {
    const segment = getGbSegment(snap.dataGB);
    return segment !== null && allowed.has(segment.id);
  });
}

export function buildTimeline(
  snapshots: SnapshotLike[],
  groupBy: "segment" | "operator" = "segment",
): TimelinePoint[] {
  const buckets = new Map<
    string,
    {
      prices: number[];
      seriesKey: string;
      seriesLabel: string;
      segment: GbSegmentId | null;
      date: string;
    }
  >();

  for (const snap of snapshots) {
    const segment = getGbSegment(snap.dataGB);
    if (groupBy === "segment" && !segment) continue;

    const date = toDateKey(snap.capturedAt);
    const seriesKey = groupBy === "segment" ? segment!.id : snap.operator;
    const seriesLabel = groupBy === "segment" ? segment!.label : snap.operator;
    const key = `${date}::${seriesKey}`;
    const existing = buckets.get(key) ?? {
      prices: [],
      seriesKey,
      seriesLabel,
      segment: segment?.id ?? null,
      date,
    };
    existing.prices.push(snap.campaignPrice);
    buckets.set(key, existing);
  }

  return [...buckets.values()]
    .map((bucket) => {
      const sum = bucket.prices.reduce((a, b) => a + b, 0);
      return {
        date: bucket.date,
        seriesKey: bucket.seriesKey,
        seriesLabel: bucket.seriesLabel,
        segment: bucket.segment,
        avgCampaignPrice: Math.round(sum / bucket.prices.length),
        minCampaignPrice: Math.min(...bucket.prices),
        maxCampaignPrice: Math.max(...bucket.prices),
        count: bucket.prices.length,
      };
    })
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.seriesKey.localeCompare(b.seriesKey),
    );
}

export function buildFrequency(snapshots: SnapshotLike[]): FrequencyRow[] {
  const byOperator = new Map<string, SnapshotLike[]>();
  for (const snap of snapshots) {
    const list = byOperator.get(snap.operator) ?? [];
    list.push(snap);
    byOperator.set(snap.operator, list);
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return [...byOperator.entries()]
    .map(([operator, rows]) => {
      const times = rows
        .map((r) => new Date(r.capturedAt).getTime())
        .sort((a, b) => a - b);
      const uniqueDays = new Set(rows.map((r) => toDateKey(r.capturedAt))).size;
      const last7Days = times.filter((t) => now - t <= 7 * dayMs).length;
      const last30Days = times.filter((t) => now - t <= 30 * dayMs).length;

      let avgDaysBetween: number | null = null;
      if (times.length >= 2) {
        let gapSum = 0;
        for (let i = 1; i < times.length; i += 1) {
          gapSum += (times[i]! - times[i - 1]!) / dayMs;
        }
        avgDaysBetween = Math.round((gapSum / (times.length - 1)) * 10) / 10;
      }

      return {
        operator,
        snapshots: rows.length,
        uniqueDays,
        last7Days,
        last30Days,
        avgDaysBetween,
        firstSeenAt: new Date(times[0]!).toISOString(),
        latestSeenAt: new Date(times[times.length - 1]!).toISOString(),
      };
    })
    .sort((a, b) => b.snapshots - a.snapshots);
}

export function scoreCampaigns(snapshots: SnapshotLike[]): CampaignScore[] {
  if (snapshots.length === 0) return [];

  // Score the latest snapshot per operator + student flag + name (approx "current deals")
  const latestByKey = new Map<string, SnapshotLike>();
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
  );
  for (const snap of sorted) {
    const key = `${snap.operator}::${snap.isStudent}::${snap.name}`;
    if (!latestByKey.has(key)) latestByKey.set(key, snap);
  }

  const prices = [...snapshots.map((s) => s.campaignPrice)].sort((a, b) => a - b);
  const gbValues = [...snapshots.map((s) => s.dataGB / Math.max(s.campaignPrice, 1))].sort(
    (a, b) => a - b,
  );

  return [...latestByKey.values()]
    .map((snap) => {
      // Lower price => higher score
      const pricePercentile = percentileRank(prices, snap.campaignPrice);
      const price = Math.round((1 - pricePercentile) * 40);

      const discountRatio =
        snap.regularPrice > 0
          ? clamp((snap.regularPrice - snap.campaignPrice) / snap.regularPrice, 0, 1)
          : 0;
      const discount = Math.round(discountRatio * 30);

      const gbValueRaw = snap.dataGB / Math.max(snap.campaignPrice, 1);
      const gbPercentile = percentileRank(gbValues, gbValueRaw);
      const gbValue = Math.round(gbPercentile * 30);

      const score = clamp(price + discount + gbValue, 0, 100);
      const grade: CampaignScore["grade"] =
        score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";

      return {
        operator: snap.operator,
        name: snap.name,
        dataGB: snap.dataGB,
        campaignPrice: snap.campaignPrice,
        regularPrice: snap.regularPrice,
        isStudent: snap.isStudent,
        score,
        grade,
        breakdown: { price, discount, gbValue },
        capturedAt:
          typeof snap.capturedAt === "string"
            ? snap.capturedAt
            : snap.capturedAt.toISOString(),
      };
    })
    .sort((a, b) => b.score - a.score || a.campaignPrice - b.campaignPrice);
}
