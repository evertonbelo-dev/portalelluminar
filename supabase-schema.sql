-- ==========================================================
-- Portal El'Luminar — Schema do Supabase (v2.1.0)
-- Execute este SQL no SQL Editor do Supabase Dashboard
--
-- 100% IDEMPOTENTE: pode rodar quantas vezes quiser, sem erro.
-- Toda policy e precedida de "DROP POLICY IF EXISTS", pois
-- CREATE POLICY nao aceita IF NOT EXISTS (erro 42710).
-- ==========================================================

-- 0. Funcao auxiliar is_admin() + papeis de usuario
--    (necessaria para as policies de leitura administrativa abaixo)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = $1 AND role IN ('admin', 'master')
  )
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios podem ver proprio papel" ON public.user_roles;
CREATE POLICY "Usuarios podem ver proprio papel"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins podem ver todos" ON public.user_roles;
CREATE POLICY "Admins podem ver todos"
    ON public.user_roles FOR SELECT
    USING (public.is_admin(auth.uid()));

-- Escrita em user_roles: sem isto os botoes "Tornar Admin",
-- "Remover Admin" e "Excluir" do painel falham com RLS (o frontend
-- usa a chave anon, nao existe service_role no navegador).
DROP POLICY IF EXISTS "Admins podem gerenciar papeis" ON public.user_roles;
CREATE POLICY "Admins podem gerenciar papeis"
    ON public.user_roles FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 0.1 Tabela de configuracoes do site (lida por js/admin-config.js)
CREATE TABLE IF NOT EXISTS public.site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Todos leem config" ON public.site_config;
CREATE POLICY "Todos leem config"
    ON public.site_config FOR SELECT
    USING (true);
DROP POLICY IF EXISTS "Admins gerenciam config" ON public.site_config;
CREATE POLICY "Admins gerenciam config"
    ON public.site_config FOR ALL
    USING (public.is_admin(auth.uid()));

INSERT INTO public.site_config (key, value) VALUES
    ('modelo_ia', '{"id": "deepseek/deepseek-v4-flash-0731", "nome": "DeepSeek V4 Flash"}'),
    ('afirmacao_footer', '{"valor": "\"Que a Luz de Sirius guie teus passos.\""}'),
    ('cores', '{"ouro_solar": "#ffaa00", "dourado_antigo": "#d4af37", "azul_profundo": "#050510"}')
ON CONFLICT (key) DO NOTHING;

-- ==========================================================
-- 1. Tabela: readings (Leituras de Tarô)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.readings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consulente TEXT NOT NULL,
    tipo_tiragem TEXT NOT NULL,
    cartas JSONB NOT NULL DEFAULT '[]',
    pergunta TEXT,
    interpretacao TEXT,
    essencia TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela: course_progress (Progresso dos Cursos)
CREATE TABLE IF NOT EXISTS public.course_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    curso_id TEXT NOT NULL,
    concluidos JSONB NOT NULL DEFAULT '[]',
    anotacoes JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, curso_id)
);

-- 3. Tabela: session_history (Histórico de Sessões)
CREATE TABLE IF NOT EXISTS public.session_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_sessao TEXT NOT NULL, -- 'hawkins', 'bovis', 'numerologia', 'dna'
    dados_sessao JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela: user_profiles (Perfil do Usuário + consentimento de marketing)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT,
    name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    birth_date DATE,
    preferences JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT false,
    consent_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.1 Migração v2.1.0: garante as colunas novas caso a tabela já exista
--     no formato legado (apenas display_name/avatar_url)
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS consent_date TIMESTAMPTZ;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- UNIQUE(user_id) é obrigatório para o upsert onConflict:'user_id'
DO $$ BEGIN
    ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ==========================================================
