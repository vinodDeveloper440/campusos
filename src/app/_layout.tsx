
import '../../global.css';

import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <AnimatedSplashOverlay />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboardingScreen" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="student" />
          <Stack.Screen name="parent" />
          <Stack.Screen name="faculty" />
          <Stack.Screen name="hod" />
          <Stack.Screen name="principal" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
