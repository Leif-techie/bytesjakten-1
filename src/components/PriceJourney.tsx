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

      <div className="bj-journey-panel relative overflow-x-auto rounded-2xl bg-background px-3 py-8 ring-1 ring-bj-line [-webkit-overflow-scrolling:touch] sm:overflow-visible sm:px-5 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-20 hidden h-56 w-56 rounded-full bg-bj-soft/60 blur-3xl sm:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 hidden h-48 w-48 rounded-full bg-zinc-200/40 blur-3xl sm:block"
          aria-hidden
        />

        <svg
          viewBox="0 0 760 210"
          className="bj-journey-svg relative mx-auto h-auto w-[640px] max-w-none sm:w-full sm:max-w-3xl"
          role="img"
          aria-label="Pris över tid: 29, 230, 29 och 20 kronor per månad. Utan byte höjs priset; Bytesjakten hjälper dig byta tillbaka."
        >
          <Segment
            x1={36}
            x2={188}
            y={118}
            tone="good"
            price="29"
            label="Kampanjpris"
          />
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

          <Segment
            x1={228}
            x2={360}
            y={118}
            tone="warn"
            price="230"
            label="Ordinarie pris"
          />
          <SwitchMark x={390} />

          <Segment
            x1={420}
            x2={552}
            y={118}
            tone="good"
            price="29"
            label="Ny kampanj"
          />
          <SwitchMark x={582} />

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
      <p className="mt-2 text-center text-xs text-bj-muted sm:hidden">
        Svep i sidled för att se hela tidslinjen
      </p>
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
