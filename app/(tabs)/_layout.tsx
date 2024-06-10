import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="siktemerker"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faChartBar} color={focused ? '#0066b2' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Siktemerker',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faUser} color={focused ? '#0066b2' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesomeIcon icon={faCircleQuestion} color={focused ? '#0066b2' : 'grey'} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
    </Tabs>
  );
}
