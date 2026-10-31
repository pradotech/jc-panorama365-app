import { Link } from 'expo-router';
import { Clock, User } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ImageCarousel } from '@/components/ImageCarousel';
import { gradients, shadows } from '@/constants/theme';
import { getArticleImages } from '@/lib/newsUtils';
import type { News } from '@/types/news';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Destaque principal da Home — idêntico ao FeaturedNews do portal (16:9 + degradê + título serifado). */
export function FeaturedNews({ article }: { article: News }) {
  const images = getArticleImages(article);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const minHeight = Math.max(Math.round((size.width * 9) / 16), 300);

  // Mede o card inteiro: a imagem cobre todo o fundo, mesmo quando o texto é longo
  const onLayout = (e: LayoutChangeEvent) => {
    const width = Math.round(e.nativeEvent.layout.width);
    const height = Math.round(e.nativeEvent.layout.height);
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };

  return (
    <Link href={{ pathname: '/noticia/[slug]', params: { slug: article.slug } }} asChild>
      <Pressable className="overflow-hidden rounded-2xl active:opacity-95" style={shadows.card}>
        <View style={{ minHeight }} className="bg-navy-950" onLayout={onLayout}>
          {size.width > 0 ? (
            <ImageCarousel
              images={images}
              width={size.width}
              height={size.height}
              showDots={false}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          ) : null}
          <View className="absolute inset-0" style={gradients.heroOverlay} pointerEvents="none" />

          <View className="mt-auto p-6" pointerEvents="none">
            <View className="mb-3">
              <CategoryBadge categoryId={article.category} size="md" />
            </View>
            <Text className="mb-3 font-serif text-2xl leading-8 text-white">{article.title}</Text>
            {article.subtitle ? (
              <Text className="mb-4 font-inter text-base leading-6 text-white/80" numberOfLines={2}>
                {article.subtitle}
              </Text>
            ) : null}

            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
              <View className="flex-row items-center gap-2.5">
                {article.columnist_avatar ? (
                  <Image
                    source={{ uri: article.columnist_avatar }}
                    style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#4287ff' }}
                  />
                ) : article.columnist_name ? (
                  <View className="h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-accent-500">
                    <Text className="font-inter-bold text-xs text-white">{article.columnist_name.charAt(0)}</Text>
                  </View>
                ) : (
                  <User size={15} color="rgba(255,255,255,0.8)" />
                )}
                <Text className="font-inter-semibold text-sm text-white">
                  {article.columnist_name ? `Coluna de ${article.columnist_name}` : article.author}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Clock size={14} color="rgba(255,255,255,0.7)" />
                <Text className="font-inter text-xs text-white/70">{formatDate(article.published_at)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
