// js/env-config.example.js
// ---------------------------------------------------------------------------
// Copie este arquivo para js/env-config.js e preencha com as SUAS chaves
// de desenvolvimento. O js/env-config.js está no .gitignore — ele nunca
// deve ser versionado.
//
// Em produção (Vercel) este arquivo é gerado automaticamente pelo build.js
// a partir das env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
// VITE_OPENROUTER_API_KEY, VITE_OPENROUTER_MODEL, VITE_STRIPE_PUBLISHABLE_KEY.
//
// ATENÇÃO: a chave da OpenRouter aqui fica VISÍVEL no navegador. Para uso
// real, o caminho correto é uma Edge Function intermediando as chamadas.
// ---------------------------------------------------------------------------

window.__SUPABASE_URL__ = "https://SEU-PROJETO.supabase.co";
window.__SUPABASE_ANON_KEY__ = "sua-anon-key";
window.__OPENROUTER_API_KEY__ = "";
window.__OPENROUTER_MODEL__ = "deepseek/deepseek-v4-flash-0731";
window.__STRIPE_PK__ = "";
