@echo off
echo 🚀 Rozpoczynam wdrożenie...
echo.
echo 📦 Budowanie aplikacji...
call npm run build
echo.
echo 🔥 Wdrażanie na Firebase...
call firebase deploy --only hosting --project pro8link
echo.
echo ✅ Gotowe!
pause