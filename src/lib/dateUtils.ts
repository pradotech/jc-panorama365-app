interface TimeAgoOptions {
  withSuffix?: boolean;
}

/**
 * Formata o tempo decorrido desde a publicação.
 * "Agora" (< 1min ou futuro), "Xmin", "Xh", "Xd" ou data abreviada ("20 out").
 */
export function formatTimeAgo(dateStr: string | null | undefined, { withSuffix = false }: TimeAgoOptions = {}): string {
  if (!dateStr) return '';

  const postDate = new Date(dateStr);
  const time = postDate.getTime();
  if (Number.isNaN(time)) return '';

  const diffMs = Date.now() - time;
  if (diffMs < 60000) return 'Agora';

  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return withSuffix ? `${mins}min atrás` : `${mins}min`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return withSuffix ? `${hours}h atrás` : `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return withSuffix ? `${days}d atrás` : `${days}d`;

  return postDate
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    .replace('.', '');
}

/** Data completa para o cabeçalho da matéria: "30 de outubro de 2026, 14:30". */
export function formatFullDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Data YYYY-MM-DD no fuso de Brasília. */
export function getLocalDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
