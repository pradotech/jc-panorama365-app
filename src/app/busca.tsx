import { useLocalSearchParams } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Footer } from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { colors, shadows } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { searchNews } from '@/services/newsService';

/** Resultados da busca — idêntico ao SearchPage do portal (busca feita pelo campo do cabeçalho). */
export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const query = (q ?? '').trim();
  const { news } = useNewsContext();
  const results = useMemo(() => (query ? searchNews(news, query) : []), [news, query]);

  return (
    <ScrollView className="flex-1 bg-surface" keyboardShouldPersistTaps="handled">
      <View className="px-4 py-8">
        <View className="mb-8">
          <View className="mb-2 flex-row items-center gap-3">
            <Search size={24} color={colors.accent} />
            <Text className="font-inter-bold text-2xl text-navy-900">Resultados da busca</Text>
          </View>
          {query ? (
            <Text className="font-inter text-navy-500">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para{' '}
              <Text className="font-inter-semibold text-navy-700">"{query}"</Text>
            </Text>
          ) : null}
        </View>

        {results.length > 0 ? (
          <View className="gap-5">
            {results.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </View>
        ) : (
          <View className="items-center rounded-2xl bg-white px-6 py-20" style={shadows.card}>
            <Search size={56} color={colors.navy200} />
            <Text className="mb-2 mt-4 font-inter-semibold text-xl text-navy-700">
              {query ? 'Nenhum resultado encontrado' : 'Digite algo para buscar'}
            </Text>
            <Text className="text-center font-inter text-sm text-navy-400">
              {query
                ? 'Tente buscar por outros termos ou navegue pelas categorias.'
                : 'Use o campo de busca no topo da página para encontrar notícias.'}
            </Text>
          </View>
        )}
      </View>
      <Footer />
    </ScrollView>
  );
}
