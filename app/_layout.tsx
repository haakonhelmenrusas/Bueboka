import { StatusBar } from 'expo-status-bar';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as Sentry from '@/services/sentryStub';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts';
import { colors } from '@/styles/colors';
import { VersionService } from '@/services';
import { UpdateRequired } from '@/components/common';

let navigationIntegration: any = null;

const appEnv = process.env.EXPO_PUBLIC_APP_ENV || 'development';
const isNonDev = appEnv !== 'development';

/*if (isNonDev) {
  navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: false,
  });

  Sentry.init({
    dsn: 'https://310ad5a856229859c003cf549b110334@o4505578901929984.ingest.us.sentry.io/4508262003048448',
    environment: appEnv, // 'preview' | 'production'
    tracesSampleRate: 0.2,
    integrations: [navigationIntegration],
    // enableNativeFramesTracking is disabled — it requires a native module call
    // at startup and can cause a hard native crash on iOS with RN New Architecture.
  });
}*/

function RootLayoutContent() {
  const ref = useNavigationContainerRef();
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
      /*      if (isNonDev) {
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
      }*/
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
        <Stack.Screen name="intro" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" options={{ contentStyle: { backgroundColor: colors.primary } }} />
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

export default RootLayout;
//export default isNonDev ? Sentry.wrap(RootLayout) : RootLayout;
