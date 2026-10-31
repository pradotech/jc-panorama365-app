import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { getCategoryById } from '@/constants/categories';
import type { News } from '@/types/news';

/** Bloco de seção (ex.: "Geral", "Política") — versão celular do NewsList do portal. */
export function NewsList({ categoryId, articles, limit = 3 }: { categoryId: string; articles: News[]; limit?: number }) {
  const category = getCategoryById(categoryId);
  const display = articles.slice(0, limit);
  if (!category || display.length === 0) return null;

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between border-b border-navy-100 pb-2">
        <View className="flex-row items-center gap-2.5">
          <View className="h-6 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
          <Text className="font-inter-bold text-lg tracking-tight text-navy-950">{category.name}</Text>
        </View>
        <Link href={{ pathname: '/categoria/[slug]', params: { slug: category.slug } }} asChild>
          <Pressable className="flex-row items-center gap-1 active:opacity-60" hitSlop={8}>
            <Text className="font-inter-semibold text-xs" style={{ color: category.color }}>
              Ver todas
            </Text>
            <ArrowRight size={15} color={category.color} />
          </Pressable>
        </Link>
      </View>

      {display.map((article, i) => (
        <View key={article.id} className={i > 0 ? 'border-t border-navy-100' : ''}>
          <NewsCard article={article} variant="editorial-list" />
        </View>
      ))}
    </View>
  );
}

