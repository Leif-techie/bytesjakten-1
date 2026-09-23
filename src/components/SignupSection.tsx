function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-bj-mobile-deep" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Marketing block below the fold. Signup form lives in the hero.
 */
export function SignupSection() {
  return (
    <section className="border-y border-bj-line bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-bj-ink">
          Vi ser till att du alltid ligger kvar på billigast kampanjpris
        </h2>
        <p className="mt-4 text-lg text-bj-muted">
          Registrera dig hos oss så mejlar vi dig när det närmar sig byte – du får då en länk
          till den bästa kampanjen baserat på dina preferenser.
        </p>
        <ul className="mx-auto mt-6 inline-block text-left text-bj-ink">
          <li className="flex items-center gap-2">
            <CheckIcon /> Påminnelse via mejl när det är dags för byte
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Operatörer i vårt erbjudande: Hallon, Vimla, Comviq och Fello
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Länk till bästa erbjudandet
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Vi håller koll åt dig
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Det tar 5 minuter att byta
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Alltid gratis
          </li>
        </ul>

        <a
          href="#registrera"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-bj-mobile px-6 py-3.5 font-semibold text-bj-ink transition hover:bg-bj-mobile-deep hover:text-white"
        >
          Registrera dig ↑
        </a>
      </div>
    </section>
  );
}
