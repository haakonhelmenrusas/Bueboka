import { StatusBar } from 'react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import * as Clarity from '@microsoft/react-native-clarity';
import { isRunningInExpoGo } from 'expo';
import React, { useEffect } from 'react';

let navigationIntegration: any = null;

// Only initialize Sentry in production and not in Expo Go
if (process.env.NODE_ENV !== 'development' && !isRunningInExpoGo()) {
  navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
  });

  Sentry.init({
    dsn: 'https://310ad5a856229859c003cf549b110334@o4505578901929984.ingest.us.sentry.io/4508262003048448',
    tracesSampler: () => 1.0,
    integrations: [navigationIntegration],
    enableNativeFramesTracking: true,
  });

  // Initialize Clarity
  if (process.env.EXPO_PUBLIC_CLARITY_KEY) {
    Clarity.initialize(process.env.EXPO_PUBLIC_CLARITY_KEY, {
      logLevel: Clarity.LogLevel.Info,
    });
  }
}

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current && navigationIntegration) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Only wrap with Sentry if it's initialized
export default process.env.NODE_ENV !== 'development' && !isRunningInExpoGo() ? Sentry.wrap(RootLayout) : RootLayout;
