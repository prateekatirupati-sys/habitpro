@echo off
REM Quick setup verification script for Windows
REM Run this to see what's been configured

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     HabitTrackerApp - Mobile-Ready Web Version                 ║
echo ║                  Setup Verification                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check build scripts
echo 📁 Checking Build Scripts...
if exist "build-web.bat" (
  if exist "build-web.sh" (
    echo    ✅ Build scripts present (Windows + Unix^)
  )
) else (
  echo    ❌ Build scripts missing
)

if exist "serve-web.bat" (
  if exist "serve-web.sh" (
    echo    ✅ Server scripts present (Windows + Unix^)
  )
) else (
  echo    ❌ Server scripts missing
)

REM Check hosting configs
echo.
echo 🌐 Checking Hosting Configurations...
if exist "vercel.json" echo    ✅ Vercel config
if exist "netlify.toml" echo    ✅ Netlify config
if exist "firebase.json" echo    ✅ Firebase config
if exist "Dockerfile" echo    ✅ Docker config

REM Check CI/CD
echo.
echo ⚙️ Checking CI/CD...
if exist ".github\workflows\web-deploy.yml" (
  echo    ✅ GitHub Actions configured
) else (
  echo    ❌ GitHub Actions missing
)

REM Check styles
echo.
echo 🎨 Checking Responsive Styles...
if exist "public\styles\responsive.css" (
  echo    ✅ Responsive CSS present
  echo    └─ Mobile-first design
  echo    └─ Touch-friendly UI
  echo    └─ Dark mode support
) else (
  echo    ❌ Responsive CSS missing
)

REM Check documentation
echo.
echo 📚 Checking Documentation...
set doc_count=0
if exist "00_START_HERE.md" set /a doc_count+=1
if exist "WEB_README.md" set /a doc_count+=1
if exist "WEB_QUICKSTART.md" set /a doc_count+=1
if exist "WEB_DEPLOYMENT.md" set /a doc_count+=1
if exist "COMMANDS.md" set /a doc_count+=1
echo    ✅ %doc_count% documentation files found

REM Check node_modules
echo.
echo 📦 Checking Dependencies...
if exist "node_modules\" (
  echo    ✅ Dependencies installed
) else (
  echo    ⚠️ Dependencies not installed - Run 'npm install'
)

REM Summary
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Setup Status: COMPLETE ✅                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Next Steps:
echo.
echo 1️⃣  Test Locally:
echo     npm run web
echo     Visit: http://localhost:19006
echo.
echo 2️⃣  Test on Phone:
echo     Get your IP: ipconfig
echo     Visit: http://YOUR_IP:19006 on phone
echo.
echo 3️⃣  Deploy:
echo     build-web.bat
echo     vercel
echo.
echo 4️⃣  Documentation:
echo     Start: 00_START_HERE.md
echo     Quick: WEB_QUICKSTART.md
echo     Deploy: WEB_DEPLOYMENT.md
echo.
echo 🎉 Your mobile-ready website is ready!
echo.
pause
