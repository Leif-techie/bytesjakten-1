"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BroadbandPreferencesForm,
  defaultBroadbandPreferences,
  type BroadbandPreferences,
} from "@/components/BroadbandPreferencesForm";
import { BroadbandSignupSection } from "@/components/BroadbandSignupSection";
import { BroadbandBestOfferCard } from "@/components/BroadbandBestOfferCard";

export function BredbandClient() {
  const [preferences, setPreferences] = useState<BroadbandPreferences>(
    defaultBroadbandPreferences
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 to-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-orange-700">
              Mobilt bredband
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Byt smartare.
              <br />
              <span className="text-orange-600">Betala mindre.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">
              Berätta vilken operatör du har och när avtalet går ut – vi mejlar
              dig när det är dags att byta till ett bättre kampanjpris på mobilt
              bredband och 5G-hemma.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: "📅", text: "Vi berättar när det är dags att byta" },
                { icon: "📡", text: "Utifrån hastighet och nät du vill ha" },
                { icon: "✉️", text: "Påminnelse innan avtalet tar slut" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 text-zinc-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BroadbandSignupSection preferences={preferences} />
        <BroadbandPreferencesForm
          preferences={preferences}
          onChange={setPreferences}
        />
        <BroadbandBestOfferCard preferences={preferences} />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900">
              Vanliga frågor om mobilt bredband
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Alla frågor och svar om både mobilabonnemang och mobilt bredband
              finns nu samlade på en gemensam sida.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vanliga-fragor#mobilt-bredband"
                className="inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Läs vanliga frågor om mobilt bredband →
              </Link>
              <Link
                href="/vanliga-fragor#mobilabonnemang"
                className="inline-flex rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-800 transition hover:border-orange-300 hover:text-orange-700"
              >
                Se frågor om mobilabonnemang
              </Link>
            </div>

            <p className="mt-10 text-zinc-600">
              Letar du efter mobilabonnemang istället?{" "}
              <Link
                href="/"
                className="font-semibold text-orange-600 hover:underline"
              >
                Till mobilabonnemang →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
