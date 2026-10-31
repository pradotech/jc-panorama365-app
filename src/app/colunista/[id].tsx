import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { NewsCard } from '@/components/NewsCard';
import { EmptyState, LoadingView } from '@/components/StateViews';
import { useColumnistsContext } from '@/context/ColumnistsContext';
import { useNewsContext } from '@/context/NewsContext';
import { selectByColumnist } from '@/services/newsService';

export default function ColumnistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, loading } = useColumnistsContext();
  const { news } = useNewsContext();
  const columnist = id ? getById(id) : undefined;

  const articles = useMemo(
    () => (columnist ? selectByColumnist(news, columnist.id, columnist.name) : []),
    [news, columnist]
  );

  if (!columnist) {
    return loading ? <LoadingView /> : <EmptyState title="Colunista não encontrado." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: columnist.name }} />
      <FlatList
        className="flex-1 bg-surface"
        data={articles}
        keyExtractor={(a) => a.id}
        contentContainerClassName="px-4 pb-10"
        ListHeaderComponent={
          <View className="items-center border-b border-navy-100 py-6">
            <Avatar name={columnist.name} uri={columnist.avatar_url} size={88} />
            <Text className="mt-3 text-xl font-bold text-navy-950">{columnist.name}</Text>
            <Text className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-accent-500">
              {columnist.role ?? 'Colunista'}
            </Text>
            {columnist.bio ? (
              <Text className="mt-3 text-center text-sm leading-5 text-navy-500">{columnist.bio}</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <NewsCard article={item} variant="compact" />}
        ListEmptyComponent={<EmptyState title="Nenhum artigo publicado ainda." />}
      />
    </>
  );
}

