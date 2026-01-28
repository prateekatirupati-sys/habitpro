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
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '../utils/storageService';

const DURATIONS = [15, 25, 30, 45, 60, 90, 120];

export default function ProductivityScreen() {
  const [todayLog, setTodayLog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    loadTodayData();
    const interval = setInterval(loadTodayData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const loadTodayData = async () => {
    const data = await storageService.getTodayProductivity();
    setTodayLog(data);
  };

  const startTimer = async () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    setTimeLeft(selectedDuration * 60);
    setTimerActive(true);
    setModalVisible(false);
  };

  const completeTimer = async () => {
    setTimerActive(false);
    await storageService.logProductivity(taskName, selectedDuration);
    Alert.alert('Great!', `${taskName} completed for ${selectedDuration} minutes!`);
    setTaskName('');
    setSelectedDuration(25);
    loadTodayData();
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resumeTimer = () => {
    if (timeLeft > 0) {
      setTimerActive(true);
    }
  };

  const cancelTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
    setTaskName('');
    setSelectedDuration(25);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {timerActive ? (
          <LinearGradient
            colors={['#6366f1', '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.timerSection}
          >
            <Text style={styles.timerTask}>{taskName}</Text>
            <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={pauseTimer}
              >
                <Ionicons name="pause" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timerButton, styles.timerButtonDanger]}
                onPress={cancelTimer}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.startSection}>
            <Ionicons name="timer" size={80} color="#d1d5db" />
            <Text style={styles.startTitle}>Focus Timer</Text>
            <Text style={styles.startSubtitle}>
              Use the Pomodoro technique to boost productivity
            </Text>
          </View>
        )}

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today's Focus Time</Text>
            <Text style={styles.statValue}>
              {todayLog?.totalTime || 0} min
            </Text>
          </View>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>
              {todayLog?.logs.length || 0}
            </Text>
          </View>
        </View>

        {todayLog && todayLog.logs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Sessions</Text>
            </View>
            {todayLog.logs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color="#10b981"
                  />
                </View>
                <View style={styles.logInfo}>
                  <Text style={styles.logTaskName}>{log.task}</Text>
                  <Text style={styles.logTime}>
                    {`${log.duration} minutes ${String.fromCharCode(8226)} ${new Date(log.completedAt).toLocaleTimeString()}`}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {!timerActive && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.startButtonText}>Start Focus Session</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Focus Session</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Design mockups, Code review"
              value={taskName}
              onChangeText={setTaskName}
            />

            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationGrid}>
              {DURATIONS.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration &&
                      styles.durationButtonActive,
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === duration &&
                        styles.durationTextActive,
                    ]}
                  >
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.startSessionButton}
              onPress={startTimer}
            >
              <Text style={styles.startSessionButtonText}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  timerSection: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerTask: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  startSection: {
    alignItems: 'center',
    paddingVertical: 48,
    marginBottom: 16,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
  },
  startSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    paddingHorizontal: 12,
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366f1',
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logIconContainer: {
    marginRight: 16,
  },
  logInfo: {
    flex: 1,
  },
  logTaskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  logTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  durationTextActive: {
    color: '#6366f1',
  },
  startSessionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  startSessionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
