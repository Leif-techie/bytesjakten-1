# Starta Bytesjakten i produktionslage (lokal dator)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env")) {
    Write-Host "Kor setup forst: .\scripts\setup.ps1" -ForegroundColor Red
    exit 1
}

$env:ENABLE_LOCAL_CRON = "true"
$env:NODE_ENV = "production"

Write-Host "Bygger appen..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Startar pa http://localhost:3000" -ForegroundColor Green
Write-Host "Cron kor kl 07:00 (Europe/Stockholm)" -ForegroundColor Cyan
Write-Host "Admin: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host "Tryck Ctrl+C for att stoppa" -ForegroundColor Yellow
Write-Host ""

npm run start
