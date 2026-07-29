"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { GB_SEGMENTS, type GbSegmentId } from "@/lib/campaign-lab";

type SummaryRow = {
  operator: string;
  snapshots: number;
  studentSnapshots: number;
  standardSnapshots: number;
  lowestCampaignPrice: number | null;
  highestCampaignPrice: number | null;
  avgCampaignPrice: number | null;
  avgRegularPrice: number | null;
  firstSeenAt: string | null;
  latestSeenAt: string | null;
};

type HistoryRow = {
  id: string;
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  network: string;
  isStudent: boolean;
  source: string;
  capturedAt: string;
  campaignStart: string;
  campaignEnd: string;
};

type TimelinePoint = {
  date: string;
  seriesKey: string;
  seriesLabel: string;
  segment: GbSegmentId | null;
  avgCampaignPrice: number;
  minCampaignPrice: number;
  maxCampaignPrice: number;
  count: number;
};

type FrequencyRow = {
  operator: string;
  snapshots: number;
  uniqueDays: number;
  last7Days: number;
  last30Days: number;
  avgDaysBetween: number | null;
  firstSeenAt: string | null;
  latestSeenAt: string | null;
};

type ScoreRow = {
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

type LabResponse = {
  meta: {
    totalSnapshots: number;
    latestCapturedAt: string | null;
    appliedFilters: {
      operator: string | null;
      isStudent: boolean | null;
      limit: number;
      groupBy: "segment" | "operator";
      segments: GbSegmentId[];
    };
    gbSegments: { id: GbSegmentId; label: string }[];
    scoring: {
      max: number;
      weights: { price: number; discount: number; gbValue: number };
      grades: { A: string; B: string; C: string; D: string };
    };
  };
  summary: SummaryRow[];
  timeline: TimelinePoint[];
  frequency: FrequencyRow[];
  scores: ScoreRow[];
  history: HistoryRow[];
};

const OPERATOR_COLORS = [
  "#059669",
  "#2563eb",
  "#d97706",
  "#db2777",
  "#7c3aed",
  "#0891b2",
  "#b45309",
  "#4f46e5",
];

const SEGMENT_COLORS: Record<GbSegmentId, string> = {
  "5-15": "#059669",
  "15-30": "#2563eb",
  "30-50": "#d97706",
  "50-plus": "#db2777",
};

const ALL_SEGMENT_IDS = GB_SEGMENTS.map((s) => s.id);

function formatDate(value: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleString("sv-SE");
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
  });
}

function gradeColor(grade: ScoreRow["grade"]) {
  if (grade === "A") return "bg-emerald-100 text-emerald-800";
  if (grade === "B") return "bg-sky-100 text-sky-800";
  if (grade === "C") return "bg-amber-100 text-amber-800";
  return "bg-zinc-200 text-zinc-700";
}

