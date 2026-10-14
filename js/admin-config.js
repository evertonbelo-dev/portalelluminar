// js/admin-config.js — Configuracoes do Portal (persistidas no Supabase)
// Versao: 2.1.0

import { getSupabase } from './supabase-config.js';

let configCache = null;

const DEFAULTS = {
    modelo_ia: { id: 'deepseek/deepseek-v4-flash-0731', nome: 'DeepSeek V4 Flash' },
    afirmacao_footer: '"Que a Luz de Sirius guie teus passos."',
    cores: { ouro_solar: '#ffaa00', dourado_antigo: '#d4af37', azul_profundo: '#050510' },
    versao_sistema: '2.1.0',
    nome_versao: 'O Voo da Aguia',
    titulo_portal: "Portal El'Luminar"
};

export async function carregarConfig() {
    if (configCache) return configCache;
    const supabase = await getSupabase();
    if (!supabase) return { ...DEFAULTS };
    try {
        const { data, error } = await supabase.from('site_config').select('*');
        if (error || !data) return { ...DEFAULTS };
        const config = { ...DEFAULTS };
        data.forEach(item => {
            if (typeof item.value === 'object' && item.value !== null) {
                if (item.value.valor !== undefined) config[item.key] = item.value.valor;
                else config[item.key] = { ...config[item.key], ...item.value };
            } else { config[item.key] = item.value; }
        });
        configCache = config;
        return config;
    } catch (e) {
        console.warn('Erro ao carregar config:', e);
        return { ...DEFAULTS };
    }
}

export async function salvarConfig(key, value, userId) {
    const supabase = await getSupabase();
    if (!supabase) {
        const local = JSON.parse(localStorage.getItem('site_config_local') || '{}');
        local[key] = value;
        localStorage.setItem('site_config_local', JSON.stringify(local));
        configCache = null;
        return { local: true };
    }
    const { data, error } = await supabase.from('site_config').upsert({
        key: key,
        value: typeof value === 'object' ? value : { valor: value },
        updated_at: new Date().toISOString(),
        updated_by: userId || null
    }, { onConflict: 'key' });
    if (error) { console.error('Erro ao salvar config:', error); return { error }; }
    configCache = null;
    return { success: true };
}

export async function isAdmin(userId) {
    if (!userId) return false;
    const supabase = await getSupabase();
    if (!supabase) return false;
    try {
        const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
        if (error) {
            console.warn('[isAdmin] Erro na consulta:', error.message);
            return false;
        }
        if (!data) {
            console.warn('[isAdmin] Nenhum registro para user_id:', userId);
            return false;
        }
        console.log('[isAdmin] Role:', data.role);
        return data.role === 'admin' || data.role === 'master';
    } catch (e) {
        console.warn('[isAdmin] Excecao:', e.message);
        return false;
    }
}export function getSqlSetup() {
    const sql = `-- Portal El'Luminar - Setup do Banco (CORRIGIDO - sem erro de sintaxe)
-- Agora usa template literal no JS, aceita aspas duplas no SQL sem conflito

-- 1. Funcao segura SECURITY DEFINER (ignora RLS, sem recursao)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = $1 AND role IN ('admin', 'master'))
$$;

-- 2. Tabela de papeis dos usuarios
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios podem ver proprio papel" ON user_roles;
CREATE POLICY "Usuarios podem ver proprio papel" ON user_roles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins podem ver todos" ON user_roles;
CREATE POLICY "Admins podem ver todos" ON user_roles FOR SELECT USING (public.is_admin(auth.uid()));
-- Escrita em user_roles: sem isto os botoes "Tornar Admin" e
-- "Remover Admin" do painel falham com erro de RLS.
DROP POLICY IF EXISTS "Admins podem gerenciar papeis" ON user_roles;
CREATE POLICY "Admins podem gerenciar papeis" ON user_roles FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 3. Tabela de configuracoes do site
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Todos leem config" ON site_config;
CREATE POLICY "Todos leem config" ON site_config FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins gerenciam config" ON site_config;
CREATE POLICY "Admins gerenciam config" ON site_config FOR ALL USING (public.is_admin(auth.uid()));

-- 4. Inserir configuracoes padrao
INSERT INTO site_config (key, value) VALUES
    ('modelo_ia', '{"id": "deepseek/deepseek-v4-flash-0731", "nome": "DeepSeek V4 Flash"}'),
    ('afirmacao_footer', '{"valor": "\"Que a Luz de Sirius guie teus passos.\""}'),
    ('cores', '{"ouro_solar": "#ffaa00", "dourado_antigo": "#d4af37", "azul_profundo": "#050510"}')
ON CONFLICT (key) DO NOTHING;

-- 5. Tabela de perfis de usuario + consentimento de marketing
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    name TEXT,
    marketing_consent BOOLEAN DEFAULT false,
    consent_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garante as colunas mesmo se a tabela ja existir com outro formato
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS consent_date TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
DO $$ BEGIN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios podem ver proprio perfil" ON user_profiles;
CREATE POLICY "Usuarios podem ver proprio perfil" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON user_profiles;
CREATE POLICY "Admins podem ver todos os perfis" ON user_profiles FOR SELECT USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Usuarios podem inserir/atualizar proprio perfil" ON user_profiles;
CREATE POLICY "Usuarios podem inserir/atualizar proprio perfil" ON user_profiles FOR ALL USING (auth.uid() = user_id);

-- 6. ADMIN: listar usuarios e excluir contas (SECURITY DEFINER)
--    O schema "auth" NAO e exposto na API REST, portanto
--    s.from('auth.users') sempre falha no navegador.
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (user_id uuid, user_email text, user_name text, user_created_at timestamptz, user_role text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administradores podem listar usuarios';
    END IF;
    RETURN QUERY
    SELECT u.id, u.email::text,
           COALESCE(p.name, p.display_name, u.raw_user_meta_data->>'name', u.email)::text,
           u.created_at,
           COALESCE(r.role, 'user')::text
    FROM auth.users u
    LEFT JOIN public.user_profiles p ON p.user_id = u.id
    LEFT JOIN public.user_roles r ON r.user_id = u.id
    ORDER BY u.created_at DESC
    LIMIT 500;
END;
$func$;

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Apenas administradores podem excluir usuarios';
    END IF;
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Voce nao pode excluir a propria conta';
    END IF;
    UPDATE public.site_config SET updated_by = NULL WHERE updated_by = target_user_id;
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$func$;

REVOKE ALL ON FUNCTION public.admin_list_users() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;
DO $func$ BEGIN
    REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM anon;
EXCEPTION WHEN OTHERS THEN NULL; END $func$;

-- 7. Para se tornar admin (troque pelo seu email):
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'seu@email.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
`;
    return sql;
}
