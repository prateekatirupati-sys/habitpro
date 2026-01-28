import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '../utils/storageService';

const EMOJIS = ['⚽', '💪', '📚', '🧘', '🏃', '🎵', '🎨', '📖', '💼', '🍎'];
const FREQUENCIES = ['Daily', 'Weekly', 'Twice a week'];

export default function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '✓',
    frequency: 'Daily',
  });

  useEffect(() => {
    loadHabits();
    const interval = setInterval(loadHabits, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadHabits = async () => {
    const allHabits = await storageService.getHabits();
    const habitsWithStats = await Promise.all(
      allHabits.map(async (habit) => ({
        ...habit,
        streak: await storageService.getHabitStreak(habit.id),
      }))
    );
    setHabits(habitsWithStats);
  };

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    await storageService.addHabit({
      name: newHabit.name,
      emoji: newHabit.emoji,
      frequency: newHabit.frequency,
    });

    setNewHabit({ name: '', emoji: '✓', frequency: 'Daily' });
    setModalVisible(false);
    loadHabits();
  };

  const handleDeleteHabit = (id) => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await storageService.deleteHabit(id);
          loadHabits();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={handleDeleteHabit}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="list" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first habit to get started
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Habit</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning Exercise"
              value={newHabit.name}
              onChangeText={(text) =>
                setNewHabit({ ...newHabit, name: text })
              }
            />

            <Text style={styles.label}>Select Emoji</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    newHabit.emoji === emoji && styles.emojiButtonActive,
                  ]}
                  onPress={() => setNewHabit({ ...newHabit, emoji })}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    newHabit.frequency === freq &&
                      styles.frequencyButtonActive,
                  ]}
                  onPress={() =>
                    setNewHabit({ ...newHabit, frequency: freq })
                  }
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      newHabit.frequency === freq &&
                        styles.frequencyTextActive,
                    ]}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleAddHabit}
            >
              <Text style={styles.createButtonText}>Create Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function HabitCard({ habit, onDelete }) {
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
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <View>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.frequency}>{habit.frequency}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onDelete(habit.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={16} color="#f59e0b" />
          <Text style={styles.statText}>
            {habit.streak} day{habit.streak !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleted && styles.completeButtonActive,
          ]}
          onPress={toggleCompletion}
          disabled={isCompleted}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={isCompleted ? '#10b981' : '#d1d5db'}
          />
          <Text
            style={[
              styles.completeButtonText,
              isCompleted && styles.completeButtonTextActive,
            ]}
          >
            {isCompleted ? 'Done' : 'Check In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  emoji: {
    fontSize: 32,
  },
  frequencyContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  frequencyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  frequencyTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#f0fdf4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  frequency: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  completeButtonActive: {
    backgroundColor: '#dcfce7',
  },
  completeButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  completeButtonTextActive: {
    color: '#10b981',
  },
});
