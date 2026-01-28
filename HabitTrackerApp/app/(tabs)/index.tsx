import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '@/src/utils/storageService';

const EMOJIS = ['⚽', '💪', '📚', '🧘', '🏃', '🎵', '🎨', '📖', '💼', '🍎'];
const FREQUENCIES = ['Daily', 'Weekly', 'Twice a week'];

export default function HomeScreen() {
  const [habits, setHabits] = useState([]);
  const [habitsCompletedToday, setHabitsCompletedToday] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '⚽',
    frequency: 'Daily',
  });

  useEffect(() => {
    loadHabits();
    const interval = setInterval(loadHabits, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadHabits = async () => {
    try {
      console.log('Loading habits...');
      const allHabits = await storageService.getHabits();
      console.log('Loaded habits:', allHabits);
      setHabits(allHabits);
      
      // Load completion status for each habit
      const completionStatus = {};
      for (const habit of allHabits) {
        const isCompleted = await storageService.isHabitCompletedToday(habit.id);
        completionStatus[habit.id] = isCompleted;
      }
      setHabitsCompletedToday(completionStatus);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const handleToggleHabitComplete = async (habitId) => {
    try {
      const isCurrentlyCompleted = habitsCompletedToday[habitId];
      
      if (!isCurrentlyCompleted) {
        await storageService.logHabitCompletion(habitId);
        setMessage('✅ Great job! Habit completed today!');
      } else {
        setMessage('Habit already marked as complete today');
      }
      
      setTimeout(() => setMessage(''), 2000);
      await loadHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
      setMessage('Error updating habit');
    }
  };

  const handleAddHabit = async () => {
    console.log('handleAddHabit called with:', newHabit);
    
    if (!newHabit.name.trim()) {
      setMessage('Please enter a habit name');
      return;
    }

    try {
      console.log('Adding habit:', newHabit);
      const result = await storageService.addHabit({
        name: newHabit.name,
        emoji: newHabit.emoji,
        frequency: newHabit.frequency,
      });
      console.log('Habit added:', result);

      setMessage('Habit added successfully!');
      setNewHabit({ name: '', emoji: '⚽', frequency: 'Daily' });
      setModalVisible(false);
      
      setTimeout(() => setMessage(''), 2000);
      await loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      setMessage('Failed to add habit: ' + error.message);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      console.log('Deleting habit:', id);
      await storageService.deleteHabit(id);
      setMessage('Habit deleted');
      setTimeout(() => setMessage(''), 2000);
      await loadHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      setMessage('Failed to delete habit');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Habits</Text>
      </View>

      {message && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {habits.length > 0 ? (
          habits.map((habit) => (
            <View key={habit.id} style={[styles.habitCard, habitsCompletedToday[habit.id] && styles.habitCardCompleted]}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <View style={styles.habitDetails}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitFrequency}>{habit.frequency}</Text>
                </View>
              </View>
              <View style={styles.habitActions}>
                <TouchableOpacity 
                  style={[styles.checkButton, habitsCompletedToday[habit.id] && styles.checkButtonCompleted]}
                  onPress={() => handleToggleHabitComplete(habit.id)}
                >
                  <Ionicons 
                    name={habitsCompletedToday[habit.id] ? "checkmark-circle" : "checkmark-circle-outline"} 
                    size={28} 
                    color={habitsCompletedToday[habit.id] ? "#10b981" : "#d1d5db"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteHabit(habit.id)}>
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="list" size={64} color="#d1d5db" />
            </View>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>Create your first habit to get started</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => {
        console.log('FAB clicked');
        setModalVisible(true);
      }}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Habit</Text>
              <TouchableOpacity onPress={() => {
                console.log('Close modal');
                setModalVisible(false);
              }}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <TextInput
                style={styles.input}
                placeholder="Habit name (e.g., Exercise)"
                placeholderTextColor="#999"
                value={newHabit.name}
                autoComplete="off"
                testID="habit-name-input"
                onChangeText={(text) => {
                  console.log('Name changed to:', text);
                  setNewHabit({ ...newHabit, name: text });
                }}
              />

              <Text style={styles.label}>Choose emoji:</Text>
              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[styles.emojiButton, newHabit.emoji === emoji && styles.selectedEmoji]}
                    onPress={() => {
                      console.log('Emoji selected:', emoji);
                      setNewHabit({ ...newHabit, emoji });
                    }}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Frequency:</Text>
              <View style={styles.frequencyButtons}>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[styles.frequencyButton, newHabit.frequency === freq && styles.selectedFrequency]}
                    onPress={() => {
                      console.log('Frequency selected:', freq);
                      setNewHabit({ ...newHabit, frequency: freq });
                    }}
                  >
                    <Text style={[styles.frequencyText, newHabit.frequency === freq && styles.selectedFrequencyText]}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => {
              console.log('Add button clicked');
              handleAddHabit();
            }}>
              <Text style={styles.addButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  messageBox: {
    backgroundColor: '#10b981',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  messageText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#6366f1',
    boxShadow: '0 4px 8px rgba(99, 102, 241, 0.12)',
    elevation: 4,
  },
  habitCardCompleted: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#10b981',
    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.15)',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  habitDetails: {
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkButton: {
    padding: 8,
  },
  checkButtonCompleted: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4b5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#9ca3af',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 6px 12px rgba(99, 102, 241, 0.4)',
    elevation: 12,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalScroll: {
    maxHeight: '70%',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 4,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 10,
  },
  emojiButton: {
    width: '19%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmoji: {
    backgroundColor: '#dbeafe',
    borderColor: '#6366f1',
  },
  emojiText: {
    fontSize: 32,
  },
  frequencyButtons: {
    gap: 10,
    marginBottom: 24,
  },
  frequencyButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedFrequency: {
    backgroundColor: '#dbeafe',
    borderColor: '#6366f1',
  },
  frequencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedFrequencyText: {
    color: '#6366f1',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
