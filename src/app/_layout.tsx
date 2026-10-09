import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, SplashScreen, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from '@/state/wallet';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bgTop, primary: colors.mint, card: colors.bgTop },
};

const sheet = Platform.OS === 'ios' ? ('modal' as const) : ('card' as const);

export default function RootLayout() {
  // Inter is only used on Android/web; iOS uses SF Pro.
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <WalletProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bgTop }, animation: 'default' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="recharge" options={{ presentation: sheet }} />
            <Stack.Screen name="profile" options={{ presentation: sheet }} />
            <Stack.Screen name="premium" options={{ presentation: sheet }} />
          </Stack>
        </WalletProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
