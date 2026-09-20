export const SAMLING_SERVICE_KEYS = [
  "mobile",
  "broadband",
  "electricity",
  "insurance",
  "inspection",
  "streaming",
] as const;

export type SamlingServiceKey = (typeof SAMLING_SERVICE_KEYS)[number];

export const SAMLING_SERVICE_OPTIONS: {
  key: SamlingServiceKey;
  label: string;
  description: string;
}[] = [
  {
    key: "mobile",
    label: "Mobilabonnemang",
    description: "Påminnelse innan kampanjen tar slut",
  },
  {
    key: "broadband",
    label: "Mobilt bredband",
    description: "5G-hemma och mobilt bredband",
  },
  {
    key: "electricity",
    label: "Elavtal",
    description: "När elavtalet går ut",
  },
  {
    key: "insurance",
    label: "Försäkring",
    description: "Bil, hem, djur med mera",
  },
  {
    key: "inspection",
    label: "Besiktning",
    description: "Bil, husvagn, släp, MC…",
  },
  {
    key: "streaming",
    label: "Streaming",
    description: "Netflix, Spotify och liknande",
  },
];

export const INSURANCE_SUBTYPES = [
  { value: "bil", label: "Bil" },
  { value: "hem", label: "Hem / villa / bostadsrätt" },
  { value: "bat", label: "Båt" },
  { value: "husvagn", label: "Husvagn" },
  { value: "husbil", label: "Husbil" },
  { value: "slap", label: "Släpvagn" },
  { value: "mc", label: "Motorcykel" },
  { value: "djur", label: "Djur" },
  { value: "person", label: "Person" },
  { value: "ovrigt", label: "Övrigt" },
] as const;

export const INSPECTION_SUBTYPES = [
  { value: "bil", label: "Bil" },
  { value: "mc", label: "Motorcykel" },
  { value: "husvagn", label: "Husvagn" },
  { value: "husbil", label: "Husbil" },
  { value: "slap", label: "Släpvagn" },
  { value: "moped", label: "Moped" },
] as const;

export const STREAMING_SUBTYPES = [
  { value: "netflix", label: "Netflix" },
  { value: "spotify", label: "Spotify" },
  { value: "disney", label: "Disney+" },
  { value: "viaplay", label: "Viaplay" },
  { value: "max", label: "Max" },
  { value: "appletv", label: "Apple TV+" },
  { value: "youtube", label: "YouTube Premium" },
  { value: "storytel", label: "Storytel" },
  { value: "bookbeat", label: "BookBeat" },
  { value: "ovrigt", label: "Övrigt" },
] as const;

export const REMINDER_CATEGORIES = [
  "insurance",
  "inspection",
  "streaming",
] as const;

export type ReminderCategory = (typeof REMINDER_CATEGORIES)[number];

export function reminderCategoryLabel(category: string): string {
  if (category === "insurance") return "Försäkring";
  if (category === "inspection") return "Besiktning";
  if (category === "streaming") return "Streaming";
  return category;
}

export function reminderSubtypeLabel(
  category: string,
  subtype: string,
): string {
  const lists = {
    insurance: INSURANCE_SUBTYPES,
    inspection: INSPECTION_SUBTYPES,
    streaming: STREAMING_SUBTYPES,
  } as const;
  if (category in lists) {
    const found = lists[category as ReminderCategory].find(
      (s) => s.value === subtype,
    );
    if (found) return found.label;
  }
  return subtype;
}

export function formatReminderTitle(item: {
  category: string;
  subtype: string;
  provider?: string | null;
}): string {
  const type = reminderSubtypeLabel(item.category, item.subtype);
  const cat = reminderCategoryLabel(item.category);
  if (item.category === "streaming") return `${cat}: ${type}`;
  if (item.provider?.trim()) return `${cat}: ${type} · ${item.provider.trim()}`;
  return `${cat}: ${type}`;
}