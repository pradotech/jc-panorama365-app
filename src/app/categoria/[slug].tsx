import { useLocalSearchParams } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Footer } from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { SidebarBlocks } from '@/components/SidebarBlocks';
import { getCategoryBySlug } from '@/constants/categories';
import { colors, shadows } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { selectByCategory, selectHome } from '@/services/newsService';

/** Página de categoria — idêntica ao CategoryPage do portal (banner colorido + cards + sidebar). */
export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { news, refreshing, refresh } = useNewsContext();
  const category = getCategoryBySlug(slug);

  const articles = useMemo(() => (category ? selectByCategory(news, category.id) : []), [news, category]);
  const sidebarNews = useMemo(() => selectHome(news), [news]);

  if (!category) {
    return (
      <View className="flex-1 items-center bg-surface px-4 py-20">
        <Text className="mb-4 font-inter-bold text-3xl text-navy-900">Categoria não encontrada</Text>
        <Text className="font-inter text-navy-500">A categoria que você procura não existe.</Text>
      </View>
    );
  }

  const Icon = category.icon;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
    >
      {/* Banner da categoria */}
      <View className="overflow-hidden px-4 py-10" style={{ backgroundColor: category.color }}>
        <View className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <View className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/[0.03]" />

        <View className="mb-3 flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Icon size={24} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-inter-bold text-3xl text-white">{category.name}</Text>
            <Text className="mt-1 font-inter text-sm text-white/80">{category.description}</Text>
          </View>
        </View>

        <View className="mt-2 gap-4">
          <Text className="font-inter text-sm text-white/70">
            {articles.length} {articles.length === 1 ? 'publicação encontrada' : 'publicações encontradas'}
          </Text>
          {category.id === 'colunistas' ? (
            <Link href="/colunistas" asChild>
              <Pressable className="flex-row items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 active:bg-white/20">
                <Text className="font-inter-bold text-xs text-accent-200">Conhecer todos os colunistas</Text>
                <ArrowRight size={13} color={colors.accent300} />
              </Pressable>
            </Link>
          ) : null}
        </View>
      </View>

      <View className="gap-8 px-4 py-8">
        {articles.length > 0 ? (
          <View className="gap-5">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </View>
        ) : (
          <View className="items-center rounded-2xl bg-white py-16" style={shadows.card}>
            <Icon size={48} color={colors.navy200} />
            <Text className="mb-2 mt-4 font-inter-semibold text-lg text-navy-700">Nenhuma notícia nesta categoria</Text>
            <Text className="font-inter text-sm text-navy-400">Novas notícias serão publicadas em breve.</Text>
          </View>
        )}

        <SidebarBlocks news={sidebarNews} />
      </View>

      <Footer />
    </ScrollView>
  );
}
