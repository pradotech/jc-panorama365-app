import { Link } from 'expo-router';
import { ChevronRight, Clock } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { BreakingTicker } from '@/components/BreakingTicker';
import { MarketCard } from '@/components/MarketCard';
import { NewsCard } from '@/components/NewsCard';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState, LoadingView } from '@/components/StateViews';
import { WeatherCard } from '@/components/WeatherCard';
import { categories } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { isColumnistArticle } from '@/lib/newsUtils';
import { selectFeatured, selectHome } from '@/services/newsService';
import type { News } from '@/types/news';

export default function HomeScreen() {
  const { news, loading, refreshing, refresh } = useNewsContext();

  const { mainFeatured, secondaryFeatured, latest, columnistArticles, topCategories } = useMemo(() => {
    const featured = selectFeatured(news);
    const home = selectHome(news);

    const byCategory: Record<string, News[]> = {};
    for (const article of home) {
      const cat = isColumnistArticle(article) ? 'colunistas' : article.category;
      (byCategory[cat] ??= []).push(article);
    }

    const top = Object.keys(byCategory)
      .filter((id) => id !== 'colunistas')
      .sort((a, b) => (byCategory[b]?.length ?? 0) - (byCategory[a]?.length ?? 0))
      .slice(0, 4)
      .map((id) => ({ category: categories.find((c) => c.id === id), items: byCategory[id] ?? [] }))
      .filter((g) => g.category !== undefined);

    return {
      mainFeatured: featured[0],
      secondaryFeatured: featured.slice(1, 4),
      latest: home.slice(0, 12),
      columnistArticles: byCategory.colunistas?.slice(0, 6) ?? [],
      topCategories: top,
    };
  }, [news]);

  if (loading) return <LoadingView />;

  return (
    <View className="flex-1 bg-surface">
      <BrandHeader />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
        contentContainerClassName="pb-10"
      >
        <BreakingTicker items={latest.slice(0, 8)} />

        {news.length === 0 ? (
          <EmptyState title="Nenhuma notícia publicada ainda." description="Puxe para baixo para atualizar." />
        ) : null}

        <View className="gap-8 px-4 pt-4">
          {mainFeatured ? <NewsCard article={mainFeatured} variant="hero" /> : null}

          {secondaryFeatured.length > 0 ? (
            <View className="gap-4">
              {secondaryFeatured.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </View>
          ) : null}

          {latest.length > 0 ? (
            <View>
              <SectionHeader title="Últimas notícias" icon={Clock} accentColor={colors.breaking} />
              {latest.map((a) => (
                <NewsCard key={a.id} article={a} variant="compact" />
              ))}
            </View>
          ) : null}

          <MarketCard />
          <WeatherCard />

          {columnistArticles.length > 0 ? (
            <View>
              <SectionHeader
                title="Colunistas"
                accentColor={colors.navy950}
                right={<SeeAll href={{ pathname: '/categoria/[slug]', params: { slug: 'colunistas' } }} />}
              />
              {columnistArticles.map((a) => (
                <NewsCard key={a.id} article={a} variant="compact" />
              ))}
            </View>
          ) : null}

          {topCategories.map(({ category, items }) =>
            category ? (
              <View key={category.id}>
                <SectionHeader
                  title={category.name}
                  icon={category.icon}
                  accentColor={category.color}
                  right={<SeeAll href={{ pathname: '/categoria/[slug]', params: { slug: category.slug } }} />}
                />
                {items.slice(0, 4).map((a) => (
                  <NewsCard key={a.id} article={a} variant="compact" />
                ))}
              </View>
            ) : null
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SeeAll({ href }: { href: { pathname: '/categoria/[slug]'; params: { slug: string } } }) {
  return (
    <Link href={href} asChild>
      <Pressable className="flex-row items-center active:opacity-60" hitSlop={8}>
        <Text className="text-xs font-semibold text-accent-500">Ver tudo</Text>
        <ChevronRight size={14} color={colors.accent} />
      </Pressable>
    </Link>
  );
}
