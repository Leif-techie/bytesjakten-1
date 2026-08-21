/** Snap Pixel helpers (client-side only). */

import { hasMarketingConsent } from "@/lib/cookie-consent";

// Must be a direct `process.env.NEXT_PUBLIC_*` read so Next inlines the value
// into the client bundle at build time. Optional chaining (?.trim()) breaks
// inlining and leaves an empty string in the browser.
export const SNAP_PIXEL_ID = (
  process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? ""
).trim();

export type SnapTrackEvent =
  | "PAGE_VIEW"
  | "SIGN_UP"
  | "CUSTOM_EVENT_1"
  | (string & {});

type Snaptr = (
  command: "init" | "track",
  eventOrPixelId: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    snaptr?: Snaptr & { queue?: unknown[] };
  }
}

export function isSnapPixelConfigured(): boolean {
  return Boolean(SNAP_PIXEL_ID);
}

/** Track a Snap Pixel event if consent is given and the pixel is loaded. */
export function trackSnap(
  event: SnapTrackEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!SNAP_PIXEL_ID) return;
  if (!hasMarketingConsent()) return;
  if (typeof window.snaptr !== "function") return;
  window.snaptr("track", event, params);
}

/** Custom Event 1 = klick på erbjudande (Beställ nu). */
export function trackOfferClick(params?: {
  operator?: string;
  campaignName?: string;
  vertical?: "mobile" | "broadband";
}): void {
  trackSnap("CUSTOM_EVENT_1", {
    item_category: params?.vertical ?? "mobile",
    item_name: params?.campaignName,
    brand: params?.operator,
  });
}

/** Registrering till påminnelsetjänsten. */
export function trackSignUp(params?: {
  vertical?: "mobile" | "broadband";
}): void {
  trackSnap("SIGN_UP", {
    sign_up_method: params?.vertical ?? "mobile",
  });
}
