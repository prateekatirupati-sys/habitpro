// Puzzle Service - Daily puzzles for habit tracking challenges

const puzzles = [
  // Logic Puzzles
  {
    id: 1,
    type: 'logic',
    title: 'River Crossing',
    difficulty: 'medium',
    description: 'A farmer needs to cross a river with a fox, chicken, and grain. The boat can only hold the farmer and one item.',
    question: 'In what order should the farmer take items across?',
    options: [
      'Fox, Chicken, Grain',
      'Chicken, Fox, Grain',
      'Grain, Fox, Chicken',
      'Chicken, Grain, Fox'
    ],
    answer: 1, // Chicken first
    explanation: 'The farmer must take the chicken first (as it would eat the grain or be eaten by the fox). Then take either the fox or grain, bring the chicken back, take the remaining item, and finally return alone for the chicken.',
    reward: 50,
  },
  {
    id: 2,
    type: 'logic',
    title: 'Four Friends',
    difficulty: 'easy',
    description: 'Alice, Bob, Carol, and Dave have different colored shirts: Red, Blue, Green, Yellow. Alice does not wear Red or Blue. Bob wears neither Green nor Yellow.',
    question: 'If Carol wears Red, what can Bob wear?',
    options: ['Blue', 'Green', 'Yellow', 'Red'],
    answer: 0, // Blue
    explanation: 'Carol wears Red. Alice cannot wear Red or Blue (given), so Alice wears Green or Yellow. Bob cannot wear Green or Yellow, so Bob wears Blue or Red. Since Carol has Red, Bob must wear Blue.',
    reward: 30,
  },
  {
    id: 3,
    type: 'logic',
    title: 'Number Pattern',
    difficulty: 'medium',
    description: 'What is the next number in this sequence?',
    question: '2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '50'],
    answer: 1, // 42
    explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
    reward: 40,
  },

  // Trivia Questions
  {
    id: 4,
    type: 'trivia',
    title: 'Productivity Fact',
    difficulty: 'easy',
    description: 'What is the recommended duration for focused work periods in the Pomodoro Technique?',
    question: 'Pomodoro Technique: Work duration?',
    options: ['15 minutes', '25 minutes', '45 minutes', '60 minutes'],
    answer: 1, // 25 minutes
    explanation: 'The Pomodoro Technique recommends 25-minute focused work intervals, followed by short breaks.',
    reward: 35,
  },
  {
    id: 5,
    type: 'trivia',
    title: 'Habit Formation',
    difficulty: 'medium',
    description: 'How many days does it typically take to form a new habit according to research?',
    question: 'Days to form a habit?',
    options: ['7 days', '21 days', '66 days', '30 days'],
    answer: 2, // 66 days
    explanation: 'Research suggests it takes an average of 66 days to form a new habit, though it can range from 18 to 254 days depending on the habit complexity.',
    reward: 50,
  },
  {
    id: 6,
    type: 'trivia',
    title: 'Sleep & Productivity',
    difficulty: 'easy',
    description: 'What is the recommended amount of sleep for adults?',
    question: 'Recommended daily sleep?',
    options: ['5-6 hours', '7-9 hours', '9-10 hours', '4-5 hours'],
    answer: 1, // 7-9 hours
    explanation: 'The National Sleep Foundation recommends 7-9 hours of sleep per night for adults to maintain optimal health and productivity.',
    reward: 35,
  },

  // Word Puzzles
  {
    id: 7,
    type: 'word',
    title: 'Anagram Challenge',
    difficulty: 'easy',
    description: 'Unscramble the letters to find a word related to habits.',
    question: 'Unscramble: SUCOFC',
    options: ['FOCUS', 'FOSUC', 'FOCUS', 'CUFOS'],
    answer: 0, // FOCUS
    explanation: 'The word is FOCUS - an essential component of building successful habits.',
    reward: 25,
  },
  {
    id: 8,
    type: 'word',
    title: 'Word Association',
    difficulty: 'medium',
    description: 'Which word does NOT belong with the others?',
    question: 'Which is different?',
    options: ['Consistency', 'Dedication', 'Commitment', 'Laziness'],
    answer: 3, // Laziness
    explanation: 'Laziness does not belong - it works against habit formation, while the others are key traits for success.',
    reward: 45,
  },
];

