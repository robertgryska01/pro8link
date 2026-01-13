# 🚀 Instrukcja użycia plików Git .bat

## 📦 Pobrane pliki:

1. **1st-commit.bat** - Pierwszy commit (raz na początku)
2. **add-commit.bat** - Backup zmian (codziennie)
3. **clone-ProLink.bat** - Pobierz projekt z GitHub

---

## 📍 Gdzie umieścić pliki:

```
C:\Users\User1\Desktop\ProLink\
├── 1st-commit.bat       ← TU
├── add-commit.bat       ← TU
└── clone-ProLink.bat    ← TU (opcjonalnie)
```

---

## 🎯 Jak używać:

### **KROK 1: Pierwszy raz (tylko raz!)**

1. Utwórz repo na GitHub.com:
   - Nazwa: `ProLink`
   - Private lub Public
   - NIE twórz README

2. Skopiuj URL repo:
   ```
   https://github.com/twoj-username/ProLink.git
   ```

3. **Kliknij 2x:** `1st-commit.bat`
   - Wklej URL repo gdy poprosi
   - Poczekaj na zakończenie
   - ✅ Projekt na GitHub!

---

### **KROK 2: Codzienne backupy (po każdej zmianie)**

1. Zmieniłeś coś w kodzie? (np. dodałeś funkcję, zmieniłeś kolory)

2. **Kliknij 2x:** `add-commit.bat`

3. Wpisz co zmieniłeś:
   ```
   Updated logo colors
   ```
   lub
   ```
   Added Google Sheets integration
   ```

4. Enter → ✅ Backup na GitHub!

---

### **KROK 3: Przywracanie projektu (opcjonalnie)**

**Scenariusz:** Chcesz pobrać projekt na innym komputerze lub przywrócić po crash.

1. Skopiuj `clone-ProLink.bat` do pustego folderu

2. **Kliknij 2x:** `clone-ProLink.bat`

3. Wklej URL:
   ```
   https://github.com/twoj-username/ProLink.git
   ```

4. Poczekaj (~5-10 minut):
   - Pobierze kod
   - Zainstaluje npm packages
   - Zbuduje projekt

5. ✅ Gotowy projekt w folderze `ProLink`!

---

## 💡 Przykładowy workflow:

### **Dzień 1 (raz):**
```
1. Utwórz repo na GitHub
2. Uruchom: 1st-commit.bat
3. ✅ Projekt na GitHub
```

### **Dzień 2 (dodałeś favicon):**
```
1. Zmieniłeś plik icon.png
2. Uruchom: add-commit.bat
3. Wpisz: "Added new favicon"
4. ✅ Backup na GitHub
```

### **Dzień 3 (zmieniłeś kolory logo):**
```
1. Zaktualizowałeś global-header.tsx
2. Uruchom: add-commit.bat
3. Wpisz: "Updated logo colors to match favicon"
4. ✅ Backup na GitHub
```

---

## 🔍 Co robi każdy skrypt?

### **1st-commit.bat:**
```bash
git init                    # Inicjalizuje Git
git add .                   # Dodaje wszystkie pliki
git commit -m "..."         # Pierwszy commit
git remote add origin ...   # Łączy z GitHub
git push -u origin main     # Wysyła na GitHub
```

### **add-commit.bat:**
```bash
git add .           # Dodaje zmiany
git commit -m "..." # Commit z twoim opisem
git push            # Wysyła na GitHub
```

### **clone-ProLink.bat:**
```bash
git clone ...       # Pobiera z GitHub
npm install         # Instaluje packages
npm run build       # Buduje projekt
```

---

## ⚠️ WAŻNE:

1. **Uruchamiaj zawsze z folderu ProLink**
   - Skrypty sprawdzają czy są w dobrym miejscu

2. **Nie commituj node_modules**
   - `.gitignore` to obsługuje automatycznie

3. **Opisuj zmiany po polsku lub angielsku**
   - "Updated colors" ✅
   - "Zaktualizowane kolory" ✅

---

## 📊 Co jest backupowane:

| Folder/Plik | Backup? | Rozmiar |
|-------------|---------|---------|
| `src/` | ✅ TAK | ~5 MB |
| `package.json` | ✅ TAK | ~2 KB |
| `next.config.ts` | ✅ TAK | ~1 KB |
| `firebase.json` | ✅ TAK | ~1 KB |
| `node_modules/` | ❌ NIE | ~500 MB |
| `out/` | ❌ NIE | ~50 MB |
| `.next/` | ❌ NIE | ~100 MB |

**Backup: ~10 MB zamiast 1000 MB!** 🎉

---

## 🆘 Rozwiązywanie problemów:

### Problem: "Git nie jest rozpoznawane"
**Rozwiązanie:** Zainstaluj Git dla Windows z git-scm.com

### Problem: "Push failed"
**Rozwiązanie:** 
1. Sprawdź internet
2. Sprawdź czy repo istnieje na GitHub
3. Sprawdź czy jesteś zalogowany do Git

### Problem: "Brak zmian do commitowania"
**To OK!** Znaczy że nie zmieniłeś nic od ostatniego commitu.

---

**Gotowe! Teraz masz prosty backup system!** 🎉
