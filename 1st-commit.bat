@echo off
REM ========================================
REM PIERWSZY COMMIT - ProLink do GitHub
REM ========================================
REM Ten skrypt:
REM 1. Inicjalizuje Git w projekcie
REM 2. Dodaje wszystkie pliki
REM 3. Tworzy pierwszy commit
REM 4. Łączy z GitHub
REM 5. Pushuje kod
REM ========================================

echo.
echo ========================================
echo   PIERWSZY COMMIT - ProLink
echo ========================================
echo.

REM Sprawdź czy jesteś w folderze ProLink
if not exist "package.json" (
    echo BLAD: Nie jestes w folderze ProLink!
    echo Uruchom ten skrypt w C:\Users\User1\Desktop\ProLink\
    pause
    exit /b 1
)

echo [1/5] Inicjalizacja Git...
git init
if errorlevel 1 (
    echo BLAD: Git init nie powiodlo sie
    pause
    exit /b 1
)

echo.
echo [2/5] Dodawanie plikow...
git add .
if errorlevel 1 (
    echo BLAD: Git add nie powiodlo sie
    pause
    exit /b 1
)

echo.
echo [3/5] Tworzenie pierwszego commitu...
git commit -m "Initial ProLink commit - Google OAuth + Sheets integration"
if errorlevel 1 (
    echo BLAD: Git commit nie powiodlo sie
    pause
    exit /b 1
)

echo.
echo [4/5] Ustawianie galezi main...
git branch -M main

echo.
echo [5/5] Laczenie z GitHub...
echo.
echo UWAGA: Teraz wpisz swoj URL repozytorium GitHub
echo Przyklad: https://github.com/twoj-username/ProLink.git
echo.
set /p REPO_URL="Wklej URL repo: "

git remote add origin %REPO_URL%
if errorlevel 1 (
    echo BLAD: Nie udalo sie dodac remote
    pause
    exit /b 1
)

echo.
echo Pushowanie do GitHub...
git push -u origin main
if errorlevel 1 (
    echo BLAD: Push nie powiodl sie
    echo Sprawdz czy repo istnieje na GitHub
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUKCES! Projekt na GitHub!
echo ========================================
echo.
echo Twoj projekt jest teraz na GitHub!
echo URL: %REPO_URL%
echo.
pause
