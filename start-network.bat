@echo off
echo Starting Smart Teacher on Network with HTTPS...
echo.
echo The application will be available at:
echo - Local: https://localhost:3000
echo - Network: https://10.120.250.175:3000
echo.
echo For mobile access:
echo 1. Make sure mobile is on same network
echo 2. Open browser and go to: https://10.120.250.175:3000
echo 3. If security warning appears, click "Advanced" then "Proceed"
echo.
echo Press Ctrl+C to stop the server
echo.

REM تشغيل المشروع على الشبكة المحلية مع HTTPS
npm run dev:https
