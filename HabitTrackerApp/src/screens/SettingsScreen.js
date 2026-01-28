import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '../utils/storageService';

export default function SettingsScreen() {
  const [version] = useState('1.0.0');

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all habits, logs, and productivity data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: async () => {
            await storageService.clearAll();
            Alert.alert('Success', 'All data has been cleared');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Habit Tracker</Text>
              <Text style={styles.settingValue}>Version {version}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Features</Text>
              <Text style={styles.settingDescription}>
                Track daily habits, monitor productivity with timers, and visualize your progress
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <View style={styles.card}>
          <TipItem
            icon="list"
            title="Create Habits"
            description="Add your daily habits with custom emojis and frequencies"
          />
          <View style={styles.divider} />
          <TipItem
            icon="checkmark-circle"
            title="Check In Daily"
            description="Mark habits as complete each day to build your streak"
          />
          <View style={styles.divider} />
          <TipItem
            icon="timer"
            title="Track Productivity"
            description="Use the focus timer to track your productive work sessions"
          />
          <View style={styles.divider} />
          <TipItem
            icon="home"
            title="View Dashboard"
            description="Check your daily overview and progress on the home screen"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips for Success</Text>
        <View style={styles.card}>
          <TipItem
            icon="bulb"
            title="Start Small"
            description="Begin with 2-3 habits to avoid overwhelm"
          />
          <View style={styles.divider} />
          <TipItem
            icon="flame"
            title="Build Streaks"
            description="Consistent daily check-ins help you build momentum"
          />
          <View style={styles.divider} />
          <TipItem
            icon="moon"
            title="Use Pomodoro"
            description="Focus sessions help maintain concentration on tasks"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <Text style={styles.warningText}>
            All data is stored locally on your device. Back up your data before clearing.
          </Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
          >
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with care for productivity</Text>
      </View>
    </ScrollView>
  );
}

function TipItem({ icon, title, description }) {
  return (
    <View style={styles.tipRow}>
      <View style={styles.tipIcon}>
        <Ionicons name={icon} size={24} color="#6366f1" />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  tipRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  tipDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
