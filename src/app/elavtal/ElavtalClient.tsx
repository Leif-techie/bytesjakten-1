"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ElectricitySignupForm } from "@/components/ElectricitySignupForm";
import { ElectricitySignupSection } from "@/components/ElectricitySignupSection";

export function ElavtalClient() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
              Elavtal
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Byt smartare.
              <br />
              <span className="text-blue-600">Betala mindre.</span>
            </h1>

            <ElectricitySignupForm layout="hero" />

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-zinc-600">
              Berätta vilken elleverantör du har och när avtalet går ut – vi
              mejlar dig när det är dags att byta elavtal.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: "📅", text: "Vi berättar när det är dags att byta" },
                {
                  icon: "💡",
                  text: "Du anger fastpris/rörligt och bindningstid",
                },
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

        <ElectricitySignupSection />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900">
              Vanliga frågor om elavtal
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Alla frågor och svar om mobilabonnemang, mobilt bredband och
              elavtal finns samlade på en gemensam sida.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vanliga-fragor#elavtal"
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Läs vanliga frågor om elavtal →
              </Link>
              <Link
                href="/vanliga-fragor"
                className="inline-flex rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-800 transition hover:border-blue-300 hover:text-blue-700"
              >
                Se alla vanliga frågor
              </Link>
            </div>

            <p className="mt-10 text-zinc-600">
              Letar du efter mobilabonnemang eller mobilt bredband?{" "}
              <Link
                href="/mobilabonnemang"
                className="font-semibold text-blue-600 hover:underline"
              >
                Till mobilabonnemang →
              </Link>
              {" · "}
              <Link
                href="/bredband"
                className="font-semibold text-blue-600 hover:underline"
              >
                Till mobilt bredband →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
