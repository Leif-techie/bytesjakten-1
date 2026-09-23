import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SamlingRegisterForm } from "@/components/SamlingRegisterForm";

export const metadata: Metadata = {
  title: "Registrera påminnelser – Bytesjakten",
  description:
    "Samla mobil, bredband, el, försäkring, besiktning och streaming. Vi mejlar dig när det är dags – gratis, utan konto.",
};

export default function RegistreraPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-bj-soft/80 to-background px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-muted">
              Registrera
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-bj-ink sm:text-5xl">
              En mejladress.
              <br />
              <span className="text-bj-muted">Alla påminnelser.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bj-muted">
              Kryssa i vad du vill ha koll på. Vi sparar ingen inloggning – bara
              din e-post och datumen du anger. Helt gratis.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <SamlingRegisterForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
