import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceJourney } from "@/components/PriceJourney";

const VERTICALS = [
  {
    href: "/mobilabonnemang",
    title: "Mobilabonnemang",
    description: "Kampanjer utan bindningstid – byt när priset går upp.",
    accent: "emerald" as const,
  },
  {
    href: "/bredband",
    title: "Mobilt bredband",
    description: "5G-hemma och mobilt bredband till kampanjpris.",
    accent: "orange" as const,
  },
  {
    href: "/elavtal",
    title: "Elavtal",
    description: "Få påminnelse när det är dags att se över elavtalet.",
    accent: "blue" as const,
  },
] as const;

const accentStyles = {
  emerald: {
    ring: "ring-emerald-200 hover:ring-emerald-400",
    title: "group-hover:text-emerald-700",
    arrow: "text-emerald-600",
    bar: "bg-emerald-600",
  },
  orange: {
    ring: "ring-orange-200 hover:ring-orange-400",
    title: "group-hover:text-orange-700",
    arrow: "text-orange-600",
    bar: "bg-orange-600",
  },
  blue: {
    ring: "ring-blue-200 hover:ring-blue-400",
    title: "group-hover:text-blue-700",
    arrow: "text-blue-600",
    bar: "bg-blue-600",
  },
} as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
              Byt smartare.
              <br />
              <span className="text-emerald-600">Betala mindre.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
              Gratis tjänst som bevakar kampanjer och mejlar dig när det är dags
              att byta till nästa billiga erbjudande.
            </p>

            <PriceJourney />

            <div className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Välj vad du vill bevaka
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {VERTICALS.map((item) => {
                  const styles = accentStyles[item.accent];
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 transition ${styles.ring}`}
                      >
                        <span
                          className={`absolute inset-y-0 left-0 w-1 ${styles.bar}`}
                          aria-hidden
                        />
                        <span
                          className={`text-lg font-bold text-zinc-900 transition ${styles.title}`}
                        >
                          {item.title}
                        </span>
                        <span className="mt-1.5 flex-1 text-sm leading-snug text-zinc-600">
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
