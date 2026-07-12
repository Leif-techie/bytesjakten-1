# Bytesjakten – första gången setup
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== Bytesjakten Setup ===" -ForegroundColor Green

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Skapade .env från .env.example" -ForegroundColor Yellow
    Write-Host "VIKTIGT: Redigera .env och fyll i RESEND_API_KEY, ADMIN_SECRET m.m." -ForegroundColor Yellow
}

npm install
npx prisma generate
npx prisma migrate deploy
npx tsx scripts/run-cron.ts

Write-Host ""
Write-Host "=== Setup klar! ===" -ForegroundColor Green
Write-Host "Nasta steg:"
Write-Host "  1. Redigera .env (RESEND_API_KEY, ADMIN_SECRET, EMAIL_FROM)"
Write-Host "  2. Kor: .\scripts\start.ps1"
Write-Host "  3. Oppna http://localhost:3000"
Write-Host "  4. Admin: http://localhost:3000/admin"
