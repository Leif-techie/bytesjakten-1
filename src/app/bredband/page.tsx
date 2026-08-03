import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Bredband – byt smartare, betala mindre | Bytesjakten",
  description:
    "Snart hjälper Bytesjakten dig byta bredband till bättre kampanjpris i rätt tid. Läs hur bredbandsbyte fungerar och behåll koll på slutdatum.",
};

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
      "Bytesjakten kommer, precis som för mobil, att fokusera på erbjudanden där du slipper onödig inlåsning så långt det går.",
    ],
  },
  {
    question: "Vad påverkar priset på bredband?",
    answer: [
      "Adress och tillgänglig teknik (fiber, kabel, 5G-hemma m.m.), hastighet, om router ingår, kampanjlängd och ordinarie pris efter kampanj.",
      "Två hushåll på samma gata kan ha olika utbud – därför blir adress viktigt när bredbandstjänsten är igång.",
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

export default function BredbandPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Nästa steg
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Bredband
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Samma idé som för mobilabonnemang: du berättar vad du har och när
              avtalet går ut – vi mejlar dig när det är dags att byta till ett
              bättre kampanjpris. Bredbandsdelen byggs ut nu.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-zinc-700">
              <p className="leading-relaxed">
                <strong className="font-semibold text-emerald-800">
                  På gång:
                </strong>{" "}
                Registrering och påminnelser för bredband kommer här. Tills
                dess kan du använda Bytesjakten för{" "}
                <Link
                  href="/#registrera"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  mobilabonnemang
                </Link>
                .
              </p>
            </div>

            <div className="mt-12 space-y-8 leading-relaxed text-zinc-600">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Så kommer det att funka
                </h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Du anger leverantör, ungefärlig hastighet och slutdatum.</li>
                  <li>Vi håller koll på kampanjer som passar dig.</li>
                  <li>Du får mejl i tid innan avtalet tar slut.</li>
                  <li>Du väljer själv om du vill byta via länken i mejlet.</li>
                </ol>
              </div>
            </div>

            <h2 className="mt-14 text-2xl font-bold text-zinc-900">
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
              Frågor om tjänsten?{" "}
              <Link
                href="/kontakt"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Kontakta oss →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
