import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { EmptyState, LoadingView } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useColumnistsContext } from '@/context/ColumnistsContext';

export default function ColumnistsScreen() {
  const { columnists, loading, refresh } = useColumnistsContext();

  if (loading) return <LoadingView />;

  return (
    <FlatList
      className="flex-1 bg-surface"
      data={columnists}
      keyExtractor={(c) => c.id}
      contentContainerClassName="p-4 gap-3"
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.accent} />}
      ListEmptyComponent={<EmptyState title="Nenhum colunista cadastrado." />}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/colunista/[id]', params: { id: item.id } }} asChild>
          <Pressable className="flex-row items-center gap-3 rounded-xl border border-navy-100 bg-white p-4 active:opacity-80">
            <Avatar name={item.name} uri={item.avatar_url} size={52} />
            <View className="flex-1">
              <Text className="text-base font-semibold text-navy-950">{item.name}</Text>
              <Text className="text-xs font-medium uppercase tracking-wider text-accent-500">
                {item.role ?? 'Colunista'}
              </Text>
              {item.bio ? (
                <Text className="mt-1 text-xs leading-4 text-navy-500" numberOfLines={2}>
                  {item.bio}
                </Text>
              ) : null}
            </View>
            <ChevronRight size={18} color={colors.navy300} />
          </Pressable>
        </Link>
      )}
    />
  );
}
