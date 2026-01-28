import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '@/src/utils/storageService';

export default function WelcomeScreen() {
  const router = useRouter();

  const highlights = [
    { icon: '✨', text: 'Track habits daily' },
    { icon: '📈', text: 'Visualize progress' },
    { icon: '🎯', text: 'Achieve your goals' },
    { icon: '🏆', text: 'Build streaks' },
  ];

  const handleNavigate = (path: string) => {
    console.log('Navigating to:', path);
    if (path === '/(auth)/signin') {
      storageService.setItem('hasSeenIntro', 'true').catch(e => console.error(e));
    }
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logo}>📊</Text>
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>HabitTracker</Text>
          <Text style={styles.subtitle}>
            Transform Your Life, One Habit at a Time
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Track daily habits, boost productivity, and achieve your goals with intelligent
            habit tracking and productivity tools.
          </Text>

          {/* Highlights */}
          <View style={styles.highlightsContainer}>
            {highlights.map((item, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>{item.icon}</Text>
                <Text style={styles.highlightText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Habits Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => handleNavigate('/(auth)/signin')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => handleNavigate('/(auth)/features')}
        >
          <Text style={styles.secondaryButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  highlightsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightIcon: {
    fontSize: 20,
  },
  highlightText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: 'white',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});
