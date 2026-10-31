import { Text, View } from 'react-native';
import { getCategoryById } from '@/constants/categories';

interface Props {
  categoryId: string;
  /** "solid" sobre imagens; "subtle" em fundos claros. */
  variant?: 'solid' | 'subtle';
}

export function CategoryBadge({ categoryId, variant = 'subtle' }: Props) {
  const cat = getCategoryById(categoryId);
  if (!cat) return null;

  const solid = variant === 'solid';
  return (
    <View
      className="self-start rounded px-2 py-0.5"
      style={{ backgroundColor: solid ? cat.color : cat.bgLight }}
    >
      <Text
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: solid ? '#ffffff' : cat.color }}
      >
        {cat.name}
      </Text>
    </View>
  );
}
