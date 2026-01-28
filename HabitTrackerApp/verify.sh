#!/bin/bash
# Habit Tracker App - Setup Verification Script

echo "🔍 Habit Tracker App - Verification Check"
echo "=========================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found. Install Node.js which includes npm"
    exit 1
fi

echo ""
echo "📦 Checking Project Structure..."
echo "================================"

# Check key files
FILES=(
    "App.js"
    "package.json"
    "src/screens/HomeScreen.js"
    "src/screens/HabitsScreen.js"
    "src/screens/ProductivityScreen.js"
    "src/screens/SettingsScreen.js"
    "src/utils/storageService.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""
echo "🔄 Checking Dependencies..."
echo "==========================="

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    
    # Check for key dependencies
    if [ -d "node_modules/react-native" ]; then
        echo "✅ react-native installed"
    else
        echo "⚠️  react-native not fully installed"
    fi
    
    if [ -d "node_modules/@react-navigation/native" ]; then
        echo "✅ React Navigation installed"
    else
        echo "⚠️  React Navigation not fully installed"
    fi
    
    if [ -d "node_modules/@react-native-async-storage/async-storage" ]; then
        echo "✅ AsyncStorage installed"
    else
        echo "⚠️  AsyncStorage not fully installed"
    fi
else
    echo "❌ node_modules not found"
    echo "   Run: npm install"
fi

echo ""
echo "📄 Documentation Files..."
echo "========================"

DOCS=(
    "README.md"
    "QUICKSTART.md"
    "GUIDE.md"
    "SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc"
    else
        echo "❌ $doc - MISSING"
    fi
done

echo ""
echo "🎯 Setup Status"
echo "==============="

if [ -f "App.js" ] && [ -f "package.json" ] && [ -d "src" ]; then
    echo "✅ Project structure is valid"
    echo "✅ Ready to run!"
    echo ""
    echo "Next Steps:"
    echo "==========="
    echo "1. Start the app:     npm start"
    echo "2. Choose platform:   a (Android), i (iOS), w (Web)"
    echo "3. Or scan QR code with Expo Go app"
else
    echo "❌ Project structure incomplete"
    echo "   Make sure you're in the HabitTrackerApp directory"
fi

echo ""
