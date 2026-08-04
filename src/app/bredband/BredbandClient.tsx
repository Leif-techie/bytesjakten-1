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

const FAQ = [
  {
    question: "Vad är mobilt bredband?",
    answer: [
      "Mobilt bredband (ofta 5G-hemma) ger internet via mobilnätet med en router hemma – utan fiberinstallation eller stadsnät. Du beställer, kopplar in routern och surfar.",
      "Hastigheten beror på täckning och belastning i området, men du slipper binda dig till en specifik fiberleverantör på adressen.",
    ],
  },
  {
    question: "Hur fungerar byte av mobilt bredband?",
    answer: [
      "Du beställer ett nytt abonnemang hos en annan operatör, aktiverar den nya routern eller SIM:en och säger upp det gamla avtalet (eller låter det löpa ut).",
      "Kolla bindningstid, uppsägningstid och eventuella avgifter innan du byter.",
    ],
  },
  {
    question: "Kan man byta innan bindningstiden gått ut?",
    answer: [
      "Ofta ja, men du kan behöva betala kvarvarande avgifter. Räkna hem skillnaden mot det nya kampanjpriset först.",
      "Bytesjakten fokuserar på erbjudanden där du slipper onödig inlåsning så långt det går.",
    ],
  },
  {
    question: "Vad påverkar pris och hastighet?",
    answer: [
      "Kampanjlängd, ordinarie pris efter kampanj, om router ingår och vilken hastighetsnivå du väljer.",
      "Täckning där du bor spelar stor roll för hur snabbt det känns i praktiken – särskilt med 5G.",
    ],
  },
] as const;

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

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900">
              Vanliga frågor om mobilt bredband
            </h2>
            <div className="mt-6 space-y-4">
              {FAQ.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.question}
                  </h3>
                  <div className="mt-3 space-y-3 leading-relaxed text-zinc-600">
                    {item.answer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
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
