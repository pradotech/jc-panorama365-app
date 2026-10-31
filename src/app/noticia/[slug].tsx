import { Stack, useLocalSearchParams } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArticleContent } from '@/components/ArticleContent';
import { Avatar } from '@/components/Avatar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ImageCarousel } from '@/components/ImageCarousel';
import { NewsCard } from '@/components/NewsCard';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState, LoadingView } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { formatFullDate } from '@/lib/dateUtils';
import { getArticleImages, isColumnistArticle } from '@/lib/newsUtils';
import { recordNewsView } from '@/services/analyticsService';
import { fetchNewsBySlug, selectRelated } from '@/services/newsService';
import { shareArticle } from '@/services/shareService';
import type { News } from '@/types/news';

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { news, getBySlug, loading: listLoading } = useNewsContext();

  const fromList = slug ? getBySlug(slug) : undefined;
  const [fetched, setFetched] = useState<News | null>(null);
  const [fetching, setFetching] = useState(false);
  const article = fromList ?? fetched;

  // Matéria ainda não está na lista (ex.: aberta por push) → busca direta
  useEffect(() => {
    if (fromList || !slug) return;
    let active = true;
    setFetching(true);
    fetchNewsBySlug(slug)
      .then((a) => {
        if (active) setFetched(a);
      })
      .finally(() => {
        if (active) setFetching(false);
      });
    return () => {
      active = false;
    };
  }, [slug, fromList]);

  useEffect(() => {
    if (article) void recordNewsView(article.id);
  }, [article]);

  const related = useMemo(() => (article ? selectRelated(news, article) : []), [news, article]);

  if (!article) {
    if (fetching || listLoading) return <LoadingView />;
    return <EmptyState title="Notícia não encontrada." description="Ela pode ter sido removida ou despublicada." />;
  }

  const images = getArticleImages(article);
  const columnist = isColumnistArticle(article);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => void shareArticle(article)} hitSlop={10} accessibilityLabel="Compartilhar">
              <Share2 size={22} color={colors.navy950} />
            </Pressable>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-12">
        <View className="px-5 pt-4">
          <CategoryBadge categoryId={article.category} />
          <Text className="mt-3 text-[26px] font-bold leading-8 text-navy-950">{article.title}</Text>
          {article.subtitle ? (
            <Text className="mt-3 text-lg leading-7 text-navy-500">{article.subtitle}</Text>
          ) : null}

          <View className="mt-4 flex-row items-center gap-3 border-y border-navy-100 py-3">
            {columnist && article.columnist_name ? (
              <Avatar name={article.columnist_name} uri={article.columnist_avatar} size={40} />
            ) : null}
            <View className="flex-1">
              <Text className="text-sm font-semibold text-navy-950">
                {columnist ? article.columnist_name : article.author ?? 'Redação'}
              </Text>
              <Text className="text-xs text-navy-400">{formatFullDate(article.published_at)}</Text>
            </View>
            <Pressable
              onPress={() => void shareArticle(article)}
              className="flex-row items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-2 active:opacity-70"
            >
              <Share2 size={16} color={colors.accent} />
              <Text className="text-xs font-semibold text-accent-500">Compartilhar</Text>
            </Pressable>
          </View>
        </View>

        {images.length > 0 ? (
          <View className="mt-4">
            <ImageCarousel images={images} />
          </View>
        ) : null}

        <View className="px-5 pt-5">
          {article.content ? <ArticleContent html={article.content} /> : null}
        </View>

        {related.length > 0 ? (
          <View className="mt-6 px-5">
            <SectionHeader title="Leia também" />
            {related.map((r) => (
              <NewsCard key={r.id} article={r} variant="compact" />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

