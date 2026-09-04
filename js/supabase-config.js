// js/supabase-config.js — Conexão com o Supabase
// Versão: 1.0.0
// 
// Uso:
//   import { supabase } from './supabase-config.js';
//   const { data, error } = await supabase.from('tabela').select('*');

// Configuração via variáveis injetadas pelo build.js (window.__*__)
const SUPABASE_URL = window.__SUPABASE_URL__ || '';
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__ || '';

// Importação dinâmica do cliente Supabase via CDN (para sites estáticos)
// Se estiver usando npm, troque por: import { createClient } from '@supabase/supabase-js'
let supabaseInstance = null;

export async function initSupabase() {
    if (supabaseInstance) return supabaseInstance;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("🔮 Supabase: Credenciais não encontradas. Modo offline.");
        return null;
    }

    try {
        // Carrega o cliente Supabase via módulo ES dinâmico
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                storageKey: 'portal_elluminar_auth'
            }
        });

        console.log("🔮 Supabase: Conexão estabelecida com o Criamor.");
        return supabaseInstance;
    } catch (err) {
        console.error("🔮 Supabase: Erro na conexão:", err);
        return null;
    }
}

// Exporta uma Promise que resolve para o cliente
export const supabase = new Promise((resolve) => {
    if (supabaseInstance) {
        resolve(supabaseInstance);
    } else {
        // Inicialização sob demanda
        resolve(initSupabase());
    }
});

// Helper: obter o cliente já iniciado (para uso síncrono após init)
export async function getSupabase() {
    if (!supabaseInstance) {
        await initSupabase();
    }
    return supabaseInstance;
}