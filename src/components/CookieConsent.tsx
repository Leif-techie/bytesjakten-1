"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SnapPixel } from "@/components/SnapPixel";
import {
  type CookieConsentValue,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";
import {
  isSnapPixelConfigured,
  isSnapTestSession,
} from "@/lib/snap-pixel";

/**
 * Shows a compact consent bar. Snap Pixel loads after accept,
 * or immediately during Snap Events Manager test sessions (ScTestModeId).
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);
  const [snapTest, setSnapTest] = useState(false);

  useEffect(() => {
    // Defer so we don't sync-setState in the effect body (eslint react-hooks).
    queueMicrotask(() => {
      setChoice(readCookieConsent());
      setSnapTest(isSnapTestSession());
      setReady(true);
    });
  }, []);

  function accept() {
    writeCookieConsent("accepted");
    setChoice("accepted");
  }

  function reject() {
    writeCookieConsent("rejected");
    setChoice("rejected");
  }

  const configured = isSnapPixelConfigured();
  const showBanner = ready && choice === null && configured && !snapTest;
  // Snap Test Events needs the pixel on first paint of the test tab.
  const loadPixel =
    ready && configured && (choice === "accepted" || snapTest);

  return (
    <>
      {loadPixel ? <SnapPixel /> : null}

      {showBanner ? (
        <div
          role="dialog"
          aria-label="Cookies och mätning"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-zinc-600">
              Vi använder cookies för att mäta våra annonser.{" "}
              <Link
                href="/integritet"
                className="font-semibold text-emerald-700 underline hover:text-emerald-800"
              >
                Läs mer
              </Link>
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={reject}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              >
                Avvisa
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Acceptera
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
