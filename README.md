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
- Skicka mejl till respektive användare med valt erbjudande

### 3. Kampanjer

Hantera kampanjer manuellt via admin:

- **Admin** → "Lägg till kampanj"
- **Admin** → "Ta bort" på en rad
- **Admin** → "Uppdatera kampanjer" (valfritt – fyller på från seed-data)

### 4. Mejlutskick

Mejl skickas **endast manuellt**. Under **Aktiva användare** i admin: välj erbjudande per rad och klicka **Skicka mejl**.

### 5. Publicera på internet (valfritt)

Deploy till [Vercel](https://vercel.com):

1. Pusha till GitHub
2. Importera projektet i Vercel
3. Sätt miljövariabler: `MAILEROO_API_KEY`, `EMAIL_FROM`, `ADMIN_SECRET`, `NEXT_PUBLIC_APP_URL`

## Användarflöde

1. Användaren besöker landningssidan
2. Väljer data, nätverk, operatör och slutdatum
3. Registrerar sig med e-post (gratis)
4. Du skickar mejl manuellt via admin när det är dags, med valt erbjudande:
   - Kampanj hos annat telebolag
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
| `CRON_SECRET` | Säkerhet för cron-API (valfritt) |

Kopiera `.env.example` till `.env` och fyll i värdena.

## Kommandon

| Kommando | Beskrivning |
|----------|-------------|
| `npm run dev` | Utvecklingsläge |
| `npm run prod` | Produktion lokalt (bygger + startar) |
| `npm run setup` | Första gången setup |
| `npm run cron` | Kör kampanjuppdatering (inga mejl) |

## Teknik

Next.js 16 · SQLite · Prisma · Maileroo · Tailwind CSS
