function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-blue-600"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Marketing block for electricity. Signup form lives in the hero.
 */
export function ElectricitySignupSection() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-zinc-900">
          Få mejl när det är dags att byta elavtal
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Registrera dig så håller vi koll på när ditt elavtal går ut och mejlar
          dig i tid – med tips om bättre kampanjpris, oavsett om du vill ha
          fastpris eller rörligt och hur lång bindningstid du accepterar.
        </p>
        <ul className="mx-auto mt-6 inline-block text-left text-zinc-700">
          <li className="flex items-center gap-2">
            <CheckIcon /> Påminnelse via mejl innan avtalet tar slut
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Baserat på pristyp och bindningstid du vill ha
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Du väljer själv om du vill byta
          </li>
          <li className="mt-2 flex items-center gap-2">
            <CheckIcon /> Alltid gratis
          </li>
        </ul>

        <a
          href="#registrera"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Registrera dig ↑
        </a>
      </div>
    </section>
  );
}
