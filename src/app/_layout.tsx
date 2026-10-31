import '../../global.css';

import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { Merriweather_700Bold } from '@expo-google-fonts/merriweather/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { colors } from '@/constants/theme';
import { ColumnistsProvider } from '@/context/ColumnistsContext';
import { NewsProvider } from '@/context/NewsContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  usePushNotifications();

  return (
    <Stack
      screenOptions={{
        // Mesmo cabeçalho do portal em todas as telas (com "voltar" fora da Home)
        header: ({ back }) => <AppHeader canGoBack={Boolean(back)} />,
        contentStyle: { backgroundColor: colors.surface },
      }}
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Merriweather_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ColumnistsProvider>
        <NewsProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </NewsProvider>
      </ColumnistsProvider>
    </SafeAreaProvider>
  );
}
