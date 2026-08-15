import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Integritetspolicy | Bytesjakten",
  description:
    "Hur Bytesjakten samlar in, använder och sparar personuppgifter när du använder vår påminnelsetjänst.",
};

export default function IntegritetPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Integritet
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Integritetspolicy
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Här beskriver vi hur Bytesjakten behandlar personuppgifter när du
              använder vår gratis påminnelsetjänst för mobilabonnemang och
              mobilt bredband.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Senast uppdaterad: 15 augusti 2026
            </p>

            <div className="mt-12 space-y-10 leading-relaxed text-zinc-600">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  1. Personuppgiftsansvarig
                </h2>
                <p className="mt-3">
                  Bytesjakten är personuppgiftsansvarig för behandlingen.
                  Kontakta oss på{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  . Mer kontaktinfo finns på{" "}
                  <Link
                    href="/kontakt"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    kontaktsidan
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  2. Vad tjänsten gör
                </h2>
                <p className="mt-3">
                  Du registrerar dig med e-post och uppgifter om ditt abonnemang.
                  Vi mejlar dig bekräftelser och, när det är dags, tips om
                  kampanjer utan bindningstid. Tjänsten är gratis. Vi kan få
                  ersättning via affiliatelänkar om du beställer hos en operatör
                  via våra länkar – samma pris som hos operatören. Läs mer på{" "}
                  <Link
                    href="/om"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    Om Bytesjakten
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  3. Uppgifter vi samlar in
                </h2>
                <p className="mt-3">Vi samlar in de uppgifter du själv anger:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="font-semibold text-zinc-800">
                      Mobilabonnemang:
                    </strong>{" "}
                    e-post, nuvarande operatör, när avtalet går ut, önskad
                    datamängd, nätpreferens och om du vill se studentabonnemang.
                  </li>
                  <li>
                    <strong className="font-semibold text-zinc-800">
                      Mobilt bredband:
                    </strong>{" "}
                    e-post, nuvarande operatör, när avtalet går ut, önskad
                    hastighet och teknikpreferens.
                  </li>
                  <li>
                    Efter att du angett att ett byte är klart kan vi också spara
                    startdatum, kampanjlängd och (för mobil) kampanj- respektive
                    ordinariepris som du bytt till – bland annat för att kunna
                    påminna dig i tid och visa sparande i vår adminvy.
                  </li>
                  <li>
                    Tekniska identifikatorer som behövs för tjänsten, t.ex. en
                    unik avregistrerings-/länk-token och logg över vilka mejl
                    som skickats (typ och tidpunkt).
                  </li>
                </ul>
                <p className="mt-3">
                  Vi sparar inte lösenord, bankkort eller personnummer.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  4. Ändamål och rättslig grund
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    Leverera tjänsten (påminnelser, bekräftelser, personliga
                    tips) – behandling som behövs för att utföra avtalet med dig
                    / åtgärder innan avtal.
                  </li>
                  <li>
                    Administrera tjänsten (felsökning, support, radering på
                    begäran) – berättigat intresse eller avtal.
                  </li>
                  <li>
                    Affiliate: när du själv klickar på en beställningslänk går
                    du vidare till affiliatenätverk/operatör. Vi skickar inte med
                    din e-post i de länkarna.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  5. Mejl
                </h2>
                <p className="mt-3">
                  Vi skickar mejl till den adress du registrerat: bekräftelse vid
                  registrering eller uppdatering, samt bytespåminnelser med
                  erbjudanden. Utskick av kampanj-/bytesmejl sker manuellt från
                  vår admin. Mejl skickas via vår mejlleverantör (Maileroo).
                  Varje mejl innehåller länk för avregistrering.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  6. Delning av uppgifter
                </h2>
                <p className="mt-3">
                  Vi säljer inte dina uppgifter. Vi kan använda leverantörer som
                  behandlar uppgifter för vår räkning, till exempel:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Mejlleverantör (utskick)</li>
                  <li>Hosting och databas (lagring av tjänsten)</li>
                </ul>
                <p className="mt-3">
                  Om du klickar vidare till en operatör via affiliatelänk gäller
                  den partens egna villkor och integritetspolicy för det som
                  händer där.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  7. Cookies
                </h2>
                <p className="mt-3">
                  Vi använder inga analys- eller marknadsföringscookies på
                  besökarsajten. Endast inloggning till vår adminpanel sätter en
                  sessionscookie.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  8. Lagringstid
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="font-semibold text-zinc-800">
                      Aktiva konton:
                    </strong>{" "}
                    så länge du är registrerad och tjänsten används.
                  </li>
                  <li>
                    <strong className="font-semibold text-zinc-800">
                      Efter avregistrering:
                    </strong>{" "}
                    dina uppgifter kan sparas i upp till{" "}
                    <strong className="font-semibold text-zinc-800">
                      12 månader
                    </strong>{" "}
                    (t.ex. om du registrerar dig igen med samma e-post, eller för
                    support/historik), därefter raderas de. Du kan begära
                    radering tidigare (se nedan).
                  </li>
                  <li>
                    Mejlloggar raderas tillsammans med kontot, eller tidigare om
                    vi rensar enligt samma princip.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  9. Avregistrering och radering
                </h2>
                <p className="mt-3">
                  <strong className="font-semibold text-zinc-800">
                    Avregistrering
                  </strong>{" "}
                  (via länken i mejlen eller{" "}
                  <Link
                    href="/avregistrera"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    /avregistrera
                  </Link>
                  ) betyder att vi slutar skicka tjänstemejl. Kontot markeras som
                  inaktivt men uppgifterna kan ligga kvar enligt lagringstiden
                  ovan.
                </p>
                <p className="mt-3">
                  <strong className="font-semibold text-zinc-800">
                    Full radering
                  </strong>
                  : mejla{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      "Radera mitt konto hos Bytesjakten"
                    )}`}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  från samma adress som du registrerat, med ämne i stil med
                  ”Radera mitt konto”. Vi raderar då kontot och tillhörande
                  mejlloggar i admin. Vi strävar efter att göra det inom{" "}
                  <strong className="font-semibold text-zinc-800">
                    30 dagar
                  </strong>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  10. Dina rättigheter
                </h2>
                <p className="mt-3">
                  Du har rätt att bland annat begära tillgång till dina
                  uppgifter, få dem rättade (du kan ofta uppdatera via samma
                  registreringsformulär med samma e-post), få dem raderade och
                  invända mot viss behandling. Du kan också lämna klagomål till{" "}
                  <a
                    href="https://www.imy.se/"
                    className="font-semibold text-emerald-600 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Integritetsskyddsmyndigheten (IMY)
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  11. Säkerhet
                </h2>
                <p className="mt-3">
                  Vi skyddar uppgifterna med rimliga tekniska och
                  organisatoriska åtgärder, bland annat HTTPS, begränsad
                  adminåtkomst och unika länkar för avregistrering och
                  ”byte klart”. Dela inte sådana länkar med andra.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  12. Ändringar
                </h2>
                <p className="mt-3">
                  Vi kan uppdatera den här policyn. Datumet överst visar när
                  texten senast ändrades. Väsentliga ändringar kan vi även
                  nämna på sajten eller i mejl.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
              <p>
                Frågor om integritet? Mejla{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                eller gå till{" "}
                <Link
                  href="/kontakt"
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  kontakten
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
