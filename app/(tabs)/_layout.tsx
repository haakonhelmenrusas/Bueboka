import { faChartBar } from '@fortawesome/free-regular-svg-icons/faChartBar';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { faDragon } from '@fortawesome/free-solid-svg-icons/faDragon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="siktemerker"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faChartBar} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Siktemerker',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="bueskyting"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faDragon} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Bueskyting',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faUser} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
    </Tabs>
  );
}
