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
    question: "Hur fungerar byte av bredband?",
    answer: [
      "Du tecknar ett nytt abonnemang hos en annan operatör och säger upp det gamla (eller låter det löpa ut). Vissa byten kräver teknikerbesök eller ny router – andra kan aktiveras mer eller mindre automatiskt beroende på teknik och adress.",
      "Kolla alltid bindningstid, uppsägningstid och eventuella avgifter innan du byter, så du inte får överraskningar.",
    ],
  },
  {
    question: "Kan man byta bredband innan bindningstiden gått ut?",
    answer: [
      "Ofta ja, men du kan behöva betala kvarvarande avgifter eller uppsägningskostnad. Det lönar sig ibland ändå om det nya erbjudandet är tillräckligt mycket billigare – räkna hem skillnaden först.",
      "Bytesjakten fokuserar, precis som för mobil, på erbjudanden där du slipper onödig inlåsning så långt det går.",
    ],
  },
  {
    question: "Vad påverkar priset på bredband?",
    answer: [
      "Adress och tillgänglig teknik (fiber, kabel, 5G-hemma m.m.), hastighet, om router ingår, kampanjlängd och ordinarie pris efter kampanj.",
      "Två hushåll på samma gata kan ha olika utbud – därför kan adress bli viktigt när vi kopplar på kampanjer.",
    ],
  },
  {
    question: "Hur lång tid tar ett bredbandsbyte?",
    answer: [
      "Det varierar. Ibland går aktivering på några dagar, ibland tar det längre om installation eller leverans av utrustning krävs.",
      "Planera bytet så att du har uppkoppling under övergången – särskilt om du jobbar hemifrån.",
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
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Bredband
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Byt smartare.
              <br />
              <span className="text-emerald-600">Betala mindre.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">
              Samma idé som för mobil: du berättar vad du har och när avtalet går
              ut – vi mejlar dig när det är dags att byta till ett bättre
              kampanjpris.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: "📅", text: "Vi berättar när det är dags att byta" },
                { icon: "⚡", text: "Utifrån hastighet och teknik du vill ha" },
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
              Vanliga frågor om bredband
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
              Letar du efter mobil istället?{" "}
              <Link
                href="/"
                className="font-semibold text-emerald-600 hover:underline"
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
