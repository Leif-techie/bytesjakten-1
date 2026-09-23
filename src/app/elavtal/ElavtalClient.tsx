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
        <section className="relative overflow-hidden bg-gradient-to-b from-bj-electricity-soft to-background px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-electricity">
              Elavtal
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-bj-ink sm:text-5xl lg:text-[3.25rem]">
              Byt smartare.
              <br />
              <span className="text-bj-electricity">Betala mindre.</span>
            </h1>

            <ElectricitySignupForm layout="hero" />

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-bj-muted">
              Berätta vilken elleverantör du har och när avtalet går ut – vi
              mejlar dig när det är dags att byta elavtal.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Vi berättar när det är dags att byta",
                "Du anger fastpris/rörligt och bindningstid",
                "Påminnelse innan avtalet tar slut",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-bj-ink">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bj-electricity"
                    aria-hidden
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ElectricitySignupSection />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-bj-ink">
              Vanliga frågor om elavtal
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-bj-muted">
              Alla frågor och svar om mobilabonnemang, mobilt bredband och
              elavtal finns samlade på en gemensam sida.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vanliga-fragor#elavtal"
                className="inline-flex rounded-md bg-bj-electricity px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Läs vanliga frågor om elavtal →
              </Link>
              <Link
                href="/vanliga-fragor"
                className="inline-flex rounded-md border border-bj-line bg-white px-5 py-3 font-semibold text-bj-ink transition hover:border-bj-electricity hover:text-bj-electricity"
              >
                Se alla vanliga frågor
              </Link>
            </div>

            <p className="mt-10 text-bj-muted">
              Letar du efter mobilabonnemang eller mobilt bredband?{" "}
              <Link
                href="/mobilabonnemang"
                className="font-semibold text-bj-electricity hover:underline"
              >
                Till mobilabonnemang →
              </Link>
              {" · "}
              <Link
                href="/bredband"
                className="font-semibold text-bj-electricity hover:underline"
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
