# Bytesjakten

**Betala mindre för mobilabonnemang – byt smartare.**

Bytesjakten är en gratis webbapp som hjälper användare betala så lite som möjligt för mobilabonnemang genom att utnyttja kampanjer utan bindningstid.

## Vad appen gör

- Bevakar **kampanjer för mobilabonnemang** utan bindningstid
- Visar bästa erbjudandet utifrån dina val (GB, nätverk, operatör)
- Räknar ut besparing jämfört med ordinarie pris hela året
- Mejlar dig **en vecka innan bindningstiden går ut**, med länk till ny kampanj och Kivra

> Tanken: behåll abonnemanget under kampanjperioden, byt sedan innan ordinarie pris börjar gälla.

## Snabbstart (Windows)

```powershell
cd bytesjakten
copy .env.example .env
.\scripts\setup.ps1      # Första gången
.\scripts\start.ps1      # Starta appen
```

Öppna **http://localhost:3000** – admin finns på **http://localhost:3000/admin**

## Steg för steg

### 1. Mejl (Maileroo)

1. Skapa konto på [maileroo.com](https://maileroo.com) (gratis nivå räcker)
2. Lägg till och verifiera din domän (t.ex. `bytesjakten.se`) – DNS hos One.com
3. Skapa en **Sending Key** och kopiera den till `.env`:
   ```
   MAILEROO_API_KEY=din-nyckel
   EMAIL_FROM="Bytesjakten <hej@bytesjakten.se>"
   ```
4. Avsändaradressen i `EMAIL_FROM` måste höra till en verifierad domän i Maileroo

Testa mejl via admin-panelen → **Skicka testmejl**.

### 2. Admin-lösenord

Sätt i `.env`:

```
ADMIN_SECRET=ditt-hemliga-losenord
```

Logga in på `/admin` för att:

- Se registrerade användare
- Lägga till/redigera kampanjer manuellt
- Uppdatera kampanjer och köra mejlutskick
- Skicka testmejl

### 3. Kampanjer

Kampanjer uppdateras automatiskt kl **07:00** varje dag. Du kan också:

- **Admin** → "Uppdatera kampanjer" (fyller på från seed-data)
- **Admin** → "Lägg till kampanj" (manuellt med riktiga priser och länkar)

Tips: Kolla operatörernas sidor regelbundet och lägg till kampanjer utan bindningstid via admin.

### 4. Automatisering kl 07:00

**Alternativ A – Servern körs dygnet runt**

`start.ps1` sätter `ENABLE_LOCAL_CRON=true` – då körs uppdatering + mejl automatiskt kl 07:00.

**Alternativ B – Windows Task Scheduler**

Kör som administratör:

```powershell
.\scripts\install-scheduler.ps1
```

Detta schemalägger `cron-daily.ps1` kl 07:00 även om appen inte kör.

**Manuell körning:**

```powershell
npm run cron
```

### 5. Publicera på internet (valfritt)

Deploy till [Vercel](https://vercel.com):

1. Pusha till GitHub
2. Importera projektet i Vercel
3. Sätt miljövariabler: `MAILEROO_API_KEY`, `EMAIL_FROM`, `ADMIN_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_APP_URL`
4. Vercel Cron körs automatiskt kl 07:00 (konfigurerat i `vercel.json`)

## Användarflöde

1. Användaren besöker landningssidan
2. Väljer data, nätverk, operatör och slutdatum
3. Registrerar sig med e-post (gratis)
4. En vecka innan abonnemanget går ut → automatiskt mejl med:
   - Bästa kampanjen hos annat telebolag
   - Länk till Kivra
   - Avregistreringslänk

## Miljövariabler

| Variabel | Beskrivning |
|----------|-------------|
| `DATABASE_URL` | SQLite (lokal) |
| `MAILEROO_API_KEY` | Mejl via Maileroo |
| `EMAIL_FROM` | Avsändaradress |
| `NEXT_PUBLIC_APP_URL` | Publik URL |
| `ADMIN_SECRET` | Lösenord för /admin |
| `CRON_SECRET` | Säkerhet för cron-API |
| `ENABLE_LOCAL_CRON` | Cron kl 07:00 när servern kör |

Kopiera `.env.example` till `.env` och fyll i värdena.

## Kommandon

| Kommando | Beskrivning |
|----------|-------------|
| `npm run dev` | Utvecklingsläge |
| `npm run prod` | Produktion lokalt (bygger + startar) |
| `npm run setup` | Första gången setup |
| `npm run cron` | Kör kampanjuppdatering + mejl manuellt |

## Teknik

Next.js 16 · SQLite · Prisma · Maileroo · Tailwind CSS
