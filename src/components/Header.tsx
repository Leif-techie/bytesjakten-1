"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/mobilabonnemang", label: "Mobilabonnemang" },
  { href: "/bredband", label: "Mobilt bredband" },
  { href: "/elavtal", label: "Elavtal" },
  { href: "/vanliga-fragor", label: "Vanliga frågor" },
  { href: "/om", label: "Om" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isElectricity = pathname.startsWith("/elavtal");
  const isBroadband = pathname.startsWith("/bredband");
  const isMobile = pathname.startsWith("/mobilabonnemang");
  const brandSuffix = isElectricity
    ? "elavtal"
    : isBroadband
      ? "mobilt bredband"
      : isMobile
        ? "mobilabonnemang"
        : null;
  const brandAccent = isElectricity
    ? "bg-bj-electricity text-white"
    : isBroadband
      ? "bg-bj-broadband text-white"
      : isMobile
        ? "bg-bj-mobile text-bj-ink"
        : "bg-bj-ink text-background";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-bj-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2.5">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${brandAccent}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </div>
          <span className="truncate text-lg font-bold tracking-tight text-bj-ink sm:text-xl">
            Bytesjakten
            {brandSuffix && (
              <span className="hidden font-medium text-bj-muted sm:inline">
                {" "}
                | {brandSuffix}
              </span>
            )}
          </span>
        </Link>

        <nav
          aria-label="Huvudnavigering"
          className="hidden items-center gap-1 text-sm font-medium text-bj-muted md:flex md:gap-2"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 transition hover:bg-bj-soft hover:text-bj-ink sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-bj-ink transition hover:bg-bj-soft md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobil-meny"
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobil-meny"
          className="border-t border-bj-line bg-background md:hidden"
        >
          <nav
            aria-label="Mobilnavigering"
            className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-base font-medium text-bj-ink transition hover:bg-bj-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
