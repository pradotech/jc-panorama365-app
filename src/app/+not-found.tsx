import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View className="flex-1 items-center justify-center bg-surface p-6">
        <Text className="text-base font-semibold text-navy-700">Esta página não existe.</Text>
        <Link href="/" className="mt-4 text-sm font-semibold text-accent-500">
          Voltar ao início
        </Link>
      </View>
    </>
  );
}

