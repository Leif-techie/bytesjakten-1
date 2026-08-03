export const OPERATORS = [
  "Telia",
  "Telenor",
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
