// js/supabase-db.js — Operações de Banco de Dados (CRUD)
// Versão: 1.0.0
//
// Tabelas do Supabase:
//   readings        — Leituras de Tarô
//   course_progress — Progresso dos cursos
//   session_history — Histórico de sessões (Hawkins, Bovis)
//   user_profiles   — Dados adicionais do usuário

import { getSupabase } from './supabase-config.js';

// ======================================================================
// LEITURAS DE TARÔ (readings)
// ======================================================================

export async function saveReading(readingData) {
    const client = await getSupabase();
    if (!client) {
        saveToLocalBackup('readings', readingData);
        return { local: true };
    }

    const { data, error } = await client
        .from('readings')
        .insert({
            user_id: readingData.user_id,
            consulente: readingData.consulente,
            tipo_tiragem: readingData.tipo_tiragem,
            cartas: readingData.cartas,
            pergunta: readingData.pergunta,
            interpretacao: readingData.interpretacao,
            essencia: readingData.essencia,
            created_at: new Date().toISOString()
        })
        .select();

    if (error) {
        console.warn("Erro ao salvar leitura, salvando local:", error);
        saveToLocalBackup('readings', readingData);
    }

    return { data, error, local: false };
}

export async function getUserReadings(userId, limit = 10) {
    const client = await getSupabase();
    if (!client) {
        return loadFromLocalBackup('readings');
    }

    const { data, error } = await client
        .from('readings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return { data, error };
}

// ======================================================================
// PROGRESSO DO CURSO (course_progress)
// ======================================================================

export async function saveCourseProgress(userId, cursoId, concluidos, anotacoes) {
    const client = await getSupabase();
    if (!client) {
        localStorage.setItem(`curso_${cursoId}`, JSON.stringify({ concluidos, anotacoes }));
        return { local: true };
    }

    const { data, error } = await client
        .from('course_progress')
        .upsert({
            user_id: userId,
            curso_id: cursoId,
            concluidos: concluidos,
            anotacoes: anotacoes,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,curso_id'
        })
        .select();

    return { data, error };
}

export async function getCourseProgress(userId, cursoId) {
    const client = await getSupabase();
    if (!client) {
        const local = localStorage.getItem(`curso_${cursoId}`);
        return local ? JSON.parse(local) : { concluidos: [], anotacoes: {} };
    }

    const { data, error } = await client
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('curso_id', cursoId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.warn("Erro ao carregar progresso:", error);
    }

    return data || { concluidos: [], anotacoes: {} };
}
// ======================================================================
// HISTÓRICO DE SESSÕES (session_history)
// ======================================================================

export async function saveSessionHistory(userId, tipo, dados) {
    const client = await getSupabase();
    if (!client) {
        saveToLocalBackup(`sessions_${tipo}`, dados);
        return { local: true };
    }

    const { data, error } = await client
        .from('session_history')
        .insert({
            user_id: userId,
            tipo_sessao: tipo,
            dados_sessao: dados,
            created_at: new Date().toISOString()
        })
        .select();

    return { data, error };
}

export async function getSessionHistory(userId, tipo, limit = 20) {
    const client = await getSupabase();
    if (!client) {
        return loadFromLocalBackup(`sessions_${tipo}`);
    }

    const { data, error } = await client
        .from('session_history')
        .select('*')
        .eq('user_id', userId)
        .eq('tipo_sessao', tipo)
        .order('created_at', { ascending: false })
        .limit(limit);

    return { data, error };
}

// ======================================================================
// FALLBACK: localStorage (modo offline)
// ======================================================================

const BACKUP_PREFIX = 'supa_backup_';

function saveToLocalBackup(tabela, dados) {
    try {
        const chave = BACKUP_PREFIX + tabela;
        const existente = JSON.parse(localStorage.getItem(chave) || '[]');
        existente.push({
            ...dados,
            _backup_at: new Date().toISOString()
        });
        localStorage.setItem(chave, JSON.stringify(existente));
    } catch (e) {
        console.warn("Erro ao salvar backup local:", e);
    }
}

function loadFromLocalBackup(tabela) {
    try {
        const chave = BACKUP_PREFIX + tabela;
        const data = JSON.parse(localStorage.getItem(chave) || '[]');
        return data;
    } catch {
        return [];
    }
}

// ======================================================================
// MIGRAÇÃO: localStorage → Supabase (executar uma vez)
// ======================================================================

export async function migrateLocalDataToSupabase(userId) {
    const results = { migrated: 0, errors: 0 };

    // 1. Migrar progresso do curso
    const cursoLocal = localStorage.getItem('curso_progresso_linguagem_luz');
    if (cursoLocal) {
        try {
            const dados = JSON.parse(cursoLocal);
            await saveCourseProgress(userId, 'linguagem_luz', dados.concluidos, dados.anotacoes);
            results.migrated++;
        } catch (e) {
            results.errors++;
        }
    }

    // 2. Migrar leituras de Tarô
    const readingsLocal = loadFromLocalBackup('readings');
    if (readingsLocal.length > 0) {
        for (const r of readingsLocal) {
            try {
                await saveReading({ ...r, user_id: userId });
                results.migrated++;
            } catch (e) {
                results.errors++;
            }
        }
    }

    return results;
}