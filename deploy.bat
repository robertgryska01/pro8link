@echo off
echo Rozpoczynam wdrozenie...
echo.
echo Budowanie aplikacji...
call npm run build
echo.
echo Wdrazanie na Firebase...
call firebase deploy --only hosting --project pro8link
echo.
echo Gotowe!
pause