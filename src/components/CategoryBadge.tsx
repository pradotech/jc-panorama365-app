import { Text, View } from 'react-native';
import { getCategoryById } from '@/constants/categories';

type Size = 'sm' | 'md';

const SIZES: Record<Size, { container: string; text: string; icon: number }> = {
  sm: { container: 'px-2.5 py-1 gap-1', text: 'text-xs', icon: 12 },
  md: { container: 'px-3 py-1.5 gap-1.5', text: 'text-sm', icon: 14 },
};

/** Badge de categoria (pílula com ícone) — idêntico ao CategoryBadge do portal. */
export function CategoryBadge({ categoryId, size = 'sm' }: { categoryId: string; size?: Size }) {
  const cat = getCategoryById(categoryId);
  if (!cat) return null;
  const Icon = cat.icon;
  const s = SIZES[size];

  return (
    <View className={`flex-row items-center self-start rounded-full ${s.container}`} style={{ backgroundColor: cat.bgLight }}>
      <Icon size={s.icon} color={cat.color} />
      <Text className={`font-inter-semibold ${s.text}`} style={{ color: cat.color }}>
        {cat.name}
      </Text>
    </View>
  );
}
