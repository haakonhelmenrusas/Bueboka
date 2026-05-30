import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'bueboka_onboarding_seen';
const CURRENT_VERSION = '2026-05-30';

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setHasSeenOnboarding(val === CURRENT_VERSION);
      setIsLoading(false);
    });
  }, []);

  const markAsSeen = () => {
    AsyncStorage.setItem(ONBOARDING_KEY, CURRENT_VERSION);
    setHasSeenOnboarding(true);
  };

  return { hasSeenOnboarding, isLoading, markAsSeen };
}
