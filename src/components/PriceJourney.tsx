/**
 * Insäljande prisresa baserad på skissen:
 * horisontella prissegment med Bytesjakten vid varje byte.
 */
export function PriceJourney() {
  return (
    <figure
      className="bj-journey relative mt-10 w-full"
      aria-labelledby="bj-journey-title"
    >
      <figcaption className="mb-5 max-w-xl">
        <p
          id="bj-journey-title"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-bj-muted"
        >
          Så funkar Bytesjakten
        </p>
        <p className="mt-1.5 text-base leading-snug text-bj-muted sm:text-lg">
          När kampanjen tar slut höjs priset. Vi mejlar dig i tid – så du byter
          till nästa billiga erbjudande.
        </p>
      </figcaption>

      {/* Desktop / tablet — flat segments like the sketch */}
      <div className="bj-journey-panel relative hidden rounded-2xl bg-background px-3 py-8 ring-1 ring-bj-line sm:block sm:px-5 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-bj-soft/60 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-zinc-200/40 blur-3xl"
          aria-hidden
        />

        <svg
          viewBox="0 0 760 210"
          className="bj-journey-svg relative mx-auto h-auto w-full"
          role="img"
          aria-label="Pris över tid: 29, 230, 29 och 20 kronor per månad. Utan byte höjs priset; Bytesjakten hjälper dig byta tillbaka."
        >
          {/* Segment 1: 29 kampanj — ingen Bytesjakten här (visar vad som händer utan byte) */}
          <Segment
            x1={36}
            x2={188}
            y={118}
            tone="good"
            price="29"
            label="Kampanjpris"
          />
          {/* Tyst gap: priset bara går upp */}
          <line
            x1={196}
            y1={118}
            x2={220}
            y2={118}
            stroke="#d4d4d8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="3 5"
            className="bj-journey-path"
          />

          {/* Segment 2: 230 ordinarie — utan Bytesjakten */}
          <Segment
            x1={228}
            x2={360}
            y={118}
            tone="warn"
            price="230"
            label="Ordinarie pris"
          />
          <SwitchMark x={390} />

          {/* Segment 3: 29 ny */}
          <Segment
            x1={420}
            x2={552}
            y={118}
            tone="good"
            price="29"
            label="Ny kampanj"
          />
          <SwitchMark x={582} />

          {/* Segment 4: 20 bättre */}
          <Segment
            x1={612}
            x2={744}
            y={118}
            tone="best"
            price="20"
            label="Ännu billigare"
          />
        </svg>
      </div>

      {/* Mobile stacked journey */}
      <ol className="bj-journey-panel relative space-y-0 rounded-2xl bg-background px-4 py-5 ring-1 ring-bj-line sm:hidden">
        {[
          {
            price: "29",
            label: "Kampanjpris",
            note: "Du startar på ett lågt erbjudande.",
            tone: "good" as const,
          },
          {
            price: "230",
            label: "Ordinarie pris",
            note: "Utan Bytesjakten höjs månadspriset.",
            tone: "warn" as const,
          },
          {
            price: "29",
            label: "Ny kampanj",
            note: "Bytesjakten mejlar – du byter i tid.",
            tone: "good" as const,
            brand: true,
          },
          {
            price: "20",
            label: "Ännu billigare",
            note: "Nästa gång hittar vi ett ännu bättre pris.",
            tone: "best" as const,
            brand: true,
          },
        ].map((step, i) => (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {i < 3 && (
              <span
                className="absolute bottom-0 left-[15px] top-8 w-0.5 bg-bj-line"
                aria-hidden
              />
            )}
            <span
              className={`relative z-[1] mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white ${
                step.price.length > 2 ? "text-[9px]" : "text-xs"
              } ${
                step.tone === "warn"
                  ? "bg-zinc-400"
                  : "bg-bj-ink"
              }`}
            >
              {step.price}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              {step.brand && (
                <div className="mb-1.5 flex flex-col items-start gap-0.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-bj-ink px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background">
                    <TargetIcon className="h-2.5 w-2.5" />
                    Bytesjakten
                  </span>
                  <span className="ml-5 flex flex-col items-center" aria-hidden>
                    <span className="h-3 w-0.5 bg-bj-ink" />
                    <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-bj-ink" />
                  </span>
                </div>
              )}
              <p className="font-semibold text-bj-ink">
                {step.price} kr/mån
                <span className="ml-1.5 font-medium text-bj-muted">
                  · {step.label}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-bj-muted">{step.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Segment({
  x1,
  x2,
  y,
  tone,
  price,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  tone: "good" | "warn" | "best";
  price: string;
  label: string;
}) {
  const stroke = tone === "warn" ? "#a1a1aa" : "#1a1a18";
  const fill = tone === "warn" ? "#d4d4d8" : "#1a1a18";
  const mid = (x1 + x2) / 2;

  return (
    <g className="bj-journey-node">
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        className="bj-journey-path"
      />
      <circle cx={mid} cy={y} r="8" fill={fill} />
      <circle
        cx={mid}
        cy={y}
        r="12"
        fill="none"
        stroke={tone === "warn" ? "#e4e4e7" : "#e2e1dc"}
        strokeWidth="3"
      />
      <text
        x={mid}
        y={y + 38}
        textAnchor="middle"
        fill="#1a1a18"
        fontSize={price.length > 2 ? 17 : 20}
        fontWeight="800"
        fontFamily="var(--font-familjen), system-ui, sans-serif"
      >
        {price}
        <tspan fill="#5c5c57" fontSize="12" fontWeight="600">
          {" "}
          kr/mån
        </tspan>
      </text>
      <text
        x={mid}
        y={y + 58}
        textAnchor="middle"
        fill="#5c5c57"
        fontSize="12"
        fontWeight="500"
        fontFamily="var(--font-familjen), system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

function SwitchMark({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 22)`} className="bj-journey-brand">
      <rect x={-56} y={0} width={112} height={28} rx={14} fill="#1a1a18" />
      <circle cx={-38} cy={14} r={8} fill="#2a2a27" />
      <g
        transform="translate(-38, 14)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <circle r="4.6" />
        <circle r="1.5" fill="#ffffff" stroke="none" />
        <path d="M0 -7.4 v2.4 M0 5 v2.4 M-7.4 0 h2.4 M5 0 h2.4" />
      </g>
      <text
        x={14}
        y={18}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="var(--font-familjen), system-ui, sans-serif"
      >
        Bytesjakten
      </text>
      {/* Down arrow into the gap */}
      <line
        x1={0}
        y1={32}
        x2={0}
        y2={78}
        stroke="#1a1a18"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <polygon points="0,92 -6,78 6,78" fill="#1a1a18" />
    </g>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
