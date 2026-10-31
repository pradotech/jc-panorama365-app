import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import { ChevronLeft, Feather, Menu, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories } from '@/constants/categories';
import { colors, shadows } from '@/constants/theme';

const logo = require('../../assets/images/logo-full.jpg') as number;
const LOGO_RATIO = 949 / 283;
const LOGO_HEIGHT = 44;

/** Cabeçalho do portal: barra da data + logo + busca + menu de editorias. */
export function AppHeader({ canGoBack = false }: { canGoBack?: boolean }) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    setQuery('');
    setSearchOpen(false);
    router.push({ pathname: '/busca', params: { q } });
  };

  const go = (href: Parameters<typeof router.push>[0]) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <View className="bg-white" style={[shadows.header, { zIndex: 40 }]}>
      {/* Barra superior com a data */}
      <View className="bg-navy-950 px-4 py-1.5" style={{ paddingTop: insets.top + 6 }}>
        <Text className="font-inter text-xs capitalize text-navy-300">{today}</Text>
      </View>

      {/* Barra do logo */}
      <View className="border-b border-navy-100">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-1">
            {canGoBack ? (
              <Pressable onPress={() => router.back()} hitSlop={10} className="-ml-2 rounded-lg p-1 active:bg-navy-50" accessibilityLabel="Voltar">
                <ChevronLeft size={26} color={colors.navy600} />
              </Pressable>
            ) : null}
            <Pressable onPress={() => router.dismissTo('/')} accessibilityLabel="JC Panorama 365 — Início">
              <Image source={logo} style={{ height: LOGO_HEIGHT, width: LOGO_HEIGHT * LOGO_RATIO }} contentFit="contain" />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-1">
            <Pressable onPress={() => setSearchOpen((v) => !v)} className="rounded-lg p-2 active:bg-navy-50" accessibilityLabel="Buscar">
              <Search size={20} color={colors.navy600} />
            </Pressable>
            <Pressable onPress={() => setMenuOpen(true)} className="rounded-lg p-2 active:bg-navy-50" accessibilityLabel="Menu">
              <Menu size={22} color={colors.navy600} />
            </Pressable>
          </View>
        </View>

        {searchOpen ? (
          <View className="px-4 pb-3">
            <View className="flex-row items-center rounded-full border border-navy-200 bg-navy-50 pl-3.5 pr-4">
              <Search size={16} color={colors.navy400} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={submitSearch}
                placeholder="Buscar notícias..."
                placeholderTextColor={colors.navy400}
                returnKeyType="search"
                autoFocus
                className="ml-2 h-10 flex-1 font-inter text-sm text-navy-700"
              />
            </View>
          </View>
        ) : null}
      </View>

      {/* Menu de editorias (equivalente ao menu mobile do portal) */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setMenuOpen(false)}>
          <Pressable className="bg-white" style={[{ paddingTop: insets.top }, shadows.xl]} onPress={() => {}}>
            <View className="flex-row items-center justify-between border-b border-navy-100 px-4 py-3">
              <Image source={logo} style={{ height: 40, width: 40 * LOGO_RATIO }} contentFit="contain" />
              <Pressable onPress={() => setMenuOpen(false)} className="rounded-lg p-2 active:bg-navy-50" accessibilityLabel="Fechar menu">
                <X size={22} color={colors.navy600} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 520 }} contentContainerClassName="gap-1 px-4 py-3">
              <MenuItem label="Início" active={pathname === '/'} onPress={() => go('/')} bold />
              {categories
                .filter((c) => c.id !== 'colunistas')
                .map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <MenuItem
                      key={cat.id}
                      label={cat.name}
                      icon={<Icon size={16} color={cat.color} />}
                      active={pathname === `/categoria/${cat.slug}`}
                      onPress={() => go({ pathname: '/categoria/[slug]', params: { slug: cat.slug } })}
                    />
                  );
                })}
              <MenuItem
                label="Nossos Colunistas"
                icon={<Feather size={16} color={colors.accent} />}
                active={pathname.startsWith('/colunista')}
                onPress={() => go('/colunistas')}
                bold
              />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function MenuItem({
  label,
  icon,
  active,
  bold = false,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  bold?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-2.5 rounded-lg px-4 py-2.5 active:bg-navy-50 ${active ? 'bg-navy-50' : ''}`}
    >
      {icon}
      <Text className={`text-sm ${bold ? 'font-inter-semibold' : 'font-inter-medium'} ${active ? 'text-accent-600' : 'text-navy-700'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

