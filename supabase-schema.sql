-- ==========================================================
-- Portal El'Luminar — Schema do Supabase
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- ==========================================================

-- 1. Tabela: readings (Leituras de Tarô)
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

-- 4. Tabela: user_profiles (Perfil do Usuário)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    birth_date DATE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ÍNDICES (para performance)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON public.readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON public.readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON public.session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_tipo ON public.session_history(tipo_sessao);

-- ==========================================================
-- RLS (Row Level Security) — SEGURANÇA
-- ==========================================================

-- readings: usuários só veem suas próprias leituras
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas próprias leituras"
    ON public.readings FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias leituras"
    ON public.readings FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias leituras"
    ON public.readings FOR DELETE
    USING (auth.uid() = user_id);

-- course_progress: progresso pessoal do curso
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver seu próprio progresso"
    ON public.course_progress FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir/atualizar seu próprio progresso"
    ON public.course_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- session_history: histórico pessoal
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver seu próprio histórico"
    ON public.session_history FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seu próprio histórico"
    ON public.session_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- user_profiles: perfil público apenas leitura, privado para edição
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfis são públicos para leitura"
    ON public.user_profiles FOR SELECT
    USING (true);
CREATE POLICY "Usuários podem editar seu próprio perfil"
    ON public.user_profiles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- TRIGGER: Criar perfil automaticamente ao cadastrar
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();