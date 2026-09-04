// js/admin-config.js — Configurações do Portal (persistidas no Supabase)
// Versão: 1.0.0
// Tabela no Supabase: site_config { key: text PK, value: jsonb, updated_at: timestamp, updated_by: uuid }

import { getSupabase } from './supabase-config.js';

let configCache = null;

// VALORES PADRÃO
const DEFAULTS = {
    modelo_ia: { id: window.__OPENROUTER_MODEL__ || 'deepseek/deepseek-v4-flash-0731', nome: 'DeepSeek V4 Flash' },
    afirmacao_footer: '"Que a Luz de Sirius guie teus passos."',
    cores: { ouro_solar: '#ffaa00', dourado_antigo: '#d4af37', azul_profundo: '#050510' },
    versao_sistema: '2.0.0',
    nome_versao: 'O Voo da Águia',
    titulo_portal: "Portal El'Luminar"
};

// CARREGAR CONFIG
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

// SALVAR CONFIG
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

// VERIFICAR ADMIN
export async function isAdmin(userId) {
    if (!userId) return false;
    const supabase = await getSupabase();
    if (!supabase) return false;
    try {
        const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
        if (error) return false;
        return data.role === 'admin' || data.role === 'master';
    } catch { return false; }
}

// SQL SETUP (para exibir ao admin)
export function getSqlSetup() {
    return '-- Portal El\'Luminar - Setup do Banco (execute no SQL Editor do Supabase)\n\n' +
    'CREATE TABLE IF NOT EXISTS user_roles (\n' +
    '    user_id UUID PRIMARY KEY REFERENCES auth.users(id),\n' +
    '    role TEXT NOT NULL DEFAULT \'user\' CHECK (role IN (\'user\', \'admin\', \'master\')),\n' +
    '    created_at TIMESTAMPTZ DEFAULT NOW()\n' +
    ');\n\n' +
    'ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;\n\n' +
    'CREATE TABLE IF NOT EXISTS site_config (\n' +
    '    key TEXT PRIMARY KEY,\n' +
    '    value JSONB NOT NULL DEFAULT \'{}\',\n' +
    '    updated_at TIMESTAMPTZ DEFAULT NOW(),\n' +
    '    updated_by UUID REFERENCES auth.users(id)\n' +
    ');\n\n' +
    'ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;\n\n' +
    'CREATE POLICY "Todos leem config" ON site_config FOR SELECT USING (true);\n' +
    'CREATE POLICY "Admins gerenciam config" ON site_config FOR ALL USING (\n' +
    '    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN (\'admin\', \'master\'))\n' +
    ');\n\n' +
    'INSERT INTO site_config (key, value) VALUES\n' +
    '    (\'modelo_ia\', \'{"id": "deepseek/deepseek-v4-flash-0731", "nome": "DeepSeek V4 Flash"}\'),\n' +
    '    (\'afirmacao_footer\', \'{"valor": "\\"Que a Luz de Sirius guie teus passos.\\""}\'),\n' +
    '    (\'cores\', \'{"ouro_solar": "#ffaa00", "dourado_antigo": "#d4af37", "azul_profundo": "#050510"}\')\n' +
    'ON CONFLICT (key) DO NOTHING;';
}
