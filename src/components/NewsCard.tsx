import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { CategoryBadge } from '@/components/CategoryBadge';
import { colors } from '@/constants/theme';
import { formatTimeAgo } from '@/lib/dateUtils';
import { getCoverImage, isColumnistArticle } from '@/lib/newsUtils';
import type { News } from '@/types/news';

type Variant = 'hero' | 'default' | 'compact';

interface Props {
  article: News;
  variant?: Variant;
}

function Meta({ article, light = false }: { article: News; light?: boolean }) {
  const byline = isColumnistArticle(article) ? article.columnist_name : article.author;
  return (
    <Text className={`text-xs ${light ? 'text-white/80' : 'text-navy-400'}`} numberOfLines={1}>
      {byline ? `${byline} · ` : ''}
      {formatTimeAgo(article.published_at, { withSuffix: true })}
    </Text>
  );
}

function Placeholder({ height }: { height: number }) {
  return <View style={{ height, backgroundColor: colors.navy100 }} />;
}

export function NewsCard({ article, variant = 'default' }: Props) {
  const cover = getCoverImage(article);
  const href = { pathname: '/noticia/[slug]', params: { slug: article.slug } } as const;

  if (variant === 'hero') {
    return (
      <Link href={href} asChild>
        <Pressable className="overflow-hidden rounded-xl bg-navy-950 active:opacity-90">
          {cover ? (
            <Image source={cover} style={{ width: '100%', aspectRatio: 4 / 3 }} contentFit="cover" transition={200} />
          ) : (
            <Placeholder height={240} />
          )}
          <View className="absolute inset-x-0 bottom-0 bg-black/60 p-4">
            <CategoryBadge categoryId={article.category} variant="solid" />
            <Text className="mt-2 text-xl font-bold leading-7 text-white" numberOfLines={3}>
              {article.title}
            </Text>
            {article.subtitle ? (
              <Text className="mt-1 text-sm leading-5 text-white/85" numberOfLines={2}>
                {article.subtitle}
              </Text>
            ) : null}
            <View className="mt-2">
              <Meta article={article} light />
            </View>
          </View>
        </Pressable>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} asChild>
        <Pressable className="flex-row gap-3 border-b border-navy-100 py-3 active:opacity-70">
          <View className="flex-1">
            <CategoryBadge categoryId={article.category} />
            <Text className="mt-1.5 text-[15px] font-semibold leading-5 text-navy-950" numberOfLines={3}>
              {article.title}
            </Text>
            <View className="mt-1.5">
              <Meta article={article} />
            </View>
          </View>
          {cover ? (
            <Image
              source={cover}
              style={{ width: 96, height: 80, borderRadius: 8 }}
              contentFit="cover"
              transition={150}
            />
          ) : null}
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable className="overflow-hidden rounded-xl border border-navy-100 bg-white active:opacity-90">
        {cover ? (
          <Image source={cover} style={{ width: '100%', aspectRatio: 16 / 9 }} contentFit="cover" transition={200} />
        ) : null}
        <View className="p-4">
          <CategoryBadge categoryId={article.category} />
          <Text className="mt-2 text-base font-bold leading-6 text-navy-950" numberOfLines={3}>
            {article.title}
          </Text>
          {article.subtitle ? (
            <Text className="mt-1 text-sm leading-5 text-navy-500" numberOfLines={2}>
              {article.subtitle}
            </Text>
          ) : null}
          <View className="mt-2">
            <Meta article={article} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
