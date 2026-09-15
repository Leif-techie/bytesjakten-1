function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
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
    <section className="bg-zinc-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-zinc-900">
          Vi ser till att du alltid ligger kvar på billigast kampanjpris
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Registrera dig hos oss så mejlar vi dig när det närmar sig byte – du får då en länk
          till den bästa kampanjen baserat på dina preferenser.
        </p>
        <ul className="mx-auto mt-6 inline-block text-left text-zinc-700">
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
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
        >
          Registrera dig ↑
        </a>
      </div>
    </section>
  );
}
