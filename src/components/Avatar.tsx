import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface Props {
  name: string;
  uri?: string | null;
  size?: number;
  /** "light": borda azul sobre fundo claro; "dark": sobre fundo escuro (seção colunistas). */
  tone?: 'light' | 'dark';
}

/** Avatar de colunista com borda azul (idêntico ao portal). */
export function Avatar({ name, uri, size = 48, tone = 'light' }: Props) {
  const borderColor = tone === 'dark' ? '#4287ff' : '#1E56A0';

  if (uri) {
    return (
      <Image
        source={uri}
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor }}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: tone === 'dark' ? 2 : 1,
        borderColor: tone === 'dark' ? '#4287ff' : '#6ba1ff',
        backgroundColor: tone === 'dark' ? '#1E56A0' : '#bdd6ff',
      }}
    >
      <Text className="font-inter-extrabold" style={{ fontSize: size * 0.36, color: tone === 'dark' ? '#fff' : '#153f78' }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
