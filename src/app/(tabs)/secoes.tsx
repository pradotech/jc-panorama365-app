import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { categories } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { selectByCategory } from '@/services/newsService';

export default function SectionsScreen() {
  const { news } = useNewsContext();

  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, selectByCategory(news, c.id).length])),
    [news]
  );

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerClassName="p-4 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link key={cat.id} href={{ pathname: '/categoria/[slug]', params: { slug: cat.slug } }} asChild>
            <Pressable className="flex-row items-center gap-3 rounded-xl border border-navy-100 bg-white p-4 active:opacity-80">
              <View className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: cat.bgLight }}>
                <Icon size={20} color={cat.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-navy-950">{cat.name}</Text>
                <Text className="text-xs text-navy-400" numberOfLines={1}>
                  {cat.description}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-navy-400">{counts[cat.id] ?? 0}</Text>
              <ChevronRight size={18} color={colors.navy300} />
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

