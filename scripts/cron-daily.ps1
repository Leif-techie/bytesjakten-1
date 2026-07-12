# Schemalagd korning kl 07:00 – anvand med Windows Task Scheduler
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$logDir = Join-Path $PSScriptRoot "..\logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$logFile = Join-Path $logDir ("cron-" + (Get-Date -Format "yyyy-MM-dd") + ".log")

Add-Content $logFile "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Startar cron..."

try {
    npx tsx scripts/run-cron.ts 2>&1 | Add-Content $logFile
    Add-Content $logFile "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Klart."
} catch {
    Add-Content $logFile "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] FEL: $_"
}
