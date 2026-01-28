import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { storageService } from '@/src/utils/storageService';

export default function SignInScreen({ onSignInSuccess }: { onSignInSuccess: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign in with:', email);
      const user = await storageService.signIn(email, password);
      console.log('Sign in result:', user);
      if (user) {
        console.log('Calling onSignInSuccess callback with user:', user);
        onSignInSuccess(user);
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert('Error', error?.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign up with:', email);
      const user = await storageService.signUp(email, password);
      console.log('Sign up result:', user);
      if (user) {
        console.log('Calling onSignInSuccess callback with user:', user);
        onSignInSuccess(user);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error?.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const demoEmail = 'demo@example.com';
      const demoPassword = 'demo123';
      
      console.log('[Demo Login] Starting demo login...');
      
      // Try to sign in first
      let user = await storageService.signIn(demoEmail, demoPassword);
      console.log('[Demo Login] Sign in result:', user);
      
      // If user doesn't exist, create the demo account
      if (!user) {
        console.log('[Demo Login] Demo account not found, creating...');
        user = await storageService.signUp(demoEmail, demoPassword);
        console.log('[Demo Login] Sign up result:', user);
      }
      
      if (user) {
        console.log('[Demo Login] Login successful, calling onSignInSuccess');
        Alert.alert('Success!', 'Logged in as demo@example.com');
        onSignInSuccess(user);
      } else {
        console.log('[Demo Login] User is null after sign in/up');
        Alert.alert('Error', 'Failed to log in. Please try again.');
      }
    } catch (error: any) {
      console.error('[Demo Login] Error:', error);
      Alert.alert('Error', error?.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-done-circle" size={80} color="#6366f1" />
        <Text style={styles.title}>HabitPro</Text>
        <Text style={styles.subtitle}>Build Better Habits, One Day at a Time</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#6366f1" />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#6366f1" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={isSignUp ? handleSignUp : handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.demoButton}
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={styles.demoButtonText}>
            Try Demo Account
          </Text>
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleButton}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="trending-up" size={24} color="#6366f1" />
          <Text style={styles.featureText}>Track Progress</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="flame" size={24} color="#f59e0b" />
          <Text style={styles.featureText}>Build Streaks</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="star" size={24} color="#ec4899" />
          <Text style={styles.featureText}>Earn Rewards</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#c7d2fe',
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#059669',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleButton: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '600',
  },
});
