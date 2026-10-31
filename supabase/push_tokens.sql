-- =========================================================
-- Push notifications do app JC (Expo)
-- STATUS: NÃO APLICADO — revisar e executar no SQL Editor do Supabase.
-- Impacto: cria apenas objetos NOVOS; não altera tabelas usadas pelo portal.
-- =========================================================

-- 1. Tabela de tokens dos dispositivos
CREATE TABLE IF NOT EXISTS public.push_tokens (
  token TEXT PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS ligado e SEM políticas: anon/authenticated não leem nem escrevem diretamente.
-- O registro acontece somente via função abaixo; o envio usa a service role (Edge Function).
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- 2. Função de registro chamada pelo app (supabase.rpc('register_push_token'))
CREATE OR REPLACE FUNCTION public.register_push_token(p_token TEXT, p_platform TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_token IS NULL OR p_token !~ '^Expo(nent)?PushToken\[.+\]$' THEN
    RAISE EXCEPTION 'Token inválido';
  END IF;
  IF p_platform NOT IN ('ios', 'android') THEN
    RAISE EXCEPTION 'Plataforma inválida';
  END IF;

  INSERT INTO public.push_tokens (token, platform)
  VALUES (p_token, p_platform)
  ON CONFLICT (token) DO UPDATE SET platform = EXCLUDED.platform, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.register_push_token(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_push_token(TEXT, TEXT) TO anon, authenticated;
