import type { ReactNode } from "react";

type HeroProps = {
  /** Placed directly under the headline (e.g. signup form). */
  children?: ReactNode;
};

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bj-mobile-soft to-background px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-mobile-deep">
          Mobilabonnemang
        </p>
        <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-bj-ink sm:text-5xl lg:text-[3.25rem]">
          Byt smartare.
          <br />
          <span className="text-bj-mobile-deep">Betala mindre.</span>
        </h1>

        {children}

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-bj-muted">
          Vi bevakar kampanjer för mobilabonnemang utan bindningstid. Du slipper
          jämföra priser själv – vi mejlar dig när det är dags att byta till
          nästa billiga erbjudande. Helt gratis.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            "Vi hittar bästa kampanjen för dig",
            "Vi berättar när det är dags att byta",
            "Påminnelse en vecka innan det är dags",
          ].map((text) => (
            <li key={text} className="flex items-start gap-3 text-bj-ink">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bj-mobile"
                aria-hidden
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
