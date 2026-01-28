@echo off
REM Habit Tracker App - Setup Verification Script for Windows

echo.
echo 🔍 Habit Tracker App - Verification Check
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js installed: %NODE_VERSION%
) else (
    echo ❌ Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm installed: %NPM_VERSION%
) else (
    echo ❌ npm not found. Install Node.js which includes npm
    pause
    exit /b 1
)

echo.
echo 📦 Checking Project Structure...
echo ================================

REM Check key files
if exist "App.js" (echo ✅ App.js) else (echo ❌ App.js - MISSING)
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json - MISSING)
if exist "src\screens\HomeScreen.js" (echo ✅ src\screens\HomeScreen.js) else (echo ❌ src\screens\HomeScreen.js - MISSING)
if exist "src\screens\HabitsScreen.js" (echo ✅ src\screens\HabitsScreen.js) else (echo ❌ src\screens\HabitsScreen.js - MISSING)
if exist "src\screens\ProductivityScreen.js" (echo ✅ src\screens\ProductivityScreen.js) else (echo ❌ src\screens\ProductivityScreen.js - MISSING)
if exist "src\screens\SettingsScreen.js" (echo ✅ src\screens\SettingsScreen.js) else (echo ❌ src\screens\SettingsScreen.js - MISSING)
if exist "src\utils\storageService.js" (echo ✅ src\utils\storageService.js) else (echo ❌ src\utils\storageService.js - MISSING)

echo.
echo 🔄 Checking Dependencies...
echo ===========================

if exist "node_modules" (
    echo ✅ node_modules exists
    if exist "node_modules\react-native" (echo ✅ react-native installed) else (echo ⚠️  react-native not fully installed)
    if exist "node_modules\@react-navigation" (echo ✅ React Navigation installed) else (echo ⚠️  React Navigation not fully installed)
    if exist "node_modules\@react-native-async-storage" (echo ✅ AsyncStorage installed) else (echo ⚠️  AsyncStorage not fully installed)
) else (
    echo ❌ node_modules not found
    echo    Run: npm install
)

echo.
echo 📄 Documentation Files...
echo ========================

if exist "README.md" (echo ✅ README.md) else (echo ❌ README.md - MISSING)
if exist "QUICKSTART.md" (echo ✅ QUICKSTART.md) else (echo ❌ QUICKSTART.md - MISSING)
if exist "GUIDE.md" (echo ✅ GUIDE.md) else (echo ❌ GUIDE.md - MISSING)
if exist "SUMMARY.md" (echo ✅ SUMMARY.md) else (echo ❌ SUMMARY.md - MISSING)

echo.
echo 🎯 Setup Status
echo ===============

if exist "App.js" (
    if exist "package.json" (
        if exist "src" (
            echo ✅ Project structure is valid
            echo ✅ Ready to run!
            echo.
            echo Next Steps:
            echo ===========
            echo 1. Start the app:     npm start
            echo 2. Choose platform:   a (Android), i (iOS), w (Web)
            echo 3. Or scan QR code with Expo Go app
        ) else (
            echo ❌ Project structure incomplete
        )
    ) else (
        echo ❌ Project structure incomplete
    )
) else (
    echo ❌ Project structure incomplete
    echo    Make sure you're in the HabitTrackerApp directory
)

echo.
pause
