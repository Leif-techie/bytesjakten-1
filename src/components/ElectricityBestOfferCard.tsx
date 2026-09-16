"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatSEK,
  getCampaignAffiliateUrl,
  getCampaignPeriodLabel,
  getElectricityPriceTypeLabel,
  getElectricityBindingLabel,
  daysUntil,
} from "@/lib/campaigns";
import type { ElectricityPreferences } from "@/components/ElectricityPreferencesForm";
import { trackOfferClick, trackViewContent } from "@/lib/snap-pixel";

type ElectricityOffer = {
  operator: string;
  name: string;
  priceType: string;
  bindingMonths: number;
  campaignPrice: number;
  regularPrice: number;
  url: string;
  campaignStart: Date | string;
  campaignEnd: Date | string;
  readyToSwitch?: boolean;
};

type ElectricityBestOfferCardProps = {
  preferences: ElectricityPreferences;
};

const RANK_BLUE: Record<number, string> = {
  1: "bg-blue-600",
  2: "bg-blue-500",
  3: "bg-blue-400",
};

function rankBlue(rank: number): string {
  return RANK_BLUE[rank] ?? "bg-blue-600";
}

function rankPanelText(rank: number): string {
  return rank >= 3 ? "text-blue-950" : "text-white";
}

function rankPanelMutedText(rank: number): string {
  return rank >= 3 ? "text-blue-950/80" : "text-white/90";
}

function ActiveCampaignsNote({ count }: { count: number | null | undefined }) {
  if (count == null) return null;
  return (
    <p className="text-sm text-zinc-500">
      {count === 1
        ? "baserat på dina val. Vi har nu 1 aktiv elkampanj i databasen."
        : `baserat på dina val. Vi har nu ${count} aktiva elkampanjer i databasen.`}
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
    <div className="mb-4 inline-flex max-w-full items-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 px-4 py-2.5 text-sm text-blue-900">
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
  campaign: ElectricityOffer;
  activeCount?: number | null;
}) {
  const start = new Date(campaign.campaignStart);
  const end = new Date(campaign.campaignEnd);
  const bgColor = rankBlue(1);
  const ready = campaign.readyToSwitch ?? true;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {ready && (
        <div className="absolute left-0 top-0 z-10 rounded-br-xl bg-blue-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
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
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            1 · Bästa erbjudandet just nu
          </p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-900">
            {campaign.name}
          </h2>
          <div className="mt-1">
            <ActiveCampaignsNote count={activeCount} />
          </div>
          <p className="mt-2 text-4xl font-extrabold text-blue-600">
            {formatSEK(campaign.campaignPrice)} öre/kWh
          </p>

          <ul className="mt-4 space-y-1.5 text-sm text-zinc-600">
            <li>
              • Pristyp: {getElectricityPriceTypeLabel(campaign.priceType)}
            </li>
            <li>• {getElectricityBindingLabel(campaign.bindingMonths)}</li>
            <li>• {getCampaignPeriodLabel(start, end)}</li>
          </ul>

          <p className="mt-4 inline-block rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
            Ordinarie pris därefter: {formatSEK(campaign.regularPrice)} öre/kWh
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t border-zinc-100 p-6 md:border-l md:border-t-0">
          <span className="text-4xl">⚡</span>
          <a
            href={getCampaignAffiliateUrl(campaign)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() =>
              trackOfferClick({
                operator: campaign.operator,
                campaignName: campaign.name,
                vertical: "electricity",
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
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
  campaign: ElectricityOffer;
  rank: number;
}) {
  const start = new Date(campaign.campaignStart);
  const end = new Date(campaign.campaignEnd);
  const bgColor = rankBlue(rank);

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
        <p className="mt-2 text-3xl font-extrabold text-blue-600">
          {formatSEK(campaign.campaignPrice)} öre/kWh
        </p>
        <ul className="mt-3 space-y-1 text-sm text-zinc-600">
          <li>• {getElectricityPriceTypeLabel(campaign.priceType)}</li>
          <li>• {getElectricityBindingLabel(campaign.bindingMonths)}</li>
          <li>• {getCampaignPeriodLabel(start, end)}</li>
        </ul>
        <p className="mt-3 text-sm text-zinc-500">
          Därefter {formatSEK(campaign.regularPrice)} öre/kWh
        </p>
        <a
          href={getCampaignAffiliateUrl(campaign)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() =>
            trackOfferClick({
              operator: campaign.operator,
              campaignName: campaign.name,
              vertical: "electricity",
            })
          }
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Beställ nu
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

export function ElectricityBestOfferCard({
  preferences,
}: ElectricityBestOfferCardProps) {
  const [campaigns, setCampaigns] = useState<ElectricityOffer[]>([]);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [lastCampaignUpdate, setLastCampaignUpdate] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchOffers = useCallback(async (prefs: ElectricityPreferences) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        best: "true",
        top: "3",
        priceTypePreference: prefs.priceTypePreference,
        currentOperator: prefs.currentOperator,
      });
      if (prefs.maxBindingMonths != null) {
        params.set("maxBindingMonths", String(prefs.maxBindingMonths));
      }
      const res = await fetch(`/api/electricity/campaigns?${params}`);
      const data = await res.json();
      const top = Array.isArray(data.campaigns)
        ? (data.campaigns as ElectricityOffer[])
        : data.campaign
          ? [data.campaign as ElectricityOffer]
          : [];
      setCampaigns(top);
      setActiveCount(
        typeof data.activeCount === "number" ? data.activeCount : null,
      );
      setLastCampaignUpdate(
        typeof data.lastCampaignUpdate === "string"
          ? data.lastCampaignUpdate
          : null,
      );
    } catch {
      setCampaigns([]);
      setActiveCount(null);
      setLastCampaignUpdate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers(preferences);
  }, [preferences, fetchOffers]);

  const readyToSwitch = daysUntil(new Date(preferences.contractEndDate)) <= 7;
  const offers = campaigns.map((c) => ({ ...c, readyToSwitch }));

  const viewKey = offers
    .slice(0, 3)
    .map((o) => `${o.operator}:${o.name}:${o.campaignPrice}`)
    .join("|");

  useEffect(() => {
    if (loading || !viewKey) return;
    for (const offer of offers.slice(0, 3)) {
      trackViewContent({
        price: offer.campaignPrice,
        operator: offer.operator,
        campaignName: offer.name,
        vertical: "electricity",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [loading, viewKey]);

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
              Inga aktiva elkampanjer matchar dina val just nu.
            </p>
            <div className="mt-2">
              <ActiveCampaignsNote count={activeCount} />
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Prova att ändra pristyp eller bindningstid. Registrera dig så
              mejlar vi dig när något bra dyker upp.
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
