import { faChartBar } from '@fortawesome/free-regular-svg-icons/faChartBar';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons/faCircleQuestion';
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
        name="omOss"
        options={{
          tabBarIcon: () => <FontAwesomeIcon icon={faCircleQuestion} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: { fontSize: 14, marginBottom: 4 },
        }}
      />
    </Tabs>
  );
}
