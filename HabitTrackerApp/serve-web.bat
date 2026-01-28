@echo off
REM Serve the web version locally for development or preview

echo.
echo ========================================
echo  HabitTrackerApp Web Server
echo ========================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo ERROR: 'dist' folder not found
    echo Please run 'build-web.bat' first to build the web version
    exit /b 1
)

REM Check if npx is available
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npx is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Starting web server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Install http-server if not already installed globally
call npx http-server dist -p 3000 -o
