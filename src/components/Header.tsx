import Link from "next/link";

const NAV_LINKS = [
  { href: "/mobilabonnemang", label: "Mobilabonnemang" },
  { href: "/om", label: "Om" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Bytesjakten
            <span className="hidden font-medium text-zinc-500 sm:inline"> | mobilabonnemang</span>
          </span>
        </Link>

        <nav
          aria-label="Huvudnavigering"
          className="flex items-center gap-1 text-sm font-medium text-zinc-600 sm:gap-2"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-1.5 transition hover:bg-zinc-50 hover:text-zinc-900 sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200 md:inline-flex">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Alltid gratis
        </span>
      </div>
    </header>
  );
}
