import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { categories } from '@/constants/categories';
import { colors } from '@/constants/theme';

const logo = require('../../assets/images/logo-full.jpg') as number;

/** Rodapé — idêntico ao Footer do portal (layout de 1 coluna do celular). */
export function Footer() {
  return (
    <View className="bg-navy-950">
      <View className="gap-10 px-4 py-12">
        <View>
          <View className="mb-4 self-start rounded-lg bg-white px-4 py-2">
            <Image source={logo} style={{ height: 40, width: 134 }} contentFit="contain" />
          </View>
          <Text className="font-inter text-sm leading-6 text-navy-300">
            Informação que conecta. Todos os dias. Seu portal de notícias com cobertura completa e independente.
          </Text>
        </View>

        <View>
          <Text className="mb-4 font-inter-bold text-sm uppercase tracking-wider text-navy-200">Editorias</Text>
          <View className="gap-2.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'colunistas' ? '/colunistas' : { pathname: '/categoria/[slug]', params: { slug: cat.slug } }}
                asChild
              >
                <Pressable className="flex-row items-center gap-2 active:opacity-60">
                  <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <Text className="font-inter text-sm text-navy-400">{cat.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View>
          <Text className="mb-4 font-inter-bold text-sm uppercase tracking-wider text-navy-200">Contato</Text>
          <View className="flex-row items-start gap-2.5">
            <Mail size={16} color={colors.accent400} />
            <Text className="font-inter text-sm text-navy-400">redacao@jcpanorama365.com.br</Text>
          </View>
        </View>
      </View>

      <View className="items-center gap-2 border-t border-white/10 px-4 py-4">
        <Text className="font-inter text-xs text-navy-500">
          © {new Date().getFullYear()} JC Panorama 365. Todos os direitos reservados.
        </Text>
        <Text className="font-inter text-xs text-navy-500">Informação que conecta. Todos os dias.</Text>
      </View>
    </View>
  );
}

