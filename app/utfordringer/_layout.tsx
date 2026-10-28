import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function UtfordringerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primary },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="ny"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="[id]/submit"
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
