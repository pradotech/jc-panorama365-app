import { Link, router } from 'expo-router';
import { ArrowLeft, ArrowRight, BookOpen, Feather, Newspaper, Search, Users } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Footer } from '@/components/Footer';
import { NewsCard } from '@/components/NewsCard';
import { LoadingView } from '@/components/StateViews';
import { colors, shadows } from '@/constants/theme';
import { useColumnistsContext } from '@/context/ColumnistsContext';
import { useNewsContext } from '@/context/NewsContext';
import { selectByCategory, selectByColumnist } from '@/services/newsService';

/** "Nossos Colunistas" — idêntico ao ColumnistsPage do portal. */
export default function ColumnistsScreen() {
  const { columnists, loading, refresh } = useColumnistsContext();
  const { news } = useNewsContext();
  const [term, setTerm] = useState('');

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return columnists;
    return columnists.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.role ?? '').toLowerCase().includes(q) || (c.bio ?? '').toLowerCase().includes(q)
    );
  }, [columnists, term]);

  const columnistArticles = useMemo(() => selectByCategory(news, 'colunistas').slice(0, 6), [news]);

  if (loading) return <LoadingView />;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.accent} />}
    >
      {/* Hero */}
      <View className="border-b border-navy-800 bg-navy-950 px-4 py-12">
        <View className="mb-4 flex-row items-center gap-2">
          <Pressable onPress={() => router.dismissTo('/')} className="flex-row items-center gap-1">
            <ArrowLeft size={14} color={colors.accent300} />
            <Text className="font-inter-semibold text-xs text-accent-300">Início</Text>
          </Pressable>
          <Text className="font-inter-semibold text-xs text-navy-400">/</Text>
          <Text className="font-inter-semibold text-xs text-accent-300">Colunistas</Text>
        </View>

        <View className="mb-3 flex-row items-center gap-2 self-start rounded-full border border-accent-400/30 bg-accent-500/20 px-3 py-1">
          <Feather size={13} color={colors.accent300} />
          <Text className="font-inter-bold text-xs uppercase tracking-wider text-accent-300">Espaço de Opinião & Análise</Text>
        </View>
        <Text className="font-serif text-3xl tracking-tight text-white">Nossos Colunistas</Text>
        <Text className="mt-3 font-inter text-base leading-7 text-navy-200">
          Acompanhe as reflexões, análises especializadas e pontos de vista exclusivos dos principais articulistas do JC
          Panorama 365.
        </Text>

        <View className="mt-6 flex-row items-center rounded-xl border border-navy-700 bg-navy-900/90 pl-3.5 pr-4">
          <Search size={16} color={colors.navy400} />
          <TextInput
            value={term}
            onChangeText={setTerm}
            placeholder="Buscar por nome ou área..."
            placeholderTextColor={colors.navy400}
            className="ml-2 h-11 flex-1 font-inter text-sm text-white"
          />
        </View>
      </View>

      <View className="px-4 pt-10">
        {filtered.length > 0 ? (
          <View className="gap-6">
            {filtered.map((col) => {
              const articles = selectByColumnist(news, col.id, col.name);
              const latest = articles[0];
              return (
                <View key={col.id} className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-6" style={shadows.card}>
                  <View className="mb-4 flex-row items-start gap-4">
                    <View>
                      <Avatar name={col.name} uri={col.avatar_url} size={64} />
                      <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                    </View>
                    <View className="min-w-0 flex-1">
                      <View className="mb-1.5 self-start rounded-full border border-accent-200/60 bg-accent-50 px-2.5 py-0.5">
                        <Text className="font-inter-extrabold text-[11px] uppercase tracking-wider text-accent-700">
                          {col.role || 'Colunista'}
                        </Text>
                      </View>
                      <Text className="font-inter-extrabold text-lg leading-6 text-navy-950">{col.name}</Text>
                      <View className="mt-1 flex-row items-center gap-1">
                        <BookOpen size={13} color={colors.accent} />
                        <Text className="font-inter-medium text-xs text-navy-400">
                          {articles.length} {articles.length === 1 ? 'matéria publicada' : 'matérias publicadas'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text className="mb-5 font-inter text-sm leading-6 text-navy-600" numberOfLines={3}>
                    {col.bio || 'Articulista e colunista exclusivo do JC Panorama 365.'}
                  </Text>

                  {latest ? (
                    <View className="mb-5 rounded-xl border border-navy-100 bg-navy-50/70 p-3">
                      <Text className="mb-1 font-inter-bold text-[10px] uppercase tracking-wider text-navy-400">Última publicação</Text>
                      <Text className="font-inter-semibold text-xs text-navy-900" numberOfLines={1}>
                        "{latest.title}"
                      </Text>
                    </View>
                  ) : null}

                  <Link href={{ pathname: '/colunista/[id]', params: { id: col.id } }} asChild>
                    <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 active:bg-accent-600">
                      <Text className="font-inter-bold text-sm text-white">Ver Matérias da Coluna</Text>
                      <ArrowRight size={15} color="#fff" />
                    </Pressable>
                  </Link>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="items-center rounded-2xl border border-navy-100 bg-white p-12" style={shadows.card}>
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-navy-50">
              <Users size={28} color={colors.navy400} />
            </View>
            <Text className="mb-2 font-inter-bold text-lg text-navy-900">Nenhum colunista encontrado</Text>
            <Text className="mb-6 text-center font-inter text-sm text-navy-500">
              {term ? `Não encontramos colunistas para o termo "${term}".` : 'Ainda não há colunistas cadastrados na plataforma.'}
            </Text>
            {term ? (
              <Pressable onPress={() => setTerm('')} className="rounded-lg bg-accent-500 px-4 py-2 active:bg-accent-600">
                <Text className="font-inter-semibold text-sm text-white">Limpar busca</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        {columnistArticles.length > 0 ? (
          <View className="mt-16 border-t border-navy-200 pt-12">
            <View className="mb-8">
              <View className="mb-2 flex-row items-center gap-2 self-start rounded-full border border-accent-200/60 bg-accent-50 px-3 py-1">
                <Newspaper size={13} color={colors.accent} />
                <Text className="font-inter-bold text-xs uppercase tracking-wider text-accent-700">Artigos Publicados</Text>
              </View>
              <Text className="font-serif text-2xl text-navy-950">Publicações dos Nossos Colunistas</Text>
            </View>
            <View className="gap-5">
              {columnistArticles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View className="mt-16">
        <Footer />
      </View>
    </ScrollView>
  );
}
