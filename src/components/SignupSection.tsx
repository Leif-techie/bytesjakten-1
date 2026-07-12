"use client";

import { useState } from "react";
import type { UserPreferences } from "./PreferencesForm";

type SignupSectionProps = {
  preferences: UserPreferences;
};

export function SignupSection({ preferences }: SignupSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentOperator: preferences.currentOperator,
          contractEndDate: preferences.contractEndDate,
          minDataGB: preferences.minDataGB,
          networkPreference: preferences.networkPreference,
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
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Kunde inte ansluta. Försök igen.");
    }
  }

  return (
    <section id="registrera" className="bg-zinc-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
          ✉️
        </div>
        <h2 className="mt-6 text-3xl font-bold text-zinc-900">Missa aldrig nästa kampanj</h2>
        <p className="mt-4 text-lg text-zinc-600">
          Registrera dig gratis så mejlar vi dig en vecka innan ditt abonnemang går ut –
          med länk till bästa kampanjen hos ett annat telebolag.
        </p>

        <ul className="mx-auto mt-6 inline-block text-left text-zinc-700">
          <li className="flex items-center gap-2">
            <CheckIcon /> Påminnelse i rätt tid
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Länk till bästa erbjudandet
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Uppdateras varje morgon kl 07:00
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="din@epost.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-300 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {status === "loading" ? "Registrerar..." : "Kom igång gratis →"}
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${status === "success" ? "text-emerald-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-sm text-zinc-400">
          Ingen bindningstid. Avregistrera när som helst.
        </p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
