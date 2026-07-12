import { KIVRA_URL } from "@/lib/constants";

export function KivraSection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-3xl font-bold text-white">
          K
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-zinc-900">
            Håll koll på dina mobilfakturor med Kivra
          </h3>
          <p className="mt-2 text-zinc-600">
            När du byter operatör regelbundet kan fakturor bli svåra att hålla reda på.
            Med Kivra samlar du alla mobilräkningar digitalt – smidigt och gratis.
          </p>
        </div>
        <a
          href={KIVRA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl border-2 border-emerald-600 px-6 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          Skaffa Kivra gratis →
        </a>
      </div>
    </section>
  );
}
