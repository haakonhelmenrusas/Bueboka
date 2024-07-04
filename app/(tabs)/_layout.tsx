import { Platform } from 'react-native';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#053546',
        tabBarInactiveTintColor: 'grey',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        },
      }}>
      <Tabs.Screen
        name="siktemerker"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faBullseye} color={focused ? '#053546' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Siktemerker',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 8 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faUser} color={focused ? '#053546' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 8 },
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faCircleQuestion} color={focused ? '#053546' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 8 },
        }}
      />
    </Tabs>
  );
}