-- ÍNDICES (para performance)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON public.readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON public.readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON public.session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_tipo ON public.session_history(tipo_sessao);
CREATE INDEX IF NOT EXISTS idx_user_profiles_consent ON public.user_profiles(marketing_consent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- ==========================================================
-- RLS (Row Level Security) — SEGURANÇA
-- ==========================================================

-- readings: usuários só veem suas próprias leituras
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias leituras" ON public.readings;
CREATE POLICY "Usuários podem ver suas próprias leituras"
    ON public.readings FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias leituras" ON public.readings;
CREATE POLICY "Usuários podem inserir suas próprias leituras"
    ON public.readings FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias leituras" ON public.readings;
CREATE POLICY "Usuários podem deletar suas próprias leituras"
    ON public.readings FOR DELETE
    USING (auth.uid() = user_id);
-- Necessaria para anexar o texto da IA apos o salvamento imediato
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias leituras" ON public.readings;
CREATE POLICY "Usuários podem atualizar suas próprias leituras"
    ON public.readings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- course_progress: progresso pessoal do curso
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio progresso" ON public.course_progress;
CREATE POLICY "Usuários podem ver seu próprio progresso"
    ON public.course_progress FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Usuários podem inserir/atualizar seu próprio progresso" ON public.course_progress;
CREATE POLICY "Usuários podem inserir/atualizar seu próprio progresso"
    ON public.course_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- session_history: histórico pessoal
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio histórico" ON public.session_history;
CREATE POLICY "Usuários podem ver seu próprio histórico"
    ON public.session_history FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio histórico" ON public.session_history;
CREATE POLICY "Usuários podem inserir seu próprio histórico"
    ON public.session_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- user_profiles: cada usuário só vê/edita o próprio perfil; admins veem todos
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ATENÇÃO: remove a policy legada que expunha TODOS os perfis (inclusive emails)
DROP POLICY IF EXISTS "Perfis são públicos para leitura" ON public.user_profiles;
DROP POLICY IF EXISTS "Perfis sao publicos para leitura" ON public.user_profiles;

DROP POLICY IF EXISTS "Usuarios podem ver proprio perfil" ON public.user_profiles;
CREATE POLICY "Usuarios podem ver proprio perfil"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.user_profiles;
CREATE POLICY "Admins podem ver todos os perfis"
    ON public.user_profiles FOR SELECT
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Usuarios podem inserir/atualizar proprio perfil" ON public.user_profiles;
CREATE POLICY "Usuarios podem inserir/atualizar proprio perfil"
    ON public.user_profiles FOR ALL
    USING (auth.uid() = user_id);

-- Remove a policy legada de edição (substituída pela de cima)
DROP POLICY IF EXISTS "Usuários podem editar seu próprio perfil" ON public.user_profiles;

-- ==========================================================
-- TRIGGER: Criar perfil automaticamente ao cadastrar
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, name, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (user_id) DO NOTHING;  -- evita erro 23505 se o perfil já existir
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- 5. BACKFILL: preenche email/name dos perfis antigos
--    (o trigger legado só gravava display_name)
-- ==========================================================
UPDATE public.user_profiles p
SET email        = COALESCE(p.email, u.email),
    name         = COALESCE(p.name, p.display_name, u.raw_user_meta_data->>'name', u.email),
    display_name = COALESCE(p.display_name, u.raw_user_meta_data->>'name', u.email)
FROM auth.users u
WHERE u.id = p.user_id
  AND (p.email IS NULL OR p.name IS NULL);

-- ==========================================================
-- 6. ADMIN: listar usuarios e excluir contas (SECURITY DEFINER)
--    O schema "auth" NAO e exposto na API REST, portanto
--    s.from('auth.users') sempre falha no navegador (erro 404:
--    "The schema must be one of the following: public, ...").
--    Por isso estas funcoes RPC, que validam is_admin() internamente.
-- ==========================================================
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (user_id uuid, user_email text, user_name text, user_created_at timestamptz, user_role text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administradores podem listar usuarios';
    END IF;

    RETURN QUERY
    SELECT u.id,
           u.email::text,
           COALESCE(p.name, p.display_name, u.raw_user_meta_data->>'name', u.email)::text,
           u.created_at,
           COALESCE(r.role, 'user')::text
    FROM auth.users u
    LEFT JOIN public.user_profiles p ON p.user_id = u.id
    LEFT JOIN public.user_roles r ON r.user_id = u.id
    ORDER BY u.created_at DESC
    LIMIT 500;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administradores podem excluir usuarios';
    END IF;
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Voce nao pode excluir a propria conta';
    END IF;

    -- Remove os vinculos SEM ON DELETE CASCADE antes de apagar do auth,
    -- senao o DELETE abaixo falha por violacao de chave estrangeira.
    UPDATE public.site_config SET updated_by = NULL WHERE updated_by = target_user_id;
    DELETE FROM public.user_roles WHERE user_id = target_user_id;

    -- user_profiles, readings, course_progress e session_history
    -- possuem ON DELETE CASCADE e sao removidos automaticamente.
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Somente usuarios autenticados chamam (a checagem de admin e interna)
REVOKE ALL ON FUNCTION public.admin_list_users() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;
DO $$ BEGIN
    REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM anon;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ==========================================================
-- 7. Como se tornar admin (rode manualmente trocando o email)
-- ==========================================================
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'seu@email.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';