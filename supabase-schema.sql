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
    essencia_imagem TEXT,
    notas_tarologo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.1 Migração: garante a coluna das anotações do Guardião/Tarólogo
--     (ela alimenta o PDF e agora também fica gravada na jornada)
ALTER TABLE public.readings ADD COLUMN IF NOT EXISTS notas_tarologo TEXT;

-- 1.2 Migração: guarda a imagem da carta da Essência revelada
--     (ex.: "Cartas da Essencia/1-ApresencadeSirian.png", renderizada
--     como assets/cartas/<valor>). Sem ela o histórico mostrava apenas
--     o nome da Essência, sem a carta.
ALTER TABLE public.readings ADD COLUMN IF NOT EXISTS essencia_imagem TEXT;

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

-- ==========================================================
-- 8. VITRINE DE TERAPEUTAS (Fase F2)
--    therapists         — perfil publico (1 por conta)
--    therapist_services — atendimentos exibidos no perfil
--    therapist_contatos — canais de contato exibidos no perfil
--
--    Visibilidade:
--      visitante  -> le apenas perfis com status = 'publicado'
--      terapeuta  -> le/edita o proprio perfil, em qualquer status
--      admin      -> le/edita todos
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.therapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    slug TEXT UNIQUE,
    nome TEXT NOT NULL,
    titulo TEXT,
    especialidades TEXT[] NOT NULL DEFAULT '{}',
    cidade TEXT,
    modalidade TEXT NOT NULL DEFAULT 'ambos'
        CHECK (modalidade IN ('online', 'presencial', 'ambos')),
    anos INTEGER,
    bio TEXT,
    foto_url TEXT,
    destaque BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'rascunho'
        CHECK (status IN ('rascunho', 'publicado', 'pausado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.therapist_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    duracao_min INTEGER,
    -- Preco em texto livre ("R$ 180", "A combinar"). A F4 (agendamento)
    -- normaliza para NUMERIC quando existir checkout.
    preco TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.therapist_contatos (
    therapist_id UUID PRIMARY KEY REFERENCES public.therapists(id) ON DELETE CASCADE,
    whatsapp TEXT,
    email_publico TEXT,
    instagram TEXT,
    site TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapists_status
    ON public.therapists (status);
CREATE INDEX IF NOT EXISTS idx_therapist_services_therapist
    ON public.therapist_services (therapist_id, ordem);

-- Redes sociais: ALTER (e nao so CREATE TABLE) porque a tabela pode ja
-- existir de uma execucao anterior deste schema.
ALTER TABLE public.therapist_contatos ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE public.therapist_contatos ADD COLUMN IF NOT EXISTS youtube TEXT;

-- ----------------------------------------------------------
-- STORAGE: fotos dos terapeutas
--   Bucket publico para leitura (a vitrine mostra a foto) e escrita
--   restrita a pasta do proprio usuario: {auth.uid()}/foto-<ts>.jpg
-- ----------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('therapist-fotos', 'therapist-fotos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Fotos de terapeutas sao publicas" ON storage.objects;
CREATE POLICY "Fotos de terapeutas sao publicas"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'therapist-fotos');

DROP POLICY IF EXISTS "Terapeuta envia a propria foto" ON storage.objects;
CREATE POLICY "Terapeuta envia a propria foto"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'therapist-fotos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Terapeuta atualiza a propria foto" ON storage.objects;
CREATE POLICY "Terapeuta atualiza a propria foto"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'therapist-fotos'
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid()))
    );

DROP POLICY IF EXISTS "Terapeuta remove a propria foto" ON storage.objects;
CREATE POLICY "Terapeuta remove a propria foto"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'therapist-fotos'
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid()))
    );

-- updated_at automatico (mesma tabela de perfis, dois gatilhos)
CREATE OR REPLACE FUNCTION public.touch_therapists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_therapists_updated_at ON public.therapists;
CREATE TRIGGER trg_therapists_updated_at
    BEFORE UPDATE ON public.therapists
    FOR EACH ROW EXECUTE FUNCTION public.touch_therapists_updated_at();

DROP TRIGGER IF EXISTS trg_therapist_contatos_updated_at ON public.therapist_contatos;
CREATE TRIGGER trg_therapist_contatos_updated_at
    BEFORE UPDATE ON public.therapist_contatos
    FOR EACH ROW EXECUTE FUNCTION public.touch_therapists_updated_at();

