import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { EmptyState } from '@/components/StateViews';
import { getCategoryBySlug } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { selectByCategory } from '@/services/newsService';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { news, refreshing, refresh } = useNewsContext();
  const category = getCategoryBySlug(slug);

  const items = useMemo(() => (category ? selectByCategory(news, category.id) : []), [news, category]);

  if (!category) return <EmptyState title="Seção não encontrada." />;

  const [first, ...rest] = items;

  return (
    <>
      <Stack.Screen options={{ title: category.name }} />
      <FlatList
        className="flex-1 bg-surface"
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
        ListHeaderComponent={
          <View className="gap-4 pt-4">
            <View className="flex-row items-center gap-2">
              <View className="h-5 w-1 rounded-full" style={{ backgroundColor: category.color }} />
              <Text className="flex-1 text-sm text-navy-500">{category.description}</Text>
            </View>
            {first ? <NewsCard article={first} variant="hero" /> : null}
          </View>
        }
        renderItem={({ item }) => <NewsCard article={item} variant="compact" />}
        ListEmptyComponent={first ? null : <EmptyState title="Nenhuma notícia nesta seção ainda." />}
      />
    </>
  );
}

