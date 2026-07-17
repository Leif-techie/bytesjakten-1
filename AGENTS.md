<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

**Product:** Bytesjakten — a Next.js 16 + Prisma app for tracking Swedish mobile-plan campaigns. Single service (Next.js app on port 3000, UI + `/api/*` routes). Standard commands live in `package.json` and `README.md`.

**Database is PostgreSQL, not SQLite.** Despite `README.md`/`.env.example` mentioning SQLite (`file:./dev.db`), the runtime hardcodes the Prisma Postgres adapter (`src/lib/db.ts` uses `PrismaPg`) and `prisma/schema.prisma` uses `provider = "postgresql"`. A running PostgreSQL instance is required; a SQLite `DATABASE_URL` will fail at runtime.

**Startup (not handled by the update script — run these each fresh session):**
- Start Postgres: `sudo pg_ctlcluster 16 main start` (installed via apt; data persists in the snapshot, so the `bytesjakten` DB and applied migrations survive across sessions).
- Ensure `.env` exists (it is gitignored). Set `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bytesjakten"` and `ADMIN_SECRET=...`. `RESEND_API_KEY` may be empty — email code no-ops and just logs when it is unset.
- Apply migrations if the DB is fresh: `npx prisma migrate deploy`.
- Run the app: `npm run dev` (http://localhost:3000). Admin panel is at `/admin` (password = `ADMIN_SECRET`).

**Gotchas:**
- Campaigns auto-seed on first hit of `GET /api/campaigns` (calls `ensureCampaignsSeeded`); no separate seed step is needed to exercise the UI/offer flow.
- The standalone `scripts/seed.ts` does NOT load dotenv, so `DATABASE_URL` is undefined when run directly and it fails. Seed via the running app (hit `/api/campaigns`) or `POST /api/cron` (Bearer `CRON_SECRET`) instead. `scripts/run-cron.ts` does load dotenv.
- `scripts/*.ps1` are Windows-only PowerShell and do not run here.
- `npm run lint` currently reports pre-existing `react-hooks/set-state-in-effect` errors in `src/app/page.tsx` and `src/app/avregistrera/page.tsx`; these are existing code issues, not environment problems. `npm run build` succeeds regardless.
