import { faChartBar } from '@fortawesome/free-regular-svg-icons/faChartBar';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import Logo from '../../assets/images/Icon_Bow.png';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="siktemerker"
        options={{
          tabBarIcon: () => <FontAwesomeIcon size={24} icon={faChartBar} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Siktemerker',
          tabBarLabelStyle: {
            color: 'white',
            marginBottom: 8,
          },
          tabBarStyle: {
            ...styles.page,
          },
        }}
      />
      <Tabs.Screen
        name="bueskyting"
        options={{
          tabBarIcon: () => <FontAwesomeIcon size={24} icon={faCircleXmark} />,
          headerShadowVisible: false,
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarLabel: 'Bueskyting',
          tabBarLabelStyle: {
            color: 'white',
            marginBottom: 8,
          },
          tabBarStyle: {
            ...styles.page,
          },
        }}
      />
      <Tabs.Screen
        name="omOss"
        options={{
          tabBarIcon: () => {
            return (
              <Image
                source={Logo}
                style={{
                  width: 56,
                  height: 56,
                }}
              />
            );
          },
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: 'Om oss',
          tabBarLabelStyle: {
            color: 'white',
            marginBottom: 8,
          },
          tabBarStyle: {
            ...styles.page,
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  page: {
    height: 64,
  },
});
