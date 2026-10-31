import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Footer } from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { LoadingView } from '@/components/StateViews';
import { colors, gradients, shadows } from '@/constants/theme';
import { useColumnistsContext } from '@/context/ColumnistsContext';
import { useNewsContext } from '@/context/NewsContext';
import { selectByColumnist } from '@/services/newsService';

/** Página do colunista — idêntica ao ColumnistDetailPage do portal. */
export default function ColumnistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, loading } = useColumnistsContext();
  const { news } = useNewsContext();
  const columnist = id ? getById(id) : undefined;

  const articles = useMemo(
    () => (columnist ? selectByColumnist(news, columnist.id, columnist.name) : []),
    [news, columnist]
  );

  if (!columnist) {
    if (loading) return <LoadingView />;
    return (
      <View className="flex-1 items-center bg-surface px-4 py-20">
        <Text className="mb-4 font-inter-bold text-2xl text-navy-900">Colunista não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface">
      {/* Hero do colunista */}
      <View className="overflow-hidden px-4 py-12" style={[{ backgroundColor: colors.navy950 }, gradients.columnists]}>
        <View className="mb-6 flex-row flex-wrap items-center gap-2">
          <Pressable onPress={() => router.dismissTo('/')} className="flex-row items-center gap-1">
            <ArrowLeft size={14} color={colors.accent300} />
            <Text className="font-inter-semibold text-xs text-accent-300">Início</Text>
          </Pressable>
          <Text className="font-inter-semibold text-xs text-navy-400">/</Text>
          <Link href="/colunistas">
            <Text className="font-inter-semibold text-xs text-accent-300">Colunistas</Text>
          </Link>
          <Text className="font-inter-semibold text-xs text-navy-400">/</Text>
          <Text className="font-inter-semibold text-xs text-white" numberOfLines={1}>
            {columnist.name}
          </Text>
        </View>

        <View className="items-center gap-6">
          <View>
            {columnist.avatar_url ? (
              <Image
                source={columnist.avatar_url}
                style={{ width: 112, height: 112, borderRadius: 56, borderWidth: 3, borderColor: colors.accent400 }}
                contentFit="cover"
              />
            ) : (
              <View className="h-28 w-28 items-center justify-center rounded-full border-2 border-white bg-accent-600">
                <Text className="font-inter-extrabold text-4xl text-white">{columnist.name.charAt(0)}</Text>
              </View>
            )}
            <View
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500"
              style={{ borderWidth: 3, borderColor: colors.navy950 }}
            />
          </View>

          <View className="items-center">
            <View className="mb-2 flex-row flex-wrap items-center justify-center gap-2.5">
              <View className="rounded-full bg-accent-500 px-3.5 py-1">
                <Text className="font-inter-extrabold text-xs uppercase tracking-wider text-white">{columnist.role || 'Colunista'}</Text>
              </View>
              <Text className="font-inter-semibold text-xs uppercase tracking-wide text-accent-200">JC Panorama 365</Text>
            </View>
            <Text className="mb-3 text-center font-serif text-3xl tracking-tight text-white">{columnist.name}</Text>
            <Text className="mb-4 text-center font-inter text-sm leading-6 text-slate-100/90">
              {columnist.bio ||
                'Articulista e colunista exclusivo do JC Panorama 365, trazendo análises, reflexões e conteúdos informativos.'}
            </Text>
            <View className="flex-row items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5">
              <BookOpen size={14} color={colors.accent400} />
              <Text className="font-inter-medium text-xs text-navy-200">
                {articles.length} {articles.length === 1 ? 'matéria publicada' : 'matérias publicadas'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Matérias da coluna */}
      <View className="px-4 pb-12 pt-10">
        <View className="mb-8 border-b border-navy-200 pb-4">
          <View className="flex-row items-center gap-2.5">
            <View className="h-7 w-1.5 rounded-full bg-accent-500" />
            <Text className="flex-1 font-inter-extrabold text-2xl tracking-tight text-navy-950">Todas as Matérias da Coluna</Text>
          </View>
          <Text className="mt-1 font-inter text-sm text-navy-500">Publicações e textos de autoria de {columnist.name}</Text>
        </View>

        {articles.length > 0 ? (
          <View className="gap-6">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </View>
        ) : (
          <View className="items-center rounded-2xl border border-navy-100 bg-white p-12" style={shadows.card}>
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-navy-50">
              <BookOpen size={28} color={colors.navy400} />
            </View>
            <Text className="mb-2 font-inter-bold text-lg text-navy-900">Nenhuma matéria publicada ainda</Text>
            <Text className="mb-6 text-center font-inter text-sm text-navy-500">
              Este colunista ainda não possui publicações cadastradas no portal.
            </Text>
            <Link href="/colunistas" asChild>
              <Pressable className="flex-row items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 active:bg-accent-600">
                <ArrowLeft size={16} color="#fff" />
                <Text className="font-inter-semibold text-sm text-white">Voltar aos colunistas</Text>
              </Pressable>
            </Link>
          </View>
        )}
      </View>

      <Footer />
    </ScrollView>
  );
}
