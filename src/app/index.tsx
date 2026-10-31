import { Clock } from 'lucide-react-native';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { BreakingTicker } from '@/components/BreakingTicker';
import { ColumnistsSection } from '@/components/ColumnistsSection';
import { FeaturedNews } from '@/components/FeaturedNews';
import { Footer } from '@/components/Footer';
import { MarketOverview } from '@/components/MarketOverview';
import { NewsCard } from '@/components/NewsCard';
import { NewsList } from '@/components/NewsList';
import { SidebarBlocks } from '@/components/SidebarBlocks';
import { LoadingView } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { isColumnistArticle } from '@/lib/newsUtils';
import { selectFeatured, selectHome } from '@/services/newsService';
import type { News } from '@/types/news';

/** Home — mesma ordem e blocos do portal no celular (HomePage.jsx). */
export default function HomeScreen() {
  const { news, loading, refreshing, refresh } = useNewsContext();

  const data = useMemo(() => {
    const featured = selectFeatured(news);
    const home = selectHome(news);

    const byCategory: Record<string, News[]> = {};
    for (const article of home) {
      const cat = isColumnistArticle(article) ? 'colunistas' : article.category;
      (byCategory[cat] ??= []).push(article);
    }

    const topCategories = Object.keys(byCategory)
      .filter((id) => id !== 'colunistas' && (byCategory[id]?.length ?? 0) > 0)
      .sort((a, b) => (byCategory[b]?.length ?? 0) - (byCategory[a]?.length ?? 0))
      .slice(0, 4);

    return {
      home,
      mainFeatured: featured[0],
      secondaryFeatured: featured.slice(1, 4),
      latest: home.slice(0, 12),
      columnistArticles: home.filter(isColumnistArticle),
      byCategory,
      topCategories,
    };
  }, [news]);

  if (loading) return <LoadingView />;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
    >
      <BreakingTicker items={data.home.slice(0, 8)} />

      <View className="px-4 py-6">
        {data.mainFeatured ? (
          <View className="mb-8">
            <FeaturedNews article={data.mainFeatured} />
          </View>
        ) : null}

        {data.secondaryFeatured.length > 0 ? (
          <View className="mb-10 gap-5">
            {data.secondaryFeatured.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </View>
        ) : null}

        {data.latest.length > 0 ? (
          <View className="mb-12">
            <View className="mb-5 flex-row items-center justify-between border-b border-navy-100 pb-3">
              <View className="flex-row items-center gap-2.5">
                <View className="h-6 w-1.5 rounded-full bg-red-600" />
                <Clock size={20} color={colors.red600} />
                <Text className="font-inter-bold text-lg tracking-tight text-navy-950">Últimas Notícias</Text>
              </View>
              <Text className="font-inter-semibold text-xs uppercase tracking-wider text-navy-400">Mais Recentes</Text>
            </View>

            <View className="mb-6">
              <MarketOverview />
            </View>

            <View className="gap-4">
              {data.latest.map((a) => (
                <NewsCard key={a.id} article={a} variant="compact" />
              ))}
            </View>
          </View>
        ) : null}

        <View className="mb-10">
          <ColumnistsSection articles={data.columnistArticles} />
          <View className="mt-8">
            <SidebarBlocks news={data.home} />
          </View>
        </View>

        <View className="gap-10">
          {data.topCategories.map((catId) => (
            <NewsList key={catId} categoryId={catId} articles={data.byCategory[catId] ?? []} />
          ))}

          {data.topCategories.length === 0 ? (
            <View className="items-center py-16">
              <Text className="font-inter text-lg text-navy-400">Nenhuma notícia publicada ainda.</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}
