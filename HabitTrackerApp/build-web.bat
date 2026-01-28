@echo off
REM Build web version of HabitTrackerApp
REM This script builds the web version and creates a static build folder

echo.
echo ========================================
echo  HabitTrackerApp Web Build
echo ========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        exit /b 1
    )
)

REM Build the web version
echo.
echo Building web version...
call npx expo export -p web
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Web build failed
    exit /b 1
)

echo.
echo ========================================
echo  Web Build Complete!
echo ========================================
echo.
echo The web build has been created in the 'dist' folder.
echo.
echo To serve locally:
echo   npx http-server dist -p 3000 -o
echo.
echo To deploy:
echo   1. Upload the 'dist' folder to your hosting provider
echo   2. Configure your server to serve index.html for all routes
echo.
