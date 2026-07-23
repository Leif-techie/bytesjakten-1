<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Drift / produkt

Ägaren administrerar **kampanjer och mejlutskick manuellt** via adminpanelen. Leta inte upp, scrapa eller föreslå nya mobilabonnemangserbjudanden om det inte uttryckligen efterfrågas.

**Mejl** skickas via **Maileroo** (`MAILEROO_API_KEY` + `EMAIL_FROM`). Inte Resend. Inga automatiska utskick (ingen välkomstmejl, ingen cron-mejl) – skicka per användare i `/admin` med valt erbjudande.

**Affiliate:** Ägaren använder **Addrevenue** som affiliatenätverk. Hämta spårningslänkar där och klistra in dem som affiliatelänk per kampanj i admin (samma länk används på sajten och i mejl). Föreslå inte Adtraction eller andra nätverk om det inte efterfrågas.

**Kampanjer:** "Uppdatera kampanjer" i admin ersätter databasen med seed-listan i `src/lib/seed-campaigns.ts` (aktuella erbjudanden utan bindningstid, operatörs-URL:er). Efter refresh: byt URL:er till Addrevenue-spårningslänkar. Föreslå/scrapa inte nya erbjudanden om det inte uttryckligen efterfrågas.
