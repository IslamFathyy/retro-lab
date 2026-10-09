# Rename the parent clone folder to retro-lab (matches GitHub repo name).
# Close Cursor and other programs using this folder before running.
param(
  [string]$Parent = "D:\",
  [string]$OldName = "AI-Driven retro app",
  [string]$NewName = "retro-lab"
)

$oldPath = Join-Path $Parent $OldName
$newPath = Join-Path $Parent $NewName

if (Test-Path $newPath) {
  Write-Host "Already exists: $newPath" -ForegroundColor Green
  exit 0
}
if (-not (Test-Path -LiteralPath $oldPath)) {
  Write-Host "Not found: $oldPath (nothing to rename)" -ForegroundColor Yellow
  exit 0
}

try {
  Rename-Item -LiteralPath $oldPath -NewName $NewName -ErrorAction Stop
  Write-Host "Renamed to $newPath" -ForegroundColor Green
  Write-Host "Reopen: $newPath\retro-lab.code-workspace"
} catch {
  Write-Error "Rename failed (folder in use?). Close Cursor, then run this script again."
  exit 1
}
