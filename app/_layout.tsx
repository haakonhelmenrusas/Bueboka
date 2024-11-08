import { Stack } from 'expo-router';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://310ad5a856229859c003cf549b110334@o4505578901929984.ingest.us.sentry.io/4508262003048448',
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
