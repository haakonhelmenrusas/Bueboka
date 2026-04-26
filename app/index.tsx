import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks';
import { INTRO_SEEN_KEY } from './intro';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(INTRO_SEEN_KEY).then((val) => {
      setHasSeenIntro(val === 'true');
    });
  }, []);

  // Wait for both auth check and AsyncStorage read to complete
  if (isLoading || hasSeenIntro === null) return null;

  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;

  // First-time visitor — show the intro screen
  if (!hasSeenIntro) return <Redirect href="/intro" />;

  // Returning visitor who has an account — go straight to auth
  return <Redirect href="/auth" />;
}
