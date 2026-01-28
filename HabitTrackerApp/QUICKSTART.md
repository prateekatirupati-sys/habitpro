# Habit Tracker - Quick Start Guide

A mobile app built with React Native and Expo for tracking habits and productivity.

## Quick Start

```bash
cd HabitTrackerApp
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS (Mac only)
- Press `w` for web
- Scan QR code with Expo Go app

## Features

✨ **Habit Tracking**
- Create habits with emojis and custom frequencies
- Daily check-ins to track streaks
- View habit completion rates

⏱️ **Productivity Timer**
- Pomodoro-style focus sessions (15-120 minutes)
- Log and track work sessions
- Daily productivity stats

📊 **Dashboard**
- Daily overview of habits and productivity
- Real-time statistics
- Session history

## Project Files

- `App.js` - Main app with navigation
- `src/screens/` - Four main screens (Home, Habits, Productivity, Settings)
- `src/utils/storageService.js` - Data persistence with AsyncStorage

## Architecture

The app uses:
- React Native + Expo (cross-platform)
- React Navigation (bottom tab navigation)
- AsyncStorage (local device storage)
- React Hooks (state management)
- Ionicons (icons)

## Data

All data stored locally on device:
- Habits and metadata
- Daily completion logs
- Productivity session logs

**Note**: Data is device-specific. Clear app data = loss of all history.

## Customization

**Add emojis**: Edit `EMOJIS` in `src/screens/HabitsScreen.js`
**Change colors**: Replace `#6366f1` with your hex color
**Timer durations**: Edit `DURATIONS` in `src/screens/ProductivityScreen.js`

## Scripts

```bash
npm start      # Start dev server
npm run web    # Run in browser
```

---

For full documentation, see the main README.md in the project root.
