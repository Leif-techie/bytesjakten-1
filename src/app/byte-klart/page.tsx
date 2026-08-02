"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { OPERATORS } from "@/lib/constants";

const CAMPAIGN_LENGTHS = [3, 4, 5, 6] as const;

function todayIso(): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addMonthsToIso(startIso: string, months: number): string {
  const d = new Date(`${startIso}T12:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function SwitchCompleteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const suggestedOperator = searchParams.get("operator");

  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [email, setEmail] = useState("");
  const [currentOperator, setCurrentOperator] = useState(
    suggestedOperator && OPERATORS.includes(suggestedOperator as (typeof OPERATORS)[number])
      ? suggestedOperator
      : OPERATORS[0]
  );
  const [campaignStartDate, setCampaignStartDate] = useState(todayIso());
  const [campaignLengthMonths, setCampaignLengthMonths] =
    useState<(typeof CAMPAIGN_LENGTHS)[number]>(4);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [savedEndDate, setSavedEndDate] = useState("");

  const contractEndDate = useMemo(
    () => addMonthsToIso(campaignStartDate, campaignLengthMonths),
    [campaignStartDate, campaignLengthMonths]
  );

  useEffect(() => {
    if (!token) {
      setLoadStatus("error");
      return;
    }

    fetch(`/api/switch-complete?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          setLoadStatus("error");
          return;
        }
        const data = await res.json();
        setEmail(data.email);
        if (
          suggestedOperator &&
          OPERATORS.includes(suggestedOperator as (typeof OPERATORS)[number])
        ) {
          setCurrentOperator(suggestedOperator);
        } else if (OPERATORS.includes(data.currentOperator)) {
          setCurrentOperator(data.currentOperator);
        }
        if (data.campaignStartDate) {
          setCampaignStartDate(data.campaignStartDate);
        }
        if (CAMPAIGN_LENGTHS.includes(data.campaignLengthMonths)) {
          setCampaignLengthMonths(data.campaignLengthMonths);
        }
        setLoadStatus("ready");
      })
      .catch(() => setLoadStatus("error"));
  }, [token, suggestedOperator]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSubmitStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/switch-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          currentOperator,
          campaignStartDate,
          campaignLengthMonths,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitStatus("error");
        setMessage(data.error ?? "Något gick fel.");
        return;
      }
      setSavedEndDate(data.contractEndDate ?? contractEndDate);
      setSubmitStatus("success");
      setMessage(data.message);
    } catch {
      setSubmitStatus("error");
      setMessage("Kunde inte ansluta. Försök igen.");
    }
  }

  if (loadStatus === "loading") {
    return <p className="py-20 text-center text-zinc-600">Laddar...</p>;
  }

  if (loadStatus === "error") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Ogiltig länk</h1>
        <p className="mt-3 text-zinc-600">
          Länken saknas eller fungerar inte längre. Öppna länken från ditt mejl
          igen.
        </p>
        <Link href="/" className="mt-8 inline-block text-emerald-600 hover:underline">
          Tillbaka till Bytesjakten
        </Link>
      </div>
    );
  }

  if (submitStatus === "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Klart!</h1>
        <p className="mt-3 text-zinc-600">{message}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Kampanjens slutdatum:{" "}
          <strong>
            {new Date(savedEndDate || contractEndDate).toLocaleDateString("sv-SE")}
          </strong>
          . Vi mejlar dig innan det är dags att byta igen.
        </p>
        <Link href="/" className="mt-8 inline-block text-emerald-600 hover:underline">
          Tillbaka till Bytesjakten
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-center text-3xl font-bold text-zinc-900">
        Nästan klart!
      </h1>
      <p className="mt-3 text-center text-zinc-600">
        Bra jobbat{email ? `, ${email}` : ""}! Titta i SMS:et från din nya
        operatör och fyll i{" "}
        <strong className="font-semibold text-zinc-800">när nummerflytten sker</strong>
        . Välj sedan kampanjens längd så räknar vi ut slutdatumet.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Ny operatör
          </label>
          <select
            value={currentOperator}
            onChange={(e) => setCurrentOperator(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-900"
          >
            {OPERATORS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/60 p-4">
          <label
            htmlFor="porting-date"
            className="block text-base font-bold text-zinc-900"
          >
            När sker nummerflytten?
          </label>
          <p className="mt-1 text-sm text-zinc-600">
            Titta i SMS:et från operatören – där står oftast datumet för
            nummerflytten. Det blir kampanjens startdatum. Glöm inte trycka på
            Spara nedan!
          </p>
          <input
            id="porting-date"
            type="date"
            required
            value={campaignStartDate}
            onChange={(e) => setCampaignStartDate(e.target.value)}
            className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900"
          />

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Kampanjens längd
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CAMPAIGN_LENGTHS.map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setCampaignLengthMonths(months)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  campaignLengthMonths === months
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400"
                }`}
              >
                {months} mån
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-zinc-700">
            Kampanjens slutdatum:{" "}
            <strong className="text-zinc-900">
              {new Date(`${contractEndDate}T12:00:00`).toLocaleDateString("sv-SE")}
            </strong>
          </p>
        </div>

        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitStatus === "loading" ? "Sparar..." : "Spara kampanjens slutdatum"}
        </button>

        {message && submitStatus === "error" && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}

export default function SwitchCompletePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<p className="py-20 text-center">Laddar...</p>}>
        <SwitchCompleteContent />
      </Suspense>
    </>
  );
}
