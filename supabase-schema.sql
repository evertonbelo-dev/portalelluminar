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
     WHERE b.therapist_id = p_therapist
       AND b.status IN ('pendente', 'confirmado')
       AND b.data >= CURRENT_DATE - 1
       -- Pedido sem pagamento cujo prazo venceu nao segura mais o horario,
       -- mesmo antes de o cron cancelar a linha.
       AND NOT (COALESCE(b.pagamento_status, 'aguardando') <> 'pago'
                AND b.pagamento_deadline IS NOT NULL
                AND b.pagamento_deadline < NOW());
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

-- ==========================================================
-- 12. NOTIFICACOES POR EMAIL (Fase F5b — Resend + pg_net)
--
--    O envio sai do proprio Postgres (extensao pg_net), sem Edge
--    Function: um trigger em therapist_bookings dispara o e-mail
--    quando a solicitacao nasce ou muda de status.
--
--    A chave da API fica no VAULT (criptografada), nunca no codigo
--    nem no navegador:
--      select vault.create_secret('re_...', 'resend_api_key');
--      select vault.create_secret('Portal El''Luminar <agenda@dominio>', 'resend_from');
--
--    Sem a chave, o sistema apenas registra em email_log e segue:
--    o agendamento NUNCA quebra por causa de e-mail.
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.email_log (
    id BIGSERIAL PRIMARY KEY,
    tipo TEXT NOT NULL,
    booking_id UUID,
    destinatario TEXT,
    assunto TEXT,
    status TEXT NOT NULL DEFAULT 'enfileirado',
    request_id BIGINT,
    detalhe TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_created
    ON public.email_log (created_at DESC);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins leem o log de emails" ON public.email_log;
CREATE POLICY "Admins leem o log de emails"
    ON public.email_log FOR SELECT
    USING (public.is_admin(auth.uid()));

-- Escapa texto livre antes de entrar no HTML do e-mail
CREATE OR REPLACE FUNCTION public.esc_html(t text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
    SELECT replace(replace(replace(COALESCE(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;');
$$;

-- Moldura visual dos e-mails (mesma identidade do Portal)
CREATE OR REPLACE FUNCTION public.email_layout(p_titulo text, p_corpo text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
    SELECT '<div style="font-family:Arial,Helvetica,sans-serif;background:#0b0b16;padding:28px;">'
        || '<div style="max-width:520px;margin:0 auto;background:#12121f;border:1px solid #d4af37;border-radius:14px;padding:26px;color:#e8e8f0;">'
        || '<h2 style="color:#d4af37;font-family:Georgia,serif;margin:0 0 14px;font-size:20px;">' || p_titulo || '</h2>'
        || p_corpo
        || '<p style="color:#8b8b9e;font-size:12px;margin-top:24px;border-top:1px solid #23233a;padding-top:12px;">Portal El''Luminar - mensagem gerada automaticamente.</p>'
        || '</div></div>';
$$;

-- Enfileira o e-mail no Resend. Nunca lanca excecao para o chamador:
-- sem chave, sem destinatario ou com erro, grava em email_log e segue.
CREATE OR REPLACE FUNCTION public.enviar_email_resend(
    p_para text,
    p_assunto text,
    p_html text,
    p_tipo text,
    p_booking uuid DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    chave text;
    remetente text;
    req bigint;
BEGIN
    IF p_para IS NULL OR p_para = '' THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES (p_tipo, p_booking, p_para, p_assunto, 'sem_destinatario', 'Contato ausente');
        RETURN NULL;
    END IF;

    SELECT decrypted_secret INTO chave FROM vault.decrypted_secrets
     WHERE name = 'resend_api_key' ORDER BY updated_at DESC LIMIT 1;

    IF chave IS NULL OR chave = '' THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES (p_tipo, p_booking, p_para, p_assunto, 'sem_chave', 'Crie o segredo resend_api_key no Vault');
        RETURN NULL;
    END IF;

    SELECT decrypted_secret INTO remetente FROM vault.decrypted_secrets
     WHERE name = 'resend_from' ORDER BY updated_at DESC LIMIT 1;
    remetente := COALESCE(remetente, 'Portal El''Luminar <onboarding@resend.dev>');

    req := net.http_post(
        url := 'https://api.resend.com/emails',
        body := jsonb_build_object(
            'from', remetente,
            'to', jsonb_build_array(p_para),
            'subject', p_assunto,
            'html', p_html
        ),
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || chave
        ),
        timeout_milliseconds := 10000
    );

    INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, request_id, status)
    VALUES (p_tipo, p_booking, p_para, p_assunto, req, 'enfileirado');

    RETURN req;
END;
$$;

REVOKE ALL ON FUNCTION public.enviar_email_resend(text, text, text, text, uuid) FROM PUBLIC;

-- Dispara os avisos quando a solicitacao nasce ou muda de status.
-- O bloco EXCEPTION garante que uma falha de e-mail nunca derrube
-- a transacao do agendamento.
CREATE OR REPLACE FUNCTION public.notificar_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_email_terapeuta text;
    v_nome_terapeuta text;
    v_quando text;
    v_servico text;
    v_corpo text;
    v_base text;
BEGIN
    BEGIN
        SELECT u.email, t.nome INTO v_email_terapeuta, v_nome_terapeuta
          FROM public.therapists t
          JOIN auth.users u ON u.id = t.user_id
         WHERE t.id = NEW.therapist_id;

        v_quando := to_char(NEW.data, 'DD/MM/YYYY') || ' as ' || to_char(NEW.hora_inicio, 'HH24:MI');
        v_servico := COALESCE(NEW.servico_nome, 'Atendimento a combinar');
        v_base := '<p style="font-size:18px;color:#d4af37;margin:6px 0 14px;"><strong>' || v_quando || '</strong></p>'
               || '<p>' || public.esc_html(v_servico)
               || CASE WHEN NEW.servico_preco IS NOT NULL THEN ' - ' || public.esc_html(NEW.servico_preco) ELSE '' END
               || ' - ' || NEW.duracao_min || ' min</p>';

        -- 1) Nova solicitacao -> terapeuta
        IF TG_OP = 'INSERT' THEN
            IF NEW.status = 'pendente' THEN
                v_corpo := '<p><strong>' || public.esc_html(NEW.consulente_nome) || '</strong> pediu um horario.</p>'
                    || v_base
                    || CASE WHEN NEW.consulente_contato IS NOT NULL THEN '<p>Contato: ' || public.esc_html(NEW.consulente_contato) || '</p>' ELSE '' END
                    || CASE WHEN NEW.observacao IS NOT NULL THEN '<p style="background:#1c1c2e;padding:12px;border-radius:8px;">"' || public.esc_html(NEW.observacao) || '"</p>' ELSE '' END
                    || '<p style="color:#ffcc80;">Responda em ate 24h (ou antes do horario) em Minha Jornada. Sem resposta, o horario e liberado automaticamente.</p>';

                PERFORM public.enviar_email_resend(
                    v_email_terapeuta,
                    'Nova solicitacao: ' || v_quando,
                    public.email_layout('Nova solicitacao de agendamento', v_corpo),
                    'solicitacao', NEW.id);
            END IF;
            RETURN NEW;
        END IF;

        -- 2) Mudanca de status
        IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
            RETURN NEW;
        END IF;

        IF NEW.status = 'confirmado' THEN
            v_corpo := '<p>Ola, ' || public.esc_html(NEW.consulente_nome) || '!</p>'
                || '<p><strong>' || public.esc_html(v_nome_terapeuta) || '</strong> confirmou seu atendimento.</p>'
                || v_base
                || CASE WHEN NEW.resposta IS NOT NULL THEN '<p style="background:#1c1c2e;padding:12px;border-radius:8px;">' || public.esc_html(NEW.resposta) || '</p>' ELSE '' END;
            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Agendamento confirmado: ' || v_quando,
                public.email_layout('Seu agendamento foi confirmado', v_corpo), 'confirmado', NEW.id);

        ELSIF NEW.status = 'recusado' THEN
            v_corpo := '<p>Ola, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>Seu pedido nao pode ser confirmado.</p>' || v_base
                || '<p>Escolha outro horario na vitrine - a agenda e atualizada em tempo real.</p>';
            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Horario indisponivel: ' || v_quando,
                public.email_layout('Sua solicitacao nao foi confirmada', v_corpo), 'recusado', NEW.id);

        ELSIF NEW.status = 'cancelado' THEN
            v_corpo := '<p>Ola, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>Seu pedido foi cancelado.</p>' || v_base
                || CASE WHEN NEW.resposta IS NOT NULL THEN '<p style="background:#1c1c2e;padding:12px;border-radius:8px;">' || public.esc_html(NEW.resposta) || '</p>' ELSE '' END
                || '<p style="color:#ffcc80;">Se nao foi voce, escolha outro horario na vitrine.</p>';
            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Solicitacao cancelada: ' || v_quando,
                public.email_layout('Sua solicitacao foi cancelada', v_corpo), 'cancelado', NEW.id);

            PERFORM public.enviar_email_resend(v_email_terapeuta,
                'Agendamento cancelado: ' || v_quando,
                public.email_layout('Um horario foi liberado',
                    '<p>O pedido de <strong>' || public.esc_html(NEW.consulente_nome) || '</strong> foi cancelado.</p>' || v_base),
                'cancelado_terapeuta', NEW.id);
        END IF;

        RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES ('erro', NEW.id, NULL, NULL, 'erro', SQLERRM);
        RETURN NEW;
    END;
END;
$$;

REVOKE ALL ON FUNCTION public.notificar_booking() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_booking_notificar ON public.therapist_bookings;
CREATE TRIGGER trg_booking_notificar
    AFTER INSERT OR UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.notificar_booking();

-- ==========================================================
-- 13. ADMIN: LOG DE E-MAILS + LIMPEZA (Fase F5c)
--    O schema "net" (respostas do pg_net) nao e exposto ao
--    navegador — por isso a RPC junta email_log + status HTTP.
-- ==========================================================
CREATE OR REPLACE FUNCTION public.admin_listar_emails(p_limite integer DEFAULT 100)
RETURNS TABLE (
    id bigint,
    tipo text,
    destinatario text,
    assunto text,
    status text,
    status_http integer,
    detalhe text,
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administradores podem ver os emails';
    END IF;

    RETURN QUERY
    SELECT l.id, l.tipo, l.destinatario, l.assunto, l.status,
           r.status_code,
           COALESCE(l.detalhe, left(r.content, 300)),
           l.created_at
      FROM public.email_log l
      LEFT JOIN net._http_response r ON r.id = l.request_id
     ORDER BY l.id DESC
     LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 100), 500));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_listar_emails(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_listar_emails(integer) TO authenticated;
DO $$ BEGIN
    REVOKE EXECUTE ON FUNCTION public.admin_listar_emails(integer) FROM anon;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Limpeza diaria: log com mais de 90 dias
DO $$
BEGIN
    BEGIN
        PERFORM cron.unschedule('limpar-email-log');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    PERFORM cron.schedule(
        'limpar-email-log',
        '15 4 * * *',
        $cron$DELETE FROM public.email_log WHERE created_at < NOW() - INTERVAL '90 days';$cron$
    );
END $$;

-- ==========================================================
-- 14. PAGAMENTOS E CUPONS (Fase F6 — Stripe)
--    Regras:
--      * sinal de 30% ou integral, decidido no checkout
--      * pendente + sem pagamento + prazo vencido = cancelado
--      * confirmado + sem pagamento = CONTINUA (regra de negocio)
--      * cupom de 15% gerado na primeira compra (uso unico, 30 dias)
--      * cupom aplicado antes de criar o PaymentIntent
-- ==========================================================
ALTER TABLE public.therapist_bookings
    ADD COLUMN IF NOT EXISTS valor_total NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS valor_desconto NUMERIC(10,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS valor_cobrado NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS cupom_codigo TEXT,
    ADD COLUMN IF NOT EXISTS forma_pagamento TEXT,
    ADD COLUMN IF NOT EXISTS pagamento_status TEXT NOT NULL DEFAULT 'aguardando',
    ADD COLUMN IF NOT EXISTS pagamento_deadline TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT,
    ADD COLUMN IF NOT EXISTS pago_em TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS reembolso_solicitado_em TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT NOT NULL UNIQUE,
    percentual INTEGER NOT NULL CHECK (percentual BETWEEN 1 AND 100),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    origem TEXT NOT NULL DEFAULT 'primeira_compra'
        CHECK (origem IN ('primeira_compra', 'solicitado', 'admin', 'stripe')),
    stripe_coupon_id TEXT,
    stripe_promotion_code TEXT,
    valido_ate TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    usado_em TIMESTAMPTZ,
    usado_booking_id UUID,
    criado_por UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Um cupom de primeira compra aberto por pessoa
CREATE UNIQUE INDEX IF NOT EXISTS uniq_cupom_primeira_por_user
    ON public.coupons (user_id)
    WHERE origem = 'primeira_compra' AND usado_em IS NULL;

CREATE INDEX IF NOT EXISTS idx_coupons_user ON public.coupons (user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_codigo ON public.coupons (upper(codigo));

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dono ve o proprio cupom" ON public.coupons;
CREATE POLICY "Dono ve o proprio cupom"
    ON public.coupons FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins gerenciam cupons" ON public.coupons;
CREATE POLICY "Admins gerenciam cupons"
    ON public.coupons FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- "R$ 1.234,56" -> 1234.56
CREATE OR REPLACE FUNCTION public.preco_para_numeric(p_preco text)
RETURNS numeric LANGUAGE sql IMMUTABLE AS $$
    SELECT CASE
        WHEN p_preco IS NULL OR btrim(p_preco) = '' THEN NULL
        WHEN position(',' in p_preco) > 0 THEN
            NULLIF(replace(regexp_replace(replace(p_preco, '.', ''), '[^0-9,]', '', 'g'), ',', '.'), '')::numeric
        ELSE
            NULLIF(regexp_replace(p_preco, '[^0-9.]', '', 'g'), '')::numeric
    END;
$$;

-- Gera (ou devolve) o cupom de 15% da primeira compra. Idempotente.
CREATE OR REPLACE FUNCTION public.gerar_cupom_primeira_compra(p_user uuid)
RETURNS TABLE (codigo text, percentual integer, valido_ate timestamptz, novo boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_codigo text;
    v_reg record;
BEGIN
    IF p_user IS NULL THEN RETURN; END IF;

    SELECT c.codigo, c.percentual, c.valido_ate INTO v_reg
      FROM public.coupons c
     WHERE c.user_id = p_user AND c.origem = 'primeira_compra' AND c.usado_em IS NULL
     ORDER BY c.created_at DESC LIMIT 1;

    IF FOUND THEN
        codigo := v_reg.codigo; percentual := v_reg.percentual;
        valido_ate := v_reg.valido_ate; novo := false;
        RETURN NEXT; RETURN;
    END IF;

    -- Quem ja pagou alguma vez nao e mais primeira compra
    IF EXISTS (SELECT 1 FROM public.therapist_bookings b
                WHERE b.consulente_id = p_user AND b.pagamento_status = 'pago') THEN
        RETURN;
    END IF;

    v_codigo := 'LUMINAR15-' || upper(substr(md5(random()::text || p_user::text), 1, 6));

    INSERT INTO public.coupons (codigo, percentual, user_id, origem, valido_ate)
    VALUES (v_codigo, 15, p_user, 'primeira_compra', NOW() + INTERVAL '30 days');

    codigo := v_codigo; percentual := 15;
    valido_ate := NOW() + INTERVAL '30 days'; novo := true;
    RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.validar_cupom(p_codigo text, p_user uuid)
RETURNS TABLE (ok boolean, motivo text, percentual integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v record;
BEGIN
    IF p_codigo IS NULL OR btrim(p_codigo) = '' THEN
        ok := false; motivo := 'Informe um codigo'; percentual := 0; RETURN NEXT; RETURN;
    END IF;

    SELECT c.percentual, c.user_id, c.usado_em, c.valido_ate INTO v
      FROM public.coupons c
     WHERE upper(c.codigo) = upper(btrim(p_codigo)) LIMIT 1;

    IF NOT FOUND THEN
        ok := false; motivo := 'Cupom nao encontrado'; percentual := 0; RETURN NEXT; RETURN;
    END IF;
    IF v.usado_em IS NOT NULL THEN
        ok := false; motivo := 'Este cupom ja foi utilizado'; percentual := 0; RETURN NEXT; RETURN;
    END IF;
    IF v.valido_ate < NOW() THEN
        ok := false; motivo := 'Este cupom venceu'; percentual := 0; RETURN NEXT; RETURN;
    END IF;
    IF v.user_id IS NOT NULL AND v.user_id <> p_user THEN
        ok := false; motivo := 'Este cupom e de outra pessoa'; percentual := 0; RETURN NEXT; RETURN;
    END IF;

    ok := true; motivo := NULL; percentual := v.percentual; RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.marcar_cupom_usado(p_codigo text, p_booking uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    UPDATE public.coupons
       SET usado_em = NOW(), usado_booking_id = p_booking
     WHERE upper(codigo) = upper(btrim(p_codigo)) AND usado_em IS NULL;
$$;

-- Permissoes: gerar/validar so para logados; marcar uso so pelo service_role
-- (a Edge Function do Stripe, que roda no webhook).
REVOKE ALL ON FUNCTION public.gerar_cupom_primeira_compra(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gerar_cupom_primeira_compra(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.validar_cupom(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_cupom(text, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.marcar_cupom_usado(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.marcar_cupom_usado(text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_cupom_usado(text, uuid) TO service_role;

DO $$ BEGIN
    REVOKE EXECUTE ON FUNCTION public.gerar_cupom_primeira_compra(uuid) FROM anon;
    REVOKE EXECUTE ON FUNCTION public.validar_cupom(text, uuid) FROM anon;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Prazo de pagamento: reserva curta de 30 min para concluir o checkout,
-- limitada ao horario do atendimento. Antes era LEAST(24h, horario-24h):
-- um checkout abandonado travava o horario por dias.
CREATE OR REPLACE FUNCTION public.booking_prazo_pagamento()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pagamento_deadline IS NULL THEN
        NEW.pagamento_deadline := LEAST(
            NOW() + INTERVAL '30 minutes',
            ((NEW.data + NEW.hora_inicio) AT TIME ZONE 'America/Sao_Paulo')
        );
        IF NEW.pagamento_deadline <= NOW() THEN
            NEW.pagamento_deadline := NOW() + INTERVAL '5 minutes';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_prazo_pagamento ON public.therapist_bookings;
CREATE TRIGGER trg_booking_prazo_pagamento
    BEFORE INSERT OR UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.booking_prazo_pagamento();

-- Desfaz apenas o que esta PENDENTE e sem pagamento (confirmado segue)
CREATE OR REPLACE FUNCTION public.cancelar_pagamentos_vencidos()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE total integer;
BEGIN
    UPDATE public.therapist_bookings
       SET status = 'cancelado',
           resposta = COALESCE(resposta, 'Cancelado automaticamente: pagamento nao concluido ate o prazo.')
     WHERE status = 'pendente'
       AND pagamento_status <> 'pago'
       AND pagamento_deadline IS NOT NULL
       AND pagamento_deadline < NOW();

    GET DIAGNOSTICS total = ROW_COUNT;
    RETURN total;
END;
$$;

-- Pedido PAGO que e cancelado entra na fila de reembolso
CREATE OR REPLACE FUNCTION public.booking_reembolso()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelado' AND OLD.status <> 'cancelado'
       AND NEW.pagamento_status = 'pago'
       AND NEW.reembolso_solicitado_em IS NULL THEN
        NEW.reembolso_solicitado_em := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_reembolso ON public.therapist_bookings;
CREATE TRIGGER trg_booking_reembolso
    BEFORE UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.booking_reembolso();

DO $$
BEGIN
    BEGIN
        PERFORM cron.unschedule('cancelar-pagamentos-vencidos');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    PERFORM cron.schedule(
        'cancelar-pagamentos-vencidos',
        '5,20,35,50 * * * *',
        $cron$SELECT public.cancelar_pagamentos_vencidos();$cron$
    );
END $$;

-- Idempotencia do webhook: o Stripe reenvia eventos; a PK impede
-- processar duas vezes (e queimar o cupom duas vezes).
CREATE TABLE IF NOT EXISTS public.stripe_events (
    id TEXT PRIMARY KEY,
    tipo TEXT,
    recebido_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Guarda o motivo quando a assinatura do webhook falha. Sem isso, um
-- STRIPE_WEBHOOK_SECRET errado nao deixa rastro nenhum no banco.
ALTER TABLE public.stripe_events ADD COLUMN IF NOT EXISTS erro TEXT;
CREATE INDEX IF NOT EXISTS idx_stripe_events_data
    ON public.stripe_events (recebido_em DESC);
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- Sem policies: apenas service_role (a Edge Function) acessa.

-- ==========================================================================
-- 15) RECONCILIACAO DE PAGAMENTOS (F6)
-- O webhook e o caminho rapido, mas nao pode ser o unico: se ele atrasar ou
-- falhar, o job de expiracao cancelaria um pedido JA PAGO - e o consulente
-- perderia o horario com o dinheiro cobrado.
-- A ordem importa: reconcilia em :02/:17/:32/:47 e cancela em :05/:20/:35/:50.
-- ==========================================================================

-- Token compartilhado entre o cron (Vault) e a Edge Function (secret
-- RECONCILE_TOKEN). Use o MESMO valor nos dois lugares.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'reconcile_token') THEN
        PERFORM vault.create_secret(
            'TROQUE-ESTE-TOKEN',
            'reconcile_token',
            'Token do cron de reconciliacao de pagamentos'
        );
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.reconciliar_pagamentos_pendentes()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    token text;
    req bigint;
BEGIN
    SELECT decrypted_secret INTO token FROM vault.decrypted_secrets
     WHERE name = 'reconcile_token' ORDER BY updated_at DESC LIMIT 1;

    IF token IS NULL OR token = '' THEN
        RETURN NULL;
    END IF;

    req := net.http_post(
        -- Ajuste o subdominio ao recriar o banco em outro projeto.
        url := 'https://frvqvnusjnnmbpztiokn.supabase.co/functions/v1/stripe/reconciliar',
        body := '{}'::jsonb,
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || token
        ),
        timeout_milliseconds := 20000
    );

    RETURN req;
END;
$$;

REVOKE ALL ON FUNCTION public.reconciliar_pagamentos_pendentes() FROM PUBLIC;

DO $$
BEGIN
    BEGIN
        PERFORM cron.unschedule('reconciliar-pagamentos');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    PERFORM cron.schedule(
        'reconciliar-pagamentos',
        '2,17,32,47 * * * *',
        $cron$SELECT public.reconciliar_pagamentos_pendentes();$cron$
    );
END $$;

-- ==========================================================================
-- 16) E-MAILS DE PAGAMENTO (F6)
-- Um unico gatilho cobre todos os caminhos que mudam o pagamento: webhook do
-- Stripe, /confirmar do checkout, reconciliacao do cron e reembolso.
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.fmt_brl(p numeric)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
    SELECT CASE WHEN p IS NULL OR p = 0 THEN '—'
                ELSE 'R$ ' || replace(to_char(p, 'FM999999990.00'), '.', ',') END;
$$;

CREATE OR REPLACE FUNCTION public.notificar_pagamento()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_email_terapeuta text;
    v_nome_terapeuta text;
    v_quando text;
    v_servico text;
    v_corpo text;
    v_restante numeric;
BEGIN
    BEGIN
        IF TG_OP <> 'UPDATE' THEN RETURN NEW; END IF;
        IF OLD.pagamento_status IS NOT DISTINCT FROM NEW.pagamento_status THEN RETURN NEW; END IF;

        SELECT u.email, t.nome INTO v_email_terapeuta, v_nome_terapeuta
          FROM public.therapists t
          JOIN auth.users u ON u.id = t.user_id
         WHERE t.id = NEW.therapist_id;

        v_quando := to_char(NEW.data, 'DD/MM/YYYY') || ' às ' || to_char(NEW.hora_inicio, 'HH24:MI');
        v_servico := COALESCE(NEW.servico_nome, 'Atendimento a combinar');

        IF NEW.pagamento_status = 'pago' THEN
            v_restante := GREATEST(0, COALESCE(NEW.valor_total,0) - COALESCE(NEW.valor_desconto,0) - COALESCE(NEW.valor_cobrado,0));

            v_corpo := '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '!</p>'
                || '<p>Seu pagamento de <strong>' || public.fmt_brl(NEW.valor_cobrado) || '</strong> foi <strong style="color:#4caf50;">confirmado</strong>.</p>'
                || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
                || '<p>' || public.esc_html(v_servico) || ' · ' || NEW.duracao_min || ' min</p>'
                || '<p>Terapeuta: <strong>' || public.esc_html(v_nome_terapeuta) || '</strong></p>'
                || CASE WHEN NEW.cupom_codigo IS NOT NULL THEN '<p>Cupom aplicado: ' || public.esc_html(NEW.cupom_codigo) || ' (desconto de ' || public.fmt_brl(NEW.valor_desconto) || ')</p>' ELSE '' END
                || CASE WHEN NEW.forma_pagamento = 'sinal' AND v_restante > 0 THEN '<p style="color:#ffcc80;">Você pagou o sinal de 30%. O restante (' || public.fmt_brl(v_restante) || ') é acertado direto com o terapeuta.</p>' ELSE '' END
                || '<p style="color:#aaa;">O terapeuta foi avisado e vai confirmar o atendimento.</p>'
                || '<div style="background:#1c1c2e;border-left:3px solid #d4af37;padding:14px 16px;border-radius:8px;margin-top:18px;font-size:14px;line-height:1.7;">'
                || '<strong>Cancelamento e remarcação</strong><br>'
                || '• Reembolso <strong>integral</strong> até <strong>24h antes</strong> do atendimento.<br>'
                || '• Depois desse prazo o valor fica como garantia do horário e <strong>não há reembolso</strong>.<br>'
                || '• Você pode <strong>remarcar</strong> até <strong>2 vezes</strong> (com 24h de antecedência), sem cobrança nova.<br>'
                || '• Remarcações usadas até agora: <strong>0 de 2</strong>.'
                || '</div>';

            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Pagamento confirmado: ' || v_quando,
                public.email_layout('Pagamento confirmado', v_corpo), 'pagamento_confirmado', NEW.id);

            PERFORM public.enviar_email_resend(v_email_terapeuta,
                'Novo agendamento pago: ' || v_quando,
                public.email_layout('Agendamento pago',
                    '<p><strong>' || public.esc_html(NEW.consulente_nome) || '</strong> pagou ' || public.fmt_brl(NEW.valor_cobrado) || '.</p>'
                    || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
                    || '<p>' || public.esc_html(v_servico) || ' · ' || NEW.duracao_min || ' min</p>'
                    || '<p style="color:#ffcc80;">Confirme o atendimento em Minha Jornada.</p>'),
                'pagamento_terapeuta', NEW.id);

        ELSIF NEW.pagamento_status = 'falhou' THEN
            v_corpo := '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>O pagamento de <strong>' || public.fmt_brl(NEW.valor_cobrado) || '</strong> não foi aprovado.</p>'
                || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
                || '<p>Seu horário continua reservado até o prazo. Entre no portal, abra <strong>Meus agendamentos</strong> e clique em <strong>Pagar agora</strong> para tentar de novo.</p>';

            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Pagamento não aprovado: ' || v_quando,
                public.email_layout('Pagamento não aprovado', v_corpo), 'pagamento_falhou', NEW.id);

        ELSIF NEW.pagamento_status = 'reembolsado' THEN
            v_corpo := '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>O reembolso de <strong>' || public.fmt_brl(NEW.valor_cobrado) || '</strong> foi enviado ao Stripe e volta para o seu meio de pagamento em alguns dias úteis.</p>'
                || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>';

            PERFORM public.enviar_email_resend(NEW.consulente_contato,
                'Reembolso: ' || v_quando,
                public.email_layout('Reembolso do seu pagamento', v_corpo), 'reembolsado', NEW.id);
        END IF;

        RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES ('erro', NEW.id, NULL, NULL, 'erro', SQLERRM);
        RETURN NEW;
    END;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_pagamento ON public.therapist_bookings;
CREATE TRIGGER trg_booking_pagamento
    AFTER UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.notificar_pagamento();

-- ==========================================================================
-- 17) CUPONS NO ADMIN (F6)
-- O cupom de primeira compra nasce sozinho no checkout. Estas funcoes
-- atendem quem pediu desconto por e-mail: o admin cria e vincula a uma conta.
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.admin_listar_cupons(p_limite integer DEFAULT 100)
RETURNS TABLE (
    id uuid, codigo text, percentual integer, origem text, email text,
    valido_ate timestamptz, usado_em timestamptz, usado_booking_id uuid, created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles r
                    WHERE r.user_id = auth.uid() AND r.role IN ('admin','master')) THEN
        RAISE EXCEPTION 'Apenas administrador';
    END IF;

    RETURN QUERY
    SELECT c.id, c.codigo, c.percentual, c.origem, u.email::text,
           c.valido_ate, c.usado_em, c.usado_booking_id, c.created_at
      FROM public.coupons c
      LEFT JOIN auth.users u ON u.id = c.user_id
     ORDER BY c.created_at DESC
     LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 100), 500));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_listar_cupons(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_listar_cupons(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_criar_cupom(
    p_email text, p_percentual integer DEFAULT 15, p_dias integer DEFAULT 30
)
RETURNS TABLE (codigo text, percentual integer, valido_ate timestamptz, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
    v_user uuid;
    v_codigo text;
    v_validade timestamptz;
    v_pct integer;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles r
                    WHERE r.user_id = auth.uid() AND r.role IN ('admin','master')) THEN
        RAISE EXCEPTION 'Apenas administrador';
    END IF;

    IF p_email IS NULL OR btrim(p_email) = '' THEN
        RAISE EXCEPTION 'Informe o e-mail de quem pediu o cupom';
    END IF;

    v_pct := GREATEST(1, LEAST(COALESCE(p_percentual, 15), 100));

    SELECT u.id INTO v_user FROM auth.users u
     WHERE lower(u.email) = lower(btrim(p_email)) LIMIT 1;

    IF v_user IS NULL THEN
        RAISE EXCEPTION 'Nenhuma conta com o e-mail %', btrim(p_email);
    END IF;

    IF EXISTS (SELECT 1 FROM public.coupons c WHERE c.user_id = v_user) THEN
        RAISE EXCEPTION 'Esta conta já possui um cupom';
    END IF;

    v_codigo := 'LUMINAR' || v_pct || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    v_validade := NOW() + (GREATEST(1, LEAST(COALESCE(p_dias, 30), 365)) || ' days')::interval;

    INSERT INTO public.coupons (codigo, percentual, user_id, origem, valido_ate, criado_por)
    VALUES (v_codigo, v_pct, v_user, 'solicitado', v_validade, auth.uid());

    RETURN QUERY SELECT v_codigo, v_pct, v_validade, btrim(p_email);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_criar_cupom(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_criar_cupom(text, integer, integer) TO authenticated;

-- ==========================================================================
-- 18) REEMBOLSO AUTOMATICO (F6)
-- Reembolsa so o que o PROPRIO Portal cancelou (marca "Cancelad...
-- automaticamente" na resposta). Cancelamento pedido pelo cliente fica na
-- fila (reembolso_solicitado_em) para o admin decidir pelo /refund manual.
-- A idempotency key no Stripe impede reembolso duplo.
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.reembolsar_pagos_automaticos()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    token text;
    req bigint;
BEGIN
    SELECT decrypted_secret INTO token FROM vault.decrypted_secrets
     WHERE name = 'reconcile_token' ORDER BY updated_at DESC LIMIT 1;

    IF token IS NULL OR token = '' THEN
        RETURN NULL;
    END IF;

    req := net.http_post(
        url := 'https://frvqvnusjnnmbpztiokn.supabase.co/functions/v1/stripe/refund',
        body := '{}'::jsonb,
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || token
        ),
        timeout_milliseconds := 20000
    );

    RETURN req;
END;
$$;

REVOKE ALL ON FUNCTION public.reembolsar_pagos_automaticos() FROM PUBLIC;

DO $$
BEGIN
    BEGIN
        PERFORM cron.unschedule('reembolsar-pagos');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    PERFORM cron.schedule(
        'reembolsar-pagos',
        '10,25,40,55 * * * *',
        $cron$SELECT public.reembolsar_pagos_automaticos();$cron$
    );
END $$;

-- ==========================================================================
-- 19) ALERTA DE RECONCILIACAO (F6)
-- Se a reconciliacao salvou um pagamento, o webhook do Stripe NAO entregou.
-- O sistema se cura sozinho, mas o admin precisa saber que algo esta errado -
-- senao a falha passa em silencio e so aparece no dia em que nao houver cron.
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.alerta_reconciliacao(
    p_total integer, p_pedidos jsonb DEFAULT '[]'::jsonb
)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_dest text;
    v_corpo text;
    v_lista text;
    v_enviados integer := 0;
BEGIN
    IF COALESCE(p_total, 0) <= 0 THEN
        RETURN 0;
    END IF;

    SELECT string_agg(sub.item, ', ') INTO v_lista
      FROM jsonb_array_elements_text(COALESCE(p_pedidos, '[]'::jsonb)) AS sub(item);

    v_corpo := '<p><strong>O webhook do Stripe nao entregou o evento</strong>, mas a reconciliacao salvou o pagamento.</p>'
        || '<p style="font-size:18px;color:#d4af37;"><strong>' || p_total || ' pedido(s)</strong> confirmado(s) pelo cron.</p>'
        || CASE WHEN v_lista IS NOT NULL
                THEN '<p style="color:#aaa;font-size:13px;">Pedidos: ' || public.esc_html(v_lista) || '</p>'
                ELSE '' END
        || '<p>O cliente nao perdeu o horario. Mas vale conferir por que o Stripe nao conseguiu avisar:</p>'
        || '<p>Stripe &rarr; Developers &rarr; Webhooks &rarr; entregas. O esperado e HTTP 200. '
        || 'Se aparecer 400, o STRIPE_WEBHOOK_SECRET esta diferente do endpoint; '
        || 'se aparecer 401, falta a flag <code>--no-verify-jwt</code> no deploy.</p>';

    FOR v_dest IN
        SELECT u.email
          FROM public.user_roles r
          JOIN auth.users u ON u.id = r.user_id
         WHERE r.role IN ('admin','master') AND u.email IS NOT NULL
    LOOP
        PERFORM public.enviar_email_resend(
            v_dest,
            'Alerta: o webhook do Stripe nao entregou o pagamento',
            public.email_layout('Reconciliacao salvou um pagamento', v_corpo),
            'alerta_reconciliacao', NULL);
        v_enviados := v_enviados + 1;
    END LOOP;

    RETURN v_enviados;
END;
$$;

REVOKE ALL ON FUNCTION public.alerta_reconciliacao(integer, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.alerta_reconciliacao(integer, jsonb) TO service_role;

-- ==========================================================================
-- 20) FINANCEIRO, POLITICA DE CANCELAMENTO E REMARCACAO (F7)
-- O Portal NAO retem nada: o sinal cai no Stripe em nome do Portal e precisa
-- ser repassado ao terapeuta; a diferenca e acertada direto entre consulente
-- e terapeuta. Por isso o razao tem DOIS lancamentos por pedido pago.
-- ==========================================================================

ALTER TABLE public.therapist_bookings
    ADD COLUMN IF NOT EXISTS reembolso_elegivel boolean,
    ADD COLUMN IF NOT EXISTS reembolso_motivo text,
    ADD COLUMN IF NOT EXISTS remarcacoes integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS remarcado_em timestamptz;

CREATE TABLE IF NOT EXISTS public.therapist_ledger (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id uuid NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES public.therapist_bookings(id) ON DELETE SET NULL,
    tipo text NOT NULL CHECK (tipo IN ('repasse_portal', 'direto_consulente', 'ajuste')),
    valor numeric(10,2) NOT NULL,
    taxa_stripe numeric(10,2) NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'a_receber' CHECK (status IN ('a_receber', 'acertado', 'cancelado')),
    forma text,
    acertado_em timestamptz,
    observacao text,
    criado_em timestamptz NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_ledger_booking_tipo
    ON public.therapist_ledger (booking_id, tipo) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_therapist_status
    ON public.therapist_ledger (therapist_id, status, criado_em DESC);

ALTER TABLE public.therapist_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ledger_terapeuta_le ON public.therapist_ledger;
CREATE POLICY ledger_terapeuta_le ON public.therapist_ledger
    FOR SELECT TO authenticated
    USING (therapist_id IN (SELECT t.id FROM public.therapists t WHERE t.user_id = auth.uid()));

DROP POLICY IF EXISTS ledger_admin_le ON public.therapist_ledger;
CREATE POLICY ledger_admin_le ON public.therapist_ledger
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles r
                    WHERE r.user_id = auth.uid() AND r.role IN ('admin','master')));

REVOKE ALL ON public.therapist_ledger FROM anon;

-- Backfill para pedidos pagos antes da F7
INSERT INTO public.therapist_ledger (therapist_id, booking_id, tipo, valor, status, observacao)
SELECT b.therapist_id, b.id, 'repasse_portal', COALESCE(b.valor_cobrado, 0),
       CASE WHEN b.pagamento_status = 'reembolsado' THEN 'cancelado' ELSE 'a_receber' END,
       'Backfill F7'
  FROM public.therapist_bookings b
 WHERE b.pagamento_status IN ('pago','reembolsado')
ON CONFLICT DO NOTHING;

-- Dois creditos ao confirmar o pagamento: o sinal (a repassar) e o restante
-- (acerto direto). Se o pedido for estornado, os dois sao cancelados.
CREATE OR REPLACE FUNCTION public.lancar_creditos_terapeuta()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_liquido numeric;
    v_cobrado numeric;
    v_direto numeric;
BEGIN
    IF NEW.pagamento_status IS NOT DISTINCT FROM OLD.pagamento_status THEN
        RETURN NEW;
    END IF;

    IF NEW.pagamento_status = 'pago' THEN
        v_cobrado := COALESCE(NEW.valor_cobrado, 0);
        v_liquido := GREATEST(0, COALESCE(NEW.valor_total, 0) - COALESCE(NEW.valor_desconto, 0));
        v_direto := GREATEST(0, v_liquido - v_cobrado);

        INSERT INTO public.therapist_ledger (therapist_id, booking_id, tipo, valor, observacao)
        VALUES (NEW.therapist_id, NEW.id, 'repasse_portal', v_cobrado,
                'Recebido pelo Portal no Stripe - a transferir ao terapeuta')
        ON CONFLICT DO NOTHING;

        IF v_direto > 0 THEN
            INSERT INTO public.therapist_ledger (therapist_id, booking_id, tipo, valor, observacao)
            VALUES (NEW.therapist_id, NEW.id, 'direto_consulente', v_direto,
                    'Restante acertado direto entre consulente e terapeuta')
            ON CONFLICT DO NOTHING;
        END IF;

    ELSIF NEW.pagamento_status = 'reembolsado' THEN
        UPDATE public.therapist_ledger
           SET status = 'cancelado'
         WHERE booking_id = NEW.id AND status = 'a_receber';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_creditos ON public.therapist_bookings;
CREATE TRIGGER trg_ledger_creditos
    AFTER UPDATE OF pagamento_status ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.lancar_creditos_terapeuta();

-- Politica: >= 24h antes = reembolso integral; < 24h = sem reembolso (permite
-- remarcar); pedido ainda pendente (terapeuta nao confirmou) = integral sempre;
-- pedido RECUSADO pelo terapeuta = integral em qualquer prazo (contrato 5.1e).
CREATE OR REPLACE FUNCTION public.booking_reembolso()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
    v_horas numeric;
BEGIN
    IF NEW.status IN ('cancelado', 'recusado')
       AND OLD.status <> NEW.status
       AND NEW.pagamento_status = 'pago'
       AND NEW.reembolso_elegivel IS NULL THEN

        IF NEW.status = 'recusado' THEN
            NEW.reembolso_elegivel := true;
            NEW.reembolso_motivo := 'O terapeuta recusou o pedido: reembolso integral.';
        ELSE
            v_horas := EXTRACT(EPOCH FROM (((NEW.data + NEW.hora_inicio) AT TIME ZONE 'America/Sao_Paulo') - NOW())) / 3600;

            IF OLD.status = 'pendente' THEN
                NEW.reembolso_elegivel := true;
                NEW.reembolso_motivo := 'O terapeuta ainda nao havia confirmado: reembolso integral.';
            ELSIF v_horas >= 24 THEN
                NEW.reembolso_elegivel := true;
                NEW.reembolso_motivo := 'Cancelado com ' || round(v_horas) || 'h de antecedencia: reembolso integral.';
            ELSE
                NEW.reembolso_elegivel := false;
                NEW.reembolso_motivo := 'Cancelado com menos de 24h: sem reembolso, valor fica como garantia do horario.';
            END IF;
        END IF;

        IF NEW.reembolso_elegivel THEN
            NEW.reembolso_solicitado_em := NOW();
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.politica_cancelamento(p_booking uuid)
RETURNS TABLE (reembolso_integral boolean, permite_remarcar boolean,
               horas_para_atendimento numeric, motivo text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
    b record;
    v_horas numeric;
BEGIN
    SELECT * INTO b FROM public.therapist_bookings WHERE id = p_booking;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    v_horas := round(EXTRACT(EPOCH FROM (((b.data + b.hora_inicio) AT TIME ZONE 'America/Sao_Paulo') - NOW())) / 3600, 1);
    horas_para_atendimento := v_horas;

    IF b.status = 'pendente' THEN
        reembolso_integral := true;
        permite_remarcar := false;
        motivo := 'O terapeuta ainda nao confirmou: reembolso integral.';
    ELSIF v_horas >= 24 THEN
        reembolso_integral := true;
        permite_remarcar := true;
        motivo := 'Faltam ' || round(v_horas) || 'h: reembolso integral.';
    ELSE
        reembolso_integral := false;
        permite_remarcar := COALESCE(b.remarcacoes, 0) < 2;
        motivo := 'Faltam ' || v_horas || 'h: sem reembolso, mas voce pode remarcar.';
    END IF;

    RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.politica_cancelamento(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.politica_cancelamento(uuid) TO authenticated;

-- Remarcacao: o horario continua imutavel, exceto dentro desta RPC
-- (marca a transacao com app.remarcando = on).
CREATE OR REPLACE FUNCTION public.booking_horario_imutavel()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    IF NOT public.is_admin(auth.uid())
       AND current_setting('app.remarcando', true) IS DISTINCT FROM 'on' THEN
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
$$;

CREATE OR REPLACE FUNCTION public.remarcar_solicitacao(p_booking uuid, p_data date, p_hora time)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    b record;
BEGIN
    SELECT * INTO b FROM public.therapist_bookings WHERE id = p_booking;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Agendamento nao encontrado';
    END IF;

    IF b.consulente_id <> auth.uid() AND NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Este agendamento nao e seu';
    END IF;

    IF b.status NOT IN ('pendente','confirmado') THEN
        RAISE EXCEPTION 'So e possivel remarcar pedidos abertos';
    END IF;

    IF b.pagamento_status <> 'pago' THEN
        RAISE EXCEPTION 'Conclua o pagamento antes de remarcar';
    END IF;

    IF COALESCE(b.remarcacoes, 0) >= 2 THEN
        RAISE EXCEPTION 'Limite de 2 remarcacoes atingido. Fale com o terapeuta.';
    END IF;

    IF ((p_data + p_hora) AT TIME ZONE 'America/Sao_Paulo') <= NOW() + INTERVAL '24 hours' THEN
        RAISE EXCEPTION 'Escolha um horario com pelo menos 24h de antecedencia';
    END IF;

    PERFORM set_config('app.remarcando', 'on', true);

    BEGIN
        UPDATE public.therapist_bookings
           SET data = p_data,
               hora_inicio = p_hora,
               expira_em = NULL,
               remarcacoes = COALESCE(remarcacoes, 0) + 1,
               remarcado_em = NOW()
         WHERE id = p_booking;
    EXCEPTION WHEN exclusion_violation THEN
        RAISE EXCEPTION 'Este horario acabou de ser reservado. Escolha outro.';
    END;
END;
$$;

REVOKE ALL ON FUNCTION public.remarcar_solicitacao(uuid, date, time) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remarcar_solicitacao(uuid, date, time) TO authenticated;

-- Leituras: visao do terapeuta e visao do admin
CREATE OR REPLACE FUNCTION public.meus_creditos()
RETURNS TABLE (a_receber_portal numeric, a_receber_consulente numeric,
               recebido_total numeric, recebido_mes numeric)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_therapist uuid;
BEGIN
    SELECT t.id INTO v_therapist FROM public.therapists t WHERE t.user_id = auth.uid() LIMIT 1;
    IF v_therapist IS NULL THEN RETURN; END IF;

    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN l.tipo = 'repasse_portal' AND l.status = 'a_receber'
                          THEN GREATEST(0, l.valor - l.taxa_stripe) END), 0),
        COALESCE(SUM(CASE WHEN l.tipo = 'direto_consulente' AND l.status = 'a_receber'
                          THEN l.valor END), 0),
        COALESCE(SUM(CASE WHEN l.status = 'acertado' THEN l.valor END), 0),
        COALESCE(SUM(CASE WHEN l.status = 'acertado'
                           AND l.acertado_em >= date_trunc('month', NOW())
                          THEN l.valor END), 0)
      FROM public.therapist_ledger l
     WHERE l.therapist_id = v_therapist AND l.status <> 'cancelado';
END;
$$;

CREATE OR REPLACE FUNCTION public.meus_extratos(p_limite integer DEFAULT 100)
RETURNS TABLE (id uuid, booking_id uuid, tipo text, valor numeric, taxa numeric,
               status text, forma text, acertado_em timestamptz, criado_em timestamptz,
               consulente text, data_atendimento date)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_therapist uuid;
BEGIN
    SELECT t.id INTO v_therapist FROM public.therapists t WHERE t.user_id = auth.uid() LIMIT 1;
    IF v_therapist IS NULL THEN RETURN; END IF;

    RETURN QUERY
    SELECT l.id, l.booking_id, l.tipo, l.valor, l.taxa_stripe, l.status, l.forma,
           l.acertado_em, l.criado_em, b.consulente_nome::text, b.data
      FROM public.therapist_ledger l
      LEFT JOIN public.therapist_bookings b ON b.id = l.booking_id
     WHERE l.therapist_id = v_therapist
     ORDER BY l.criado_em DESC
     LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 100), 500));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_listar_financeiro(p_limite integer DEFAULT 200)
