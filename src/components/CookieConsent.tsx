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
 * Blocking consent modal. Snap Pixel loads after accept,
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

  const configured = isSnapPixelConfigured();
  const showBanner = ready && choice === null && configured && !snapTest;
  const loadPixel =
    ready && configured && (choice === "accepted" || snapTest);

  // Prevent scrolling the page behind the modal.
  useEffect(() => {
    if (!showBanner) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showBanner]);

  function accept() {
    writeCookieConsent("accepted");
    setChoice("accepted");
  }

  function reject() {
    writeCookieConsent("rejected");
    setChoice("rejected");
  }

  return (
    <>
      {loadPixel ? <SnapPixel /> : null}

      {showBanner ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-zinc-900/60 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <h2
              id="cookie-consent-title"
              className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl"
            >
              Cookies på Bytesjakten
            </h2>
            <p
              id="cookie-consent-desc"
              className="mt-3 text-base leading-relaxed text-zinc-600"
            >
              Vi använder cookies och liknande tekniker för statistik och
              marknadsföring. Nödvändiga cookies krävs för att webbplatsen ska
              fungera. Du kan välja att acceptera alla eller bara nödvändiga.{" "}
              <Link
                href="/integritet"
                className="font-semibold text-emerald-700 underline hover:text-emerald-800"
              >
                Läs mer
              </Link>
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={accept}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700 sm:flex-1"
              >
                Acceptera alla
              </button>
              <button
                type="button"
                onClick={reject}
                className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-base font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:flex-1"
              >
                Bara nödvändiga
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
