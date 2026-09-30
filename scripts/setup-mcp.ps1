#Requires -Version 5.1
<#
.SYNOPSIS
  Load .env into User environment and copy mcp-config.json to .cursor/mcp.json
.PARAMETER SessionOnly
  Set process env only (no User persistence). Use when launching Cursor from this shell.
#>
param(
  [switch]$SessionOnly
)

$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$EnvFile = Join-Path $Root '.env'
$Template = Join-Path $Root 'mcp-config.json'
$TargetDir = Join-Path $Root '.cursor'
$Target = Join-Path $TargetDir 'mcp.json'

function Parse-DotEnvLine {
  param([string]$Line)
  $t = $Line.Trim()
  if (-not $t -or $t.StartsWith('#')) { return $null }
  $eq = $t.IndexOf('=')
  if ($eq -lt 1) { return $null }
  $key = $t.Substring(0, $eq).Trim()
  $val = $t.Substring($eq + 1).Trim()
  if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
    $val = $val.Substring(1, $val.Length - 2)
  }
  return @{ Key = $key; Value = $val }
}

Write-Host 'Retrospective Lab — MCP setup' -ForegroundColor Cyan
Write-Host "Root: $Root"
Write-Host ''

if (-not (Test-Path $Template)) {
  Write-Host "ERROR: Missing mcp-config.json at $Template" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $EnvFile)) {
  Write-Host 'WARNING: .env not found.' -ForegroundColor Yellow
  Write-Host '  copy env.example .env'
  Write-Host '  Edit .env, then re-run this script.'
  exit 1
}

$updatedKeys = @()
Get-Content $EnvFile -Encoding UTF8 | ForEach-Object {
  $parsed = Parse-DotEnvLine $_
  if (-not $parsed) { return }
  $key = $parsed.Key
  $val = $parsed.Value
  if ($SessionOnly) {
    Set-Item -Path "Env:$key" -Value $val
  } else {
    [Environment]::SetEnvironmentVariable($key, $val, 'User')
    Set-Item -Path "Env:$key" -Value $val
  }
  $updatedKeys += $key
}

if ($updatedKeys.Count -eq 0) {
  Write-Host 'WARNING: No variables loaded from .env (file empty or comments only).' -ForegroundColor Yellow
} else {
  $scope = if ($SessionOnly) { 'Process (SessionOnly)' } else { 'User + Process' }
  Write-Host "Loaded $($updatedKeys.Count) variable(s) into $scope environment:"
  $updatedKeys | ForEach-Object { Write-Host "  - $_" }
}

New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
Copy-Item -Path $Template -Destination $Target -Force

Write-Host ''
Write-Host "SUCCESS: Copied mcp-config.json -> .cursor/mcp.json" -ForegroundColor Green
Write-Host ''
Write-Host 'Next steps:'
Write-Host '  1. Restart Cursor (required after .env or mcp-config.json changes).'
Write-Host '  2. Settings -> MCP — confirm project servers are enabled.'
Write-Host '  3. Cursor resolves ${env:VAR} at runtime from your environment.'
Write-Host ''
Write-Host 'To share MCP changes with the team: edit mcp-config.json in git, re-run this script locally.'
Write-Host 'Do not commit .cursor/mcp.json (gitignored).'
