// js/admin-config.js — Configuracoes do Portal (persistidas no Supabase)
// Versao: 1.0.0

import { getSupabase } from './supabase-config.js';

let configCache = null;

const DEFAULTS = {
    modelo_ia: { id: 'deepseek/deepseek-v4-flash-0731', nome: 'DeepSeek V4 Flash' },
    afirmacao_footer: '"Que a Luz de Sirius guie teus passos."',
    cores: { ouro_solar: '#ffaa00', dourado_antigo: '#d4af37', azul_profundo: '#050510' },
    versao_sistema: '2.0.0',
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
    const sql = [
        "-- Portal El'Luminar - Setup do Banco",
        "-- Com DROP POLICY IF EXISTS - pode rodar varias vezes",
        "",
        "-- 1. Tabela de papeis dos usuarios",
        "CREATE TABLE IF NOT EXISTS user_roles (",
        "    user_id UUID PRIMARY KEY REFERENCES auth.users(id),",
        "    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'master')),",
        "    created_at TIMESTAMPTZ DEFAULT NOW()",
        ");",
        "",
        "ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;",
        'DROP POLICY IF EXISTS "Usuarios podem ver proprio papel" ON user_roles;',
        'CREATE POLICY "Usuarios podem ver proprio papel" ON user_roles FOR SELECT USING (auth.uid() = user_id);',
        'DROP POLICY IF EXISTS "Admins podem ver todos" ON user_roles;',
        'CREATE POLICY "Admins podem ver todos" ON user_roles FOR SELECT USING (',
        "    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('admin', 'master'))",
        ");",
        "",
        "-- 2. Tabela de configuracoes do site",
        "CREATE TABLE IF NOT EXISTS site_config (",
        "    key TEXT PRIMARY KEY,",
        "    value JSONB NOT NULL DEFAULT '{}',",
        "    updated_at TIMESTAMPTZ DEFAULT NOW(),",
        "    updated_by UUID REFERENCES auth.users(id)",
        ");",
        "",
        "ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;",
        'DROP POLICY IF EXISTS "Todos leem config" ON site_config;',
        'CREATE POLICY "Todos leem config" ON site_config FOR SELECT USING (true);',
        'DROP POLICY IF EXISTS "Admins gerenciam config" ON site_config;',
        'CREATE POLICY "Admins gerenciam config" ON site_config FOR ALL USING (',
        "    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('admin', 'master'))",
        ");",
        "",
        "-- 3. Inserir configuracoes padrao",
        "INSERT INTO site_config (key, value) VALUES",
        "    ('modelo_ia', '{\"id\": \"deepseek/deepseek-v4-flash-0731\", \"nome\": \"DeepSeek V4 Flash\"}'),",
        "    ('afirmacao_footer', '{\"valor\": \"\\\"Que a Luz de Sirius guie teus passos.\\\"\"}'),",
        "    ('cores', '{\"ouro_solar\": \"#ffaa00\", \"dourado_antigo\": \"#d4af37\", \"azul_profundo\": \"#050510\"}')",
        "ON CONFLICT (key) DO NOTHING;",
        "",
        "-- 4. Para se tornar admin (troque pelo seu email):",
        "-- INSERT INTO user_roles (user_id, role)",
        "-- SELECT id, 'admin' FROM auth.users WHERE email = 'seu@email.com'",
        "-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';"
    ].join('\n');
    return sql;
}
