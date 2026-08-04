import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Om Bytesjakten – byt smartare, betala mindre",
  description:
    "Bytesjakten är en gratis tjänst som hjälper dig byta mobilabonnemang till kampanjpris utan bindningstid – i rätt tid, varje gång.",
};

export default function OmPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Om oss
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Om Bytesjakten
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Bytesjakten hjälper dig att alltid ha ett bra pris på
              mobilabonnemang – utan bindningstid och utan att du själv behöver
              jaga erbjudanden varje månad.
            </p>

            <div className="mt-12 space-y-8 leading-relaxed text-zinc-600">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Vad vi gör
                </h2>
                <p className="mt-3">
                  Du berättar hur mycket data du behöver, vilket nät du vill ha
                  och när ditt nuvarande abonnemang går ut. Vi håller koll på
                  aktuella kampanjer och mejlar dig när det är dags att byta.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Alltid gratis
                </h2>
                <p className="mt-3">
                  Tjänsten kostar ingenting för dig. Vi tjänar på affiliate-länkar
                  när du beställer via våra mejl – samma kampanjpris som hos
                  operatören.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Utan bindningstid
                </h2>
                <p className="mt-3">
                  Vi tipsar om kampanjer utan bindningstid, så att du kan byta
                  igen när kampanjpriset tar slut. På så sätt betalar du mindre
                  över tid – byt smartare, betala mindre.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Du bestämmer
                </h2>
                <p className="mt-3">
                  Vi skickar tipset och länken – du väljer själv om och när du
                  beställer. När bytet gått igenom anger du kampanjens slutdatum,
                  så påminner vi dig innan nästa byte.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/#registrera"
                className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Kom igång gratis →
              </Link>
              <Link
                href="/vanliga-fragor#mobilabonnemang"
                className="inline-flex rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-800 transition hover:border-emerald-400"
              >
                Läs vanliga frågor
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
