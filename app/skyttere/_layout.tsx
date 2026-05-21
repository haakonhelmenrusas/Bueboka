import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function SkyttereLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primary },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
