import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
  defaultSystemFonts,
  type CustomBlockRenderer,
  type MixedStyleRecord,
} from '@native-html/render';
import { memo, useMemo } from 'react';
import { Linking, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@/constants/theme';

// Fontes carregadas no _layout precisam ser registradas para o RenderHTML aceitá-las
const systemFonts = [...defaultSystemFonts, 'Inter_400Regular', 'Inter_600SemiBold', 'Inter_700Bold', 'Merriweather_700Bold'];

/** Estilos equivalentes ao .article-content / .ql-editor do portal. */
const tagsStyles: MixedStyleRecord = {
  body: { color: colors.navy800, fontSize: 16, lineHeight: 27, fontFamily: 'Inter_400Regular' },
  p: { marginTop: 0, marginBottom: 12 },
  h1: { fontSize: 24, lineHeight: 30, fontFamily: 'Inter_700Bold', color: colors.navy950, marginTop: 8, marginBottom: 12 },
  h2: { fontSize: 21, lineHeight: 28, fontFamily: 'Inter_700Bold', color: colors.navy950, marginTop: 8, marginBottom: 12 },
  h3: { fontSize: 19, lineHeight: 26, fontFamily: 'Inter_700Bold', color: colors.navy950, marginTop: 8, marginBottom: 10 },
  strong: { fontFamily: 'Inter_700Bold', fontWeight: 'normal' },
  b: { fontFamily: 'Inter_700Bold', fontWeight: 'normal' },
  a: { color: colors.accent, textDecorationLine: 'underline' },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 16,
    fontStyle: 'italic',
    color: colors.navy700,
  },
  img: { borderRadius: 8 },
  li: { marginBottom: 6 },
};

// Permite renderizar <iframe> (vídeos do YouTube etc.) como bloco
const customHTMLElementModels = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.block,
  }),
};

function makeIframeRenderer(contentWidth: number): CustomBlockRenderer {
  return function IframeRenderer({ tnode }) {
    const src = typeof tnode.attributes.src === 'string' ? tnode.attributes.src : '';
    if (!src) return null;
    const uri = src.startsWith('//') ? `https:${src}` : src;
    return (
      <View style={{ width: contentWidth, height: Math.round((contentWidth * 9) / 16), marginVertical: 12, borderRadius: 8, overflow: 'hidden' }}>
        <WebView source={{ uri }} allowsFullscreenVideo allowsInlineMediaPlayback mediaPlaybackRequiresUserAction />
      </View>
    );
  };
}

const renderersProps = {
  a: {
    onPress: (_event: unknown, href: string) => {
      if (href) void Linking.openURL(href);
    },
  },
};

interface Props {
  html: string;
  /** Soma dos espaçamentos laterais entre a tela e o texto (cada lado). */
  horizontalInset?: number;
}

/** Corpo da matéria (HTML gerado pelo editor do painel admin). */
export const ArticleContent = memo(function ArticleContent({ html, horizontalInset = 20 }: Props) {
  const { width } = useWindowDimensions();
  const contentWidth = width - horizontalInset * 2;
  const renderers = useMemo(() => ({ iframe: makeIframeRenderer(contentWidth) }), [contentWidth]);

  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={{ html }}
      tagsStyles={tagsStyles}
      systemFonts={systemFonts}
      customHTMLElementModels={customHTMLElementModels}
      renderers={renderers}
      renderersProps={renderersProps}
      enableExperimentalMarginCollapsing
    />
  );
});
