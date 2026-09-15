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
 * Snap Pixel loads after accept, or immediately in Snap test sessions.
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
            {panel === "main" ? (
              <>
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
                  marknadsföring. Nödvändiga cookies krävs för att webbplatsen
                  ska fungera.{" "}
                  <Link
                    href="/integritet"
                    className="font-semibold text-emerald-700 underline hover:text-emerald-800"
                  >
                    Läs mer
                  </Link>
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Acceptera alla
                  </button>
                  <button
                    type="button"
                    onClick={necessaryOnly}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-base font-semibold text-zinc-800 transition hover:bg-zinc-50"
                  >
                    Bara nödvändiga
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("customize")}
                    className="w-full rounded-xl px-5 py-3 text-base font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Anpassa
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2
                  id="cookie-consent-title"
                  className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl"
                >
                  Anpassa cookies
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="mt-3 text-base leading-relaxed text-zinc-600"
                >
                  Välj vilka cookies du vill tillåta. Nödvändiga cookies kan
                  inte stängas av.
                </p>

                <ul className="mt-5 space-y-3">
                  <li className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div>
                      <p className="font-semibold text-zinc-900">Nödvändiga</p>
                      <p className="mt-0.5 text-sm text-zinc-500">
                        Krävs för grundläggande funktioner på sajten.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600">
                      Alltid på
                    </span>
                  </li>
                  <li className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3">
                    <div>
                      <p className="font-semibold text-zinc-900">
                        Marknadsföring
                      </p>
                      <p className="mt-0.5 text-sm text-zinc-500">
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700 sm:flex-1"
                  >
                    Spara val
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("main")}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-base font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:flex-1"
                  >
                    Tillbaka
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
