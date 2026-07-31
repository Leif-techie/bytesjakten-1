import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/mobilabonnemang", label: "Mobilabonnemang" },
  { href: "/om", label: "Om" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="px-4 py-8 sm:px-6">
        <nav
          aria-label="Sidfot"
          className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-zinc-600"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-emerald-700 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-zinc-400">
          Priserna uppdateras löpande baserat på aktuella kampanjer hos operatörerna.
          Kontrollera alltid villkor och aktuellt pris hos respektive operatör innan du beställer.
          Bytesjakten är en gratis jämförelsetjänst och tar inget ansvar för operatörernas erbjudanden.
        </p>
      </div>
      <div className="bg-zinc-800 px-4 py-4 text-center text-sm text-zinc-300 sm:px-6">
        Bytesjakten · Alltid gratis · Uppdateras löpande · Vi hjälper dig betala så lite som möjligt
      </div>
    </footer>
  );
}