-- ----------------------------------------------------------
-- RLS: therapists
-- ----------------------------------------------------------
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Perfis publicados sao publicos" ON public.therapists;
CREATE POLICY "Perfis publicados sao publicos"
    ON public.therapists FOR SELECT
    USING (
        status = 'publicado'
        OR auth.uid() = user_id
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Terapeuta gerencia proprio perfil" ON public.therapists;
CREATE POLICY "Terapeuta gerencia proprio perfil"
    ON public.therapists FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins gerenciam terapeutas" ON public.therapists;
CREATE POLICY "Admins gerenciam terapeutas"
    ON public.therapists FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ----------------------------------------------------------
-- RLS: therapist_services
--   Servicos seguem o status do perfil: so aparecem quando o
--   perfil esta publicado (o EXISTS respeita a RLS de therapists).
-- ----------------------------------------------------------
ALTER TABLE public.therapist_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Servicos de perfil visivel sao publicos" ON public.therapist_services;
CREATE POLICY "Servicos de perfil visivel sao publicos"
    ON public.therapist_services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_services.therapist_id
              AND (
                  t.status = 'publicado'
                  OR t.user_id = auth.uid()
                  OR public.is_admin(auth.uid())
              )
        )
    );

DROP POLICY IF EXISTS "Terapeuta gerencia os proprios servicos" ON public.therapist_services;
CREATE POLICY "Terapeuta gerencia os proprios servicos"
    ON public.therapist_services FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_services.therapist_id
              AND t.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_services.therapist_id
              AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins gerenciam servicos" ON public.therapist_services;
CREATE POLICY "Admins gerenciam servicos"
    ON public.therapist_services FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ----------------------------------------------------------
-- RLS: therapist_contatos
--   O contato e publico quando o perfil esta publicado — e por
--   ele que o consulente fala com o terapeuta. Campos deixados
--   em branco no painel simplesmente nao aparecem na vitrine.
-- ----------------------------------------------------------
ALTER TABLE public.therapist_contatos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contatos de perfil visivel sao publicos" ON public.therapist_contatos;
CREATE POLICY "Contatos de perfil visivel sao publicos"
    ON public.therapist_contatos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_contatos.therapist_id
              AND (
                  t.status = 'publicado'
                  OR t.user_id = auth.uid()
                  OR public.is_admin(auth.uid())
              )
        )
    );

DROP POLICY IF EXISTS "Terapeuta gerencia os proprios contatos" ON public.therapist_contatos;
CREATE POLICY "Terapeuta gerencia os proprios contatos"
    ON public.therapist_contatos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_contatos.therapist_id
              AND t.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_contatos.therapist_id
              AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins gerenciam contatos" ON public.therapist_contatos;
CREATE POLICY "Admins gerenciam contatos"
    ON public.therapist_contatos FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ==========================================================
-- 9. AGENDA DO TERAPEUTA (Fase F3)
--    therapist_availability — janelas semanais de atendimento
--    therapist_blocks       — folgas e excecoes pontuais
--
--    Horarios sao "wall clock" no fuso America/Sao_Paulo (o Brasil
--    nao tem horario de verao desde 2019). dia_semana segue o padrao
--    do JavaScript: 0 = domingo ... 6 = sabado.
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.therapist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    duracao_min INTEGER NOT NULL DEFAULT 60 CHECK (duracao_min BETWEEN 15 AND 480),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT availability_horario_valido CHECK (hora_fim > hora_inicio)
);

CREATE TABLE IF NOT EXISTS public.therapist_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    motivo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Dia inteiro (os dois nulos) ou faixa fechada
    CONSTRAINT block_faixa_valida CHECK (
        (hora_inicio IS NULL AND hora_fim IS NULL)
        OR (hora_inicio IS NOT NULL AND hora_fim IS NOT NULL AND hora_fim > hora_inicio)
    )
);

CREATE INDEX IF NOT EXISTS idx_availability_therapist
    ON public.therapist_availability (therapist_id, dia_semana);
CREATE INDEX IF NOT EXISTS idx_blocks_therapist_data
    ON public.therapist_blocks (therapist_id, data);

-- ----------------------------------------------------------
-- RLS: therapist_availability
--   A grade so e publica quando o perfil esta publicado — o mesmo
--   criterio de servicos e contatos.
-- ----------------------------------------------------------
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agenda de perfil visivel e publica" ON public.therapist_availability;
CREATE POLICY "Agenda de perfil visivel e publica"
    ON public.therapist_availability FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_availability.therapist_id
              AND (
                  t.status = 'publicado'
                  OR t.user_id = auth.uid()
                  OR public.is_admin(auth.uid())
              )
        )
    );

DROP POLICY IF EXISTS "Terapeuta gerencia a propria agenda" ON public.therapist_availability;
CREATE POLICY "Terapeuta gerencia a propria agenda"
    ON public.therapist_availability FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_availability.therapist_id
              AND t.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_availability.therapist_id
              AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins gerenciam agendas" ON public.therapist_availability;
CREATE POLICY "Admins gerenciam agendas"
    ON public.therapist_availability FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ----------------------------------------------------------
