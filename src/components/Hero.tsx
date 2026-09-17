import type { ReactNode } from "react";
import { PriceJourney } from "@/components/PriceJourney";

type HeroProps = {
  /** Placed directly under the headline (e.g. signup form). */
  children?: ReactNode;
};

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
          Byt smartare.
          <br />
          <span className="text-emerald-600">Betala mindre.</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
          Gratis tjänst som bevakar kampanjer och mejlar dig när det är dags att
          byta till nästa billiga erbjudande.
        </p>

        <div className="max-w-md">{children}</div>

        <PriceJourney />
      </div>
    </section>
  );
}
