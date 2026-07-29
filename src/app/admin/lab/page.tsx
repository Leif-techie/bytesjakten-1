"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";

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

type LabResponse = {
  meta: {
    totalSnapshots: number;
    latestCapturedAt: string | null;
    appliedFilters: {
      operator: string | null;
      isStudent: boolean | null;
      limit: number;
    };
  };
  summary: SummaryRow[];
  history: HistoryRow[];
};

function formatDate(value: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleString("sv-SE");
}

export default function AdminLabPage() {
  const [data, setData] = useState<LabResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "200" });
    if (operator) params.set("operator", operator);
    if (studentFilter === "true" || studentFilter === "false") {
      params.set("isStudent", studentFilter);
    }

    const res = await fetch(`/api/admin/lab?${params}`);
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    const json = (await res.json()) as LabResponse;
    setData(json);
    setLoading(false);
  }, [operator, studentFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const operators = data ? [...new Set(data.summary.map((row) => row.operator))] : [];

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Admin Labb – Kampanjhistorik</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Första versionen av datalabbet: snapshots, översikt och historik.
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
            label="Rader i historikvyn"
            value={loading ? "…" : String(data?.history.length ?? 0)}
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
                      {row.lowestCampaignPrice !== null ? `${Math.round(row.lowestCampaignPrice)} kr` : "–"}
                    </td>
                    <td className="px-4 py-3">
                      {row.avgCampaignPrice !== null ? `${Math.round(row.avgCampaignPrice)} kr` : "–"}
                    </td>
                    <td className="px-4 py-3">
                      {row.avgRegularPrice !== null ? `${Math.round(row.avgRegularPrice)} kr` : "–"}
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
