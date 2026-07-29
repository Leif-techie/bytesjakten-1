import { ESIM_GUIDE_STEPS } from "@/lib/esim-guide";

export function EsimGuide() {
  return (
    <section id="esim" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-zinc-900">Byt med eSIM – så gör du</h2>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600">
          Med eSIM byter du operatör utan att vänta på ett plastkort. Här är en enkel guide
          steg för steg.
        </p>

        <ol className="mt-10 space-y-8">
          {ESIM_GUIDE_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 sm:gap-5">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                <div className="mt-1.5 space-y-1.5 leading-relaxed text-zinc-600">
                  {step.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-zinc-500">
          Tips: gör bytet när du har wifi hemma, så går installationen smidigare om
          mobilnätet tillfälligt saknas under övergången.
        </p>
      </div>
    </section>
  );
}
