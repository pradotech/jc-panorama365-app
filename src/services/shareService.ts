import { Share } from 'react-native';
import { PORTAL_URL } from '@/constants/theme';
import type { News } from '@/types/news';

/** Link público da matéria no portal web (abre a página com preview no WhatsApp). */
export function getArticleUrl(article: Pick<News, 'slug'>): string {
  return PORTAL_URL ? `${PORTAL_URL.replace(/\/$/, '')}/noticia/${article.slug}` : '';
}

/** Abre a planilha nativa de compartilhamento (WhatsApp, Telegram, e-mail etc.). */
export async function shareArticle(article: Pick<News, 'slug' | 'title'>): Promise<void> {
  const url = getArticleUrl(article);
  const message = url ? `${article.title}\n\n${url}` : article.title;
  try {
    await Share.share({ title: article.title, message, url: url || undefined });
  } catch (e) {
    console.warn('Falha ao compartilhar:', e);
  }
}
