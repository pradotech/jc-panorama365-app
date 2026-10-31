import { Link } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import type { News } from '@/types/news';

/** Faixa "Últimas" com rolagem horizontal (equivalente ao ticker do portal). */
export function BreakingTicker({ items }: { items: News[] }) {
  if (items.length === 0) return null;

  return (
    <View className="flex-row items-center" style={{ backgroundColor: colors.breaking }}>
      <View className="flex-row items-center gap-1.5 px-3 py-2" style={{ backgroundColor: colors.breakingDark }}>
        <Zap size={13} color="#fff" />
        <Text className="text-[11px] font-bold uppercase tracking-wider text-white">Últimas</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="items-center gap-6 px-3">
        {items.map((item) => (
          <Link key={item.id} href={{ pathname: '/noticia/[slug]', params: { slug: item.slug } }} asChild>
            <Pressable className="flex-row items-center gap-2 py-2 active:opacity-70">
              <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <Text className="text-[13px] font-medium text-white" numberOfLines={1}>
                {item.title}
              </Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
