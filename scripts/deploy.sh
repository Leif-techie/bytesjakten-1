#!/usr/bin/env bash
# Deploy Bytesjakten after merging to main (VPS).
# Usage: npm run deploy
# Short alias (install once on the VPS):
#   echo "alias bb='cd ~/bytesjakten && npm run deploy'" >> ~/.bashrc && source ~/.bashrc
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

APP_NAME="${PM2_APP_NAME:-bytesjakten}"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> Pull $BRANCH"
git pull origin "$BRANCH"

echo "==> Install dependencies"
npm ci

echo "==> Database migrate"
npx prisma migrate deploy

echo "==> Build"
npm run build

echo "==> Restart $APP_NAME"
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  echo "pm2 hittades inte – starta/starta om appen manuellt."
  exit 1
fi

echo "==> Klart"
echo "Tips: gå till /admin och tryck \"Uppdatera erbjudanden\" om seed-listan ändrats."
