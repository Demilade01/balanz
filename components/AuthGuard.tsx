import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      } finally {
        setIsReady(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isReady || loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'mono-test' || segments[0] === 'connect-bank';
    const inUnauthGroup = segments[0] === 'signin' || segments[0] === 'signup' || segments[0] === 'otp' || segments[0] === 'verification-success';

    console.log('Auth Guard Check:', {
      isAuthenticated,
      hasSeenOnboarding,
      segments,
      inAuthGroup,
      inUnauthGroup,
    });

    if (!hasSeenOnboarding) {
      // User hasn't seen onboarding yet
      if (segments[0] !== 'onboarding') {
        router.replace('/onboarding');
      }
    } else if (isAuthenticated) {
      // User is authenticated
      if (!inAuthGroup && !inUnauthGroup) {
        // If not in any protected route, go to main app
        router.replace('/(tabs)/HomeScreen');
      }
    } else {
      // User is not authenticated
      if (inAuthGroup) {
        // User is trying to access protected route without auth
        router.replace('/signin');
      } else if (segments[0] !== 'signin' && segments[0] !== 'signup' && segments[0] !== 'onboarding') {
        // Redirect to sign in if not in auth flow
        router.replace('/signin');
      }
    }
  }, [isAuthenticated, hasSeenOnboarding, segments, isReady, loading]);

  if (!isReady || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
