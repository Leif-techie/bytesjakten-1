import type { Metadata } from "next";
import Link from "next/link";
import { EsimGuide } from "@/components/EsimGuide";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MOBILABBONEMANG_FAQ } from "@/lib/mobilabonnemang-faq";

export const metadata: Metadata = {
  title: "Mobilabonnemang – nummerflytt, eSIM och byte | Bytesjakten",
  description:
    "Så fungerar nummerflytt, eSIM och byte av mobilabonnemang. Behåll ditt nummer och byt till kampanjpris utan bindningstid med Bytesjakten.",
};

export default function MobilabonnemangPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Guide
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Mobilabonnemang
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Här får du svar på de vanligaste frågorna om att byta operatör,
              behålla numret och använda eSIM – så att du kan jaga kampanjpris
              utan onödigt krångel.
            </p>

            <div className="mt-12 space-y-4">
              {MOBILABBONEMANG_FAQ.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {item.question}
                  </h2>
                  <div className="mt-3 space-y-3 leading-relaxed text-zinc-600">
                    {item.answer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-10 text-zinc-600">
              Redo att börja?{" "}
              <Link
                href="/#registrera"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Registrera dig gratis på startsidan →
              </Link>
            </p>
          </div>
        </section>

        <div className="border-t border-zinc-100 bg-zinc-50/80">
          <EsimGuide />
        </div>
      </main>
      <Footer />
    </>
  );
}
