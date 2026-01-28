import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { puzzleService } from '@/src/utils/puzzleService';
import { storageService } from '@/src/utils/storageService';

export default function PuzzlesScreen() {
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadPuzzles();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await storageService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        const solved = await storageService.getUserSolvedPuzzles(user.id);
        setSolvedPuzzles(solved || []);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadPuzzles = () => {
    const allPuzzles = puzzleService.getAllPuzzles();
    setPuzzles(allPuzzles);
  };

  const isPuzzleSolved = (puzzleId) => {
    return solvedPuzzles.includes(puzzleId);
  };

  const getFilteredPuzzles = () => {
    if (filterType === 'all') return puzzles;
    return puzzles.filter(p => p.type === filterType);
  };

  const handleSelectPuzzle = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const verificationResult = puzzleService.verifyAnswer(
      selectedPuzzle.id,
      selectedAnswer
    );

    setIsCorrect(verificationResult.correct);
    setResult(verificationResult);
    setShowResult(true);

    if (verificationResult.correct && userId) {
      // Save solved puzzle
      saveSolvedPuzzle(selectedPuzzle.id, verificationResult.reward);
    }
  };

  const saveSolvedPuzzle = async (puzzleId, reward) => {
    try {
      const updated = [...solvedPuzzles, puzzleId];
      setSolvedPuzzles(updated);
      await storageService.saveUserSolvedPuzzles(userId, updated);
      
      // Add XP reward
      const user = await storageService.getCurrentUser();
      const updatedUser = {
        ...user,
        points: (user.points || 0) + reward,
      };
      await storageService.updateCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error saving puzzle:', error);
    }
  };

  const closePuzzle = () => {
    setSelectedPuzzle(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
  };

  const filteredPuzzles = getFilteredPuzzles();
  const puzzleStats = puzzleService.getPuzzleStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Puzzles</Text>
          <Text style={styles.subtitle}>Solve puzzles to earn XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{solvedPuzzles.length}</Text>
            <Text style={styles.statLabel}>Solved</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#6366f1" />
            <Text style={styles.statValue}>{puzzles.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={24} color="#ec4899" />
            <Text style={styles.statValue}>{puzzleStats.totalReward}</Text>
            <Text style={styles.statLabel}>Max XP</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {['logic', 'trivia', 'word', 'math'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filterType === type && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === type && styles.filterButtonTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Puzzles List */}
        <View style={styles.puzzlesContainer}>
          {filteredPuzzles.map((puzzle) => (
            <TouchableOpacity
              key={puzzle.id}
              style={[
                styles.puzzleCard,
                isPuzzleSolved(puzzle.id) && styles.puzzleCardSolved,
              ]}
              onPress={() => handleSelectPuzzle(puzzle)}
            >
              <View style={styles.puzzleCardHeader}>
                <View style={styles.puzzleTypeIcon}>
                  <Ionicons
                    name={
                      puzzle.type === 'logic'
                        ? 'git-network'
                        : puzzle.type === 'trivia'
                        ? 'book'
                        : puzzle.type === 'word'
                        ? 'text'
                        : 'calculator'
                    }
                    size={20}
                    color="#6366f1"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.puzzleTitle}>{puzzle.title}</Text>
                  <Text style={styles.puzzleType}>
                    {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        puzzle.difficulty === 'easy'
                          ? '#d1fae5'
                          : puzzle.difficulty === 'medium'
                          ? '#fef3c7'
                          : '#fee2e2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color:
                          puzzle.difficulty === 'easy'
                            ? '#047857'
                            : puzzle.difficulty === 'medium'
                            ? '#b45309'
                            : '#dc2626',
                      },
                    ]}
                  >
                    {puzzle.difficulty === 'easy'
                      ? 'Easy'
                      : puzzle.difficulty === 'medium'
                      ? 'Med'
                      : 'Hard'}
                  </Text>
                </View>
                {isPuzzleSolved(puzzle.id) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#10b981"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
              <Text style={styles.puzzleDescription} numberOfLines={2}>
                {puzzle.description}
              </Text>
              <View style={styles.puzzleFooter}>
                <View style={styles.rewardBadge}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.rewardText}>{puzzle.reward} XP</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacing} />
      </ScrollView>

      {/* Puzzle Modal */}
      <Modal
        visible={!!selectedPuzzle}
        transparent
        animationType="slide"
        onRequestClose={closePuzzle}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closePuzzle}>
              <Ionicons name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedPuzzle?.type.charAt(0).toUpperCase() +
                selectedPuzzle?.type.slice(1)}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedPuzzle && (
              <>
                {/* Difficulty and Reward */}
                <View style={styles.modalPuzzleHeader}>
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          selectedPuzzle.difficulty === 'easy'
                            ? '#d1fae5'
                            : selectedPuzzle.difficulty === 'medium'
                            ? '#fef3c7'
                            : '#fee2e2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        {
                          color:
                            selectedPuzzle.difficulty === 'easy'
                              ? '#047857'
                              : selectedPuzzle.difficulty === 'medium'
                              ? '#b45309'
                              : '#dc2626',
                        },
                      ]}
                    >
                      {selectedPuzzle.difficulty.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.rewardBadge}>
                    <Ionicons name="star" size={16} color="#f59e0b" />
                    <Text style={styles.rewardText}>{selectedPuzzle.reward} XP</Text>
                  </View>
                </View>

                <Text style={styles.puzzleTitle}>{selectedPuzzle.title}</Text>
                <Text style={styles.puzzleDescription}>
                  {selectedPuzzle.description}
                </Text>

                {/* Question */}
                <View style={styles.questionSection}>
                  <Text style={styles.questionText}>{selectedPuzzle.question}</Text>
                </View>

                {/* Options */}
                {!showResult ? (
                  <View style={styles.optionsContainer}>
                    {selectedPuzzle.options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionButton,
                          selectedAnswer === index && styles.optionButtonSelected,
                        ]}
                        onPress={() => setSelectedAnswer(index)}
                      >
                        <View
                          style={[
                            styles.optionCircle,
                            selectedAnswer === index && styles.optionCircleSelected,
                          ]}
                        >
                          {selectedAnswer === index && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.resultContainer,
                      isCorrect ? styles.resultCorrect : styles.resultIncorrect,
                    ]}
                  >
                    <Ionicons
                      name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={48}
                      color={isCorrect ? '#10b981' : '#ef4444'}
                    />
                    <Text style={styles.resultText}>
                      {isCorrect ? 'Correct!' : 'Not Quite!'}
                    </Text>
                    <Text style={styles.resultDescription}>
                      {result?.explanation}
                    </Text>
                    <View style={styles.resultReward}>
                      <Ionicons
                        name="star"
                        size={20}
                        color={isCorrect ? '#f59e0b' : '#9ca3af'}
                      />
                      <Text
                        style={[
                          styles.resultRewardText,
                          { color: isCorrect ? '#f59e0b' : '#9ca3af' },
                        ]}
                      >
                        {isCorrect ? result?.reward : 0} XP earned
                      </Text>
                    </View>
                  </View>
                )}

                {/* Submit/Close Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !showResult && selectedAnswer === null && styles.submitButtonDisabled,
                  ]}
                  onPress={showResult ? closePuzzle : handleSubmitAnswer}
                  disabled={!showResult && selectedAnswer === null}
                >
                  <Text style={styles.submitButtonText}>
                    {showResult ? 'Back to Puzzles' : 'Submit Answer'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  puzzlesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  puzzleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  puzzleCardSolved: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  puzzleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puzzleTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  puzzleType: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  puzzleDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  puzzleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fffbeb',
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
  },
  spacing: {
    height: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalPuzzleHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  questionSection: {
    backgroundColor: '#eef2ff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginVertical: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionCircleSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  optionText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
  },
  resultContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  resultCorrect: {
    backgroundColor: '#d1fae5',
  },
  resultIncorrect: {
    backgroundColor: '#fee2e2',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
  },
  resultDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  resultReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
    justifyContent: 'center',
  },
  resultRewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
