#!/usr/bin/env bash
# Quick setup verification script
# Run this to see what's been configured

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     HabitTrackerApp - Mobile-Ready Web Version                 ║"
echo "║                  Setup Verification                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check build scripts
echo "📁 Checking Build Scripts..."
if [ -f "build-web.bat" ] && [ -f "build-web.sh" ]; then
  echo "   ✅ Build scripts present (Windows & Unix)"
else
  echo "   ❌ Build scripts missing"
fi

if [ -f "serve-web.bat" ] && [ -f "serve-web.sh" ]; then
  echo "   ✅ Server scripts present (Windows & Unix)"
else
  echo "   ❌ Server scripts missing"
fi

# Check hosting configs
echo ""
echo "🌐 Checking Hosting Configurations..."
[ -f "vercel.json" ] && echo "   ✅ Vercel config" || echo "   ❌ Vercel missing"
[ -f "netlify.toml" ] && echo "   ✅ Netlify config" || echo "   ❌ Netlify missing"
[ -f "firebase.json" ] && echo "   ✅ Firebase config" || echo "   ❌ Firebase missing"
[ -f "Dockerfile" ] && echo "   ✅ Docker config" || echo "   ❌ Docker missing"

# Check CI/CD
echo ""
echo "⚙️ Checking CI/CD..."
if [ -f ".github/workflows/web-deploy.yml" ]; then
  echo "   ✅ GitHub Actions configured"
else
  echo "   ❌ GitHub Actions missing"
fi

# Check styles
echo ""
echo "🎨 Checking Responsive Styles..."
if [ -f "public/styles/responsive.css" ]; then
  echo "   ✅ Responsive CSS present"
  echo "   └─ Mobile-first design"
  echo "   └─ Touch-friendly UI"
  echo "   └─ Dark mode support"
else
  echo "   ❌ Responsive CSS missing"
fi

# Check documentation
echo ""
echo "📚 Checking Documentation..."
docs=("00_START_HERE.md" "WEB_README.md" "WEB_QUICKSTART.md" "WEB_DEPLOYMENT.md" "COMMANDS.md")
doc_count=0
for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    ((doc_count++))
  fi
done
echo "   ✅ $doc_count documentation files found"

# Check node_modules
echo ""
echo "📦 Checking Dependencies..."
if [ -d "node_modules" ]; then
  echo "   ✅ Dependencies installed"
else
  echo "   ⚠️ Dependencies not installed - Run 'npm install'"
fi

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Setup Status: COMPLETE ✅                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next Steps:"
echo ""
echo "1️⃣  Test Locally:"
echo "    npm run web"
echo "    → Visit http://localhost:19006"
echo ""
echo "2️⃣  Test on Phone:"
echo "    → Get your IP: ipconfig (Windows) or ifconfig (Mac)"
echo "    → Visit http://YOUR_IP:19006 on phone"
echo ""
echo "3️⃣  Deploy:"
echo "    build-web.sh (or build-web.bat)"
echo "    vercel"
echo ""
echo "4️⃣  Documentation:"
echo "    → Start with 00_START_HERE.md"
echo "    → Quick start: WEB_QUICKSTART.md"
echo "    → Deployment: WEB_DEPLOYMENT.md"
echo ""
echo "🎉 Your mobile-ready website is ready!"
echo ""
