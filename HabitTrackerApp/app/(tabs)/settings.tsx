import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { storageService } from '@/src/utils/storageService';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all habits, logs, and user data. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              await storageService.resetAllData();
              Alert.alert('Success', 'All data has been cleared', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/(auth)');
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color="#6366f1" />
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="notifications" size={24} color="#6366f1" />
            <View style={styles.settingTextContent}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get habit reminders</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e5e7eb', true: '#a78bfa' }}
            thumbColor={notifications ? '#6366f1' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="moon" size={24} color="#6366f1" />
            <View style={styles.settingTextContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Easier on the eyes</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e5e7eb', true: '#a78bfa' }}
            thumbColor={darkMode ? '#6366f1' : '#9ca3af'}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>

        <TouchableOpacity style={styles.infoItem}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoItem}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2026.01</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Danger Zone</Text>

        <TouchableOpacity
          style={[styles.dangerButton, { marginBottom: 0 }]}
          onPress={handleResetData}
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text style={styles.dangerButtonText}>Reset All Data</Text>
        </TouchableOpacity>

        <Text style={styles.warningText}>
          This will delete all your habits, logs, and user data. This action cannot be undone.
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContent: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fee2e2',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    lineHeight: 18,
  },
  spacing: {
    height: 40,
  },
});
