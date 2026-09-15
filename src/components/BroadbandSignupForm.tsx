"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BROADBAND_OPERATORS,
  BROADBAND_SPEED_OPTIONS,
  BROADBAND_TECHNOLOGY_OPTIONS,
} from "@/lib/constants";
import { trackSignUp } from "@/lib/snap-pixel";
import type { BroadbandPreferences } from "./BroadbandPreferencesForm";

type BroadbandSignupFormProps = {
  preferences: BroadbandPreferences;
  layout?: "hero" | "centered";
};

/** Email + Kom igång + fine print for broadband, with registration modal. */
export function BroadbandSignupForm({
  preferences,
  layout = "hero",
}: BroadbandSignupFormProps) {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const [currentOperator, setCurrentOperator] = useState(
    preferences.currentOperator,
  );
  const [contractEndDate, setContractEndDate] = useState(
    preferences.contractEndDate,
  );
  const [minSpeedMbps, setMinSpeedMbps] = useState(preferences.minSpeedMbps);
  const [technology, setTechnology] = useState(preferences.technology);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setCurrentOperator(preferences.currentOperator);
    setContractEndDate(preferences.contractEndDate);
    setMinSpeedMbps(preferences.minSpeedMbps);
    setTechnology(preferences.technology);
    setShowModal(true);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!contractEndDate) {
      setStatus("error");
      setMessage("Fyll i slutdatum för ditt nuvarande avtal.");
      return;
    }

    try {
      const res = await fetch("/api/broadband/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentOperator,
          contractEndDate,
          minSpeedMbps,
          technology,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Något gick fel.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      trackSignUp({ vertical: "broadband", email });
      setEmail("");
      setShowModal(false);
    } catch {
      setStatus("error");
      setMessage("Kunde inte ansluta. Försök igen.");
    }
  }

  const isHero = layout === "hero";

  return (
    <>
      <div
        id="registrera"
        className={isHero ? "mt-8 max-w-md" : "mx-auto mt-8 max-w-md"}
      >
        <form onSubmit={handleEmailSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="din@epost.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-300 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700"
            >
              Kom igång →
            </button>
          </div>
        </form>

        {status === "success" && message && (
          <p className="mt-4 text-sm text-orange-600">{message}</p>
        )}

        <p
          className={`mt-4 text-sm text-zinc-400 ${isHero ? "text-left" : "text-center"}`}
        >
          Ingen bindningstid. Avregistrera när som helst. Glöm inte kolla
          skräpposten.{" "}
          <Link href="/integritet" className="underline hover:text-zinc-600">
            Integritetspolicy
          </Link>
          .
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
              aria-label="Stäng"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-zinc-900">
              Bekräfta dina uppgifter
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Kontrollera att allt stämmer – ändra om du vill.
            </p>

            <form onSubmit={handleRegister} className="mt-5 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  E-post
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-700"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Operatör
                  </label>
                  <select
                    value={currentOperator}
                    onChange={(e) => setCurrentOperator(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-900"
                  >
                    {BROADBAND_OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Avtalet tar slut
                  </label>
                  <input
                    type="date"
                    required
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Önskad hastighet
                  </label>
                  <select
                    value={minSpeedMbps}
                    onChange={(e) => setMinSpeedMbps(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-900"
                  >
                    {BROADBAND_SPEED_OPTIONS.map((speed) => (
                      <option key={speed} value={speed}>
                        {speed} Mbit/s
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Nät
                  </label>
                  <select
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-900"
                  >
                    {BROADBAND_TECHNOLOGY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {status === "error" && message && (
                <p className="text-sm text-red-600">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
              >
                {status === "loading" ? "Sparar..." : "Spara och registrera"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
