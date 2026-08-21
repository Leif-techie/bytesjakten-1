/** Cookie consent for marketing pixels (Snap). Client-side only. */

export const COOKIE_CONSENT_KEY = "bytesjakten_cookie_consent";

export type CookieConsentValue = "accepted" | "rejected";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    // private mode / blocked storage
  }
  return null;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // ignore
  }
}

export function hasMarketingConsent(): boolean {
  return readCookieConsent() === "accepted";
}
