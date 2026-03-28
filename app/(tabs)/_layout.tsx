import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors';
import { Platform, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OfflineBanner } from '@/components/common';
import { useAuth } from '@/hooks';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 70 + insets.bottom : 56 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : Math.max(insets.bottom, 8),
            paddingTop: Platform.OS === 'ios' ? 8 : 0,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faHome} color={focused ? colors.primary : colors.inactive} />,
            headerShadowVisible: false,
            headerShown: false,
            tabBarLabel: 'Hjem',
            tabBarLabelStyle: { fontSize: 14 },
          }}
        />
        <Tabs.Screen
          name="aktivitet"
          options={{
            tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faBullseye} color={focused ? colors.primary : colors.inactive} />,
            headerShadowVisible: false,
            headerShown: false,
            tabBarLabel: 'Aktivitet',
            tabBarLabelStyle: { fontSize: 14 },
          }}
        />
        <Tabs.Screen
          name="sightMarks"
          options={{
            tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faChartLine} color={focused ? colors.primary : colors.inactive} />,
            headerShadowVisible: false,
            headerShown: false,
            tabBarLabel: 'Siktemerker',
            tabBarLabelStyle: { fontSize: 14 },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faGear} color={focused ? colors.primary : colors.inactive} />,
            headerShadowVisible: false,
            headerShown: false,
            tabBarLabel: 'Innstillinger',
            tabBarLabelStyle: { fontSize: 14 },
          }}
        />
        <Tabs.Screen
          name="skyttere"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
