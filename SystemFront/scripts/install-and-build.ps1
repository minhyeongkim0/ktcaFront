# recharts 설치 후 Next.js 빌드 검증
# 프로젝트 루트에서 실행: .\scripts\install-and-build.ps1

Set-Location $PSScriptRoot\..

Write-Host "Installing dependencies (including recharts)..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed. Try clean reinstall: Remove-Item -Recurse -Force node_modules; Remove-Item -Force package-lock.json; npm install" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "node_modules\recharts")) {
    Write-Host "recharts not found in node_modules. Running clean reinstall..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    npm install
    if (-not (Test-Path "node_modules\recharts")) { Write-Host "ERROR: recharts still missing." -ForegroundColor Red; exit 1 }
}

Write-Host "Running next build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) { Write-Host "Build succeeded." -ForegroundColor Green } else { exit 1 }
