export type CampaignInput = {
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  campaignStart: Date;
  campaignEnd: Date;
  url: string;
  network?: string;
  isStudent?: boolean;
};

/** CTA-länk för erbjudandet (affiliatelänk) – används på sajten och i mejl. */
export function getCampaignAffiliateUrl(campaign: { url: string }): string {
  return campaign.url.trim();
}

export type CampaignWithSavings = CampaignInput & {
  id: string;
  annualSavings: number;
  averageMonthlyCost: number;
  campaignMonths: number;
};

export function formatSEK(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(date: Date): string {
  const y = date.getFullYear().toString().slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function calculateSavings(
  campaignPrice: number,
  regularPrice: number,
  campaignStart: Date,
  campaignEnd: Date,
  referenceRegularPrice = regularPrice
): { annualSavings: number; averageMonthlyCost: number; campaignMonths: number } {
  const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
  const campaignMonths = Math.max(
    1,
    Math.round((campaignEnd.getTime() - campaignStart.getTime()) / msPerMonth)
  );

  const campaignOnlyCost = campaignPrice * campaignMonths;
  const annualRegularCost = referenceRegularPrice * 12;
  const annualSavings = Math.max(0, annualRegularCost - campaignOnlyCost);

  return { annualSavings, averageMonthlyCost: campaignPrice, campaignMonths };
}

export function isCampaignActive(
  campaign: { campaignStart: Date; campaignEnd: Date; active?: boolean },
  now = new Date()
): boolean {
  if (campaign.active === false) return false;
  return now >= campaign.campaignStart && now <= campaign.campaignEnd;
}

export function matchesNetwork(
  campaignNetwork: string,
  preference: string
): boolean {
  if (preference === "any" || campaignNetwork === "any") return true;
  return campaignNetwork === preference;
}

export function findTopCampaigns<T extends CampaignInput & { id: string; active?: boolean }>(
  campaigns: T[],
  minDataGB: number,
  networkPreference: string,
  excludeOperator?: string,
  options: { isStudent?: boolean; now?: Date; limit?: number } = {}
): Array<T & { annualSavings: number; averageMonthlyCost: number; campaignMonths: number }> {
  const now = options.now ?? new Date();
  const wantStudent = Boolean(options.isStudent);
  const limit = options.limit ?? 3;

  return campaigns
    .filter(
      (c) =>
        isCampaignActive(c, now) &&
        Boolean(c.isStudent) === wantStudent &&
        c.dataGB >= minDataGB &&
        matchesNetwork(c.network ?? "any", networkPreference) &&
        (!excludeOperator || c.operator.toLowerCase() !== excludeOperator.toLowerCase())
    )
    .map((c) => ({
      ...c,
      ...calculateSavings(c.campaignPrice, c.regularPrice, c.campaignStart, c.campaignEnd),
    }))
    .sort((a, b) => {
      if (b.annualSavings !== a.annualSavings) {
        return b.annualSavings - a.annualSavings;
      }
      return a.campaignPrice - b.campaignPrice;
    })
    .slice(0, limit);
}

export function findBestCampaign<T extends CampaignInput & { id: string; active?: boolean }>(
  campaigns: T[],
  minDataGB: number,
  networkPreference: string,
  excludeOperator?: string,
  options: { isStudent?: boolean; now?: Date } = {}
): (T & { annualSavings: number; averageMonthlyCost: number; campaignMonths: number }) | null {
  return (
    findTopCampaigns(campaigns, minDataGB, networkPreference, excludeOperator, {
      ...options,
      limit: 1,
    })[0] ?? null
  );
}

export function daysUntil(date: Date, from = new Date()): number {
  const ms = date.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function shouldNotifyUser(contractEndDate: Date, from = new Date()): boolean {
  const days = daysUntil(contractEndDate, from);
  return days >= 6 && days <= 8;
}

export function getNetworkLabel(value: string): string {
  const labels: Record<string, string> = {
    any: "Spelar ingen roll",
    telia: "Telia",
    telenor: "Telenor",
    tele2: "Tele2",
    tre: "Tre",
  };
  return labels[value] ?? value;
}

export function getCampaignPeriodLabel(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat("sv-SE", { month: "long", year: "numeric" });
  const months = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  );
  return `Kampanj ${fmt.format(start)}–${fmt.format(end)} (${months} mån)`;
}
