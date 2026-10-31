export type NewsStatus = 'draft' | 'published';

/** Linha da tabela `news` no Supabase (mesmo banco do portal web). */
export interface NewsRow {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string | null;
  category: string;
  image_url: string | null;
  images: string[] | null;
  author: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  status: NewsStatus;
  featured: boolean | null;
  show_on_home: boolean | null;
  home_order: number | null;
  columnist_id: string | null;
  columnist_name: string | null;
  columnist_avatar: string | null;
  columnist_bio: string | null;
  columnist_role: string | null;
}

/** Notícia normalizada para uso no app. */
export interface News extends Omit<NewsRow, 'images'> {
  images: string[];
}

export interface Columnist {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  created_at: string | null;
}
