import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { storageService } from '@/src/utils/storageService';

export default function FeaturesScreen() {
  const router = useRouter();

  const features = [
    {
      id: 1,
      icon: '📋',
      title: 'Habit Management',
      description: 'Create, track, and manage habits with customizable goals and frequencies.',
      details: ['Daily/Weekly/Monthly tracking', 'Streak counter', 'Progress visualization'],
    },
    {
      id: 2,
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'View detailed statistics and trends of your habit progress over time.',
      details: ['Completion rates', 'Streaks & milestones', 'Weekly/Monthly reports'],
    },
    {
      id: 3,
      icon: '⏱️',
      title: 'Productivity Timer',
      description: 'Pomodoro-style timer to boost focus and productivity during work sessions.',
      details: ['Customizable intervals', 'Break reminders', 'Session history'],
    },
    {
      id: 4,
      icon: '🧩',
      title: 'Daily Puzzles',
      description: 'Challenge your mind with daily puzzles while building productive habits.',
      details: ['Varied puzzle types', 'Daily challenges', 'Leaderboard'],
    },
    {
      id: 5,
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Get timely notifications to stay on track with your habits.',
      details: ['Customizable alerts', 'Time-based reminders', 'Smart suggestions'],
    },
    {
      id: 6,
      icon: '🎨',
      title: 'Personalization',
      description: 'Customize themes, colors, and settings to match your preferences.',
      details: ['Dark/Light mode', 'Custom colors', 'Layout options'],
    },
  ];

  const handleStartJourney = () => {
    storageService.setItem('hasSeenIntro', 'true').catch(e => console.error(e));
    router.push('/(auth)/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Features</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Features List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Discover What You Can Do</Text>

        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureTitle}>
                <Text style={styles.title}>{feature.title}</Text>
                <Text style={styles.description}>{feature.description}</Text>
              </View>
            </View>

            <View style={styles.detailsList}>
              {feature.details.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartJourney}
        >
          <Text style={styles.buttonText}>Start Your Journey</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  featureTitle: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  detailsList: {
    marginLeft: 44,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
