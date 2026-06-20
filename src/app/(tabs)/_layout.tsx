import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Home, Settings } from 'lucide-react-native';
import { colors, textures } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          ...textures.bookmarkTab,
        },
        tabBarActiveTintColor: colors.leather,
        tabBarInactiveTintColor: colors.fadedInk,
        tabBarLabelStyle: {
          fontFamily: 'Lora-Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Collections',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.agedPaper,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
