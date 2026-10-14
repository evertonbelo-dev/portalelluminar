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
//   signInWithMagicLink(email)    — Login sem senha
//   appUrl(caminho)               — URL absoluta do portal (independe da hospedagem)
//   getAuthErrorFromUrl()         — Mensagem de erro devolvida na volta do OAuth

import { getSupabase } from './supabase-config.js';

// --- URL DO PORTAL (independente da hospedagem) ---
// Resolve um caminho a partir da pasta da pagina atual, para que o portal
// funcione tanto na raiz (Vercel) quanto em subpasta (GitHub Pages), em
// subdominio ou em dominio proprio, sem alterar codigo ao trocar de host.
// Aceita 'dashboard.html' e tambem '/dashboard.html' (formato antigo).
export function appUrl(caminho = 'index.html') {
    const rel = String(caminho).replace(/^\.?\//, '');
    const origem = window.location.origin;
    // Aberto direto do disco (file://) nao existe origem: devolvemos o caminho
    // relativo, que basta para a navegacao local (window.location.href = ...).
    // Isso evita TypeError no new URL() e mantem o fluxo local funcional.
    if (!ehUrlAbsoluta(origem)) return rel;
    const p = window.location.pathname;
    const ultimo = p.split('/').pop() || '';
    // Se a URL atual é uma pasta (termina em "/" ou o ultimo segmento nao tem
    // extensao, ex.: /portalelluminar), mantemos a pasta como base.
    const pasta = (p.endsWith('/') || !ultimo.includes('.')) ? (p.endsWith('/') ? p : p + '/') : p.replace(/[^/]*$/, '');
    return new URL(rel, origem + pasta).href;
}

// True apenas para URLs absolutas http/https (as unicas aceitas pelo Supabase).
function ehUrlAbsoluta(url) {
    return /^https?:\/\//i.test(String(url || ''));
}

// --- ERRO DEVOLVIDO PELO PROVEDOR NA VOLTA (OAuth / confirmacao de email) ---
// O Supabase devolve a falha como #error_description=... ou ?error_description=...
// ("erro" tambem e aceito, formato usado pelo login.html ao repassar a mensagem)
// Retorna a mensagem legivel, ou null quando nao ha erro.
export function getAuthErrorFromUrl() {
    const q = new URLSearchParams(window.location.search);
    const h = new URLSearchParams(String(window.location.hash || '').replace(/^#/, ''));
    return q.get('error_description') || h.get('error_description')
        || q.get('erro') || h.get('erro')
        || q.get('error') || h.get('error') || null;
}

// --- CADASTRO ---
export async function signUp(email, password, userData = {}) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    // Para onde o link de confirmacao do email deve voltar.
    // Sem isso o Supabase usa o "Site URL" do projeto (que costuma estar como
    // localhost) e o usuario cai numa pagina morta apos confirmar. So enviamos
    // quando ha URL absoluta: em file:// o Supabase recusaria o valor relativo.
    const retornoEmail = appUrl(userData.emailRedirectTo || 'dashboard.html');

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: userData.name || '',
                avatar_url: userData.avatar_url || ''
            },
            ...(ehUrlAbsoluta(retornoEmail) ? { emailRedirectTo: retornoEmail } : {})
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
export async function signInWithGoogle(options = {}) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    // Destino pos-login. O Supabase exige URL absoluta, entao resolvemos o
    // caminho relativo com appUrl() para funcionar em qualquer hospedagem.
    const redirectTo = options.redirectTo || appUrl(options.redirect || 'dashboard.html');

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: ehUrlAbsoluta(redirectTo) ? { redirectTo } : {}
    });

    return { data, error };
}

// --- LOGIN MÁGICO (sem senha) ---
export async function signInWithMagicLink(email) {
    const supabase = await getSupabase();
    if (!supabase) return { error: { message: "Supabase não conectado." } };

    const retorno = appUrl('dashboard.html');
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: ehUrlAbsoluta(retorno) ? { redirectTo: retorno } : {}
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
        window.location.href = appUrl('index.html');
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