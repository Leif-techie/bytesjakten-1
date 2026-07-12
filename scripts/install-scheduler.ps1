# Schemalägg daglig körning kl 07:00 med Windows Task Scheduler
# Kör som administratör: .\scripts\install-scheduler.ps1

$ErrorActionPreference = "Stop"
$taskName = "Bytesjakten-DailyCron"
$scriptPath = Join-Path $PSScriptRoot "cron-daily.ps1"
$projectRoot = Split-Path $PSScriptRoot -Parent

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -WorkingDirectory $projectRoot
$trigger = New-ScheduledTaskTrigger -Daily -At "07:00"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Bytesjakten: uppdatera kampanjer och skicka mejl kl 07:00" -Force

Write-Host "Schemalagt: $taskName kl 07:00 varje dag" -ForegroundColor Green
Write-Host "Loggar sparas i logs/" -ForegroundColor Cyan
