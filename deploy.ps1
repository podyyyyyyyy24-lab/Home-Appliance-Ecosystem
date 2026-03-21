Write-Host "====================================" -ForegroundColor Cyan
Write-Host "🚀 Home Appliance Deployment Script  " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 1. Pushing to Cloud (GitHub -> Vercel)
Write-Host "📦 Checking for changes to deploy to the Cloud..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ Code is already up-to-date in Cloud! (No new changes)" -ForegroundColor Green
} else {
    git add .
    git commit -m "Auto deployment update 🚀"
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub Successfully! Vercel is now building it in the background." -ForegroundColor Green
}

# 2. Starting Local Server
Write-Host "💻 Starting Local Server for testing..." -ForegroundColor Cyan
Write-Host "🌐 Store will open at: http://localhost:3000" -ForegroundColor DarkGray
npm run dev