export default function AdminLabPage() {
  const [data, setData] = useState<LabResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [groupBy, setGroupBy] = useState<"segment" | "operator">("segment");
  const [selectedSegments, setSelectedSegments] =
    useState<GbSegmentId[]>(ALL_SEGMENT_IDS);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "500", groupBy });
    if (operator) params.set("operator", operator);
    if (studentFilter === "true" || studentFilter === "false") {
      params.set("isStudent", studentFilter);
    }
    for (const segment of selectedSegments) {
      params.append("segment", segment);
    }

    const res = await fetch(`/api/admin/lab?${params}`);
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    const json = (await res.json()) as LabResponse;
    setData(json);
    setLoading(false);
  }, [operator, studentFilter, groupBy, selectedSegments]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const operators = useMemo(() => {
    if (!data) return [] as string[];
    return [
      ...new Set([
        ...data.summary.map((row) => row.operator),
        ...data.frequency.map((r) => r.operator),
      ]),
    ];
  }, [data]);

  const colorByOperator = useMemo(() => {
    const map = new Map<string, string>();
    operators.forEach((op, i) => {
      map.set(op, OPERATOR_COLORS[i % OPERATOR_COLORS.length]!);
    });
    return map;
  }, [operators]);

  const colorBySeries = useMemo(() => {
    const map = new Map<string, string>();
    if (groupBy === "segment") {
      for (const segment of GB_SEGMENTS) {
        map.set(segment.id, SEGMENT_COLORS[segment.id]);
      }
      return map;
    }
    return colorByOperator;
  }, [groupBy, colorByOperator]);

  function toggleSegment(id: GbSegmentId) {
    setSelectedSegments((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Admin Labb – Kampanjhistorik</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Prisgraf per surfsegment, kampanjfrekvens och kampanjbetyg.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Tillbaka till admin
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Totala snapshots"
            value={loading ? "…" : String(data?.meta.totalSnapshots ?? 0)}
          />
          <StatCard
            label="Senast sparad"
            value={loading ? "…" : formatDate(data?.meta.latestCapturedAt ?? null)}
          />
          <StatCard
            label="Betygsatta kampanjer"
            value={loading ? "…" : String(data?.scores.length ?? 0)}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Filter</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="">Alla operatörer</option>
              {operators.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="all">Alla typer</option>
              <option value="true">Endast student</option>
              <option value="false">Endast standard</option>
            </select>

            <button
              type="button"
              onClick={load}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Uppdatera vy
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">1. Prisgraf över tid</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Snittkampanjpris per dag, uppdelat på surfsegment (eller operatör).
              </p>
            </div>
            <SeriesLegend
              colorBySeries={colorBySeries}
              labels={
                groupBy === "segment"
                  ? Object.fromEntries(GB_SEGMENTS.map((s) => [s.id, s.label]))
                  : undefined
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mr-1 self-center text-xs font-medium uppercase tracking-wide text-zinc-400">
              Visa som
            </span>
            <button
              type="button"
              onClick={() => setGroupBy("segment")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                groupBy === "segment"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Surfsegment
            </button>
            <button
              type="button"
              onClick={() => setGroupBy("operator")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                groupBy === "operator"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Operatör
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="mr-1 self-center text-xs font-medium uppercase tracking-wide text-zinc-400">
              Segment
            </span>
            {GB_SEGMENTS.map((segment) => {
              const active = selectedSegments.includes(segment.id);
              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => toggleSegment(segment.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    active
                      ? "border-transparent text-white"
                      : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                  style={active ? { backgroundColor: SEGMENT_COLORS[segment.id] } : undefined}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Laddar…</p>
            ) : (
              <PriceTimelineChart
                points={data?.timeline ?? []}
                colorBySeries={colorBySeries}
              />
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">2. Kampanjfrekvens per operatör</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Hur ofta vi ser kampanjer – totalt, senaste 7/30 dagar och snittintervall.
          </p>
          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Laddar…</p>
            ) : (
              <FrequencyBars
                rows={data?.frequency ?? []}
                colorByOperator={colorByOperator}
              />
            )}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Operatör</th>
                  <th className="px-3 py-2">Snapshots</th>
                  <th className="px-3 py-2">Unika dagar</th>
                  <th className="px-3 py-2">7 dagar</th>
                  <th className="px-3 py-2">30 dagar</th>
                  <th className="px-3 py-2">Snitt dagar mellan</th>
                </tr>
              </thead>
              <tbody>
                {(data?.frequency ?? []).map((row) => (
                  <tr key={row.operator} className="border-t border-zinc-100">
                    <td className="px-3 py-2 font-medium text-zinc-900">{row.operator}</td>
                    <td className="px-3 py-2">{row.snapshots}</td>
                    <td className="px-3 py-2">{row.uniqueDays}</td>
                    <td className="px-3 py-2">{row.last7Days}</td>
                    <td className="px-3 py-2">{row.last30Days}</td>
                    <td className="px-3 py-2">
                      {row.avgDaysBetween !== null ? `${row.avgDaysBetween} d` : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">3. Kampanjbetyg (v1)</h2>
          <p className="mt-1 text-sm text-zinc-500">
            0–100 poäng: prisnivå (40) + rabatt vs ordinarie (30) + GB/kr (30).
            Senaste snapshot per kampanjnamn.
          </p>
          {data?.meta.scoring && (
            <p className="mt-2 text-xs text-zinc-400">
              Betyg: A {data.meta.scoring.grades.A} · B {data.meta.scoring.grades.B} · C{" "}
              {data.meta.scoring.grades.C} · D {data.meta.scoring.grades.D}
            </p>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Betyg</th>
                  <th className="px-3 py-2">Poäng</th>
                  <th className="px-3 py-2">Operatör</th>
                  <th className="px-3 py-2">Kampanj</th>
                  <th className="px-3 py-2">GB</th>
                  <th className="px-3 py-2">Pris</th>
                  <th className="px-3 py-2">Delpoäng</th>
                </tr>
              </thead>
              <tbody>
                {(data?.scores ?? []).map((row) => (
                  <tr
                    key={`${row.operator}-${row.name}-${row.isStudent}`}
                    className="border-t border-zinc-100"
                  >
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${gradeColor(row.grade)}`}
                      >
                        {row.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-semibold text-zinc-900">{row.score}</td>
                    <td className="px-3 py-2 font-medium text-zinc-900">{row.operator}</td>
                    <td className="px-3 py-2">
                      {row.name}
                      {row.isStudent ? (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                          Student
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{row.dataGB} GB</td>
                    <td className="px-3 py-2">
                      {row.campaignPrice} kr
                      <span className="text-zinc-400"> / {row.regularPrice} kr</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-500">
                      pris {row.breakdown.price} · rabatt {row.breakdown.discount} · GB{" "}
                      {row.breakdown.gbValue}
                    </td>
                  </tr>
                ))}
                {!loading && (data?.scores.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-zinc-500">
                      Inga snapshots ännu – granska kampanjerna under Admin och klicka
                      ”För över till labbet”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-zinc-900">Operatörsöversikt</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Operatör</th>
                  <th className="px-4 py-3">Snapshots</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Standard</th>
                  <th className="px-4 py-3">Lägsta pris</th>
                  <th className="px-4 py-3">Snitt kampanj</th>
                  <th className="px-4 py-3">Snitt ordinarie</th>
                  <th className="px-4 py-3">Senast sedd</th>
                </tr>
              </thead>
              <tbody>
                {data?.summary.map((row) => (
                  <tr key={row.operator} className="border-t border-zinc-100">
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.operator}</td>
                    <td className="px-4 py-3">{row.snapshots}</td>
                    <td className="px-4 py-3">{row.studentSnapshots}</td>
                    <td className="px-4 py-3">{row.standardSnapshots}</td>
                    <td className="px-4 py-3">
                      {row.lowestCampaignPrice !== null
                        ? `${Math.round(row.lowestCampaignPrice)} kr`
                        : "–"}
                    </td>
                    <td className="px-4 py-3">
                      {row.avgCampaignPrice !== null
                        ? `${Math.round(row.avgCampaignPrice)} kr`
                        : "–"}
                    </td>
                    <td className="px-4 py-3">
                      {row.avgRegularPrice !== null
                        ? `${Math.round(row.avgRegularPrice)} kr`
                        : "–"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(row.latestSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-zinc-900">Historik</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Tid</th>
                  <th className="px-4 py-3">Operatör</th>
                  <th className="px-4 py-3">Namn</th>
                  <th className="px-4 py-3">GB</th>
                  <th className="px-4 py-3">Kampanj</th>
                  <th className="px-4 py-3">Ordinarie</th>
                  <th className="px-4 py-3">Typ</th>
                  <th className="px-4 py-3">Källa</th>
                </tr>
              </thead>
              <tbody>
                {data?.history.map((row) => (
                  <tr key={row.id} className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-500">{formatDate(row.capturedAt)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.operator}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.dataGB} GB</td>
                    <td className="px-4 py-3">{row.campaignPrice} kr</td>
                    <td className="px-4 py-3">{row.regularPrice} kr</td>
                    <td className="px-4 py-3">
                      {row.isStudent ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Student
                        </span>
                      ) : (
                        <span className="text-zinc-500">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function SeriesLegend({
  colorBySeries,
  labels,
}: {
  colorBySeries: Map<string, string>;
  labels?: Record<string, string>;
}) {
  if (colorBySeries.size === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 text-xs text-zinc-600">
      {[...colorBySeries.entries()].map(([key, color]) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {labels?.[key] ?? key}
        </span>
      ))}
    </div>
  );
}

function PriceTimelineChart({
  points,
  colorBySeries,
}: {
  points: TimelinePoint[];
  colorBySeries: Map<string, string>;
}) {
  if (points.length === 0) {
    return (
      <p className="rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        Ingen tidslinjedata ännu för valda segment.
      </p>
    );
  }

  const width = 720;
  const height = 260;
  const pad = { top: 16, right: 16, bottom: 36, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const dates = [...new Set(points.map((p) => p.date))].sort();
  const prices = points.map((p) => p.avgCampaignPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const pricePad = Math.max(10, Math.round((maxPrice - minPrice) * 0.1));
  const yMin = Math.max(0, minPrice - pricePad);
  const yMax = maxPrice + pricePad;

  const xFor = (date: string) => {
    if (dates.length === 1) return pad.left + innerW / 2;
    const i = dates.indexOf(date);
    return pad.left + (i / (dates.length - 1)) * innerW;
  };
  const yFor = (price: number) =>
    pad.top + innerH - ((price - yMin) / Math.max(yMax - yMin, 1)) * innerH;

  const bySeries = new Map<string, TimelinePoint[]>();
  for (const point of points) {
    const list = bySeries.get(point.seriesKey) ?? [];
    list.push(point);
    bySeries.set(point.seriesKey, list);
  }

  const yTicks = [yMin, Math.round((yMin + yMax) / 2), yMax];

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[520px]">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="#e4e4e7"
              strokeDasharray="4 4"
            />
            <text x={pad.left - 8} y={yFor(tick) + 4} textAnchor="end" fontSize="11" fill="#71717a">
              {tick}
            </text>
          </g>
        ))}

        {dates.map((date) => (
          <text
            key={date}
            x={xFor(date)}
            y={height - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#71717a"
          >
            {formatDay(date)}
          </text>
        ))}

        {[...bySeries.entries()].map(([key, series]) => {
          const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
          const path = sorted
            .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.date)} ${yFor(p.avgCampaignPrice)}`)
            .join(" ");
          const color = colorBySeries.get(key) ?? "#059669";
          const label = sorted[0]?.seriesLabel ?? key;
          return (
            <g key={key}>
              <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
              {sorted.map((p) => (
                <circle
                  key={`${key}-${p.date}`}
                  cx={xFor(p.date)}
                  cy={yFor(p.avgCampaignPrice)}
                  r="4"
                  fill={color}
                >
                  <title>
                    {label}: {p.avgCampaignPrice} kr ({p.date})
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FrequencyBars({
  rows,
  colorByOperator,
}: {
  rows: FrequencyRow[];
  colorByOperator: Map<string, string>;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        Ingen frekvensdata ännu.
      </p>
    );
  }

  const max = Math.max(...rows.map((r) => r.snapshots), 1);

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const pct = Math.round((row.snapshots / max) * 100);
        const color = colorByOperator.get(row.operator) ?? "#059669";
        return (
          <div key={row.operator} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3">
            <span className="truncate text-sm font-medium text-zinc-800">{row.operator}</span>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-right text-sm tabular-nums text-zinc-600">{row.snapshots}</span>
          </div>
        );
      })}
    </div>
  );
}
