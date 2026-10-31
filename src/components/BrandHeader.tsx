import { Image } from 'expo-image';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/logo-full.jpg') as number;

/** Cabeçalho com a marca do portal (usado na Home). */
export function BrandHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View className="items-center border-b border-navy-100 bg-white pb-2" style={{ paddingTop: insets.top + 6 }}>
      <Image source={logo} style={{ width: 160, height: 44 }} contentFit="contain" />
    </View>
  );
}
