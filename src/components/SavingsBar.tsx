export function SavingsBar() {
  const campaignPrice = 49;
  const regularPrice = 259;
  const monthlySavings = regularPrice - campaignPrice;
  const annualSavings = monthlySavings * 12;

  return (
    <section className="bg-bj-mobile px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4 text-bj-ink">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bj-ink/10">
            <span className="text-2xl" aria-hidden>
              ●
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">
              Du sparar {annualSavings.toLocaleString("sv-SE")} kr/år
            </p>
            <p className="mt-1 text-sm text-bj-ink/75">
              Räkneexempel: {campaignPrice} kr/mån i snitt vs {regularPrice} kr/mån
              ordinarie = {monthlySavings} kr/mån × 12 ={" "}
              {annualSavings.toLocaleString("sv-SE")} kr/år
            </p>
          </div>
        </div>

        <div className="hidden h-12 w-px bg-bj-ink/20 sm:block" />

        <div className="text-center text-bj-ink sm:text-right">
          <p className="text-2xl font-bold sm:text-3xl">Snittpris 49 kr/mån</p>
          <p className="mt-1 text-sm text-bj-ink/75">
            Byt till ny kampanj innan ordinarie pris börjar gälla
          </p>
        </div>
      </div>
    </section>
  );
}
