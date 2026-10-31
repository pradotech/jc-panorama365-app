import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, View, type NativeScrollEvent, type NativeSyntheticEvent, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  images: string[];
  width: number;
  height: number;
  showDots?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Carrossel de imagens com indicadores (bolinhas) — idêntico ao ImageCarousel do portal. */
export function ImageCarousel({ images, width, height, showDots = true, style }: Props) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <View style={[{ width, height, backgroundColor: colors.navy100 }, style]} />;
  }

  if (images.length === 1) {
    return (
      <View style={[{ width, height }, style]}>
        <Image source={images[0]} style={{ width, height }} contentFit="cover" transition={200} />
      </View>
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View style={[{ width, height }, style]}>
      <FlatList
        data={images}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => <Image source={item} style={{ width, height }} contentFit="cover" transition={200} />}
      />
      {showDots && images.length <= 8 ? (
        <View
          className="absolute flex-row items-center gap-1.5 self-center rounded-full px-2 py-1"
          style={{ bottom: 10, backgroundColor: 'rgba(0,0,0,0.4)' }}
          pointerEvents="none"
        >
          {images.map((uri, i) => (
            <View
              key={`${uri}-dot-${i}`}
              className="rounded-full"
              style={{
                width: i === index ? 16 : 6,
                height: 6,
                backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
