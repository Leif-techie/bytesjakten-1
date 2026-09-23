export const OPERATORS = [
  "Telia",
  "Telenor",
  "Tele2",
  "Tre",
  "Hallon",
  "Comviq",
  "Vimla",
  "Halebop",
  "Fello",
  "Chilimobil",
] as const;

export const DATA_OPTIONS = [
  5, 10, 14, 15, 20, 25, 30, 40, 50, 60, 80, 100, 160, 200,
] as const;

export const NETWORK_OPTIONS = [
  { value: "any", label: "Spelar ingen roll" },
  { value: "telia", label: "Telia" },
  { value: "telenor", label: "Telenor" },
  { value: "tele2", label: "Tele2" },
  { value: "tre", label: "Tre" },
] as const;

export const KIVRA_URL = "https://www.kivra.se/";

export const CONTACT_EMAIL = "hej@bytesjakten.se";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const CRON_TIMEZONE = "Europe/Stockholm";

export const BROADBAND_OPERATORS = [
  "Tre",
  "Telia",
  "Telenor",
  "Tele2",
  "Hallon",
  "Fello",
  "Comviq",
  "Halebop",
  "Annan",
] as const;

export const BROADBAND_SPEED_OPTIONS = [
  100, 250, 500, 1000,
] as const;

export const BROADBAND_TECHNOLOGY_OPTIONS = [
  { value: "any", label: "Spelar ingen roll" },
  { value: "5g", label: "5G" },
  { value: "4g", label: "4G/LTE" },
] as const;

export const ELECTRICITY_OPERATORS = [
  "Vattenfall",
  "E.ON",
  "Fortum",
  "Tibber",
  "GodEl",
  "Greenely",
  "Bixia",
  "Telinet",
  "Cheap Energy",
  "Annan",
] as const;

export const ELECTRICITY_PRICE_TYPE_OPTIONS = [
  { value: "any", label: "Spelar ingen roll" },
  { value: "fixed", label: "Fastpris" },
  { value: "variable", label: "Rörligt" },
] as const;

/** Max bindningstid användaren accepterar (null i API = any via "any"). */
export const ELECTRICITY_BINDING_OPTIONS = [
  { value: "any", label: "Spelar ingen roll", months: null as number | null },
  { value: "0", label: "Ingen bindningstid", months: 0 },
  { value: "12", label: "Max 12 mån", months: 12 },
  { value: "24", label: "Max 24 mån", months: 24 },
  { value: "36", label: "Max 36 mån", months: 36 },
] as const;
