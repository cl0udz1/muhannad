# deploy.ps1

# 1. Build the project
Write-Host "Building project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Create Zip archive
Write-Host "Creating site.zip..."
Compress-Archive -Path out/* -DestinationPath site.zip -Force

Write-Host "Done! Upload 'site.zip' to Appwrite." -ForegroundColor Green
