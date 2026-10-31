import { Search, X } from 'lucide-react-native';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { EmptyState } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { searchNews } from '@/services/newsService';

export default function SearchScreen() {
  const { news } = useNewsContext();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);

  const results = useMemo(() => searchNews(news, deferred), [news, deferred]);
  const hasQuery = deferred.trim().length > 0;

  return (
    <View className="flex-1 bg-surface">
      <View className="border-b border-navy-100 bg-white px-4 py-3">
        <View className="flex-row items-center gap-2 rounded-lg bg-navy-50 px-3">
          <Search size={18} color={colors.navy400} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar notícias"
            placeholderTextColor={colors.navy400}
            returnKeyType="search"
            autoCorrect={false}
            className="h-11 flex-1 text-base text-navy-950"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <X size={18} color={colors.navy400} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsCard article={item} variant="compact" />}
        contentContainerClassName="px-4"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          hasQuery ? (
            <EmptyState title="Nenhum resultado encontrado." description="Tente outros termos." />
          ) : (
            <EmptyState title="Busque por título, autor ou assunto." />
          )
        }
      />
    </View>
  );
}

