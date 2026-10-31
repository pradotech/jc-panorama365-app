import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Clock, User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ImageCarousel } from '@/components/ImageCarousel';
import { getCategoryById } from '@/constants/categories';
import { colors, shadows } from '@/constants/theme';
import { formatTimeAgo } from '@/lib/dateUtils';
import { getArticleImages } from '@/lib/newsUtils';
import type { News } from '@/types/news';

/**
 * Variantes equivalentes ao NewsCard do portal:
 * - default: card grande (destaques secundários)
 * - compact: card com imagem 16:10 (grade "Últimas Notícias")
 * - editorial-list: miniatura à esquerda + categoria + título (seções no celular)
 */
type Variant = 'default' | 'compact' | 'editorial-list';

interface Props {
  article: News;
  variant?: Variant;
}

function useWidth() {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w !== width) setWidth(w);
  };
  return { width, onLayout };
}

function Byline({ article, large = false }: { article: News; large?: boolean }) {
  if (article.columnist_name) {
    return (
      <View className={`min-w-0 flex-1 flex-row items-center pr-1 ${large ? 'gap-3.5' : 'gap-2.5'}`}>
        <Avatar name={article.columnist_name} uri={article.columnist_avatar} size={large ? 48 : 40} />
        <View className="min-w-0 flex-1">
          <Text
            className={`mb-1 font-inter-extrabold uppercase tracking-wider text-accent-600 ${large ? 'text-[11px]' : 'text-[10px]'}`}
            numberOfLines={1}
          >
            {article.columnist_role || 'Colunista'}
          </Text>
          <Text
            className={`text-navy-950 ${large ? 'font-inter-extrabold text-base' : 'font-inter-bold text-sm'}`}
            numberOfLines={1}
          >
            {article.columnist_name}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-2">
      <User size={large ? 16 : 14} color={colors.navy400} />
      <Text className={`font-inter-medium text-navy-600 ${large ? 'text-sm' : 'text-xs'}`} numberOfLines={1}>
        {article.author || 'Redação'}
      </Text>
    </View>
  );
}

function TimeAgo({ value, large = false }: { value: string | null; large?: boolean }) {
  return (
    <View className="flex-row items-center gap-1">
      <Clock size={large ? 13 : 12} color={colors.navy400} />
      <Text className={`font-inter-medium text-navy-400 ${large ? 'text-xs' : 'text-[11px]'}`}>{formatTimeAgo(value)}</Text>
    </View>
  );
}

export function NewsCard({ article, variant = 'default' }: Props) {
  const images = getArticleImages(article);
  const href = { pathname: '/noticia/[slug]', params: { slug: article.slug } } as const;
  const { width, onLayout } = useWidth();

  if (variant === 'editorial-list') {
    const category = getCategoryById(article.category);
    return (
      <Link href={href} asChild>
        <Pressable className="flex-row items-center gap-3.5 px-0.5 py-3.5 active:bg-navy-50">
          <View className="overflow-hidden rounded-xl bg-navy-100" style={{ width: 128, aspectRatio: 16 / 10 }}>
            {images[0] ? (
              <Image source={images[0]} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} />
            ) : null}
          </View>
          <View className="min-w-0 flex-1 justify-center">
            {category ? (
              <Text
                className="mb-1 font-inter-black text-[11px] uppercase tracking-wider"
                style={{ color: category.color }}
              >
                {category.name}
              </Text>
            ) : null}
            <Text className="font-inter-bold text-[15px] leading-5 text-navy-950" numberOfLines={3}>
              {article.title}
            </Text>
          </View>
        </Pressable>
      </Link>
    );
  }

  const compact = variant === 'compact';

  return (
    <Link href={href} asChild>
      <Pressable
        className={`overflow-hidden bg-white active:opacity-90 ${compact ? 'rounded-xl' : 'rounded-2xl'}`}
        style={shadows.card}
        onLayout={onLayout}
      >
        <View>
          {width > 0 ? <ImageCarousel images={images} width={width} height={Math.round((width * 10) / 16)} /> : (
            <View style={{ aspectRatio: 16 / 10 }} className="bg-navy-100" />
          )}
          <View className={`absolute ${compact ? 'bottom-2 left-2' : 'bottom-3 left-3'}`} pointerEvents="none">
            <CategoryBadge categoryId={article.category} />
          </View>
        </View>

        <View className={compact ? 'p-4' : 'p-5'}>
          <Text
            className={`text-navy-900 ${compact ? 'mb-1.5 font-inter-bold text-sm leading-5' : 'mb-2 font-inter-bold text-lg leading-6'}`}
          >
            {article.title}
          </Text>
          {article.subtitle ? (
            <Text
              className={`text-navy-500 ${compact ? 'mb-3.5 font-inter text-xs leading-5' : 'mb-4 font-inter text-sm leading-6'}`}
              numberOfLines={2}
            >
              {article.subtitle}
            </Text>
          ) : null}

          <View
            className={`flex-row items-center justify-between border-t border-navy-100 ${compact ? 'gap-2.5 pt-3' : 'gap-3 pt-3.5'}`}
          >
            <Byline article={article} large={!compact} />
            <TimeAgo value={article.published_at} large={!compact} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
