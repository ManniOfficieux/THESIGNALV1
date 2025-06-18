import { Tabs } from 'expo-router';
import { Signal, Lock, Zap } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 107, // Réduit de 38px (1cm) depuis 145px
          paddingBottom: 47, // Réduit proportionnellement depuis 85px
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
        },
        tabBarActiveTintColor: '#00ff41',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontFamily: 'Courier New',
          fontSize: 10,
          letterSpacing: 1,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SIGNAL',
          tabBarIcon: ({ size, color }) => (
            <Signal size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="access"
        options={{
          title: 'ACCÈS',
          tabBarIcon: ({ size, color }) => (
            <Lock size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'RÉSEAU',
          tabBarIcon: ({ size, color }) => (
            <Zap size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}