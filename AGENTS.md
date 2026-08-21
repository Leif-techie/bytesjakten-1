<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Drift / produkt

Ägaren administrerar **kampanjer och mejlutskick manuellt** via adminpanelen. Leta inte upp, scrapa eller föreslå nya mobilabonnemangserbjudanden om det inte uttryckligen efterfrågas.

**Mejl** skickas via **Maileroo** (`MAILEROO_API_KEY` + `EMAIL_FROM`). Inte Resend. Automatiska bekräftelsemejl skickas vid **ny registrering** och vid **uppdatering av uppgifter** (samma formulär med samma e-post). Kampanj-/bytesmejl skickas **manuellt** per användare i `/admin`. Bytesmejlet har **Steg 1** (beställ kampanj) och **Steg 2** (ange datum för nummerflytt) → `/byte-klart` där användaren sätter ny operatör, nummerflyttdatum och kampanjlängd. Ingen cron-mejl.

**Affiliate:** Ägaren använder **Addrevenue** som affiliatenätverk. Hämta spårningslänkar där och klistra in dem som affiliatelänk per kampanj i admin (samma länk används på sajten och i mejl). Föreslå inte Adtraction eller andra nätverk om det inte efterfrågas.

**Kampanjer:** "Uppdatera kampanjer" i admin ersätter databasen med seed-listan i `src/lib/seed-campaigns.ts` (aktuella erbjudanden utan bindningstid, inkl. studentpriser, operatörs-URL:er). Efter refresh: byt URL:er till Addrevenue-spårningslänkar. Startsida har checkbox **Studentabonnemang** (🎯) som filtrerar till studentkampanjer. Föreslå/scrapa inte nya erbjudanden om det inte uttryckligen efterfrågas.

**Integritet / radering:** Offentlig policy på `/integritet`. Avregistrering = `active: false` (uppgifter kan sparas upp till 12 mån). Begäran om **full radering** via `hej@bytesjakten.se` → hard delete i `/admin` (mål inom 30 dagar). Bygg inte automatisk GDPR-purge om det inte efterfrågas.

**Snap Pixel:** Kräver `NEXT_PUBLIC_SNAP_PIXEL_ID`. Laddas **först efter cookie-samtycke** (`CookieConsent`). `PAGE_VIEW` vid accept/sidladdning; `CUSTOM_EVENT_1` vid klick på **Beställ nu**; `SIGN_UP` vid lyckad registrering. Utan samtycke eller utan ID: ingen pixel och ingen banner.

**Bredband:** Separat vertikal på `/bredband` för **mobilt bredband / 5G-hemma**. `BroadbandUser` + `BroadbandCampaign` (separata från mobil). Admin har separata kampanjlistor; gemensam **Byter inom 10 dagar** + **Mejlhistorik**. Mobilflödet är oförändrat.

**Deploy (VPS efter merge):** Kör `bb` (alias för `cd ~/bytesjakten && npm run deploy`). Scriptet gör pull, `npm ci`, migrate, build och `pm2 restart`. Installera alias en gång: `echo "alias bb='cd ~/bytesjakten && npm run deploy'" >> ~/.bashrc && source ~/.bashrc`. Om erbjudande-seed ändrats: tryck **Uppdatera erbjudanden** i `/admin`.

## Cursor Cloud specific instructions

**Demo-/bevisartefakter:** Ta **inte** skärmdumpar eller video om det inte uttryckligen efterfrågas. Ägaren granskar UI via **Desktop**-panelen. Norton kan dessutom flagga/blockera videoinspelning.
