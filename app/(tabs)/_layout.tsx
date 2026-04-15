import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors';
import { View, ActivityIndicator } from 'react-native';
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
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom + 16,
            height: 60,
            marginHorizontal: 16,
            backgroundColor: colors.primary,
            borderRadius: 30,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarIconStyle: {
            alignItems: 'center',
            height: 24,
            width: 24,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShadowVisible: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="aktivitet"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faBullseye} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShadowVisible: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="sightMarks"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faChartLine} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShadowVisible: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faGear} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShadowVisible: false,
            headerShown: false,
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
