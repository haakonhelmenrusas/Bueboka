import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function SkyttereLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.primary } }} />;
}
