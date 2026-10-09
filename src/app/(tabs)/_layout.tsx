import { Tabs } from 'expo-router/js-tabs';
import { TabBar } from '@/components/TabBar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bgTop } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="ticket" options={{ title: 'Passagem' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Carteira' }} />
      <Tabs.Screen name="settings" options={{ title: 'Conta' }} />
    </Tabs>
  );
}
