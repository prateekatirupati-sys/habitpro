#!/bin/bash

# Serve the web version locally for development or preview

echo ""
echo "========================================"
echo "  HabitTrackerApp Web Server"
echo "========================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "ERROR: 'dist' folder not found"
    echo "Please run './build-web.sh' first to build the web version"
    exit 1
fi

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "ERROR: npx is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Starting web server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Serve the dist folder
npx http-server dist -p 3000 -o
