// js/supabase-auth.js — Autenticação com Supabase
// Versão: 1.0.0
//
// Funções:
//   signUp(email, password)       — Registrar novo usuário
//   signIn(email, password)       — Login com email/senha
//   signOut()                     — Sair
//   getSession()                  — Obter sessão atual
//   onAuthChange(callback)        — Escutar mudanças de auth
//   signInWithGoogle()            — Login com Google OAuth

import { getSupabase } from './supabase-config.js';

// --- CADASTRO ---
export async function signUp(email, password, userData = {}) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: userData.name || '',
                avatar_url: userData.avatar_url || ''
            }
        }
    });

    return { data, error };
}

// --- LOGIN ---
export async function signIn(email, password) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

// --- LOGIN COM GOOGLE ---
export async function signInWithGoogle() {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/dashboard.html'
        }
    });

    return { data, error };
}

// --- LOGIN MÁGICO (sem senha) ---
export async function signInWithMagicLink(email) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            redirectTo: window.location.origin + '/dashboard.html'
        }
    });

    return { data, error };
}

// --- SAIR ---
export async function signOut() {
    const supabase = await getSupabase();
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (!error) {
        // Redireciona para o portal
        window.location.href = '/index.html';
    }
    return { error };
}

// --- OBTER SESSÃO ATUAL ---
export async function getSession() {
    const supabase = await getSupabase();
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// --- OBTER USUÁRIO ATUAL ---
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
}

// --- OUVIR MUDANÇAS DE AUTENTICAÇÃO ---
export function onAuthChange(callback) {
    // Inicializa e já chama o callback com a sessão atual
    getSupabase().then(supabase => {
        if (!supabase) return;

        // Primeiro, obtém a sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            callback(session);
        });

        // Depois, escuta mudanças futuras
        supabase.auth.onAuthStateChange((event, session) => {
            callback(session);
        });
    });
}