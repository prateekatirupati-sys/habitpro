# Habit Tracker App - Complete Guide

## Overview

The Habit Tracker is a mobile productivity app built with React Native and Expo that helps you:
- Track daily habits and build streaks
- Monitor productivity with focus sessions
- Visualize progress through a daily dashboard

## Getting Started

### Installation

1. Navigate to project:
   ```bash
   cd HabitTrackerApp
   ```

2. Install dependencies (if needed):
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

### Running the App

Choose your platform:
- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i` (requires Mac)
- **Web Browser**: Press `w`
- **Physical Device**: Install Expo Go app and scan QR code

## App Navigation

The app has 4 main tabs at the bottom:

### 1. Dashboard (Home)
**What it does**: Shows your daily overview
- Habits completed today / total habits
- Minutes of focus time logged
- List of all habits with quick check-in buttons
- Today's productivity sessions

**Quick actions**:
- Tap the checkmark icon to mark a habit as complete
- Swipe up to see more sessions

### 2. My Habits
**What it does**: Manage your habits
- View all habits with their streaks
- Create new habits with the + button
- Delete habits by swiping or tapping trash icon
- Check in to habits to build streaks

**Creating a Habit**:
1. Tap the blue + button
2. Enter habit name (e.g., "Morning Meditation")
3. Choose an emoji (⚽ 💪 📚 🧘 🏃 etc.)
4. Select frequency (Daily, Weekly, Twice a week)
5. Tap "Create Habit"

**Tracking Progress**:
- Tap "Check In" to mark habit as done
- Your streak number shows consecutive days completed
- The flame 🔥 icon indicates active streak

### 3. Productivity
**What it does**: Track focused work sessions
- Start timed focus sessions
- Log tasks with durations (15-120 minutes)
- View today's sessions and total focus time
- Real-time timer with pause option

**Starting a Session**:
1. Tap "Start Focus Session"
2. Enter your task name (e.g., "Code review")
3. Choose duration (15, 25, 30, 45, 60, 90, or 120 minutes)
4. Tap "Start Timer"
5. Timer counts down - you can pause or cancel
6. When complete, session is automatically logged

**Pomodoro Technique**:
- Default 25-minute sessions help maintain focus
- After each session, take a break
- Complete 4 sessions for a long break

### 4. Settings
**What it does**: Help, info, and data management
- App version and features
- How-to tips for getting the most from the app
- Productivity best practices
- Option to clear all data (with confirmation)

## Features Deep Dive

### Habit Tracking

**Streaks**: Consecutive days you complete a habit
- Increases by 1 each day you check in
- Shows up in the "My Habits" tab
- Once you miss a day, streak resets to 0

**Daily Check-in**: Mark habits as complete once per day
- Can only check in once per 24-hour period
- Once marked complete, button becomes green
- Dashboard shows completion rate

**Habit Frequencies**:
- Daily: Check in every day
- Weekly: Check in once per week
- Twice a week: Check in 2 times per week

### Productivity Tracking

**Focus Sessions**: Timed work blocks
- Log any task with flexible duration
- Automatic logging when timer completes
- Pause timer without losing progress
- Cancel if needed

**Time Tracking**:
- Dashboard shows total minutes logged today
- See all sessions for today with timestamps
- Perfect for tracking billable hours or work time

**Best Practices**:
- Use 25-minute Pomodoro sessions
- Take 5-minute breaks between sessions
- After 4 sessions, take a 15-30 minute break

## Data & Storage

### What Gets Saved

1. **Habits**
   - Name, emoji, frequency
   - Creation date
   - Unique ID for tracking

2. **Habit Logs**
   - Date completed
   - Which habit was completed
   - Timestamp of check-in

3. **Productivity Logs**
   - Task name
   - Duration in minutes
   - Date and time completed

### Storage Details

- **Location**: Device's local storage (AsyncStorage)
- **Backup**: Not synced to cloud
- **Persistence**: Survives app restarts
- **Loss**: Clearing app data or uninstalling deletes everything

### Exporting Data

Currently, data is device-specific. To preserve data:
- Don't clear app cache/data
- Keep the app installed
- Consider taking screenshots for backup

## Customization

### Change App Colors

1. Open any screen file in `src/screens/`
2. Find color codes like `#6366f1` (indigo)
3. Replace with your hex color

Primary color used: `#6366f1`
Success color used: `#10b981` (green)
Danger color used: `#ef4444` (red)

