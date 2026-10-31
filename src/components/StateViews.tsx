import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View className="items-center px-8 py-16">
      <Text className="text-center font-inter-semibold text-base text-navy-500">{title}</Text>
      {description ? <Text className="mt-1 text-center font-inter text-sm text-navy-400">{description}</Text> : null}
    </View>
  );
}

