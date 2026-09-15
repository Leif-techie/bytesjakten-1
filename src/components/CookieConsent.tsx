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
import styles from "./CookieConsent.module.css";

type Panel = "main" | "customize";

/**
 * Blocking, centered cookie modal (fixed inset:0 overlay + media queries).
 * Stays inside the viewport on iOS/Android, including safe-area insets.
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
        <div className={styles.overlay} role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className={styles.modal}
          >
            <div className={styles.body}>
              {panel === "main" ? (
                <>
                  <h2 id="cookie-consent-title" className={styles.title}>
                    Cookies på Bytesjakten
                  </h2>
                  <p id="cookie-consent-desc" className={styles.text}>
                    Vi använder cookies och liknande tekniker för statistik och
                    marknadsföring. Nödvändiga cookies krävs för att webbplatsen
                    ska fungera.{" "}
                    <Link href="/integritet" className={styles.link}>
                      Läs mer
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 id="cookie-consent-title" className={styles.title}>
                    Anpassa cookies
                  </h2>
                  <p id="cookie-consent-desc" className={styles.text}>
                    Välj vilka cookies du vill tillåta. Nödvändiga cookies kan
                    inte stängas av.
                  </p>

                  <ul className={styles.options}>
                    <li
                      className={`${styles.option} ${styles.optionMuted}`}
                    >
                      <div>
                        <p className={styles.optionTitle}>Nödvändiga</p>
                        <p className={styles.optionDesc}>
                          Krävs för grundläggande funktioner på sajten.
                        </p>
                      </div>
                      <span className={styles.badge}>Alltid på</span>
                    </li>
                    <li className={styles.option}>
                      <div>
                        <p className={styles.optionTitle}>Marknadsföring</p>
                        <p className={styles.optionDesc}>
                          Hjälper oss mäta och förbättra våra annonser.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={marketing}
                        onClick={() => setMarketing((v) => !v)}
                        className={`${styles.switch} ${
                          marketing ? styles.switchOn : ""
                        }`}
                      >
                        <span className={styles.switchThumb} />
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>

            <div className={styles.footer}>
              {panel === "main" ? (
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    Acceptera alla
                  </button>
                  <button
                    type="button"
                    onClick={necessaryOnly}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    Bara nödvändiga
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("customize")}
                    className={`${styles.btn} ${styles.btnGhost}`}
                  >
                    Anpassa
                  </button>
                </div>
              ) : (
                <div
                  className={`${styles.actions} ${styles.actionsRow}`}
                >
                  <button
                    type="button"
                    onClick={saveCustom}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    Spara val
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("main")}
                    className={`${styles.btn} ${styles.btnSecondary}`}
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
