#!/bin/bash

# Build script for HabitTracker mobile app
# This script helps build APK and IPA files

clear

cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║        HabitTracker Mobile Build Tool               ║
╚═══════════════════════════════════════════════════════╝

EOF

echo "Choose build option:"
echo "1) Android APK (Cloud Build)"
echo "2) Android APK (Local Build)"
echo "3) iOS IPA (requires macOS + Xcode)"
echo "4) Run Android Simulator"
echo "5) Run iOS Simulator (macOS only)"
echo "6) Run Web Development Server"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "Checking if EAS CLI is installed..."
        if ! command -v eas &> /dev/null; then
            echo "EAS CLI not found. Installing..."
            npm install -g eas-cli
        fi
        echo ""
        echo "Starting Android APK build (Cloud)..."
        echo "This may take a few minutes..."
        eas build --platform android
        ;;
    2)
        echo ""
        echo "Checking if EAS CLI is installed..."
        if ! command -v eas &> /dev/null; then
            echo "EAS CLI not found. Installing..."
            npm install -g eas-cli
        fi
        echo ""
        echo "Starting Android APK build (Local)..."
        eas build --platform android --local
        ;;
    3)
        echo ""
        echo "Note: iOS IPA builds require macOS with Xcode."
        echo "Checking if EAS CLI is installed..."
        if ! command -v eas &> /dev/null; then
            echo "EAS CLI not found. Installing..."
            npm install -g eas-cli
        fi
        echo ""
        echo "Starting iOS IPA build..."
        eas build --platform ios
        ;;
    4)
        echo ""
        echo "Starting Android Emulator..."
        npm run android
        ;;
    5)
        echo ""
        echo "Starting iOS Simulator..."
        npm run ios
        ;;
    6)
        echo ""
        echo "Starting web development server..."
        echo "Open http://localhost:8081 in your browser"
        npm run web
        ;;
    *)
        echo "Invalid choice. Please select 1-6."
        exit 1
        ;;
esac

echo ""
echo "Build process started!"
echo ""
