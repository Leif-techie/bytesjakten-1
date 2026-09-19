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
import { BroadbandSignupForm } from "@/components/BroadbandSignupForm";
import { BroadbandSignupSection } from "@/components/BroadbandSignupSection";
import { BroadbandBestOfferCard } from "@/components/BroadbandBestOfferCard";

export function BredbandClient() {
  const [preferences, setPreferences] = useState<BroadbandPreferences>(
    defaultBroadbandPreferences,
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-bj-broadband-soft to-background px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-broadband">
              Mobilt bredband
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-bj-ink sm:text-5xl lg:text-[3.25rem]">
              Byt smartare.
              <br />
              <span className="text-bj-broadband">Betala mindre.</span>
            </h1>

            <BroadbandSignupForm preferences={preferences} layout="hero" />

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-bj-muted">
              Berätta vilken operatör du har och när avtalet går ut – vi mejlar
              dig när det är dags att byta till ett bättre kampanjpris på mobilt
              bredband och 5G-hemma.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Vi berättar när det är dags att byta",
                "Utifrån hastighet och nät du vill ha",
                "Påminnelse innan avtalet tar slut",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-bj-ink">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bj-broadband"
                    aria-hidden
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BroadbandSignupSection />
        <BroadbandPreferencesForm
          preferences={preferences}
          onChange={setPreferences}
        />
        <BroadbandBestOfferCard preferences={preferences} />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-bj-ink">
              Vanliga frågor om mobilt bredband
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-bj-muted">
              Alla frågor och svar om både mobilabonnemang och mobilt bredband
              finns nu samlade på en gemensam sida.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vanliga-fragor#mobilt-bredband"
                className="inline-flex rounded-md bg-bj-broadband px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Läs vanliga frågor om mobilt bredband →
              </Link>
              <Link
                href="/vanliga-fragor#mobilabonnemang"
                className="inline-flex rounded-md border border-bj-line bg-white px-5 py-3 font-semibold text-bj-ink transition hover:border-bj-broadband hover:text-bj-broadband"
              >
                Se frågor om mobilabonnemang
              </Link>
            </div>

            <p className="mt-10 text-bj-muted">
              Letar du efter mobilabonnemang istället?{" "}
              <Link
                href="/mobilabonnemang"
                className="font-semibold text-bj-broadband hover:underline"
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
