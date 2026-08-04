import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MOBILABBONEMANG_FAQ } from "@/lib/mobilabonnemang-faq";
import { BROADBAND_FAQ } from "@/lib/broadband-faq";

export const metadata: Metadata = {
  title: "Vanliga frågor – mobilabonnemang och mobilt bredband | Bytesjakten",
  description:
    "Svar på vanliga frågor om mobilabonnemang, nummerflytt, eSIM och mobilt bredband hos Bytesjakten.",
};

function FaqSection({
  id,
  eyebrow,
  title,
  description,
  items,
  accent,
  tip,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: typeof MOBILABBONEMANG_FAQ;
  accent: "emerald" | "orange";
  tip?: ReactNode;
}) {
  const eyebrowClass =
    accent === "orange" ? "text-orange-700" : "text-emerald-700";
  const tipBorderClass =
    accent === "orange" ? "border-orange-500" : "border-emerald-500";
  const tipBgClass = accent === "orange" ? "bg-orange-50" : "bg-emerald-50";
  const tipTitleClass =
    accent === "orange" ? "text-orange-800" : "text-emerald-800";

  return (
    <section id={id} className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className={`text-sm font-medium uppercase tracking-wide ${eyebrowClass}`}>
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h2>
        <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-6">
          <p className="flex-1 text-lg leading-relaxed text-zinc-600">
            {description}
          </p>
          {tip ? (
            <aside
              className={`mx-auto mt-3 w-full max-w-[240px] shrink-0 rotate-3 rounded-lg border-2 border-dashed ${tipBorderClass} ${tipBgClass} px-4 py-3 text-sm leading-snug text-zinc-700 shadow-sm sm:mx-0 sm:mt-5 sm:rotate-[6deg]`}
            >
              <p>
                <strong className={`font-semibold ${tipTitleClass}`}>Tips!</strong>{" "}
                {tip}
              </p>
            </aside>
          ) : null}
        </div>

        <div className="mt-10 space-y-4">
          {items.map((item) => (
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
      </div>
    </section>
  );
}

export default function VanligaFragorPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-zinc-50/60">
        <section className="px-4 pb-8 pt-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Hjälp
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Vanliga frågor
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Här har vi samlat svar på de vanligaste frågorna om både
              mobilabonnemang och mobilt bredband.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#registrera"
                className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Till mobilabonnemang →
              </Link>
              <Link
                href="/bredband#registrera"
                className="inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Till mobilt bredband →
              </Link>
            </div>
          </div>
        </section>

        <FaqSection
          id="mobilabonnemang"
          eyebrow="Mobilabonnemang"
          title="Vanliga frågor om mobilabonnemang"
          description="Frågor om nummerflytt, eSIM och hur du byter abonnemang utan onödigt krångel."
          items={MOBILABBONEMANG_FAQ}
          accent="emerald"
          tip="Med lite tur så ger ett byte under våren dubbel surf som också sparas månad till månad. Detta ger mycket surf under sommaren. Undertecknad hade senast 600 GB över sommaren via Vimla. Perfekt i sommarstugan."
        />

        <FaqSection
          id="mobilt-bredband"
          eyebrow="Mobilt bredband"
          title="Vanliga frågor om mobilt bredband"
          description="Frågor om 5G-hemma, hastighet, bindningstid och hur ett byte fungerar."
          items={BROADBAND_FAQ}
          accent="orange"
        />
      </main>
      <Footer />
    </>
  );
}
