const STEPS = [
  {
    title: "Kolla att telefonen har eSIM",
    body: "De flesta nyare iPhone och Android-telefoner stödjer eSIM. På iPhone: Inställningar → Allmänt → Om – leta efter ”E-SIM” eller ”Digitalt SIM”. På Android står det oftast under Inställningar → Nätverk och internet → SIM-kort.",
  },
  {
    title: "Beställ nytt abonnemang med eSIM",
    body: "Välj eSIM hos den nya operatören och ange att du vill flytta med ditt nummer (nummerportering). Du behöver inte besöka en butik.",
  },
  {
    title: "Ta emot QR-kod eller aktiveringskod",
    body: "Operatören skickar vanligtvis en QR-kod eller aktiveringskod via mejl eller i sin app. Ha den redo innan du börjar installera.",
  },
  {
    title: "Installera eSIM i telefonen",
    body: "iPhone: Inställningar → Mobilnät → Lägg till eSIM → skanna QR-koden. Android: Inställningar → Nätverk och internet → SIM → Lägg till eSIM → skanna QR-koden. Följ stegen på skärmen.",
  },
  {
    title: "Aktivera och vänta in nummerflytten",
    body: "När eSIM är installerat aktiveras den nya linjen. Nummerflytten tar oftast några minuter upp till några timmar. Under tiden kan du behålla det gamla SIM-kortet tills det nya fungerar.",
  },
  {
    title: "Kontrollera att allt funkar – sen är du klar",
    body: "Testa att ringa, ta emot SMS och surfa på det nya abonnemanget. När det fungerar kan du ta bort eller inaktivera det gamla SIM/eSIM. Spara gärna fakturor i Kivra.",
  },
];

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
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 sm:gap-5">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-zinc-600">{step.body}</p>
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