RETURNS TABLE (id uuid, booking_id uuid, terapeuta text, consulente text, data_atendimento date,
               tipo text, valor numeric, taxa numeric, status text, forma text,
               acertado_em timestamptz, criado_em timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administrador';
    END IF;

    RETURN QUERY
    SELECT l.id, l.booking_id, t.nome::text, b.consulente_nome::text, b.data,
           l.tipo, l.valor, l.taxa_stripe, l.status, l.forma, l.acertado_em, l.criado_em
      FROM public.therapist_ledger l
      JOIN public.therapists t ON t.id = l.therapist_id
      LEFT JOIN public.therapist_bookings b ON b.id = l.booking_id
     ORDER BY l.criado_em DESC
     LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 200), 1000));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_marcar_repasse(p_ids uuid[], p_forma text DEFAULT 'pix')
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total integer;
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administrador';
    END IF;

    UPDATE public.therapist_ledger
       SET status = 'acertado', forma = COALESCE(p_forma, 'pix'), acertado_em = NOW()
     WHERE id = ANY(p_ids) AND status = 'a_receber';

    GET DIAGNOSTICS v_total = ROW_COUNT;
    RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.meus_creditos() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.meus_extratos(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_listar_financeiro(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_marcar_repasse(uuid[], text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.meus_creditos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.meus_extratos(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_listar_financeiro(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_marcar_repasse(uuid[], text) TO authenticated;

-- Mensalidade do terapeuta (receita do Portal). Estrutura pronta; a cobranca
-- entra depois do contrato. Bloqueio de novos pedidos apos 7 dias de atraso.
CREATE TABLE IF NOT EXISTS public.therapist_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id uuid NOT NULL UNIQUE REFERENCES public.therapists(id) ON DELETE CASCADE,
    plano text NOT NULL DEFAULT 'mensal',
    valor numeric(10,2) NOT NULL DEFAULT 0,
    dia_vencimento integer NOT NULL DEFAULT 5 CHECK (dia_vencimento BETWEEN 1 AND 28),
    inicio_em date NOT NULL DEFAULT CURRENT_DATE,
    vence_em date,
    status text NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa','atrasada','bloqueada','cancelada','isenta')),
    bloqueado_em timestamptz,
    observacao text,
    criado_em timestamptz NOT NULL DEFAULT NOW(),
    atualizado_em timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.therapist_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS assinatura_terapeuta_le ON public.therapist_subscriptions;
CREATE POLICY assinatura_terapeuta_le ON public.therapist_subscriptions
    FOR SELECT TO authenticated
    USING (therapist_id IN (SELECT t.id FROM public.therapists t WHERE t.user_id = auth.uid()));

DROP POLICY IF EXISTS assinatura_admin_le ON public.therapist_subscriptions;
CREATE POLICY assinatura_admin_le ON public.therapist_subscriptions
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles r
                    WHERE r.user_id = auth.uid() AND r.role IN ('admin','master')));

REVOKE ALL ON public.therapist_subscriptions FROM anon;

CREATE OR REPLACE FUNCTION public.terapeuta_pode_receber(p_therapist uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT COALESCE((
        SELECT CASE
            WHEN s.status IN ('cancelada','isenta') THEN true
            WHEN s.status = 'bloqueada' THEN false
            WHEN s.status = 'atrasada' AND s.vence_em IS NOT NULL
                 AND s.vence_em < CURRENT_DATE - 7 THEN false
            ELSE true
        END
          FROM public.therapist_subscriptions s
         WHERE s.therapist_id = p_therapist
    ), true);
$$;

-- Retencao: quita a mensalidade vencida usando os repasses ainda a receber.
CREATE OR REPLACE FUNCTION public.quitar_mensalidade_com_retencao(p_therapist uuid)
RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_devido numeric;
    v_linha record;
    v_retido numeric := 0;
BEGIN
    SELECT s.valor INTO v_devido
      FROM public.therapist_subscriptions s
     WHERE s.therapist_id = p_therapist AND s.status IN ('ativa','atrasada')
       AND s.vence_em IS NOT NULL AND s.vence_em < CURRENT_DATE
     ORDER BY s.vence_em LIMIT 1;

    IF COALESCE(v_devido, 0) <= 0 THEN
        RETURN 0;
    END IF;

    FOR v_linha IN
        SELECT l.id, l.valor FROM public.therapist_ledger l
         WHERE l.therapist_id = p_therapist AND l.tipo = 'repasse_portal' AND l.status = 'a_receber'
         ORDER BY l.criado_em
    LOOP
        EXIT WHEN v_retido >= v_devido;

        UPDATE public.therapist_ledger
           SET status = 'acertado', forma = 'retencao_mensalidade', acertado_em = NOW()
         WHERE id = v_linha.id;

        v_retido := v_retido + v_linha.valor;
    END LOOP;

    UPDATE public.therapist_subscriptions
       SET status = 'ativa', vence_em = (vence_em + INTERVAL '1 month')::date, atualizado_em = NOW()
     WHERE therapist_id = p_therapist AND status IN ('ativa','atrasada')
       AND vence_em IS NOT NULL AND vence_em < CURRENT_DATE;

    RETURN v_retido;
END;
$$;

REVOKE ALL ON FUNCTION public.quitar_mensalidade_com_retencao(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.quitar_mensalidade_com_retencao(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.terapeuta_pode_receber(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.terapeuta_pode_receber(uuid) TO anon, authenticated;

-- ==========================================================================
-- 21) E-MAILS DA POLITICA (F7)
-- O consulente precisa saber as regras no momento em que paga, quando
-- remarca (com o contador) e quando cancela (com o destino do dinheiro).
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.notificar_remarcacao()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_email_terapeuta text;
    v_nome_terapeuta text;
    v_quando text;
    v_servico text;
    v_usadas integer;
    v_restam integer;
    v_base text;
BEGIN
    BEGIN
        IF TG_OP <> 'UPDATE' THEN RETURN NEW; END IF;
        -- Detecta pela CONTAGEM de remarcacoes: remarcado_em usa NOW(), que e
        -- constante dentro da mesma transacao.
        IF COALESCE(NEW.remarcacoes, 0) IS NOT DISTINCT FROM COALESCE(OLD.remarcacoes, 0) THEN
            RETURN NEW;
        END IF;

        SELECT u.email, t.nome INTO v_email_terapeuta, v_nome_terapeuta
          FROM public.therapists t
          JOIN auth.users u ON u.id = t.user_id
         WHERE t.id = NEW.therapist_id;

        v_usadas := COALESCE(NEW.remarcacoes, 0);
        v_restam := GREATEST(0, 2 - v_usadas);
        v_quando := to_char(NEW.data, 'DD/MM/YYYY') || ' às ' || to_char(NEW.hora_inicio, 'HH24:MI');
        v_servico := COALESCE(NEW.servico_nome, 'Atendimento a combinar');

        v_base := '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
               || '<p>' || public.esc_html(v_servico) || ' · ' || NEW.duracao_min || ' min</p>'
               || '<div style="background:#1c1c2e;border-left:3px solid #d4af37;padding:14px 16px;border-radius:8px;margin-top:16px;font-size:14px;line-height:1.7;">'
               || CASE WHEN v_restam > 0
                       THEN 'Remarcações usadas: <strong>' || v_usadas || ' de 2</strong>. Ainda restam <strong>' || v_restam || '</strong>.<br>'
                            || 'Lembre-se: o novo horário precisa de 24h de antecedência e o cancelamento com reembolso integral só vale até 24h antes.'
                       ELSE '<strong style="color:#ffcc80;">Atenção: esta foi a sua última remarcação.</strong><br>'
                            || 'Você já usou as 2 remarcações deste atendimento. Não será possível remarcar novamente — '
                            || 'um novo cancelamento não terá reembolso.' END
               || '</div>';

        PERFORM public.enviar_email_resend(NEW.consulente_contato,
            'Horário remarcado: ' || v_quando,
            public.email_layout('Seu atendimento foi remarcado',
                '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '!</p>'
                || '<p>Seu atendimento com <strong>' || public.esc_html(v_nome_terapeuta) || '</strong> foi movido para:</p>'
                || v_base
                || '<p style="color:#aaa;">O valor já pago continua valendo: não houve cobrança nova.</p>'),
            'remarcado', NEW.id);

        PERFORM public.enviar_email_resend(v_email_terapeuta,
            'Atendimento remarcado: ' || v_quando,
            public.email_layout('Um atendimento foi remarcado',
                '<p><strong>' || public.esc_html(NEW.consulente_nome) || '</strong> remarcou o atendimento.</p>'
                || v_base),
            'remarcado_terapeuta', NEW.id);

        RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES ('erro', NEW.id, NULL, NULL, 'erro', SQLERRM);
        RETURN NEW;
    END;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_remarcacao ON public.therapist_bookings;
CREATE TRIGGER trg_booking_remarcacao
    AFTER UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.notificar_remarcacao();

-- E-mail focado no dinheiro do cancelamento: reembolso integral OU retencao
-- como garantia (com o lembrete de que remarcar era a alternativa).
CREATE OR REPLACE FUNCTION public.notificar_cancelamento_politica()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_quando text;
    v_corpo text;
BEGIN
    BEGIN
        IF TG_OP <> 'UPDATE' THEN RETURN NEW; END IF;
        IF NEW.status NOT IN ('cancelado', 'recusado') OR OLD.status = NEW.status THEN RETURN NEW; END IF;
        IF NEW.pagamento_status <> 'pago' OR NEW.reembolso_elegivel IS NULL THEN RETURN NEW; END IF;

        v_quando := to_char(NEW.data, 'DD/MM/YYYY') || ' às ' || to_char(NEW.hora_inicio, 'HH24:MI');

        IF NEW.reembolso_elegivel THEN
            v_corpo := '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>O <strong>reembolso integral</strong> de ' || public.fmt_brl(NEW.valor_cobrado) || ' foi solicitado.</p>'
                || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
                || '<p>' || public.esc_html(COALESCE(NEW.reembolso_motivo, '')) || '</p>'
                || '<p style="color:#aaa;">O valor volta ao seu meio de pagamento em alguns dias úteis.</p>';
        ELSE
            v_corpo := '<p>Olá, ' || public.esc_html(NEW.consulente_nome) || '.</p>'
                || '<p>Este cancelamento foi feito com <strong>menos de 24h</strong> do atendimento, então <strong>não há reembolso</strong>: o valor de '
                || public.fmt_brl(NEW.valor_cobrado) || ' ficou como garantia do horário reservado.</p>'
                || '<p style="font-size:18px;color:#d4af37;"><strong>' || v_quando || '</strong></p>'
                || '<div style="background:#1c1c2e;border-left:3px solid #d4af37;padding:14px 16px;border-radius:8px;margin-top:16px;font-size:14px;line-height:1.7;">'
                || 'Da próxima vez, se não puder comparecer, use <strong>Remarcar</strong> em Minha Jornada: '
                || 'você tem até <strong>2 remarcações</strong> por atendimento, sem custo adicional.'
                || '</div>';
        END IF;

        PERFORM public.enviar_email_resend(NEW.consulente_contato,
            'Sobre o seu pagamento: ' || v_quando,
            public.email_layout('Cancelamento e seu pagamento', v_corpo), 'cancelamento_politica', NEW.id);

        RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.email_log (tipo, booking_id, destinatario, assunto, status, detalhe)
        VALUES ('erro', NEW.id, NULL, NULL, 'erro', SQLERRM);
        RETURN NEW;
    END;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_cancelamento_politica ON public.therapist_bookings;
CREATE TRIGGER trg_booking_cancelamento_politica
    AFTER UPDATE ON public.therapist_bookings
    FOR EACH ROW EXECUTE FUNCTION public.notificar_cancelamento_politica();



