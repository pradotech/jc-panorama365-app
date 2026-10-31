import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface Props {
  title: string;
  icon?: LucideIcon;
  accentColor?: string;
  right?: ReactNode;
}

export function SectionHeader({ title, icon: Icon, accentColor = '#1E56A0', right }: Props) {
  return (
    <View className="mb-3 flex-row items-center justify-between border-b border-navy-100 pb-2">
      <View className="flex-row items-center gap-2">
        <View className="h-5 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
        {Icon ? <Icon size={18} color={accentColor} /> : null}
        <Text className="text-lg font-bold tracking-tight text-navy-950">{title}</Text>
      </View>
      {right}
    </View>
  );
}

