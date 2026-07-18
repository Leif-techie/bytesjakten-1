import {
  formatSEK,
  getCampaignAffiliateUrl,
  getCampaignPeriodLabel,
  getNetworkLabel,
} from "@/lib/campaigns";

type CampaignOffer = {
  operator: string;
  name: string;
  campaignPrice: number;
  regularPrice: number;
  url: string;
  network?: string;
  campaignStart: Date | string;
  campaignEnd: Date | string;
  readyToSwitch?: boolean;
};

type BestOfferCardProps = {
  campaign: CampaignOffer | null;
  loading?: boolean;
};

const OPERATOR_COLORS: Record<string, string> = {
  Telia: "bg-purple-900",
  Telenor: "bg-blue-600",
  Tre: "bg-pink-600",
  Hallon: "bg-orange-500",
  Comviq: "bg-yellow-500",
  Vimla: "bg-teal-600",
  Halebop: "bg-indigo-600",
  Fello: "bg-cyan-600",
  Chilimobil: "bg-red-600",
};

export function BestOfferCard({ campaign, loading }: BestOfferCardProps) {
  if (loading) {
    return (
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse rounded-2xl border border-zinc-200 bg-white p-8">
          <div className="h-6 w-48 rounded bg-zinc-200" />
          <div className="mt-6 h-12 w-64 rounded bg-zinc-200" />
        </div>
      </section>
    );
  }

  if (!campaign) {
    return (
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-lg text-zinc-600">
            Inga aktiva kampanjer utan bindningstid matchar dina val just nu.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Registrera dig så mejlar vi dig när något bra dyker upp.
          </p>
        </div>
      </section>
    );
  }

  const start = new Date(campaign.campaignStart);
  const end = new Date(campaign.campaignEnd);
  const bgColor = OPERATOR_COLORS[campaign.operator] ?? "bg-zinc-800";
  const ready = campaign.readyToSwitch ?? true;

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
        {ready && (
          <div className="absolute left-0 top-0 z-10 rounded-br-xl bg-emerald-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
            Klart att byta nu!
          </div>
        )}

        <div className="grid md:grid-cols-[140px_1fr_auto]">
          <div className={`flex items-center justify-center ${bgColor} p-8 md:min-h-[200px]`}>
            <span className="text-center text-2xl font-bold text-white">
              {campaign.operator}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Bästa erbjudandet just nu
            </p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-900">{campaign.name}</h2>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600">
              {formatSEK(campaign.campaignPrice)} kr/mån
            </p>

            <ul className="mt-4 space-y-1.5 text-sm text-zinc-600">
              <li>• Nät: {getNetworkLabel(campaign.network ?? "any")}</li>
              <li>• Ingen bindningstid</li>
              <li>• {getCampaignPeriodLabel(start, end)}</li>
            </ul>

            <p className="mt-4 inline-block rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
              Ordinarie pris därefter: {formatSEK(campaign.regularPrice)} kr/mån
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 border-t border-zinc-100 p-6 md:border-l md:border-t-0">
            <span className="text-4xl">🏷️</span>
            <a
              href={getCampaignAffiliateUrl(campaign)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
            >
              Beställ nu
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
