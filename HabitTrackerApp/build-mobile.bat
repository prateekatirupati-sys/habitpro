@echo off
REM Build script for HabitTracker mobile app
REM This script helps build APK and IPA files

echo.
echo ========================================================
echo        HabitTracker Mobile Build Tool
echo ========================================================
echo.

if "%1"=="" (
    set /p choice="Choose build option (1=Android APK, 2=iOS IPA, 3=Run Android Simulator, 4=Run iOS Simulator): "
) else (
    set choice=%1
)

if "%choice%"=="1" (
    echo.
    echo Checking if EAS CLI is installed...
    where eas-cli >nul 2>&1
    if %errorlevel% neq 0 (
        echo EAS CLI not found. Installing...
        call npm install -g eas-cli
    )
    echo.
    echo Starting Android APK build...
    call eas build --platform android --local
) else if "%choice%"=="2" (
    echo.
    echo Note: iOS IPA builds require macOS with Xcode.
    echo Checking if EAS CLI is installed...
    where eas-cli >nul 2>&1
    if %errorlevel% neq 0 (
        echo EAS CLI not found. Installing...
        call npm install -g eas-cli
    )
    echo.
    echo Starting iOS IPA build...
    call eas build --platform ios
) else if "%choice%"=="3" (
    echo.
    echo Starting Android Emulator...
    call npm run android
) else if "%choice%"=="4" (
    echo.
    echo Starting iOS Simulator (macOS only)...
    call npm run ios
) else (
    echo Invalid choice. Please select 1, 2, 3, or 4.
    exit /b 1
)

echo.
echo Build complete!
echo.
pause
