import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
  type CustomBlockRenderer,
  type MixedStyleRecord,
} from '@native-html/render';
import { memo } from 'react';
import { Linking, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@/constants/theme';

const H_PADDING = 20;

const tagsStyles: MixedStyleRecord = {
  body: { color: colors.navy900, fontSize: 17, lineHeight: 28 },
  p: { marginTop: 0, marginBottom: 16 },
  h2: { fontSize: 21, lineHeight: 28, fontWeight: '700', color: colors.navy950, marginTop: 8, marginBottom: 12 },
  h3: { fontSize: 19, lineHeight: 26, fontWeight: '700', color: colors.navy950, marginTop: 8, marginBottom: 10 },
  a: { color: colors.accent, textDecorationLine: 'underline' },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 14,
    marginLeft: 0,
    marginVertical: 16,
    fontStyle: 'italic',
    color: colors.navy700,
  },
  img: { borderRadius: 8 },
  li: { marginBottom: 6 },
  strong: { fontWeight: '700' },
};

// Permite renderizar <iframe> (vídeos do YouTube etc.) como bloco
const customHTMLElementModels = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.block,
  }),
};

const IframeRenderer: CustomBlockRenderer = ({ tnode }) => {
  const { width } = useWindowDimensions();
  const src = typeof tnode.attributes.src === 'string' ? tnode.attributes.src : '';
  if (!src) return null;
  const w = width - H_PADDING * 2;
  const uri = src.startsWith('//') ? `https:${src}` : src;
  return (
    <View style={{ width: w, height: Math.round((w * 9) / 16), marginVertical: 12, borderRadius: 8, overflow: 'hidden' }}>
      <WebView source={{ uri }} allowsFullscreenVideo allowsInlineMediaPlayback mediaPlaybackRequiresUserAction />
    </View>
  );
};

const renderers = { iframe: IframeRenderer };

const renderersProps = {
  a: {
    onPress: (_event: unknown, href: string) => {
      if (href) void Linking.openURL(href);
    },
  },
};

/** Corpo da matéria (HTML gerado pelo editor do painel admin). */
export const ArticleContent = memo(function ArticleContent({ html }: { html: string }) {
  const { width } = useWindowDimensions();
  return (
    <RenderHTML
      contentWidth={width - H_PADDING * 2}
      source={{ html }}
      tagsStyles={tagsStyles}
      customHTMLElementModels={customHTMLElementModels}
      renderers={renderers}
      renderersProps={renderersProps}
      enableExperimentalMarginCollapsing
    />
  );
});

