import { Link } from 'expo-router';
import { Clock, TrendingUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { CategoryBadge } from '@/components/CategoryBadge';
import { gradients, shadows } from '@/constants/theme';
import { formatTimeAgo } from '@/lib/dateUtils';
import type { News } from '@/types/news';

function BlockHeader({ icon, title, gradient }: { icon: React.ReactNode; title: string; gradient: object }) {
  return (
    <View className="flex-row items-center gap-2 px-5 py-4" style={gradient}>
      {icon}
      <Text className="font-inter-bold text-base text-white">{title}</Text>
    </View>
  );
}

/** "Mais Lidas" + "Últimas Notícias" — idêntico ao Sidebar do portal. */
export function SidebarBlocks({ news }: { news: News[] }) {
  return (
    <View className="gap-6">
      <View className="overflow-hidden rounded-2xl bg-white" style={shadows.card}>
        <BlockHeader icon={<TrendingUp size={18} color="#fff" />} title="Mais Lidas" gradient={gradients.mostRead} />
        {news.slice(0, 5).map((item, i) => (
          <Link key={item.id} href={{ pathname: '/noticia/[slug]', params: { slug: item.slug } }} asChild>
            <Pressable
              className={`flex-row items-start gap-3 px-5 py-3.5 active:bg-navy-50 ${i > 0 ? 'border-t border-navy-50' : ''}`}
            >
              <Text className="w-8 font-inter-black text-2xl text-navy-200">{String(i + 1).padStart(2, '0')}</Text>
              <View className="min-w-0 flex-1 gap-1">
                <Text className="font-inter-semibold text-sm leading-5 text-navy-800">{item.title}</Text>
                <CategoryBadge categoryId={item.category} />
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      <View className="overflow-hidden rounded-2xl bg-white" style={shadows.card}>
        <BlockHeader icon={<Clock size={18} color="#fff" />} title="Últimas Notícias" gradient={gradients.latest} />
        {news.slice(0, 6).map((item, i) => (
          <Link key={item.id} href={{ pathname: '/noticia/[slug]', params: { slug: item.slug } }} asChild>
            <Pressable className={`px-5 py-3.5 active:bg-navy-50 ${i > 0 ? 'border-t border-navy-50' : ''}`}>
              <Text className="mb-1.5 font-inter-semibold text-sm leading-5 text-navy-800">{item.title}</Text>
              <View className="flex-row items-center justify-between">
                <CategoryBadge categoryId={item.category} />
                <Text className="font-inter text-xs text-navy-400">
                  {formatTimeAgo(item.published_at, { withSuffix: true })}
                </Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

