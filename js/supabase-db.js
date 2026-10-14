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

// Colunas que dependem de migração no banco. Se o banco ainda for antigo, o
// insert/update falha com PGRST204/42703: repetimos SEM elas, para que a
// leitura nunca deixe de ser salva por causa de uma migração pendente.
const COLUNAS_OPCIONAIS = ['essencia_imagem'];

function faltaColuna(error) {
    if (!error) return false;
    const msg = [error.message, error.details, error.hint].filter(Boolean).join(' ');
    return error.code === 'PGRST204' || error.code === '42703'
        || /column .*does not exist|Could not find the .*column/i.test(msg);
}

function semColunasOpcionais(campos) {
    const copia = Object.assign({}, campos);
    COLUNAS_OPCIONAIS.forEach(function(c) { delete copia[c]; });
    return copia;
}

export async function saveReading(readingData) {
    const client = await getSupabase();
    if (!client) {
        saveToLocalBackup('readings', readingData);
        return { data: null, error: null, local: true, id: null };
    }

    const payload = {
        user_id: readingData.user_id,
        consulente: readingData.consulente,
        tipo_tiragem: readingData.tipo_tiragem,
        cartas: readingData.cartas,
        pergunta: readingData.pergunta,
        interpretacao: readingData.interpretacao,
        essencia: readingData.essencia,
        essencia_imagem: readingData.essencia_imagem,
        notas_tarologo: readingData.notas_tarologo,
        created_at: new Date().toISOString()
    };

    let { data, error } = await client
        .from('readings')
        .insert(payload)
        .select();

    // Banco sem a coluna nova: grava o essencial em vez de perder a leitura
    if (error && faltaColuna(error)) {
        console.warn("Coluna nova ausente no banco; salvando sem ela. Rode o SQL de migracao.");
        ({ data, error } = await client
            .from('readings')
            .insert(semColunasOpcionais(payload))
            .select());
    }

    if (error) {
        console.warn("Erro ao salvar leitura, salvando local:", error);
        saveToLocalBackup('readings', readingData);
        return { data: null, error, local: true, id: null };
    }

    // Retorna o id da linha gravada, para permitir atualizar depois
    // (ex.: anexar o texto canalizado pela IA apos o salvamento imediato).
    return { data, error: null, local: false, id: (data && data[0]) ? data[0].id : null };
}

// Atualiza uma leitura ja gravada (usado para anexar o texto da IA,
// as anotacoes do Guardiao e a carta da Essencia depois)
export async function updateReading(readingId, campos) {
    const client = await getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase não conectado.' }, local: true };
    if (!readingId) return { data: null, error: { message: 'Leitura sem identificador.' }, local: false };

    // Só permite atualizar colunas conhecidas
    const permitidos = {};
    ['consulente', 'tipo_tiragem', 'cartas', 'pergunta', 'interpretacao', 'essencia', 'essencia_imagem', 'notas_tarologo'].forEach(function(c) {
        if (campos && campos[c] !== undefined) permitidos[c] = campos[c];
    });

    let { data, error } = await client
        .from('readings')
        .update(permitidos)
        .eq('id', readingId)
        .select();

    // Banco sem a coluna nova: reenvia sem ela em vez de perder a atualizacao
    if (error && faltaColuna(error) && permitidos.essencia_imagem !== undefined) {
        console.warn("Coluna nova ausente no banco; atualizando sem ela. Rode o SQL de migracao.");
        ({ data, error } = await client
            .from('readings')
            .update(semColunasOpcionais(permitidos))
            .eq('id', readingId)
            .select());
    }

    if (error) console.warn("Erro ao atualizar leitura:", error);
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
// PERFIL DO USUÁRIO (user_profiles) + Marketing Consent
// ======================================================================

export async function saveUserProfile(userId, profileData) {
    const client = await getSupabase();
    if (!client) {
        localStorage.setItem('user_profile_local', JSON.stringify(profileData));
        return { local: true };
    }

    const { data, error } = await client
        .from('user_profiles')
        .upsert({
            user_id: userId,
            email: profileData.email,
            name: profileData.name,
            marketing_consent: profileData.marketing_consent || false,
            consent_date: profileData.marketing_consent ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select();

    if (error) console.warn("Erro ao salvar perfil:", error);
    return { data, error };
}

export async function saveMarketingConsent(userId, email, name, consent) {
    return await saveUserProfile(userId, {
        email,
        name,
        marketing_consent: consent
    });
}

export async function getUserProfile(userId) {
    const client = await getSupabase();
    if (!client) {
        const local = localStorage.getItem('user_profile_local');
        return local ? JSON.parse(local) : null;
    }

    const { data, error } = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.warn("Erro ao carregar perfil:", error);
    }
    return data;
}

export async function getMarketingLeads() {
    const client = await getSupabase();
    if (!client) return [];

    const { data, error } = await client
        .from('user_profiles')
        .select('email, name, marketing_consent, consent_date, created_at')
        .eq('marketing_consent', true)
        .order('consent_date', { ascending: false });

    if (error) {
        console.warn("Erro ao buscar leads:", error);
        return [];
    }
    return data || [];
}

// Sincroniza o perfil do usuario: cria se nao existir e aplica consentimento pendente
export async function syncUserProfile(user) {
    if (!user || !user.id) return null;
    const nome = user.user_metadata?.name || user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : '');
    let profile = await getUserProfile(user.id);

    if (!profile) {
        const r = await saveUserProfile(user.id, { email: user.email, name: nome, marketing_consent: false });
        profile = r?.data?.[0] || null;
    }

    // Aplica consentimento marcado no cadastro (aguardando a primeira sessao)
    try {
        const raw = localStorage.getItem('pending_marketing_consent');
        if (raw) {
            const p = JSON.parse(raw);
            const r = await saveUserProfile(user.id, {
                email: p.email || user.email,
                name: p.name || nome,
                marketing_consent: true
            });
            profile = r?.data?.[0] || profile;
            localStorage.removeItem('pending_marketing_consent');
        }
    } catch (e) {
        console.warn("Erro ao aplicar consentimento pendente:", e);
    }

    return profile;
}

export async function applyPendingMarketingConsent(userId, email, name) {
    if (!userId) return false;
    try {
        const raw = localStorage.getItem('pending_marketing_consent');
        if (!raw) return false;
        const p = JSON.parse(raw);
        await saveUserProfile(userId, { email: p.email || email, name: p.name || name, marketing_consent: true });
        localStorage.removeItem('pending_marketing_consent');
        return true;
    } catch (e) {
        return false;
    }
}

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