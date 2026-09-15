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

type Panel = "main" | "customize";

/**
 * Blocking consent modal with Accept all / Necessary only / Customize.
 * Compact on mobile: fits in the viewport without page scroll.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);
  const [snapTest, setSnapTest] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
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

  useEffect(() => {
    if (!showBanner) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [showBanner]);

  function acceptAll() {
    writeCookieConsent("accepted");
    setChoice("accepted");
  }

  function necessaryOnly() {
    writeCookieConsent("rejected");
    setChoice("rejected");
  }

  function saveCustom() {
    if (marketing) {
      acceptAll();
    } else {
      necessaryOnly();
    }
  }

  return (
    <>
      {loadPixel ? <SnapPixel /> : null}

      {showBanner ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 p-3 backdrop-blur-sm sm:p-4"
          style={{ minHeight: "100dvh" }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
            style={{
              maxHeight: "min(92dvh, 100%)",
              marginBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-2 sm:px-8 sm:pt-8 sm:pb-3">
              {panel === "main" ? (
                <>
                  <h2
                    id="cookie-consent-title"
                    className="text-lg font-bold tracking-tight text-zinc-900 sm:text-2xl"
                  >
                    Cookies på Bytesjakten
                  </h2>
                  <p
                    id="cookie-consent-desc"
                    className="mt-2 text-sm leading-relaxed text-zinc-600 sm:mt-3 sm:text-base"
                  >
                    Vi använder cookies och liknande tekniker för statistik och
                    marknadsföring. Nödvändiga cookies krävs för att webbplatsen
                    ska fungera.{" "}
                    <Link
                      href="/integritet"
                      className="font-semibold text-emerald-700 underline hover:text-emerald-800"
                    >
                      Läs mer
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2
                    id="cookie-consent-title"
                    className="text-lg font-bold tracking-tight text-zinc-900 sm:text-2xl"
                  >
                    Anpassa cookies
                  </h2>
                  <p
                    id="cookie-consent-desc"
                    className="mt-2 text-sm leading-relaxed text-zinc-600 sm:mt-3 sm:text-base"
                  >
                    Välj vilka cookies du vill tillåta. Nödvändiga cookies kan
                    inte stängas av.
                  </p>

                  <ul className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
                    <li className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 sm:text-base">
                          Nödvändiga
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
                          Krävs för grundläggande funktioner på sajten.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 sm:px-3 sm:text-xs">
                        Alltid på
                      </span>
                    </li>
                    <li className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 sm:text-base">
                          Marknadsföring
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
                          Hjälper oss mäta och förbättra våra annonser.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={marketing}
                        onClick={() => setMarketing((v) => !v)}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          marketing ? "bg-emerald-600" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                            marketing ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Actions stay pinned at the bottom of the card */}
            <div className="shrink-0 border-t border-zinc-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4 sm:pb-8">
              {panel === "main" ? (
                <div className="flex flex-col gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:px-5 sm:py-3.5 sm:text-base"
                  >
                    Acceptera alla
                  </button>
                  <button
                    type="button"
                    onClick={necessaryOnly}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:px-5 sm:py-3.5 sm:text-base"
                  >
                    Bara nödvändiga
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("customize")}
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:px-5 sm:py-3 sm:text-base"
                  >
                    Anpassa
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:flex-1 sm:px-5 sm:py-3.5 sm:text-base"
                  >
                    Spara val
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("main")}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:flex-1 sm:px-5 sm:py-3.5 sm:text-base"
                  >
                    Tillbaka
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
