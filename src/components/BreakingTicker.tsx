import { Link } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { colors } from '@/constants/theme';
import type { News } from '@/types/news';

const SPEED_PX_PER_SEC = 50;
const ITEM_GAP = 28;

function TickerItems({ items }: { items: News[] }) {
  return (
    <View style={styles.itemsRow}>
      {items.map((item) => (
        <Link key={item.id} href={{ pathname: '/noticia/[slug]', params: { slug: item.slug } }} asChild>
          <Pressable style={styles.itemPressable} hitSlop={6}>
            <View style={styles.bullet} />
            <Text style={styles.itemText} numberOfLines={1}>
              {item.title}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

/**
 * Faixa "Últimas" com rolagem contínua infinita (letreiro) perfeitamente fluida.
 * Usa Animated nativo com useNativeDriver para garantir 60fps no iOS e Android
 * sem risco de congelamento por UIScrollView ou acessibilidade do simulador.
 */
export function BreakingTicker({ items }: { items: News[] }) {
  const [contentWidth, setContentWidth] = useState(0);
  const animX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (contentWidth <= 0) return;

    animX.setValue(0);
    const duration = (contentWidth / SPEED_PX_PER_SEC) * 1000;

    const animation = Animated.loop(
      Animated.timing(animX, {
        toValue: -contentWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [contentWidth, animX]);

  if (!items || items.length === 0) return null;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0 && w !== contentWidth) {
      setContentWidth(w);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Zap size={13} color="#fff" />
        <Text style={styles.badgeText}>Últimas</Text>
      </View>

      <View style={styles.marqueeTrack}>
        <Animated.View
          style={[
            styles.animatedStrip,
            {
              transform: [{ translateX: animX }],
            },
          ]}
        >
          {/* Primeiro bloco medido */}
          <View onLayout={onLayout} style={styles.itemsRow}>
            <TickerItems items={items} />
          </View>
          {/* Segundo bloco idêntico para loop infinito contínuo */}
          <View style={styles.itemsRow}>
            <TickerItems items={items} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.breaking,
    height: 38,
    overflow: 'hidden',
  },
  badge: {
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: '100%',
    backgroundColor: colors.breakingDark,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  marqueeTrack: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  animatedStrip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginRight: ITEM_GAP,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  itemText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