-- RLS: therapist_blocks
-- ----------------------------------------------------------
ALTER TABLE public.therapist_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Folgas de perfil visivel sao publicas" ON public.therapist_blocks;
CREATE POLICY "Folgas de perfil visivel sao publicas"
    ON public.therapist_blocks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_blocks.therapist_id
              AND (
                  t.status = 'publicado'
                  OR t.user_id = auth.uid()
                  OR public.is_admin(auth.uid())
              )
        )
    );

DROP POLICY IF EXISTS "Terapeuta gerencia as proprias folgas" ON public.therapist_blocks;
CREATE POLICY "Terapeuta gerencia as proprias folgas"
    ON public.therapist_blocks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_blocks.therapist_id
              AND t.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_blocks.therapist_id
              AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins gerenciam folgas" ON public.therapist_blocks;
CREATE POLICY "Admins gerenciam folgas"
    ON public.therapist_blocks FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ==========================================================
-- 10. SOLICITACOES DE AGENDAMENTO (Fase F4)
--    therapist_bookings — pedido do consulente para um horario
--
--    Anti-double-booking: constraint de EXCLUSAO (gist) impede que
--    duas solicitacoes ativas se SOBREPONHAM no mesmo terapeuta,
--    nao apenas que tenham a mesma hora de inicio.
--    Requer a extensao btree_gist.
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS public.therapist_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    consulente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Snapshot: o consulente pode mudar de nome/telefone depois
    consulente_nome TEXT,
    consulente_contato TEXT,
    -- Snapshot do servico escolhido (pode ser editado ou apagado depois)
    servico_nome TEXT,
    servico_preco TEXT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    duracao_min INTEGER NOT NULL DEFAULT 60 CHECK (duracao_min BETWEEN 15 AND 600),
    status TEXT NOT NULL DEFAULT 'pendente'
        CHECK (status IN ('pendente', 'confirmado', 'recusado', 'cancelado', 'concluido')),
    observacao TEXT,
    resposta TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.therapist_bookings DROP CONSTRAINT IF EXISTS booking_sem_sobreposicao;
ALTER TABLE public.therapist_bookings
    ADD CONSTRAINT booking_sem_sobreposicao
    EXCLUDE USING gist (
        therapist_id WITH =,
        data WITH =,
        tsrange(
            data + hora_inicio,
            data + hora_inicio + (duracao_min * INTERVAL '1 minute')
        ) WITH &&
    ) WHERE (status IN ('pendente', 'confirmado'));

CREATE INDEX IF NOT EXISTS idx_bookings_terapeuta
    ON public.therapist_bookings (therapist_id, data);
CREATE INDEX IF NOT EXISTS idx_bookings_consulente
    ON public.therapist_bookings (consulente_id, data);
CREATE INDEX IF NOT EXISTS idx_bookings_status
    ON public.therapist_bookings (status);

-- O horario de uma solicitacao nao pode ser remarcado: cancele e crie outra.
CREATE OR REPLACE FUNCTION public.booking_horario_imutavel()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        IF NEW.therapist_id <> OLD.therapist_id
           OR NEW.consulente_id <> OLD.consulente_id
           OR NEW.data <> OLD.data
           OR NEW.hora_inicio <> OLD.hora_inicio
           OR NEW.duracao_min <> OLD.duracao_min THEN
            RAISE EXCEPTION 'O horario de uma solicitacao nao pode ser alterado. Cancele e crie outra.';
        END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_imutavel ON public.therapist_bookings;
CREATE TRIGGER trg_booking_imutavel
    BEFORE UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.booking_horario_imutavel();

-- ----------------------------------------------------------
-- RLS: therapist_bookings
--   Cada lado ve apenas o que lhe pertence. O consulente so
--   cria pendente e so cancela; quem confirma e o terapeuta.
-- ----------------------------------------------------------
ALTER TABLE public.therapist_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Consulente ve as proprias solicitacoes" ON public.therapist_bookings;
CREATE POLICY "Consulente ve as proprias solicitacoes"
    ON public.therapist_bookings FOR SELECT
    USING (consulente_id = auth.uid());

DROP POLICY IF EXISTS "Terapeuta ve as solicitacoes do proprio perfil" ON public.therapist_bookings;
CREATE POLICY "Terapeuta ve as solicitacoes do proprio perfil"
    ON public.therapist_bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_bookings.therapist_id
              AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins veem todas as solicitacoes" ON public.therapist_bookings;
CREATE POLICY "Admins veem todas as solicitacoes"
    ON public.therapist_bookings FOR SELECT
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Consulente cria a propria solicitacao" ON public.therapist_bookings;
CREATE POLICY "Consulente cria a propria solicitacao"
    ON public.therapist_bookings FOR INSERT
    WITH CHECK (consulente_id = auth.uid() AND status = 'pendente');

