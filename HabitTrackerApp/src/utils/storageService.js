import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const HABITS_LOG_KEY = '@habits_log';
const PRODUCTIVITY_LOG_KEY = '@productivity_log';
const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';
const SOLVED_PUZZLES_KEY = '@solved_puzzles';
const USER_REMINDERS_KEY = '@user_reminders';

// Check if we're in a web environment
const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Storage abstraction layer
const storage = {
  async getItem(key) {
    try {
      if (isWeb) {
        const item = localStorage.getItem(key);
        console.log(`[Storage] Got from localStorage[${key}]:`, item);
        return item;
      }
      const item = await AsyncStorage.getItem(key);
      console.log(`[Storage] Got from AsyncStorage[${key}]:`, item);
      return item;
    } catch (error) {
      console.error('[Storage] Error getting item:', key, error);
      return null;
    }
  },
  
  async setItem(key, value) {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
        console.log(`[Storage] Set to localStorage[${key}]:`, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
      console.log(`[Storage] Set to AsyncStorage[${key}]:`, value);
    } catch (error) {
      console.error('[Storage] Error setting item:', key, error);
    }
  },
};

export const storageService = {
  // Direct storage access methods
  async getItem(key) {
    return storage.getItem(key);
  },

  async setItem(key, value) {
    return storage.setItem(key, value);
  },

  // Authentication
  async signUp(email, password) {
    try {
      const users = await this.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, hash this!
        createdAt: new Date().toISOString(),
        points: 0,
        level: 1,
      };

      users.push(newUser);
      await storage.setItem(USERS_KEY, JSON.stringify(users));
      await storage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email, password) {
    try {
      console.log('[StorageService] signIn called with email:', email);
      const users = await this.getUsers();
      console.log('[StorageService] All users:', users);
      const user = users.find(u => u.email === email && u.password === password);
      console.log('[StorageService] Found user:', user);

      if (!user) {
        console.log('[StorageService] No user found with provided credentials');
        return null;
      }

      console.log('[StorageService] Setting current user to:', user);
      await storage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      console.log('[StorageService] Current user saved successfully');
      return user;
    } catch (error) {
      console.error('[StorageService] Sign in error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const userStr = await storage.getItem(CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async logOut() {
    try {
      await storage.setItem(CURRENT_USER_KEY, '');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async resetAllData() {
    try {
      const keys = [
        HABITS_KEY,
        HABITS_LOG_KEY,
        PRODUCTIVITY_LOG_KEY,
        USERS_KEY,
        CURRENT_USER_KEY,
        SOLVED_PUZZLES_KEY,
        USER_REMINDERS_KEY,
        'hasSeenIntro',
      ];
      
      if (isWeb) {
        keys.forEach(key => localStorage.removeItem(key));
        console.log('[Storage] Cleared all localStorage data');
      } else {
        for (const key of keys) {
          await AsyncStorage.removeItem(key);
        }
        console.log('[Storage] Cleared all AsyncStorage data');
      }
    } catch (error) {
      console.error('Reset data error:', error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const users = await storage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  },

  // User Stats
  async getUserStats(userId) {
    try {
      const habits = await this.getHabits();
      const logs = await this.getHabitLogs();
      
      const today = new Date().toISOString().split('T')[0];
      const completedToday = logs.filter(l => l.date === today).length;
      
      const users = await this.getUsers();
      const user = users.find(u => u.id === userId);

      return {
        totalHabits: habits.length,
        completedToday,
        currentStreak: await this.calculateStreak(userId),
        points: user?.points || 0,
        level: Math.floor((user?.points || 0) / 500) + 1,
        completionRate: habits.length > 0 ? Math.floor((completedToday / habits.length) * 100) : 0,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {};
    }
  },

  async calculateStreak(userId) {
    try {
      const logs = await this.getHabitLogs();
      if (logs.length === 0) return 0;

      const sortedDates = logs
        .map(l => new Date(l.date))
        .sort((a, b) => b - a);

      let streak = 0;
      const today = new Date();

      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);

        const dayStr = expectedDate.toISOString().split('T')[0];
        if (sortedDates[i].toISOString().split('T')[0] === dayStr) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Calculate streak error:', error);
      return 0;
    }
  },

  async addPoints(userId, points) {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].points = (users[userIndex].points || 0) + points;
        await storage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Add points error:', error);
    }
  },

  // User Reminders
  async getUserReminders(userId) {
    try {
      const reminders = await storage.getItem(`@reminders_${userId}`);
      return reminders ? JSON.parse(reminders) : {
        enabled: true,
        time: '08:00',
        sound: true,
        dailyChallenge: true,
      };
    } catch (error) {
      console.error('Get reminders error:', error);
      return {};
    }
  },

  async saveUserReminders(userId, reminders) {
    try {
      await storage.setItem(`@reminders_${userId}`, JSON.stringify(reminders));
    } catch (error) {
      console.error('Save reminders error:', error);
    }
  },

  // Habits
  async getHabits() {
    try {
      console.log('[HabitService] getHabits called');
      const habitsStr = await storage.getItem(HABITS_KEY);
      console.log('[HabitService] Raw data:', habitsStr);
      const habits = habitsStr ? JSON.parse(habitsStr) : [];
      console.log('[HabitService] Parsed habits:', habits);
      return habits;
    } catch (error) {
      console.error('[HabitService] Error fetching habits:', error);
      return [];
    }
  },

  async saveHabits(habits) {
    try {
      console.log('[HabitService] saveHabits called with:', habits);
      const habitsStr = JSON.stringify(habits);
      console.log('[HabitService] Stringified:', habitsStr);
      await storage.setItem(HABITS_KEY, habitsStr);
      console.log('[HabitService] Habits saved successfully');
    } catch (error) {
      console.error('[HabitService] Error saving habits:', error);
    }
  },

  async addHabit(habit) {
    console.log('[HabitService] addHabit called with:', habit);
    const habits = await this.getHabits();
    console.log('[HabitService] Current habits:', habits);
    
    const newHabit = {
      id: Date.now().toString(),
      ...habit,
      createdAt: new Date().toISOString(),
    };
    console.log('[HabitService] New habit object:', newHabit);
    
    habits.push(newHabit);
    console.log('[HabitService] Habits array after push:', habits);
    
    await this.saveHabits(habits);
    console.log('[HabitService] Habit added and saved');
    return newHabit;
  },

  async updateHabit(id, updates) {
    const habits = await this.getHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      await this.saveHabits(habits);
    }
  },

  async deleteHabit(id) {
    const habits = await this.getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    await this.saveHabits(filtered);
  },

  // Habit Logs
  async getHabitLogs() {
    try {
      const logs = await storage.getItem(HABITS_LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      return [];
    }
  },

  async logHabitCompletion(habitId, date = new Date()) {
    const logs = await this.getHabitLogs();
    const dateStr = date.toISOString().split('T')[0];
    const logExists = logs.find(
      (log) => log.habitId === habitId && log.date === dateStr
    );

    if (!logExists) {
      logs.push({
        id: Date.now().toString(),
        habitId,
        date: dateStr,
        completedAt: new Date().toISOString(),
      });
      await storage.setItem(HABITS_LOG_KEY, JSON.stringify(logs));
    }
    return !logExists;
  },

  async isHabitCompletedToday(habitId, date = new Date()) {
    const logs = await this.getHabitLogs();
    const dateStr = date.toISOString().split('T')[0];
    return logs.some((log) => log.habitId === habitId && log.date === dateStr);
  },

  async getHabitStreak(habitId) {
    const logs = await this.getHabitLogs();
    const habitLogs = logs.filter((log) => log.habitId === habitId);
    
    if (habitLogs.length === 0) return 0;

    const sortedDates = habitLogs
      .map((log) => new Date(log.date))
      .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      const dayStr = expectedDate.toISOString().split('T')[0];
      if (sortedDates[i].toISOString().split('T')[0] === dayStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  // Productivity Logs
  async getProductivityLogs() {
    try {
      const logs = await storage.getItem(PRODUCTIVITY_LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error fetching productivity logs:', error);
      return [];
    }
  },

  async logProductivity(task, duration, date = new Date()) {
    const logs = await this.getProductivityLogs();
    logs.push({
      id: Date.now().toString(),
      task,
      duration,
      date: date.toISOString().split('T')[0],
      completedAt: new Date().toISOString(),
    });
    await storage.setItem(PRODUCTIVITY_LOG_KEY, JSON.stringify(logs));
  },

  async getTodayProductivity(date = new Date()) {
    const logs = await this.getProductivityLogs();
    const dateStr = date.toISOString().split('T')[0];
    const todayLogs = logs.filter((log) => log.date === dateStr);
    const totalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);
    return { logs: todayLogs, totalTime };
  },

  // Puzzles
  async getUserSolvedPuzzles(userId) {
    try {
      const key = `${SOLVED_PUZZLES_KEY}_${userId}`;
      const puzzlesStr = await storage.getItem(key);
      return puzzlesStr ? JSON.parse(puzzlesStr) : [];
    } catch (error) {
      console.error('Error getting solved puzzles:', error);
      return [];
    }
  },

  async saveUserSolvedPuzzles(userId, puzzles) {
    try {
      const key = `${SOLVED_PUZZLES_KEY}_${userId}`;
      await storage.setItem(key, JSON.stringify(puzzles));
    } catch (error) {
      console.error('Error saving solved puzzles:', error);
    }
  },

  async getUserReminders(userId) {
    try {
      const key = `${USER_REMINDERS_KEY}_${userId}`;
      const remindersStr = await storage.getItem(key);
      if (remindersStr) {
        return JSON.parse(remindersStr);
      }
      // Return default reminders
      return {
        enabled: true,
        time: '08:00',
        sound: true,
        dailyChallenge: true,
      };
    } catch (error) {
      console.error('Error getting user reminders:', error);
      return {
        enabled: true,
        time: '08:00',
        sound: true,
        dailyChallenge: true,
      };
    }
  },

  async saveUserReminders(userId, reminders) {
    try {
      const key = `${USER_REMINDERS_KEY}_${userId}`;
      await storage.setItem(key, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving user reminders:', error);
    }
  },

  async updateCurrentUser(user) {
    try {
      await storage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // Also update in users list
      const users = await this.getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        await storage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating current user:', error);
    }
  },

  async clearAll() {
    try {
      await storage.setItem(HABITS_KEY, '');
      await storage.setItem(HABITS_LOG_KEY, '');
      await storage.setItem(PRODUCTIVITY_LOG_KEY, '');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
