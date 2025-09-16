Write-Host "Starting Smart Teacher on Network with HTTPS..." -ForegroundColor Green
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "- Local: https://localhost:3000" -ForegroundColor Cyan
Write-Host "- Network: https://10.120.250.175:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "For mobile access:" -ForegroundColor Yellow
Write-Host "1. Make sure mobile is on same network" -ForegroundColor White
Write-Host "2. Open browser and go to: https://10.120.250.175:3000" -ForegroundColor White
Write-Host "3. If security warning appears, click 'Advanced' then 'Proceed'" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# تشغيل المشروع على الشبكة المحلية مع HTTPS
npm run dev:https
