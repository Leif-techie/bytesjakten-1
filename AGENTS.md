<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Drift / produkt

Ägaren administrerar **kampanjer och mejlutskick manuellt** via adminpanelen. Leta inte upp, scrapa eller föreslå nya mobilabonnemangserbjudanden om det inte uttryckligen efterfrågas.

**Mejl** skickas via **Maileroo** (`MAILEROO_API_KEY` + `EMAIL_FROM`). Inte Resend. Automatiska bekräftelsemejl skickas vid **ny registrering** och vid **uppdatering av uppgifter** (samma formulär med samma e-post). Kampanj-/bytesmejl skickas **manuellt** per användare i `/admin`. Bytesmejlet har **Steg 1** (beställ kampanj) och **Steg 2** (ange datum för nummerflytt) → `/byte-klart` där användaren sätter ny operatör, nummerflyttdatum och kampanjlängd. Ingen cron-mejl.

**Affiliate:** Ägaren använder **Addrevenue** som affiliatenätverk. Hämta spårningslänkar där och klistra in dem som affiliatelänk per kampanj i admin (samma länk används på sajten och i mejl). Föreslå inte Adtraction eller andra nätverk om det inte efterfrågas.

**Kampanjer:** "Uppdatera kampanjer" i admin ersätter databasen med seed-listan i `src/lib/seed-campaigns.ts` (aktuella erbjudanden utan bindningstid, inkl. studentpriser, operatörs-URL:er). Efter refresh: byt URL:er till Addrevenue-spårningslänkar. Startsida har checkbox **Studentabonnemang** (🎯) som filtrerar till studentkampanjer. Föreslå/scrapa inte nya erbjudanden om det inte uttryckligen efterfrågas.
