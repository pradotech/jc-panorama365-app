import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  name: string;
  uri?: string | null;
  size?: number;
}

export function Avatar({ name, uri, size = 48 }: Props) {
  if (uri) {
    return (
      <Image
        source={uri}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.navy100 }}
        contentFit="cover"
        transition={150}
      />
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.navy950 }}
    >
      <Text className="font-bold text-white" style={{ fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
}

