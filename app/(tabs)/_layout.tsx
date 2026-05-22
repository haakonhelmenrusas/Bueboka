import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors';
import { View, ActivityIndicator } from 'react-native';
import { OfflineBanner } from '@/components/common';
import { useAuth } from '@/hooks';
import { Redirect } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import FloatingTabBar from '@/components/common/FloatingTabBar/FloatingTabBar';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const parentNavigation = useNavigation();

  // Block navigating back to auth/intro screens via Android back button or iOS gesture,
  // but allow programmatic redirects (e.g. logout → /auth)
  useEffect(() => {
    return parentNavigation.addListener('beforeRemove', (e) => {
      if (isAuthenticated) {
        e.preventDefault();
      }
    });
  }, [parentNavigation, isAuthenticated]);

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
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faHome} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="aktivitet"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faBullseye} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="sightMarks"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faChartLine} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faGear} size={24} color={focused ? colors.white : 'rgba(255, 255, 255, 0.5)'} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
