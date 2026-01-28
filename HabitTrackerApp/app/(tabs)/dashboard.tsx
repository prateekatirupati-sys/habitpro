import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { storageService } from '@/src/utils/storageService';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    points: 0,
    level: 1,
    completionRate: 0,
  });

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    try {
      const currentUser = await storageService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const userStats = await storageService.getUserStats(currentUser.id) as typeof stats;
        setStats(userStats || stats);
      }
    } catch (error) {
      console.error('Error loading user and stats:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await storageService.logOut();
            router.replace('/(auth)');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Points & XP */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="star" size={24} color="#fbbf24" />
          <Text style={styles.cardTitle}>Points & Rewards</Text>
        </View>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsValue}>{stats.points}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(stats.points % 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>{stats.points % 100}/100 to next level</Text>
        </View>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color="#10b981" />
          <Text style={styles.statValue}>{stats.completedToday}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="pie-chart" size={32} color="#6366f1" />
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Rate</Text>
        </View>
      </View>

      {/* Daily Challenge */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={24} color="#ec4899" />
          <Text style={styles.cardTitle}>Daily Challenge</Text>
        </View>
        <View style={styles.challenge}>
          <Text style={styles.challengeTitle}>Complete 3 habits today</Text>
          <Text style={styles.challengeReward}>+50 XP</Text>
          <View style={styles.challengeProgress}>
            <View style={[styles.challengeFill, { width: `${(stats.completedToday / 3) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medal" size={24} color="#ec4899" />
          <Text style={styles.cardTitle}>Achievements</Text>
        </View>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievement}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text style={styles.achievementName}>Hot Streak</Text>
          </View>
          <View style={styles.achievement}>
            <Ionicons name="trophy" size={32} color="#fbbf24" />
            <Text style={styles.achievementName}>Champion</Text>
          </View>
          <View style={styles.achievement}>
            <Ionicons name="heart" size={32} color="#ec4899" />
            <Text style={styles.achievementName}>Dedication</Text>
          </View>
          <View style={styles.achievement}>
            <Ionicons name="star" size={32} color="#a78bfa" />
            <Text style={styles.achievementName}>Superstar</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 24,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 14,
    color: '#c7d2fe',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  levelBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  levelText: {
    fontWeight: '700',
    color: '#1f2937',
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
  pointsContainer: {
    alignItems: 'center',
  },
  pointsBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#6366f1',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  xpBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  xpText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  challenge: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  challengeReward: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    marginVertical: 8,
  },
  challengeProgress: {
    height: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  challengeFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievement: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
  spacing: {
    height: 40,
  },
});
