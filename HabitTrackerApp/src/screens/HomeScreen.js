import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '../utils/storageService';

const { width } = Dimensions.get('window');

export default function HomeScreen({ useFocusEffect }) {
  const [habits, setHabits] = useState([]);
  const [productivityData, setProductivityData] = useState(null);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const allHabits = await storageService.getHabits();
    setHabits(allHabits);

    let completedCount = 0;
    for (let habit of allHabits) {
      const isCompleted = await storageService.isHabitCompletedToday(habit.id);
      if (isCompleted) completedCount++;
    }
    setCompletedToday(completedCount);

    const productivity = await storageService.getTodayProductivity();
    setProductivityData(productivity);
  };

  const getAverageStreak = () => {
    if (habits.length === 0) return 0;
    return habits.reduce((sum) => sum + 1, 0) / habits.length;
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#4f46e5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Today's Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedToday}</Text>
            <Text style={styles.statLabel}>Habits Complete</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{productivityData?.totalTime || 0}</Text>
            <Text style={styles.statLabel}>Minutes Productive</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <Text style={styles.sectionSubtitle}>
            {completedToday} of {habits.length} completed
          </Text>
        </View>

        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onUpdate={loadData}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Add a habit to get started
            </Text>
          </View>
        )}

        {productivityData && productivityData.logs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Focus Sessions</Text>
            </View>
            {productivityData.logs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logContent}>
                  <Text style={styles.logTask}>{log.task}</Text>
                  <View style={styles.logDurationContainer}>
                    <Ionicons name="timer-outline" size={14} color="#6b7280" />
                    <Text style={styles.logDuration}>{log.duration} min</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function HabitItem({ habit, onUpdate }) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    checkCompletion();
  }, []);

  const checkCompletion = async () => {
    const completed = await storageService.isHabitCompletedToday(habit.id);
    setIsCompleted(completed);
  };

  const toggleCompletion = async () => {
    await storageService.logHabitCompletion(habit.id);
    setIsCompleted(true);
    onUpdate();
  };

  return (
    <View style={[styles.habitCard, isCompleted && styles.habitCardCompleted]}>
      <View style={styles.habitContent}>
        <View style={styles.habitIcon}>
          <Text style={styles.habitEmoji}>{habit.emoji || '✓'}</Text>
        </View>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitFrequency}>
            {habit.frequency || 'Daily'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.checkButton,
          isCompleted && styles.checkButtonCompleted,
        ]}
        onPress={toggleCompletion}
        disabled={isCompleted}
      >
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={32}
          color={isCompleted ? '#10b981' : '#d1d5db'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  habitCardCompleted: {
    backgroundColor: '#f0fdf4',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  habitFrequency: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  checkButton: {
    padding: 8,
  },
  checkButtonCompleted: {
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  logItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logContent: {
    flex: 1,
  },
  logTask: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  logDuration: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  logDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});
