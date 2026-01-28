#!/bin/bash

# Build web version of HabitTrackerApp
# This script builds the web version and creates a static build folder

echo ""
echo "========================================"
echo "  HabitTrackerApp Web Build"
echo "========================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

# Build the web version
echo ""
echo "Building web version..."
npx expo export -p web
if [ $? -ne 0 ]; then
    echo "ERROR: Web build failed"
    exit 1
fi

echo ""
echo "========================================"
echo "  Web Build Complete!"
echo "========================================"
echo ""
echo "The web build has been created in the 'dist' folder."
echo ""
echo "To serve locally:"
echo "  npx http-server dist -p 3000 -o"
echo ""
echo "To deploy:"
echo "  1. Upload the 'dist' folder to your hosting provider"
echo "  2. Configure your server to serve index.html for all routes"
echo ""
