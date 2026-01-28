import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { storageService } from '@/src/utils/storageService';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = new Animated.Value(0);

  const slides = [
    {
      id: 1,
      title: 'Welcome to HabitTracker',
      subtitle: 'Build Better Habits, One Day at a Time',
      description: 'Transform your life by tracking habits that matter. Visualize your progress and stay motivated.',
      icon: '🎯',
      color: '#6366f1',
    },
    {
      id: 2,
      title: 'Track Your Habits',
      subtitle: 'Monitor Daily Progress',
      description: 'Create custom habits and track them daily. Get visual feedback on your consistency and streaks.',
      icon: '📊',
      color: '#8b5cf6',
    },
    {
      id: 3,
      title: 'Boost Productivity',
      subtitle: 'Stay Focused & Achieve More',
      description: 'Use productivity tools to manage your time effectively and accomplish your goals faster.',
      icon: '⚡',
      color: '#ec4899',
    },
    {
      id: 4,
      title: 'Puzzle Challenges',
      subtitle: 'Fun Brain Training',
      description: 'Take daily puzzles to keep your mind sharp while building productive habits.',
      icon: '🧩',
      color: '#f59e0b',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      storageService.setItem('hasSeenIntro', 'true').catch(e => console.error(e));
      router.push('/(auth)/signin');
    }
  };

  const handleSkip = () => {
    storageService.setItem('hasSeenIntro', 'true').catch(e => console.error(e));
    router.push('/(auth)/signin');
  };

  const slide = slides[currentSlide];
  const progress = (currentSlide + 1) / slides.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: slide.color }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentSlide ? '#fff' : 'rgba(255,255,255,0.3)',
                  width: index === currentSlide ? 30 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: 'white' }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: slide.color }]}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={slide.color} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 300ms ease',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
