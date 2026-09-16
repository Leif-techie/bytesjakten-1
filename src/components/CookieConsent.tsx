"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
 * Cookie modal portaled to document.body.
 * Centered with top/left 50% + translate (more reliable than flex on iOS).
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);
  const [snapTest, setSnapTest] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const [marketing, setMarketing] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyTouch: body.style.touchAction,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.touchAction = prev.bodyTouch;
      window.scrollTo(0, scrollY);
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

  const modal =
    showBanner && mounted ? (
      <div className="bj-cookie-overlay" role="presentation">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className="bj-cookie-modal"
        >
          <div className="bj-cookie-body">
            {panel === "main" ? (
              <>
                <h2 id="cookie-consent-title" className="bj-cookie-title">
                  Cookies på Bytesjakten
                </h2>
                <p id="cookie-consent-desc" className="bj-cookie-text">
                  Vi använder cookies och liknande tekniker för statistik och
                  marknadsföring. Nödvändiga cookies krävs för att webbplatsen
                  ska fungera.{" "}
                  <Link href="/integritet" className="bj-cookie-link">
                    Läs mer
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 id="cookie-consent-title" className="bj-cookie-title">
                  Anpassa cookies
                </h2>
                <p id="cookie-consent-desc" className="bj-cookie-text">
                  Välj vilka cookies du vill tillåta. Nödvändiga cookies kan
                  inte stängas av.
                </p>

                <ul className="bj-cookie-options">
                  <li className="bj-cookie-option bj-cookie-option--muted">
                    <div>
                      <p className="bj-cookie-option-title">Nödvändiga</p>
                      <p className="bj-cookie-option-desc">
                        Krävs för grundläggande funktioner på sajten.
                      </p>
                    </div>
                    <span className="bj-cookie-badge">Alltid på</span>
                  </li>
                  <li className="bj-cookie-option">
                    <div>
                      <p className="bj-cookie-option-title">Marknadsföring</p>
                      <p className="bj-cookie-option-desc">
                        Hjälper oss mäta och förbättra våra annonser.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={marketing}
                      onClick={() => setMarketing((v) => !v)}
                      className={`bj-cookie-switch${
                        marketing ? " bj-cookie-switch--on" : ""
                      }`}
                    >
                      <span className="bj-cookie-switch-thumb" />
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="bj-cookie-footer">
            {panel === "main" ? (
              <div className="bj-cookie-actions">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="bj-cookie-btn bj-cookie-btn--primary"
                >
                  Acceptera alla
                </button>
                <button
                  type="button"
                  onClick={necessaryOnly}
                  className="bj-cookie-btn bj-cookie-btn--secondary"
                >
                  Bara nödvändiga
                </button>
                <button
                  type="button"
                  onClick={() => setPanel("customize")}
                  className="bj-cookie-btn bj-cookie-btn--ghost"
                >
                  Anpassa
                </button>
              </div>
            ) : (
              <div className="bj-cookie-actions bj-cookie-actions--row">
                <button
                  type="button"
                  onClick={saveCustom}
                  className="bj-cookie-btn bj-cookie-btn--primary"
                >
                  Spara val
                </button>
                <button
                  type="button"
                  onClick={() => setPanel("main")}
                  className="bj-cookie-btn bj-cookie-btn--secondary"
                >
                  Tillbaka
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {loadPixel ? <SnapPixel /> : null}
      {modal && mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
