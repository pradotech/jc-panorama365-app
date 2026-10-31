import { Link } from 'expo-router';
import { ArrowRight, BookOpen, Clock, Feather } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, gradients, shadows } from '@/constants/theme';
import { useColumnistsContext } from '@/context/ColumnistsContext';
import { formatTimeAgo } from '@/lib/dateUtils';
import type { News } from '@/types/news';

const CARD_BG = 'rgba(21, 39, 68, 0.9)'; // #152744/90

/** "Nossos Colunistas" — idêntico ao ColumnistsSection do portal. */
export function ColumnistsSection({ articles }: { articles: News[] }) {
  const { columnists } = useColumnistsContext();
  if (articles.length === 0 && columnists.length === 0) return null;

  // Apenas o artigo mais recente de cada colunista (nunca repete o autor)
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.published_at ?? b.created_at ?? 0).getTime() - new Date(a.published_at ?? a.created_at ?? 0).getTime()
  );
  const seen = new Set<string>();
  const unique: News[] = [];
  for (const a of sorted) {
    const key = a.columnist_id ? `id_${a.columnist_id}` : (a.columnist_name ?? a.author ?? a.id).trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(a);
    }
  }
  const display = unique.slice(0, 4);

  return (
    <View className="overflow-hidden rounded-2xl p-6" style={[{ backgroundColor: colors.navy950 }, gradients.columnists, shadows.xl]}>
      <View className="mb-8 gap-4 border-b border-navy-800 pb-5">
        <View>
          <View className="mb-2 flex-row items-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-3 py-1">
            <Feather size={13} color={colors.accent400} />
            <Text className="font-inter-bold text-xs uppercase tracking-wider text-accent-300">Opinião & Análise</Text>
          </View>
          <Text className="font-serif text-2xl tracking-tight text-white">Nossos Colunistas</Text>
          <Text className="mt-1 font-inter text-sm leading-5 text-navy-200">
            Artigos exclusivos, pontos de vista e reflexões dos nossos principais articulistas.
          </Text>
        </View>

        <Link href="/colunistas" asChild>
          <Pressable className="flex-row items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2 active:bg-white/20">
            <Text className="font-inter-semibold text-sm text-white">Conhecer todos os colunistas</Text>
            <ArrowRight size={15} color="#fff" />
          </Pressable>
        </Link>
      </View>

      {display.length > 0 ? (
        <View className="gap-5">
          {display.map((article) => {
            const name = article.columnist_name ?? article.author ?? 'Colunista';
            return (
              <Link key={article.id} href={{ pathname: '/noticia/[slug]', params: { slug: article.slug } }} asChild>
                <Pressable className="rounded-xl border border-white/10 p-5 active:opacity-90" style={{ backgroundColor: CARD_BG }}>
                  <View className="mb-4 flex-row items-center gap-3 border-b border-white/10 pb-3.5">
                    <Avatar name={name} uri={article.columnist_avatar} size={48} tone="dark" />
                    <View className="min-w-0 flex-1">
                      <Text className="font-inter-bold text-[11px] uppercase tracking-wider text-accent-300" numberOfLines={1}>
                        {article.columnist_role || 'Colunista'}
                      </Text>
                      <Text className="font-inter-bold text-sm text-white" numberOfLines={1}>
                        {name}
                      </Text>
                    </View>
                  </View>

                  <Text className="mb-2 font-inter-bold text-base leading-6 text-white" numberOfLines={2}>
                    {article.title}
                  </Text>
                  {article.subtitle ? (
                    <Text className="mb-4 font-inter text-xs leading-5 text-navy-200" numberOfLines={2}>
                      {article.subtitle}
                    </Text>
                  ) : null}

                  <View className="flex-row items-center justify-between border-t border-white/10 pt-3">
                    <View className="flex-row items-center gap-1">
                      <Clock size={12} color={colors.accent400} />
                      <Text className="font-inter text-xs text-navy-300">
                        {formatTimeAgo(article.published_at, { withSuffix: true })}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="font-inter-semibold text-xs text-accent-300">Ler coluna</Text>
                      <ArrowRight size={13} color={colors.accent300} />
                    </View>
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </View>
      ) : (
        <View className="gap-4">
          {columnists.slice(0, 4).map((col) => (
            <Link key={col.id} href={{ pathname: '/colunista/[id]', params: { id: col.id } }} asChild>
              <Pressable
                className="flex-row items-center gap-3.5 rounded-xl border border-white/10 p-5 active:opacity-90"
                style={{ backgroundColor: CARD_BG }}
              >
                <Avatar name={col.name} uri={col.avatar_url} size={48} tone="dark" />
                <View className="min-w-0 flex-1">
                  <Text className="font-inter-bold text-[10px] uppercase tracking-wider text-accent-300">{col.role || 'Colunista'}</Text>
                  <Text className="font-inter-bold text-sm text-white" numberOfLines={1}>
                    {col.name}
                  </Text>
                  <View className="mt-0.5 flex-row items-center gap-1">
                    <BookOpen size={11} color={colors.accent400} />
                    <Text className="font-inter text-xs text-navy-200">Ver artigos</Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}

