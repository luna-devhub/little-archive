import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useAuthStore } from '../stores/auth';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Lora-Regular': require('../../assets/fonts/Lora-Regular.ttf'),
    'Lora-Bold': require('../../assets/fonts/Lora-Bold.ttf'),
    'Lora-Italic': require('../../assets/fonts/Lora-Italic.ttf'),
  });

  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not signed in, redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Signed in, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.leather} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.parchment },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.parchment,
  },
});
