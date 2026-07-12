import { formatSEK } from "@/lib/campaigns";

type SavingsBarProps = {
  annualSavings: number;
  campaignPrice: number;
  referencePrice?: number;
  campaignMonths?: number;
};

export function SavingsBar({
  annualSavings,
  campaignPrice,
  referencePrice = 250,
  campaignMonths,
}: SavingsBarProps) {
  return (
    <section className="bg-emerald-600 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <span className="text-2xl">🐷</span>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">
              Du sparar {formatSEK(annualSavings)} kr/år
            </p>
            <p className="mt-1 text-emerald-100">
              Jämfört med ordinarie pris {formatSEK(referencePrice)} kr/mån hela året
            </p>
          </div>
        </div>

        <div className="hidden h-12 w-px bg-emerald-400 sm:block" />

        <div className="text-center text-white sm:text-right">
          <p className="text-2xl font-bold sm:text-3xl">
            Kampanjpris {formatSEK(campaignPrice)} kr/mån
          </p>
          <p className="mt-1 text-emerald-100">
            {campaignMonths
              ? `Behåll abonnemanget ${campaignMonths} mån, byt sedan innan ordinarie pris gäller`
              : "Under kampanjperioden"}
          </p>
        </div>
      </div>
    </section>
  );
}
