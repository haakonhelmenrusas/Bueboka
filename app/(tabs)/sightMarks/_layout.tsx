import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function SightMarksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.primary } }} />
  );
}
