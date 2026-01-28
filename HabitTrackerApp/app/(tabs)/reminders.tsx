import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '@/src/utils/storageService';

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState({
    enabled: true,
    time: '08:00',
    sound: true,
    dailyChallenge: true,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await storageService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        loadReminders(user.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadReminders = async (id) => {
    try {
      const userReminders = await storageService.getUserReminders(id);
      setReminders(userReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (updated) => {
    try {
      if (userId) {
        await storageService.saveUserReminders(userId, updated);
        setReminders(updated);
      }
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#6366f1" />
        <Text style={styles.title}>Reminders & Notifications</Text>
      </View>

      {/* Main Toggle */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications" size={24} color="#6366f1" />
          <Text style={styles.cardTitle}>Enable Reminders</Text>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Get daily habit reminders</Text>
          <Switch
            value={reminders.enabled}
            onValueChange={(value) => saveReminders({ ...reminders, enabled: value })}
            trackColor={{ false: '#e5e7eb', true: '#c7d2fe' }}
            thumbColor={reminders.enabled ? '#6366f1' : '#d1d5db'}
          />
        </View>
      </View>

      {reminders.enabled && (
        <>
          {/* Time Selection */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time" size={24} color="#6366f1" />
              <Text style={styles.cardTitle}>Reminder Time</Text>
            </View>
            <View style={styles.timeButtons}>
              {['06:00', '08:00', '12:00', '18:00', '20:00'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeButton, reminders.time === time && styles.timeButtonActive]}
                  onPress={() => saveReminders({ ...reminders, time })}
                >
                  <Text style={[styles.timeButtonText, reminders.time === time && styles.timeButtonTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notification Types */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings" size={24} color="#6366f1" />
              <Text style={styles.cardTitle}>Notification Types</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high" size={20} color="#6366f1" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Sound Notifications</Text>
                  <Text style={styles.settingDesc}>Play sound with reminders</Text>
                </View>
              </View>
              <Switch
                value={reminders.sound}
                onValueChange={(value) => saveReminders({ ...reminders, sound: value })}
                trackColor={{ false: '#e5e7eb', true: '#c7d2fe' }}
                thumbColor={reminders.sound ? '#6366f1' : '#d1d5db'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="flash" size={20} color="#f59e0b" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Daily Challenge</Text>
                  <Text style={styles.settingDesc}>Get daily challenge notifications</Text>
                </View>
              </View>
              <Switch
                value={reminders.dailyChallenge}
                onValueChange={(value) => saveReminders({ ...reminders, dailyChallenge: value })}
                trackColor={{ false: '#e5e7eb', true: '#c7d2fe' }}
                thumbColor={reminders.dailyChallenge ? '#6366f1' : '#d1d5db'}
              />
            </View>
          </View>
        </>
      )}

      {/* Upcoming Reminders */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={24} color="#6366f1" />
          <Text style={styles.cardTitle}>Upcoming Reminders</Text>
        </View>

        <View style={styles.reminderItem}>
          <View style={styles.reminderDot} />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTime}>Today at {reminders.time}</Text>
            <Text style={styles.reminderDesc}>Your daily habit reminder</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        </View>

        <View style={styles.reminderItem}>
          <View style={[styles.reminderDot, { backgroundColor: '#f59e0b' }]} />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTime}>Tomorrow at {reminders.time}</Text>
            <Text style={styles.reminderDesc}>Daily challenge starts</Text>
          </View>
          <Ionicons name="time" size={24} color="#6366f1" />
        </View>
      </View>

      {/* Puzzle of the Day */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="help-circle" size={24} color="#ec4899" />
          <Text style={styles.cardTitle}>Puzzle of the Day</Text>
        </View>

        <View style={styles.puzzle}>
          <Text style={styles.puzzleQuestion}>Complete daily puzzles to earn XP and unlock rewards</Text>
          <Text style={styles.puzzleReward}>Challenge your mind • Earn Badges • Level Up</Text>
          <TouchableOpacity 
            style={styles.puzzleButton}
            onPress={() => router.push('/(tabs)/puzzles')}
          >
            <Text style={styles.puzzleButtonText}>Solve Puzzles</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  timeButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#6366f1',
  },
  timeButtonText: {
    fontWeight: '600',
    color: '#6b7280',
  },
  timeButtonTextActive: {
    color: '#6366f1',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reminderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  reminderDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  puzzle: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
  },
  puzzleQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  puzzleReward: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 8,
  },
  puzzleButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  puzzleButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  spacing: {
    height: 40,
  },
});
