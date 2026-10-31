import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Text, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

/** Carrossel de imagens da matéria (paginação horizontal). */
export function ImageCarousel({ images }: { images: string[] }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const height = Math.round((width * 9) / 16);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return <Image source={images[0]} style={{ width, height }} contentFit="cover" transition={200} />;
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => <Image source={item} style={{ width, height }} contentFit="cover" transition={200} />}
      />
      <View className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1">
        <Text className="text-xs font-semibold text-white">
          {index + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
}