### Add More Emoji Options

In `src/screens/HabitsScreen.js`:
```javascript
const EMOJIS = ['⚽', '💪', '📚', '🧘', '🏃', '🎵', '🎨', '📖', '💼', '🍎'];
// Add more: '🏋️', '🧗', '🚴', '🏊', '⛹️', '🤸', etc.
```

### Change Timer Durations

In `src/screens/ProductivityScreen.js`:
```javascript
const DURATIONS = [15, 25, 30, 45, 60, 90, 120];
// Modify to: [10, 20, 30, 45, 50, 60]
```

## Project Structure

```
HabitTrackerApp/
├── App.js                    # Main app file with navigation setup
├── package.json             # Dependencies list
├── app.json                 # Expo configuration
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Dashboard / Overview
│   │   ├── HabitsScreen.js         # Habit management
│   │   ├── ProductivityScreen.js   # Timer & sessions
│   │   └── SettingsScreen.js       # Settings & help
│   ├── utils/
│   │   └── storageService.js       # Data persistence layer
│   └── components/          # Placeholder for future reusable components
├── node_modules/            # Dependencies (auto-generated)
├── README.md               # Full documentation
├── QUICKSTART.md          # Quick reference
└── GUIDE.md              # This file
```

## Common Tasks

### Add a New Habit
1. Go to "My Habits" tab
2. Tap blue + button
3. Fill in details
4. Tap "Create Habit"

### Mark Habit Complete Today
1. Go to "Dashboard" or "My Habits"
2. Tap the checkmark icon
3. It turns green - you're done!

### Log a Work Session
1. Go to "Productivity" tab
2. Tap "Start Focus Session"
3. Enter task and duration
4. Tap "Start Timer"
5. Timer runs - complete and it auto-logs

### View Your Progress
1. Dashboard shows today's stats
2. Habit streaks visible in "My Habits"
3. Productivity total shown in "Productivity" tab

### Delete a Habit
1. Go to "My Habits" tab
2. Tap trash icon on habit
3. Confirm deletion

### Clear All Data
1. Go to "Settings" tab
2. Scroll to "Data" section
3. Tap "Clear All Data"
4. Confirm - data is deleted

## Troubleshooting

### App Won't Start
- Clear cache: `npm start -c`
- Reinstall: `rm -rf node_modules && npm install`
- Restart computer

### Data Not Saving
- Check device storage isn't full
- Restart the app
- Verify AsyncStorage permissions on device

### Timer Issues
- Restart app
- Check device time settings
- Try restarting dev server

### Habits Not Appearing
- Refresh by going to different tab and back
- Restart app
- Check you created them in "My Habits" tab

## Tips for Success

### Building Habits
1. **Start small** - 2-3 habits max
2. **Be specific** - "Exercise" → "Morning 30-min run"
3. **Make it easy** - Choose habits you can do daily
4. **Check daily** - Consistency is key
5. **Track streaks** - Motivation comes from streaks

### Maximizing Productivity
1. **Use Pomodoro** - 25 min work + 5 min break
2. **Task names matter** - Be specific about what you're doing
3. **No distractions** - Lock phone when timer runs
4. **Track everything** - Count all focus time
5. **Aim for total** - Try 2-3 hours daily focus

### Habit + Productivity Combo
1. Log "Habit practice" as productivity task
2. Use productivity timer for habit execution
3. Track both habit completion AND focus time
4. Review daily on dashboard

## Features Roadmap

Potential future additions:
- 📊 Weekly/monthly charts and analytics
- 🔔 Daily reminder notifications
- 📱 Native iOS/Android builds
- ☁️ Cloud backup and sync
- 🌙 Dark mode
- 📸 Photo evidence for habits
- 🎯 Milestone goals
- 👥 Social sharing of streaks

## Support & Issues

### Getting Help
- Check the Settings tab → Tips section
- Review this guide for your question
- Check QUICKSTART.md for quick reference

### Reporting Issues
- Note what you were doing
- Describe what went wrong
- Check that app is up to date

## License & Usage

This app is open source and free to use for:
- Personal habit tracking
- Productivity monitoring
- Educational purposes

Modification and redistribution allowed with attribution.

---

## Summary

The Habit Tracker helps you:
✅ Build and maintain daily habits
✅ Monitor and improve productivity  
✅ Visualize your daily progress
✅ Stay motivated with streaks and stats

Start small, stay consistent, and watch yourself improve! 🚀
