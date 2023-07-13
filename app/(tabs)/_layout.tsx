import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="siktemerker"
        options={{
          headerShadowVisible: false,
          title: 'Siktemerker',
        }}
      />
      <Tabs.Screen
        name="bueskyting"
        options={{
          headerShadowVisible: false,
          title: 'Bueskyting',
        }}
      />
      <Tabs.Screen
        name="omOss"
        options={{
          headerShadowVisible: false,
          title: 'Om oss',
        }}
      />
    </Tabs>
  );
}
