import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Clock, Share2, User } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { ArticleContent } from '@/components/ArticleContent';
import { Avatar } from '@/components/Avatar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Footer } from '@/components/Footer';
import { ImageCarousel } from '@/components/ImageCarousel';
import { NewsCard } from '@/components/NewsCard';
import { LoadingView } from '@/components/StateViews';
import { getCategoryById } from '@/constants/categories';
import { colors, gradients, shadows } from '@/constants/theme';
import { useNewsContext } from '@/context/NewsContext';
import { getArticleImages } from '@/lib/newsUtils';
import { recordNewsView } from '@/services/analyticsService';
import { fetchNewsBySlug, selectRelated } from '@/services/newsService';
import { shareArticle } from '@/services/shareService';
import type { News } from '@/types/news';

const H_PADDING = 12; // px-3 do portal

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} às ${time}`;
}

/** Limpeza do HTML do editor — mesma regra do portal (cleanArticleContent). */
function cleanArticleContent(html: string | null): string {
  if (!html) return '';
  return html
    .replace(/<p([^>]*)>(\s|&nbsp;|<br\s*\/?>|<\/?span[^>]*>)*<\/p>/gi, '<p$1><br></p>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF\u2060]/g, '')
    .replace(
      /([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ])-(\s*<br\s*\/?>\s*|\s*<\/p>\s*<p[^>]*>\s*|\s*\n\s*)([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ])/gi,
      '$1$3'
    );
}

function BackHomeButton({ large = false }: { large?: boolean }) {
  return (
    <Pressable
      onPress={() => router.dismissTo('/')}
      className={`flex-row items-center self-center rounded-full border border-navy-200 bg-white active:bg-navy-50 ${
        large ? 'gap-2.5 px-6 py-3' : 'gap-2 self-start px-3.5 py-1.5'
      }`}
      style={large ? shadows.card : undefined}
    >
      <ArrowLeft size={large ? 18 : 16} color={colors.navy500} />
      <Text className={`${large ? 'font-inter-bold text-sm text-navy-800' : 'font-inter-semibold text-xs text-navy-700'}`}>
        Voltar para tela inicial
      </Text>
    </Pressable>
  );
}

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { news, getBySlug, loading: listLoading } = useNewsContext();
  const { width } = useWindowDimensions();

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

  const related = useMemo(() => (article ? selectRelated(news, article, 3) : []), [news, article]);

  if (!article) {
    if (fetching || listLoading) return <LoadingView />;
    return (
      <View className="flex-1 items-center bg-surface px-4 py-20">
        <Text className="mb-4 text-center font-inter-bold text-3xl text-navy-900">Notícia não encontrada</Text>
        <Text className="mb-6 text-center font-inter text-navy-500">Ela pode ter sido removida ou despublicada.</Text>
        <BackHomeButton large />
      </View>
    );
  }

  const images = getArticleImages(article);
  const category = getCategoryById(article.category);
  const contentWidth = width - H_PADDING * 2;
  const columnistHref = article.columnist_id
    ? ({ pathname: '/colunista/[id]', params: { id: article.columnist_id } } as const)
    : null;

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-3 pt-2">
        <View className="mb-3">
          <BackHomeButton />
        </View>

        {/* Cabeçalho da matéria */}
        <View className="mb-3 rounded-2xl border border-navy-100 bg-white p-3.5" style={shadows.card}>
          <View className="mb-2 flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-1.5">
              <Pressable onPress={() => router.dismissTo('/')} className="flex-row items-center gap-1">
                <ArrowLeft size={13} color={colors.navy400} />
                <Text className="font-inter text-xs text-navy-400">Início</Text>
              </Pressable>
              <Text className="font-inter text-xs text-navy-300">/</Text>
              {category ? (
                <Link href={{ pathname: '/categoria/[slug]', params: { slug: category.slug } }}>
                  <Text className="font-inter-semibold text-xs" style={{ color: category.color }}>
                    {category.name}
                  </Text>
                </Link>
              ) : null}
            </View>
            <CategoryBadge categoryId={article.category} />
          </View>

          <Text className="mb-1.5 font-serif text-2xl leading-[30px] text-navy-950">{article.title}</Text>
          {article.subtitle ? (
            <Text className="mb-2.5 font-inter text-sm leading-6 text-navy-600">{article.subtitle}</Text>
          ) : null}

          <View className="flex-row items-center justify-between gap-3 border-t border-navy-100 pt-2.5">
            <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
              {article.columnist_name ? (
                <Avatar name={article.columnist_name} uri={article.columnist_avatar} size={40} />
              ) : (
                <View className="h-9 w-9 items-center justify-center rounded-full bg-navy-100">
                  <User size={16} color={colors.navy700} />
                </View>
              )}
              <View className="min-w-0 flex-1">
                <Text
                  className={`mb-0.5 text-[10px] uppercase tracking-wider ${
                    article.columnist_name ? 'font-inter-extrabold text-accent-600' : 'font-inter-bold text-navy-400'
                  }`}
                  numberOfLines={1}
                >
                  {article.columnist_name ? article.columnist_role || 'Colunista' : 'Autor'}
                </Text>
                <Text className="font-inter-extrabold text-sm text-navy-950" numberOfLines={1}>
                  {article.columnist_name ?? article.author ?? 'Redação'}
                </Text>
                <View className="mt-0.5 flex-row items-center gap-1">
                  <Clock size={11} color={colors.navy400} />
                  <Text className="font-inter text-[11px] text-navy-500">{formatDateShort(article.published_at)}</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => void shareArticle(article)}
              className="flex-row items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1.5 active:bg-accent-50"
            >
              <Share2 size={14} color={colors.accent600} />
              <Text className="font-inter-bold text-xs text-navy-800">Compartilhar</Text>
            </Pressable>
          </View>
        </View>

        {/* Galeria */}
        {images.length > 0 ? (
          <View className="mb-4 overflow-hidden rounded-2xl border border-navy-100 bg-slate-900" style={shadows.card}>
            <ImageCarousel images={images} width={contentWidth - 2} height={Math.round(((contentWidth - 2) * 3) / 4)} />
          </View>
        ) : null}

        {/* Conteúdo */}
        <View className="mb-8 rounded-2xl border border-navy-100 bg-white p-6" style={shadows.card}>
          {article.content ? <ArticleContent html={cleanArticleContent(article.content)} horizontalInset={H_PADDING + 24} /> : null}
        </View>

        {/* Bloco do colunista / autor */}
        {article.columnist_name ? (
          <View
            className="mb-8 items-center gap-5 overflow-hidden rounded-2xl border border-navy-700/50 p-6"
            style={[{ backgroundColor: colors.navy950 }, gradients.columnists, shadows.xl]}
          >
            {article.columnist_avatar ? (
              <Image
                source={article.columnist_avatar}
                style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: colors.accent400 }}
                contentFit="cover"
              />
            ) : (
              <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-accent-600">
                <Text className="font-inter-bold text-3xl text-white">{article.columnist_name.charAt(0)}</Text>
              </View>
            )}
            <View className="items-center">
              <View className="mb-2 flex-row flex-wrap items-center justify-center gap-2.5">
                <View className="rounded-full bg-accent-500 px-3 py-1">
                  <Text className="font-inter-extrabold text-xs uppercase tracking-wider text-white">
                    {article.columnist_role || 'Colunista'}
                  </Text>
                </View>
                <Text className="font-inter-semibold text-xs tracking-wide text-accent-200">JC Panorama 365</Text>
              </View>
              <Text className="mb-2 text-center font-inter-extrabold text-2xl tracking-tight text-white">
                {article.columnist_name}
              </Text>
              <Text className="mb-4 text-center font-inter text-sm leading-6 text-slate-200/90">
                {article.columnist_bio || 'Articulista e colunista exclusivo do JC Panorama 365.'}
              </Text>
              {columnistHref ? (
                <Link href={columnistHref} asChild>
                  <Pressable className="flex-row items-center gap-2 rounded-xl bg-accent-500 px-4 py-2 active:bg-accent-600">
                    <Text className="font-inter-bold text-xs text-white">Ver todas as matérias de {article.columnist_name}</Text>
                    <ArrowRight size={14} color="#fff" />
                  </Pressable>
                </Link>
              ) : null}
            </View>
          </View>
        ) : (
          <View className="mb-8 rounded-2xl bg-white p-6" style={shadows.card}>
            <View className="flex-row items-center gap-4">
              <View
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{ experimental_backgroundImage: 'linear-gradient(to bottom right, #4287ff, #1a4b8c)' }}
              >
                <Text className="font-inter-bold text-xl text-white">{article.author ? article.author.charAt(0) : 'J'}</Text>
              </View>
              <View>
                <Text className="font-inter-bold text-navy-900">{article.author || 'Redação'}</Text>
                <Text className="font-inter text-sm text-navy-500">Jornalista — JC Panorama 365</Text>
              </View>
            </View>
          </View>
        )}

        <View className="my-8">
          <BackHomeButton large />
        </View>
      </View>

      {/* Notícias relacionadas */}
      {related.length > 0 ? (
        <View className="px-4 pb-12">
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-8 w-1 rounded-full" style={{ backgroundColor: category?.color ?? colors.accent }} />
            <Text className="font-inter-bold text-2xl text-navy-900">Notícias relacionadas</Text>
          </View>
          <View className="gap-5">
            {related.map((r) => (
              <NewsCard key={r.id} article={r} />
            ))}
          </View>
        </View>
      ) : null}

      <Footer />
    </ScrollView>
  );
}
