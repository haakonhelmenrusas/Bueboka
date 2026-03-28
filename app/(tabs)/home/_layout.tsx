import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.primary } }} />;
}
