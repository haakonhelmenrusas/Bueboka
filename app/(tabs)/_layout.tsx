import { faChartBar } from '@fortawesome/free-regular-svg-icons/faChartBar';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark';
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
          tabBarIcon: () => <FontAwesomeIcon icon={faCircleXmark} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Bueskyting',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="omOss"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faCircleXmark} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
    </Tabs>
  );
}
