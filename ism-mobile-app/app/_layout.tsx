import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginState = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log(userToken);
      if (userToken) {
        setInitialRoute("(tabs)");
      } else {
        setInitialRoute("login");
      }
    };

    checkLoginState();
  }, []);

  useEffect(() => {
    if (loaded && initialRoute !== null) {
      SplashScreen.hideAsync();
      router.replace({ pathname: "/login" });
    }
  }, [loaded, initialRoute]);

  if (!loaded || initialRoute === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
