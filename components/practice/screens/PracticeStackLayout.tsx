import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';

const Layout = () => {
  const t = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: t['practiceScreen.title'],
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
