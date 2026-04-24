import { StatusBar } from 'expo-status-bar';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import * as Clarity from '@microsoft/react-native-clarity';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts';
import { useAuth } from '@/hooks';
import { colors } from '@/styles/colors';
import { VersionService } from '@/services';
import { UpdateRequired } from '@/components/common';

let navigationIntegration: any = null;

const appEnv = process.env.EXPO_PUBLIC_APP_ENV || 'development';
const isNonDev = appEnv !== 'development';

if (isNonDev) {
  navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
  });

  Sentry.init({
    dsn: 'https://310ad5a856229859c003cf549b110334@o4505578901929984.ingest.us.sentry.io/4508262003048448',
    environment: appEnv, // 'preview' | 'production'
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

function RootLayoutContent() {
  const ref = useNavigationContainerRef();
  const { isAuthenticated } = useAuth();
  const [updateCheck, setUpdateCheck] = useState<{
    checked: boolean;
    updateRequired: boolean;
    message: string;
    storeUrl: string;
  }>({
    checked: false,
    updateRequired: false,
    message: '',
    storeUrl: '',
  });

  // Check version on app launch
  useEffect(() => {
    async function checkAppVersion() {
      const result = await VersionService.checkVersion();
      setUpdateCheck({
        checked: true,
        updateRequired: result.updateRequired,
        message: result.message,
        storeUrl: result.storeUrl,
      });

      // Log version info to Sentry for debugging
      if (isNonDev) {
        Sentry.addBreadcrumb({
          category: 'version',
          message: 'Version check completed',
          level: 'info',
          data: {
            currentVersion: VersionService.getCurrentVersion(),
            buildNumber: VersionService.getCurrentBuildNumber(),
            updateRequired: result.updateRequired,
            updateAvailable: result.updateAvailable,
          },
        });
      }
    }
    checkAppVersion();
  }, []);

  useEffect(() => {
    if (ref?.current && navigationIntegration) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  // Show update screen if update is required
  if (updateCheck.checked && updateCheck.updateRequired) {
    return <UpdateRequired message={updateCheck.message} storeUrl={updateCheck.storeUrl} />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" options={{ contentStyle: { backgroundColor: colors.primary } }} />
        ) : (
          <Stack.Screen name="auth" />
        )}
      </Stack>
    </>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

export default isNonDev ? Sentry.wrap(RootLayout) : RootLayout;
