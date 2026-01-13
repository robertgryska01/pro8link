@echo off
REM ========================================
REM CLONE ProLink - Pobierz projekt z GitHub
REM ========================================
REM Ten skrypt:
REM 1. Klonuje projekt z GitHub
REM 2. Instaluje wszystkie zależności (npm install)
REM 3. Buduje projekt (npm run build)
REM ========================================

echo.
echo ========================================
echo   CLONE ProLink z GitHub
echo ========================================
echo.

echo UWAGA: Ten skrypt pobierze projekt z GitHub
echo i zainstaluje wszystkie zaleznosci.
echo.

set /p REPO_URL="Wklej URL repo GitHub: "

if "%REPO_URL%"=="" (
    echo BLAD: Musisz podac URL repo!
    pause
    exit /b 1
)

echo.
echo [1/4] Klonowanie projektu z GitHub...
git clone %REPO_URL%
if errorlevel 1 (
    echo BLAD: Klonowanie nie powiodlo sie
    echo Sprawdz URL lub polaczenie z internetem
    pause
    exit /b 1
)

REM Wyciągnij nazwę folderu z URL
for %%I in ("%REPO_URL%") do set FOLDER_NAME=%%~nI

echo.
echo [2/4] Wchodze do folderu %FOLDER_NAME%...
cd %FOLDER_NAME%
if errorlevel 1 (
    echo BLAD: Nie mozna wejsc do folderu
    pause
    exit /b 1
)

echo.
echo [3/4] Instalowanie zaleznosci (npm install)...
echo To moze potrwac kilka minut...
call npm install
if errorlevel 1 (
    echo BLAD: npm install nie powiodlo sie
    pause
    exit /b 1
)

echo.
echo [4/4] Budowanie projektu (npm run build)...
echo To moze potrwac kilka minut...
call npm run build
if errorlevel 1 (
    echo BLAD: npm run build nie powiodlo sie
    echo Sprawdz bledy powyzej
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUKCES! Projekt gotowy!
echo ========================================
echo.
echo Projekt znajduje sie w folderze: %FOLDER_NAME%
echo.
echo Co mozesz teraz zrobic:
echo 1. npm run dev      - uruchom lokalnie
echo 2. firebase deploy  - wdroz na Firebase
echo.
pause