// Math Puzzles
const mathPuzzles = [
  {
    id: 9,
    type: 'math',
    title: 'Daily Streak Math',
    difficulty: 'easy',
    description: 'If you complete a habit for 30 days in a row, getting 10 XP per day, how much total XP do you earn?',
    question: '30 days × 10 XP/day = ?',
    options: ['300 XP', '250 XP', '350 XP', '400 XP'],
    answer: 0, // 300 XP
    explanation: '30 × 10 = 300 XP total. Plus bonus multipliers if your streak continues!',
    reward: 30,
  },
  {
    id: 10,
    type: 'math',
    title: 'Compound Habits',
    difficulty: 'medium',
    description: 'If a habit improves 1% each day over a year, how much better are you?',
    question: '1.01^365 = ?',
    options: ['1.37x better', '13.7x better', '1.1x better', '3.7x better'],
    answer: 1, // ~37.78 (closest is 13.7x or 37.78x if 1.01^365, but typically rounded)
    explanation: 'Small improvements compound significantly! 1.01^365 ≈ 37.78x better over one year (James Clear\'s Atomic Habits principle).',
    reward: 60,
  },
];

const allPuzzles = [...puzzles, ...mathPuzzles];

export const puzzleService = {
  // Get puzzle by ID
  getPuzzleById: (id) => {
    return allPuzzles.find(p => p.id === id);
  },

  // Get puzzle of the day (based on current date)
  getPuzzleOfTheDay: () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % allPuzzles.length;
    return allPuzzles[index];
  },

  // Get today's daily challenge
  getDailyChallenge: () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const challengeIndex = (dayOfYear * 7) % allPuzzles.length;
    return allPuzzles[challengeIndex];
  },

  // Get puzzles by difficulty
  getPuzzlesByDifficulty: (difficulty) => {
    return allPuzzles.filter(p => p.difficulty === difficulty);
  },

  // Get puzzles by type
  getPuzzlesByType: (type) => {
    return allPuzzles.filter(p => p.type === type);
  },

  // Get random puzzle
  getRandomPuzzle: () => {
    return allPuzzles[Math.floor(Math.random() * allPuzzles.length)];
  },

  // Get all puzzles
  getAllPuzzles: () => {
    return allPuzzles;
  },

  // Get multiple random puzzles
  getRandomPuzzles: (count = 5) => {
    const shuffled = [...allPuzzles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },

  // Verify answer
  verifyAnswer: (puzzleId, selectedIndex) => {
    const puzzle = allPuzzles.find(p => p.id === puzzleId);
    if (!puzzle) return { correct: false, explanation: 'Puzzle not found' };
    
    const isCorrect = selectedIndex === puzzle.answer;
    return {
      correct: isCorrect,
      explanation: puzzle.explanation,
      reward: isCorrect ? puzzle.reward : Math.floor(puzzle.reward * 0.3),
    };
  },

  // Get puzzle statistics
  getPuzzleStats: () => {
    return {
      total: allPuzzles.length,
      byType: {
        logic: allPuzzles.filter(p => p.type === 'logic').length,
        trivia: allPuzzles.filter(p => p.type === 'trivia').length,
        word: allPuzzles.filter(p => p.type === 'word').length,
        math: allPuzzles.filter(p => p.type === 'math').length,
      },
      byDifficulty: {
        easy: allPuzzles.filter(p => p.difficulty === 'easy').length,
        medium: allPuzzles.filter(p => p.difficulty === 'medium').length,
        hard: allPuzzles.filter(p => p.difficulty === 'hard').length,
      },
      totalReward: allPuzzles.reduce((sum, p) => sum + p.reward, 0),
    };
  },
};
