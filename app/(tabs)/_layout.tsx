import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="siktemerker"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faChartLine} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Siktemerker',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="bueskyting"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faBullseye} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Bueskyting',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
      <Tabs.Screen
        name="omOss"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faBars} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
    </Tabs>
  );
}
