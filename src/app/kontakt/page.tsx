import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt | Bytesjakten",
  description:
    "Kontakta Bytesjakten. Mejla oss om frågor kring tjänsten, dina uppgifter eller mobilbyte.",
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Kontakt
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Hör av dig
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Har du frågor om Bytesjakten, dina sparade uppgifter eller hur ett
              byte går till? Mejla oss så återkommer vi så snart vi kan.
            </p>

            <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-zinc-900">E-post</h2>
              <p className="mt-2 text-zinc-600">
                Skriv till{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                Tips: om ärendet gäller ditt konto, ange samma e-postadress som
                du registrerat dig med. Vill du avregistrera dig kan du använda
                länken i våra mejl.
              </p>
            </div>

            <div className="mt-8 space-y-3 text-zinc-600">
              <p>
                Mer om hur byten fungerar finns på{" "}
                <Link
                  href="/vanliga-fragor#mobilabonnemang"
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  sidan med vanliga frågor
                </Link>
                .
              </p>
              <p>
                Vill du veta mer om tjänsten? Läs{" "}
                <Link
                  href="/om"
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  om Bytesjakten
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
