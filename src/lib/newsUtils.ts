import type { News } from '@/types/news';

interface ImageSource {
  images?: unknown;
  image_url?: string | null;
}

/**
 * Extrai a lista ordenada de imagens de uma notícia.
 * Suporta o array `images`, `image_url` serializado em JSON e `image_url` simples.
 */
export function getArticleImages(article: ImageSource | null | undefined): string[] {
  if (!article) return [];

  if (Array.isArray(article.images)) {
    const valid = article.images.filter(
      (img): img is string => typeof img === 'string' && img.trim().length > 0
    );
    if (valid.length > 0) return valid;
  }

  const raw = article.image_url;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (img): img is string => typeof img === 'string' && img.trim().length > 0
          );
          if (valid.length > 0) return valid;
        }
      } catch {
        // não é JSON válido — segue como URL simples
      }
    }
    return [trimmed];
  }

  return [];
}

export function getCoverImage(article: News): string | null {
  return getArticleImages(article)[0] ?? null;
}

export function isColumnistArticle(article: Pick<News, 'category' | 'columnist_id' | 'columnist_name'>): boolean {
  return article.category === 'colunistas' || Boolean(article.columnist_id) || Boolean(article.columnist_name);
}

/** Remove tags HTML para gerar resumo/texto plano. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

