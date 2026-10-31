import '../../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { ColumnistsProvider } from '@/context/ColumnistsContext';
import { NewsProvider } from '@/context/NewsContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

function RootNavigator() {
  usePushNotifications();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.navy950,
        headerTitleStyle: { fontWeight: '700' },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="noticia/[slug]" options={{ title: '' }} />
      <Stack.Screen name="categoria/[slug]" options={{ title: '' }} />
      <Stack.Screen name="colunista/[id]" options={{ title: 'Colunista' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ColumnistsProvider>
        <NewsProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </NewsProvider>
      </ColumnistsProvider>
    </SafeAreaProvider>
  );
}

