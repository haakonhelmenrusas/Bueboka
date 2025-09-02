import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faUser as userSolid } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { faCircleQuestion as questionSolid } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons/faCircleQuestion';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 56 + (Platform.OS === 'android' ? insets.bottom : 8),
          paddingBottom: Math.max(insets.bottom, 8),
        },
      }}>
      <Tabs.Screen
        name="training"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faBullseye} color={focused ? colors.primary : colors.inactive} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Trening',
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
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon icon={focused ? userSolid : faUser} color={focused ? colors.primary : colors.inactive} />
          ),
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarLabelStyle: { fontSize: 14 },
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon icon={focused ? questionSolid : faCircleQuestion} color={focused ? colors.primary : colors.inactive} />
          ),
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14 },
        }}
      />
    </Tabs>
  );
}
