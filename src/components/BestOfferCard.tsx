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
  /** Top ranked offers (best first). Falls back to single `campaign` if empty. */
  campaigns?: CampaignOffer[];
  campaign: CampaignOffer | null;
  loading?: boolean;
  activeCount?: number | null;
  lastCampaignUpdate?: string | null;
};

const RANK_GREEN: Record<number, string> = {
  1: "bg-emerald-600",
  2: "bg-emerald-500",
  3: "bg-emerald-400",
};

function rankGreen(rank: number): string {
  return RANK_GREEN[rank] ?? "bg-emerald-600";
}

function rankPanelText(rank: number): string {
  // Lighter panels need darker text for contrast.
  return rank >= 3 ? "text-emerald-950" : "text-white";
}

function rankPanelMutedText(rank: number): string {
  return rank >= 3 ? "text-emerald-950/80" : "text-white/90";
}

function ActiveCampaignsNote({ count }: { count: number | null | undefined }) {
  if (count == null) return null;
  return (
    <p className="text-sm text-zinc-500">
      {count === 1
        ? "baserat på dina val. Vi har nu 1 aktiv kampanj i databasen."
        : `baserat på dina val. Vi har nu ${count} aktiva kampanjer i databasen.`}
    </p>
  );
}

function LastUpdateBadge({ date }: { date: string | null | undefined }) {
  if (!date) return null;
  const formatted = new Date(date).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="mb-4 inline-flex max-w-full items-center rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
      <span>
        Kampanjer uppdaterade senast:{" "}
        <strong className="font-semibold">{formatted}</strong>
      </span>
    </div>
  );
}

function FeaturedOffer({
  campaign,
  activeCount,
}: {
  campaign: CampaignOffer;
  activeCount?: number | null;
}) {
  const start = new Date(campaign.campaignStart);
  const end = new Date(campaign.campaignEnd);
  const bgColor = rankGreen(1);
  const ready = campaign.readyToSwitch ?? true;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {ready && (
        <div className="absolute left-0 top-0 z-10 rounded-br-xl bg-emerald-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Klart att byta nu!
        </div>
      )}

      <div className="grid md:grid-cols-[140px_1fr_auto]">
        <div
          className={`flex items-center justify-center ${bgColor} p-8 md:min-h-[200px]`}
        >
          <span className={`text-center text-2xl font-bold ${rankPanelText(1)}`}>
            {campaign.operator}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            1 · Bästa erbjudandet just nu
          </p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-900">
            {campaign.name}
          </h2>
          <div className="mt-1">
            <ActiveCampaignsNote count={activeCount} />
          </div>
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
  );
}

function RunnerUpOffer({
  campaign,
  rank,
}: {
  campaign: CampaignOffer;
  rank: number;
}) {
  const start = new Date(campaign.campaignStart);
  const end = new Date(campaign.campaignEnd);
  const bgColor = rankGreen(rank);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className={`px-4 py-3 ${bgColor}`}>
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-sm font-bold uppercase tracking-wide ${rankPanelMutedText(rank)}`}
          >
            Alternativ {rank}
          </span>
          <span className={`text-lg font-bold ${rankPanelText(rank)}`}>
            {campaign.operator}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-zinc-900">{campaign.name}</h3>
        <p className="mt-2 text-3xl font-extrabold text-emerald-600">
          {formatSEK(campaign.campaignPrice)} kr/mån
        </p>
        <ul className="mt-3 space-y-1 text-sm text-zinc-600">
          <li>• Nät: {getNetworkLabel(campaign.network ?? "any")}</li>
          <li>• {getCampaignPeriodLabel(start, end)}</li>
        </ul>
        <p className="mt-3 text-sm text-zinc-500">
          Därefter {formatSEK(campaign.regularPrice)} kr/mån
        </p>
        <a
          href={getCampaignAffiliateUrl(campaign)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Beställ nu
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

export function BestOfferCard({
  campaigns,
  campaign,
  loading,
  activeCount,
  lastCampaignUpdate,
}: BestOfferCardProps) {
  const offers =
    campaigns && campaigns.length > 0
      ? campaigns
      : campaign
        ? [campaign]
        : [];

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

  if (offers.length === 0) {
    return (
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <LastUpdateBadge date={lastCampaignUpdate} />
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
            <p className="text-lg text-zinc-600">
              Inga aktiva kampanjer utan bindningstid matchar dina val just nu.
            </p>
            <div className="mt-2">
              <ActiveCampaignsNote count={activeCount} />
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Prova att ändra data/nät, eller bocka i/ur studentabonnemang.
              Registrera dig så mejlar vi dig när något bra dyker upp.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const [best, ...rest] = offers;
  const runnersUp = rest.slice(0, 2);

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <LastUpdateBadge date={lastCampaignUpdate} />
        {runnersUp.length > 0 ? (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
              De bästa erbjudandena just nu
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Rankade efter sparpotential utifrån dina val – ett huvudalternativ
              och två starka challengers.
            </p>
          </div>
        ) : null}
        <FeaturedOffer campaign={best} activeCount={activeCount} />
        {runnersUp.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {runnersUp.map((offer, index) => (
              <RunnerUpOffer
                key={`${offer.operator}-${offer.name}-${index}`}
                campaign={offer}
                rank={index + 2}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
