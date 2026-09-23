<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Drift / produkt

Ägaren administrerar **kampanjer och mejlutskick manuellt** via adminpanelen. Leta inte upp, scrapa eller föreslå nya mobilabonnemangserbjudanden om det inte uttryckligen efterfrågas.

**Mejl** skickas via **Maileroo** (`MAILEROO_API_KEY` + `EMAIL_FROM`). Inte Resend. Automatiska bekräftelsemejl skickas vid **ny registrering** och vid **uppdatering av uppgifter** (samma formulär med samma e-post). Kampanj-/bytesmejl skickas **manuellt** per användare i `/admin`. Bytesmejlet har **Steg 1** (beställ kampanj) och **Steg 2** (ange datum för nummerflytt) → `/byte-klart` där användaren sätter ny operatör, nummerflyttdatum och kampanjlängd. Ingen cron-mejl.

**Affiliate:** Ägaren använder **Addrevenue** som affiliatenätverk. Hämta spårningslänkar där och klistra in dem som affiliatelänk per kampanj i admin (samma länk används på sajten och i mejl). Föreslå inte Adtraction eller andra nätverk om det inte efterfrågas.

**Kampanjer:** "Uppdatera kampanjer" i admin ersätter databasen med seed-listan i `src/lib/seed-campaigns.ts` (aktuella erbjudanden utan bindningstid, inkl. studentpriser, operatörs-URL:er). Efter refresh: byt URL:er till Addrevenue-spårningslänkar. Startsida har checkbox **Studentabonnemang** (🎯) som filtrerar till studentkampanjer. Föreslå/scrapa inte nya erbjudanden om det inte uttryckligen efterfrågas.

**Integritet / radering:** Offentlig policy på `/integritet`. Avregistrering = `active: false` (uppgifter kan sparas upp till 12 mån). Begäran om **full radering** via `hej@bytesjakten.se` → hard delete i `/admin` (mål inom 30 dagar). Bygg inte automatisk GDPR-purge om det inte efterfrågas.

**Snap Pixel:** Kräver `NEXT_PUBLIC_SNAP_PIXEL_ID` i VPS `.env` **vid `next build`** (bäddas in i klientbundlen; saknas den → ingen pixel och ingen cookie-ruta). Laddas efter **Acceptera**, eller direkt om URL har `ScTestModeId` (Snap Events Manager → Test Events → **Open Website**). Vanlig sidvisning utan den knappen syns **inte** i testpanelen. I Network: `scevent` = script; riktiga events går till Snap-servrar efter init. Edge Tracking prevention kan blockera — prova Chrome eller tillåt trackers för bytesjakten.se. Events: `PAGE_VIEW`; `VIEW_CONTENT` när erbjudanden visas; `CUSTOM_EVENT_1` vid **Beställ nu**; `SIGN_UP` vid registrering (inkl. `user_email` — Snap hashar i SDK).

**Bredband:** Separat vertikal på `/bredband` för **mobilt bredband / 5G-hemma**. `BroadbandUser` + `BroadbandCampaign` (separata från mobil). Admin har separata kampanjlistor; gemensam **Byter inom 10 dagar** + **Mejlhistorik**. Mobilflödet är oförändrat.

**Deploy (VPS efter merge):** Kör `bb` (alias för `cd ~/bytesjakten && npm run deploy`). Scriptet gör pull, `npm ci`, migrate, build och `pm2 restart`. Installera alias en gång: `echo "alias bb='cd ~/bytesjakten && npm run deploy'" >> ~/.bashrc && source ~/.bashrc`. Om erbjudande-seed ändrats: tryck **Uppdatera erbjudanden** i `/admin`.

## Cursor Cloud specific instructions

**Product:** Bytesjakten — a Next.js 16 + Prisma app for tracking Swedish mobile-plan campaigns. Single service (Next.js app on port 3000, UI + `/api/*` routes). Standard commands live in `package.json` and `README.md`.

**Database is PostgreSQL, not SQLite.** Despite `README.md`/`.env.example` mentioning SQLite (`file:./dev.db`), the runtime hardcodes the Prisma Postgres adapter (`src/lib/db.ts` uses `PrismaPg`) and `prisma/schema.prisma` uses `provider = "postgresql"`. A running PostgreSQL instance is required; a SQLite `DATABASE_URL` will fail at runtime.

**Startup (not handled by the update script — run these each fresh session):**
- Start Postgres: `sudo pg_ctlcluster 16 main start` (installed via apt; data persists in the snapshot, so the `bytesjakten` DB and applied migrations survive across sessions).
- Ensure `.env` exists (it is gitignored). Set `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bytesjakten"` and `ADMIN_SECRET=...`. `MAILEROO_API_KEY` may be empty — email code no-ops and just logs when it is unset.
- Apply migrations if the DB is fresh: `npx prisma migrate deploy`.
- Run the app: `npm run dev` (http://localhost:3000). Admin panel is at `/admin` (password = `ADMIN_SECRET`).

**Gotchas:**
- Campaigns auto-seed on first hit of `GET /api/campaigns` (calls `ensureCampaignsSeeded`); no separate seed step is needed to exercise the UI/offer flow.
- The standalone `scripts/seed.ts` does NOT load dotenv, so `DATABASE_URL` is undefined when run directly and it fails. Seed via the running app (hit `/api/campaigns`) or `POST /api/cron` (Bearer `CRON_SECRET`) instead. `scripts/run-cron.ts` does load dotenv.
- `scripts/*.ps1` are Windows-only PowerShell and do not run here.
- `npm run lint` currently reports pre-existing `react-hooks/set-state-in-effect` errors in `src/app/page.tsx` and `src/app/avregistrera/page.tsx`; these are existing code issues, not environment problems. `npm run build` succeeds regardless.

**Demo-/bevisartefakter:** Ta **inte** skärmdumpar eller video om det inte uttryckligen efterfrågas. Ägaren granskar UI via **Desktop**-panelen. Norton kan dessutom flagga/blockera videoinspelning.
