// js/config.js — Configuração do Portal El'Luminar
// Versão: 2.1.0 (Supabase + OpenRouter API)

// Configuração do Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
    window.__SUPABASE_URL__ || '';

export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
    window.__SUPABASE_ANON_KEY__ || '';

// Configuração do OpenRouter (substitui o Gemini direto)
// Cadastre-se em https://openrouter.ai/keys para obter sua chave
export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 
    window.__OPENROUTER_API_KEY__ || '';

// Modelo recomendado no OpenRouter
export const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-chat-v4-0724';
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Site e nome do app para aparecer no OpenRouter
export const OPENROUTER_SITE_URL = window.location.origin;
export const OPENROUTER_APP_NAME = 'Portal El\'Luminar';

// Versão do sistema
export const SISTEMA_VERSAO = 'v2.1.0';