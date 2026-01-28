import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { storageService } from '@/src/utils/storageService';
import WelcomeScreen from './welcome';
import SignInScreen from './signin';
import IntroScreen from './intro';

export default function AuthIndex() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const intro = await storageService.getItem('hasSeenIntro');
      const user = await storageService.getCurrentUser();
      
      console.log('[Auth Index] hasSeenIntro:', intro);
      console.log('[Auth Index] currentUser:', user);
      
      setHasSeenIntro(intro === 'true');
      setCurrentUser(user);
      
      // If user is already logged in, navigate to tabs
      if (user) {
        console.log('[Auth Index] User already logged in, navigating to home');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSuccess = async (user) => {
    console.log('Sign in successful, user:', user);
    setCurrentUser(user);
    // Navigate to tabs after successful sign in
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Show intro if user hasn't seen intro
  if (!hasSeenIntro) {
    return <IntroScreen />;
  }

  // Show signin otherwise
  return <SignInScreen onSignInSuccess={handleSignInSuccess} />;
}
