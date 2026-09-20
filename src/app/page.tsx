import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceJourney } from "@/components/PriceJourney";

const VERTICALS = [
  {
    href: "/mobilabonnemang",
    title: "Mobilabonnemang",
    description: "Kampanjer utan bindningstid – byt när priset går upp.",
    accent: "mobile" as const,
  },
  {
    href: "/bredband",
    title: "Mobilt bredband",
    description: "5G-hemma och mobilt bredband till kampanjpris.",
    accent: "broadband" as const,
  },
  {
    href: "/elavtal",
    title: "Elavtal",
    description: "Få påminnelse när det är dags att se över elavtalet.",
    accent: "electricity" as const,
  },
] as const;

const accentStyles = {
  mobile: {
    ring: "ring-bj-mobile/40 hover:ring-bj-mobile",
    title: "group-hover:text-bj-mobile-deep",
    arrow: "text-bj-mobile-deep",
    bar: "bg-bj-mobile",
  },
  broadband: {
    ring: "ring-bj-broadband/30 hover:ring-bj-broadband",
    title: "group-hover:text-bj-broadband",
    arrow: "text-bj-broadband",
    bar: "bg-bj-broadband",
  },
  electricity: {
    ring: "ring-bj-electricity/30 hover:ring-bj-electricity",
    title: "group-hover:text-bj-electricity",
    arrow: "text-bj-electricity",
    bar: "bg-bj-electricity",
  },
} as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-bj-ink sm:text-5xl lg:text-[3.25rem]">
              Byt smartare.
              <br />
              <span className="text-bj-muted">Betala mindre.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bj-muted">
              Gratis tjänst som bevakar kampanjer och mejlar dig när det är dags
              att byta till nästa billiga erbjudande.
            </p>

            <div className="mt-8">
              <Link
                href="/registrera"
                className="inline-flex rounded-md bg-bj-ink px-6 py-3.5 font-semibold text-background transition hover:opacity-90"
              >
                Registrera påminnelser →
              </Link>
            </div>

            <PriceJourney />

            <div className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-muted">
                Välj vad du vill bevaka
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {VERTICALS.map((item) => {
                  const styles = accentStyles[item.accent];
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group relative flex h-full flex-col overflow-hidden rounded-lg bg-white p-5 ring-1 transition ${styles.ring}`}
                      >
                        <span
                          className={`absolute inset-y-0 left-0 w-1 ${styles.bar}`}
                          aria-hidden
                        />
                        <span
                          className={`text-lg font-bold text-bj-ink transition ${styles.title}`}
                        >
                          {item.title}
                        </span>
                        <span className="mt-1.5 flex-1 text-sm leading-snug text-bj-muted">
                          {item.description}
                        </span>
                        <span
                          className={`mt-4 text-sm font-semibold ${styles.arrow}`}
                        >
                          Kom igång →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
