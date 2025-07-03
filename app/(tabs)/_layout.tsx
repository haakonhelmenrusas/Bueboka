import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { colors } from '@/styles/colors';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 64,
        },
      }}>
      <Tabs.Screen
        name="training"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon icon={faBullseye} color={focused ? colors.primary : colors.inactive} />
          ),
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Trening',
          tabBarLabelStyle: { fontSize: 14 },
        }}
      />
      <Tabs.Screen
        name="sightMarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon icon={faBullseye} color={focused ? colors.primary : colors.inactive} />
          ),
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
            <FontAwesomeIcon icon={faUser} color={focused ? colors.primary : colors.inactive} />
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
            <FontAwesomeIcon icon={faCircleQuestion} color={focused ? colors.primary : colors.inactive} />
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
