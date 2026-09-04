// js/modelos.js — Catálogo de Modelos IA para o Portal El'Luminar
// Versão: 1.0.0
// Uso futuro: import { MODELOS_DISPONIVEIS, getModeloAtivo, setModeloAtivo } from './modelos.js';

export const MODELOS_DISPONIVEIS = [
    // === DeepSeek (Recomendados) ===
    { id: 'deepseek/deepseek-v4-flash-0731', nome: 'DeepSeek V4 Flash', provedor: 'DeepSeek', descricao: 'Excelente custo-benefício', custo: 'baixo', contexto: '1.31M', recomendado: true },
    { id: 'deepseek/deepseek-v4-flash-latest', nome: 'DeepSeek V4 Flash (Último)', provedor: 'DeepSeek', descricao: 'Sempre o último V4 Flash', custo: 'baixo', contexto: '1.05M', recomendado: false },
    { id: 'deepseek/deepseek-v4-pro-0813', nome: 'DeepSeek V4 Pro', provedor: 'DeepSeek', descricao: 'Máxima potência', custo: 'médio', contexto: '1.05M', recomendado: false },
    { id: 'deepseek/deepseek-chat', nome: 'DeepSeek V3 (Clássico)', provedor: 'DeepSeek', descricao: 'Confiável e barato', custo: 'baixo', contexto: '164K', recomendado: false },
    { id: 'deepseek/deepseek-r1', nome: 'DeepSeek R1', provedor: 'DeepSeek', descricao: 'Raciocínio profundo', custo: 'médio', contexto: '64K', recomendado: false },
    // === Google ===
    { id: 'google/gemini-2.5-flash', nome: 'Gemini 2.5 Flash', provedor: 'Google', descricao: 'Rápido e gratuito', custo: 'baixo', contexto: '1M', recomendado: false },
    { id: 'google/gemini-2.5-pro', nome: 'Gemini 2.5 Pro', provedor: 'Google', descricao: 'Alta qualidade', custo: 'médio', contexto: '2M', recomendado: false },
    // === OpenAI ===
    { id: 'openai/gpt-4o-mini', nome: 'GPT-4o Mini', provedor: 'OpenAI', descricao: 'Econômico', custo: 'baixo', contexto: '128K', recomendado: false },
    { id: 'openai/gpt-4o', nome: 'GPT-4o', provedor: 'OpenAI', descricao: 'Excelente qualidade', custo: 'médio', contexto: '128K', recomendado: false },
    // === Anthropic ===
    { id: 'anthropic/claude-3.5-haiku', nome: 'Claude 3.5 Haiku', provedor: 'Anthropic', descricao: 'Rápido e sensível', custo: 'baixo', contexto: '200K', recomendado: false },
    { id: 'anthropic/claude-3.5-sonnet', nome: 'Claude 3.5 Sonnet', provedor: 'Anthropic', descricao: 'Excelente para textos espirituais', custo: 'médio', contexto: '200K', recomendado: false }
];

export function getModeloAtivo() {
    const salvo = localStorage.getItem('portal_modelo_ia');
    if (salvo) {
        const enc = MODELOS_DISPONIVEIS.find(m => m.id === salvo);
        if (enc) return enc;
    }
    const envModel = window.__OPENROUTER_MODEL__ || '';
    const enc = MODELOS_DISPONIVEIS.find(m => m.id === envModel);
    return enc || MODELOS_DISPONIVEIS.find(m => m.recomendado) || MODELOS_DISPONIVEIS[0];
}

export function setModeloAtivo(modelId) {
    const enc = MODELOS_DISPONIVEIS.find(m => m.id === modelId);
    if (enc) {
        localStorage.setItem('portal_modelo_ia', modelId);
        window.__OPENROUTER_MODEL__ = modelId;
        return true;
    }
    return false;
}

window.__setModelo = function(modelId) {
    setModeloAtivo(modelId);
    location.reload();
};
