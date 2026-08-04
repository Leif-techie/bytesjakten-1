export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
          Byt smartare.
          <br />
          <span className="text-emerald-600">Betala mindre.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">
          Vi bevakar alla kampanjer för mobilabonnemang utan bindningstid. Du
          slipper jämföra priser själv – vi hittar det bästa erbjudandet åt dig
          när din nuvarande kampanj går ut. Registrera dig med din mejladress
          nedan för att komma igång. Ingen hake. Helt gratis. Njut av
          opertörernas låga kampanjpriser, året runt.
        </p>

        <ul className="mt-8 space-y-4">
          {[
            { icon: "🏷️", text: "Vi hittar bästa kampanjen för dina behov" },
            { icon: "📅", text: "Vi berättar när det är dags att byta" },
            { icon: "✉️", text: "Påminnelse en vecka innan bindningstiden går ut" },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-zinc-700">
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