DROP POLICY IF EXISTS "Consulente cancela a propria solicitacao" ON public.therapist_bookings;
CREATE POLICY "Consulente cancela a propria solicitacao"
    ON public.therapist_bookings FOR UPDATE
    USING (consulente_id = auth.uid())
    WITH CHECK (consulente_id = auth.uid() AND status = 'cancelado');

DROP POLICY IF EXISTS "Terapeuta responde as solicitacoes" ON public.therapist_bookings;
CREATE POLICY "Terapeuta responde as solicitacoes"
    ON public.therapist_bookings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_bookings.therapist_id
              AND t.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.therapists t
            WHERE t.id = therapist_bookings.therapist_id
              AND t.user_id = auth.uid()
        )
        AND status IN ('pendente', 'confirmado', 'recusado', 'concluido')
    );

DROP POLICY IF EXISTS "Admins gerenciam solicitacoes" ON public.therapist_bookings;
CREATE POLICY "Admins gerenciam solicitacoes"
    ON public.therapist_bookings FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ----------------------------------------------------------
-- RPC: horarios_ocupados
--   A vitrine precisa saber O QUE esta ocupado — nunca QUEM.
--   SECURITY DEFINER para atravessar a RLS, devolvendo somente
--   data/hora/duracao de solicitacoes ativas de perfis publicados.
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.horarios_ocupados(p_therapist uuid)
RETURNS TABLE (data date, hora_inicio time, duracao_min integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT b.data, b.hora_inicio, b.duracao_min
    FROM public.therapist_bookings b
    JOIN public.therapists t ON t.id = b.therapist_id
    WHERE b.therapist_id = p_therapist
      AND b.status IN ('pendente', 'confirmado')
      AND t.status = 'publicado'
      AND b.data >= CURRENT_DATE - 1
    ORDER BY b.data, b.hora_inicio;
$$;

REVOKE ALL ON FUNCTION public.horarios_ocupados(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.horarios_ocupados(uuid) TO anon, authenticated;

-- ==========================================================
-- 11. EXPIRACAO DE PENDENTES (Fase F5a)
--    Uma solicitacao pendente segura o horario. Se o terapeuta
--    nao responder em 24h, ela e cancelada e o horario volta
--    a aparecer na vitrine.
-- ==========================================================
ALTER TABLE public.therapist_bookings ADD COLUMN IF NOT EXISTS expira_em TIMESTAMPTZ;

-- Backfill para quem ja tinha pedidos abertos
UPDATE public.therapist_bookings
   SET expira_em = created_at + INTERVAL '24 hours'
 WHERE status = 'pendente' AND expira_em IS NULL;

-- Pendente ganha 24h; qualquer outro status perde a expiracao.
-- O prazo nunca passa do proprio atendimento: vale o menor entre
-- "agora + 24h" e "1h antes do horario" (wall-clock de Sao Paulo).
CREATE OR REPLACE FUNCTION public.booking_expira_em()
RETURNS TRIGGER AS $$
DECLARE limite timestamptz;
BEGIN
    IF NEW.status = 'pendente' THEN
        IF NEW.expira_em IS NULL THEN
            limite := LEAST(
                NOW() + INTERVAL '24 hours',
                ((NEW.data + NEW.hora_inicio) AT TIME ZONE 'America/Sao_Paulo') - INTERVAL '1 hour'
            );
            -- Se o atendimento já está em cima, garante ao menos 30 min.
            IF limite <= NOW() THEN
                limite := NOW() + INTERVAL '30 minutes';
            END IF;
            NEW.expira_em := limite;
        END IF;
    ELSE
        NEW.expira_em := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_expira ON public.therapist_bookings;
CREATE TRIGGER trg_booking_expira
    BEFORE INSERT OR UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.booking_expira_em();

-- Cancelamento automatico (SECURITY DEFINER: roda sem sessao, via cron)
CREATE OR REPLACE FUNCTION public.expirar_solicitacoes_pendentes()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE total integer;
BEGIN
    UPDATE public.therapist_bookings
       SET status = 'cancelado',
           resposta = COALESCE(resposta, 'Cancelada automaticamente: sem resposta do terapeuta em 24h.')
     WHERE status = 'pendente'
       AND expira_em IS NOT NULL
       AND expira_em < NOW();

    GET DIAGNOSTICS total = ROW_COUNT;
    RETURN total;
END;
$$;

REVOKE ALL ON FUNCTION public.expirar_solicitacoes_pendentes() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.expirar_solicitacoes_pendentes() TO anon, authenticated;

-- Agendador do proprio Postgres (Supabase tem pg_cron disponivel)
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
    BEGIN
        PERFORM cron.unschedule('expirar-solicitacoes-pendentes');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    PERFORM cron.schedule(
        'expirar-solicitacoes-pendentes',
        '*/15 * * * *',
        $cron$SELECT public.expirar_solicitacoes_pendentes();$cron$
    );
END $$;


