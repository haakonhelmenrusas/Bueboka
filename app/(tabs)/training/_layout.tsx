import { Stack } from 'expo-router';
import { colors } from '@/styles/colors';

const Layout = () => {
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
          title: 'Treninger',
          headerShown: false, // Hide header for main training screen since it has its own title
        }}
      />
      <Stack.Screen
        name="shooting/index"
        options={{
          title: 'Skyteøkt',
          headerBackTitle: 'Tilbake',
        }}
      />
    </Stack>
  );
};

export default Layout;
