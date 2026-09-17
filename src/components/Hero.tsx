import type { ReactNode } from "react";

type HeroProps = {
  /** Placed directly under the headline (e.g. signup form). */
  children?: ReactNode;
};

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Mobilabonnemang
        </p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
          Byt smartare.
          <br />
          <span className="text-emerald-600">Betala mindre.</span>
        </h1>

        {children}

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-zinc-600">
          Vi bevakar kampanjer för mobilabonnemang utan bindningstid. Du slipper
          jämföra priser själv – vi mejlar dig när det är dags att byta till
          nästa billiga erbjudande. Helt gratis.
        </p>

        <ul className="mt-8 space-y-4">
          {[
            { icon: "🏷️", text: "Vi hittar bästa kampanjen för dig" },
            { icon: "📅", text: "Vi berättar när det är dags att byta" },
            { icon: "✉️", text: "Påminnelse en vecka innan det är dags" },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-zinc-700">
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
