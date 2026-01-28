# 📱 Building Mobile Versions

This guide explains how to build and run the Habit Tracker App on iOS and Android devices.

## Overview

The Habit Tracker App is built with **Expo** and **React Native**, which means the same code runs on:
- ✅ Web (already working at `http://localhost:8081`)
- 📱 iOS (iPhone)
- 🤖 Android (phones & tablets)

## Prerequisites

### For Development (Testing on Simulator/Emulator)
- **Node.js 18+** (already installed)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)

### For iOS Native Builds
- **macOS** (required for iOS development)
- **Xcode** (iOS development tools)
- **CocoaPods** (iOS dependency manager)

### For Android Native Builds
- **Android Studio** or **Android SDK**
- **Java Development Kit (JDK) 17+**
- **Android emulator or physical device**

## Quick Start: Testing on Simulators/Emulators

### Option 1: Using Expo CLI (Easiest)

#### Android:
```bash
npm run android
# Or
expo start --android
```

This will:
1. Start the Metro bundler
2. Launch Android Emulator (or ask you to select a device)
3. Build and run the app

#### iOS:
```bash
npm run ios
# Or
expo start --ios
```

This will:
1. Start the Metro bundler
2. Launch iOS Simulator
3. Build and run the app

**Note:** iOS builds require macOS with Xcode installed.

### Option 2: Interactive Startup
```bash
npm start
```

This starts Expo in interactive mode. Once running, press:
- `i` → Launch iOS Simulator
- `a` → Launch Android Emulator
- `w` → Open Web (already running)
- `r` → Reload app

## Advanced: Building Native Apps (APK/IPA)

### For Android (APK)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Authenticate with Expo
```bash
eas login
# Sign in with your Expo account (create one if needed at https://expo.dev)
```

#### Step 3: Configure EAS Build
```bash
eas build:configure
```

#### Step 4: Build Android APK
```bash
eas build --platform android --local
# For cloud build (recommended):
eas build --platform android
```

This creates an **APK** file that can be shared and installed on any Android device.

### For iOS (IPA)

#### Step 1: Install EAS CLI (if not done)
```bash
npm install -g eas-cli
eas login
```

#### Step 2: Configure Signing
```bash
eas build:configure
# Select "iOS distribution"
```

#### Step 3: Build iOS IPA
```bash
eas build --platform ios
# Note: Must run on macOS with Xcode installed
```

This creates an **IPA** file for the App Store or TestFlight distribution.

## Running on Physical Devices

### Android:
1. **Enable Developer Mode:**
   - Go to Settings → About → Tap "Build Number" 7 times
   - Go back to Settings → Developer options → Enable USB Debugging

2. **Connect via USB:**
   ```bash
   adb devices  # Check connected devices
   npm run android
   ```

3. **Or use QR Code:**
   ```bash
   npm start
   # Scan the QR code with Expo Go app (from Play Store)
   ```

### iOS:
1. **Connect via Xcode or Devices:**
   ```bash
   npm run ios
   ```

2. **Or use Expo Go:**
   - Install Expo Go from App Store
   - Run `npm start`
   - Scan the QR code with Expo Go

## Features Available in Mobile Version

✅ All features from web version:
- ✅ Habit tracking with completion streaks
- ✅ Dashboard with statistics & achievements
- ✅ Daily reminders & notifications
- ✅ Puzzle solving with XP rewards
- ✅ Data persistence with AsyncStorage
- ✅ Responsive UI optimized for all screen sizes

## Troubleshooting

### Metro Bundler Issues
```bash
npm run web -- --clear
# Or reset the bundler cache
rm -rf node_modules/.cache
```

### Android Emulator Won't Start
```bash
# List available emulators
emulator -list-avds

# Start a specific emulator
emulator -avd <emulator_name>

# Then run
npm run android
```

### iOS Build Fails
- Ensure Xcode is fully installed
- Run: `sudo xcode-select --reset`
- Update Cocoa Pods: `pod repo update`

### App Crashes on Startup
- Check console: `npm start` and look for errors
- Clear cache: `npm start -- --clear`
- Check that all required dependencies are installed: `npm install`

## Project Structure

```
HabitTrackerApp/
├── app/                    # Expo Router app structure
│   ├── _layout.tsx        # Root layout
│   └── (tabs)/            # Tab navigation
│       ├── index.tsx      # Habits screen
│       ├── dashboard.tsx  # Dashboard screen
│       ├── reminders.tsx  # Reminders screen
│       ├── puzzles.tsx    # Puzzles screen (NEW!)
│       └── explore.tsx    # Explore screen
├── src/
│   ├── utils/
│   │   ├── storageService.js      # Data persistence
│   │   └── puzzleService.js       # Puzzle data (NEW!)
│   └── screens/           # Legacy screen components
├── components/            # Reusable UI components
├── assets/               # Images, icons, splash screens
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## What's New in v1.1

🎮 **Puzzle System:**
- 10+ unique puzzles (Logic, Trivia, Word, Math)
- Daily puzzle challenges with XP rewards
- Difficulty levels (Easy, Medium, Hard)
- Puzzle statistics and tracking

📊 **Mobile Optimization:**
- Responsive layouts for all screen sizes
- Touch-optimized UI controls
- Fast animations and transitions
- Offline-first data persistence

## Environment Variables

If needed, create `.env` in the root directory:
```bash
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_LOG_LEVEL=debug
```

## Next Steps

1. **Test on Web:** Visit `http://localhost:8081` (already running)
2. **Test on Android:** `npm run android`
3. **Test on iOS:** `npm run ios` (macOS only)
4. **Build for Distribution:** Use `eas build` commands above
5. **Submit to App Stores:**
   - Google Play Store: https://play.google.com/console
   - Apple App Store: https://appstoreconnect.apple.com

## Support

For issues or questions:
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/

---

**Happy building! 🚀**
