@echo off
REM ========================================
REM DODAJ I COMMIT - Szybki backup zmian
REM ========================================
REM Ten skrypt:
REM 1. Dodaje wszystkie zmiany
REM 2. Tworzy commit z twoim opisem
REM 3. Pushuje do GitHub
REM ========================================

echo.
echo ========================================
echo   BACKUP ZMIAN - ProLink
echo ========================================
echo.

REM Sprawdź czy jesteś w folderze ProLink
if not exist "package.json" (
    echo BLAD: Nie jestes w folderze ProLink!
    echo Uruchom ten skrypt w C:\Users\User1\Desktop\ProLink\
    pause
    exit /b 1
)

REM Sprawdź czy Git jest zainicjalizowany
if not exist ".git" (
    echo BLAD: Git nie jest zainicjalizowany!
    echo Najpierw uruchom: 1st-commit.bat
    pause
    exit /b 1
)

echo Co zmieniłeś? (krótki opis zmian)
echo Przykłady:
echo - Updated login colors
echo - Added Google Sheets integration
echo - Fixed dashboard bug
echo.
set /p COMMIT_MSG="Opis zmian: "

if "%COMMIT_MSG%"=="" (
    echo BLAD: Musisz podac opis zmian!
    pause
    exit /b 1
)

echo.
echo [1/3] Dodawanie zmian...
git add .
if errorlevel 1 (
    echo BLAD: Git add nie powiodlo sie
    pause
    exit /b 1
)

echo.
echo [2/3] Tworzenie commitu...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo UWAGA: Brak zmian do commitowania lub blad
    echo.
    git status
    pause
    exit /b 1
)

echo.
echo [3/3] Pushowanie do GitHub...
git push
if errorlevel 1 (
    echo BLAD: Push nie powiodl sie
    echo Sprawdz polaczenie z internetem
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUKCES! Zmiany na GitHub!
echo ========================================
echo.
echo Commit: %COMMIT_MSG%
echo.
pause
