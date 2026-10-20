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

// ======================================================================
// VITRINE DE TERAPEUTAS (Fase F2)
//   therapists / therapist_services / therapist_contatos
//
// Se o SQL da secao 8 do supabase-schema.sql ainda nao rodou, as funcoes
// devolvem { indisponivel: true } em vez de estourar erro: a vitrine cai
// para os perfis de exemplo e o painel mostra as instrucoes de migracao.
// ======================================================================

function tabelaAusente(error) {
    if (!error) return false;
    const msg = [error.message, error.details, error.hint].filter(Boolean).join(' ');
    return error.code === 'PGRST205' || error.code === 'PGRST200' || error.code === '42P01'
        || /Could not find the table|relation .* does not exist|Could not find a relationship/i.test(msg);
}

// Converte a linha do banco (+ servicos e contatos embutidos) no formato
// que a vitrine e o painel ja usam.
export function normalizarTerapeuta(row) {
    if (!row) return null;

    const servicos = (Array.isArray(row.therapist_services) ? row.therapist_services : [])
        .slice()
        .sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); })
        .map(function (s) {
            return {
                id: s.id,
                nome: s.nome,
                descricao: s.descricao || '',
                duracao_min: s.duracao_min,
                preco: s.preco || '',
                ativo: s.ativo !== false
            };
        });

    // therapist_id e PK em contatos: o Supabase devolve objeto, mas
    // versoes antigas do PostgREST devolvem array de 1.
    const bruto = row.therapist_contatos;
    const contatos = Array.isArray(bruto) ? (bruto[0] || null) : (bruto || null);

    // F3: janelas semanais e folgas pontuais
    const disponibilidade = (Array.isArray(row.therapist_availability) ? row.therapist_availability : [])
        .filter(function (a) { return a && a.ativo !== false; })
        .map(function (a) {
            return {
                id: a.id,
                dia_semana: Number(a.dia_semana),
                hora_inicio: hhmm(a.hora_inicio),
                hora_fim: hhmm(a.hora_fim),
                duracao_min: Number(a.duracao_min) || 60
            };
        })
        .sort(function (a, b) {
            return (a.dia_semana - b.dia_semana) || a.hora_inicio.localeCompare(b.hora_inicio);
        });

    const bloqueios = (Array.isArray(row.therapist_blocks) ? row.therapist_blocks : [])
        .map(function (b) {
            return {
                id: b.id,
                data: String(b.data || '').slice(0, 10),
                hora_inicio: hhmm(b.hora_inicio),
                hora_fim: hhmm(b.hora_fim),
                motivo: b.motivo || ''
            };
        })
        .sort(function (a, b) { return a.data.localeCompare(b.data); });

    return {
        id: row.id,
        user_id: row.user_id,
        slug: row.slug || '',
        nome: row.nome || '',
        titulo: row.titulo || '',
        especialidades: Array.isArray(row.especialidades) ? row.especialidades : [],
        cidade: row.cidade || '',
        modalidade: row.modalidade || 'ambos',
        anos: row.anos || 0,
        bio: row.bio || '',
        foto_url: row.foto_url || '',
        destaque: !!row.destaque,
        status: row.status || 'rascunho',
        servicos: servicos,
        contatos: contatos,
        disponibilidade: disponibilidade,
        bloqueios: bloqueios
    };
}

const SELECT_TERAPEUTA = '*, therapist_services(*), therapist_contatos(*), therapist_availability(*), therapist_blocks(*)';

// Postgres devolve TIME como "14:00:00"; a UI trabalha com "14:00"
function hhmm(v) {
    return v ? String(v).slice(0, 5) : '';
}

// Vitrine: os perfis publicados (a RLS ja bloqueia o resto; o filtro
// explicito deixa a consulta direta).
export async function listarTerapeutasPublicos() {
    const client = await getSupabase();
    if (!client) return { data: [], error: null, local: true, indisponivel: true };

    const { data, error } = await client
        .from('therapists')
        .select(SELECT_TERAPEUTA)
        .eq('status', 'publicado')
        .order('destaque', { ascending: false })
        .order('nome', { ascending: true });

    if (error) {
        if (tabelaAusente(error)) return { data: [], error: null, indisponivel: true };
        return { data: [], error, indisponivel: false };
    }

    return { data: (data || []).map(normalizarTerapeuta), error: null, indisponivel: false };
}

// Painel do terapeuta: o perfil da conta logada (qualquer status).
export async function obterMeuPerfilTerapeuta(userId) {
    if (!userId) return { data: null, error: null, indisponivel: false };

    const client = await getSupabase();
    if (!client) return { data: null, error: null, local: true, indisponivel: true };

    const { data, error } = await client
        .from('therapists')
        .select(SELECT_TERAPEUTA)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        if (tabelaAusente(error)) return { data: null, error: null, indisponivel: true };
        return { data: null, error, indisponivel: false };
    }

    return { data: normalizarTerapeuta(data), error: null, indisponivel: false };
}

// Gera o identificador do perfil a partir do nome: "Ana Solar" -> "ana-solar"
export function slugifyTerapeuta(texto) {
    return String(texto || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}

function sufixoAleatorio() {
    return Math.random().toString(36).slice(2, 6);
}

// Cria ou atualiza o perfil (1 por conta, upsert em user_id).
// `status` controla a visibilidade: 'rascunho' | 'publicado' | 'pausado'.
export async function salvarPerfilTerapeuta(dados) {
    const client = await getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase nao conectado.' }, local: true, indisponivel: true };
    if (!dados || !dados.user_id) return { data: null, error: { message: 'Usuario nao identificado.' } };
    if (!String(dados.nome || '').trim()) return { data: null, error: { message: 'Informe o nome que aparece na vitrine.' } };

    const payload = {
        user_id: dados.user_id,
        nome: String(dados.nome).trim(),
        titulo: dados.titulo ? String(dados.titulo).trim() : null,
        especialidades: Array.isArray(dados.especialidades) ? dados.especialidades : [],
        cidade: dados.cidade ? String(dados.cidade).trim() : null,
        modalidade: dados.modalidade || 'ambos',
        anos: dados.anos ? Number(dados.anos) : null,
        bio: dados.bio ? String(dados.bio).trim() : null,
        foto_url: dados.foto_url ? String(dados.foto_url).trim() : null,
        status: dados.status || 'rascunho'
    };
    if (dados.id) payload.id = dados.id;
    if (dados.slug) payload.slug = dados.slug;
    if (typeof dados.destaque === 'boolean') payload.destaque = dados.destaque;

    const gravar = function (p) {
        return client.from('therapists').upsert(p, { onConflict: 'user_id' }).select().maybeSingle();
    };

    if (!payload.slug) payload.slug = slugifyTerapeuta(payload.nome) || 'terapeuta';

    let { data, error } = await gravar(payload);

    // Slug ja usado por outro terapeuta: reenvia com sufixo unico.
    // (Perfis que ja existem mantem o slug antigo — links nao quebram.)
    let tentativas = 0;
    while (error && error.code === '23505' && !dados.slug && tentativas < 3
           && /slug/i.test((error.message || '') + ' ' + (error.details || '') + ' ' + (error.hint || ''))) {
        tentativas++;
        payload.slug = (slugifyTerapeuta(payload.nome) || 'terapeuta') + '-' + sufixoAleatorio();
        ({ data, error } = await gravar(payload));
    }

    if (error) {
        if (tabelaAusente(error)) return { data: null, error: null, indisponivel: true };
        return { data: null, error };
    }

    return { data: normalizarTerapeuta(data), error: null, indisponivel: false };
}

// Regrava a lista de servicos na ordem da tela.
// Estrategia "apaga e insere": simples de manter e a lista e pequena.
export async function salvarServicosTerapeuta(therapistId, servicos) {
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, local: true };
    if (!therapistId) return { error: { message: 'Perfil sem identificador.' } };

    const lista = (servicos || []).filter(function (s) {
        return s && String(s.nome || '').trim();
    });

    const { error: erroDel } = await client
        .from('therapist_services')
        .delete()
        .eq('therapist_id', therapistId);

    if (erroDel) {
        if (tabelaAusente(erroDel)) return { error: null, indisponivel: true };
        return { error: erroDel };
    }

    if (!lista.length) return { error: null, total: 0 };

    const rows = lista.map(function (s, i) {
        const dur = parseInt(s.duracao_min, 10);
        return {
            therapist_id: therapistId,
            nome: String(s.nome).trim(),
            descricao: s.descricao ? String(s.descricao).trim() : null,
            duracao_min: isNaN(dur) ? null : dur,
            preco: s.preco ? String(s.preco).trim() : null,
            ordem: i,
            ativo: s.ativo === false ? false : true
        };
    });

    const { error } = await client.from('therapist_services').insert(rows);
    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        return { error };
    }

    return { error: null, total: rows.length };
}

// Telefone no formato +pais (DDD) numero — assume Brasil quando o codigo
// nao vem. Usado pelo painel (mascara) e pela gravacao (normalizacao),
// para que dado antigo/cru vire formato consistente ao salvar.
export function formatarWhatsApp(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.length > 13) d = d.slice(0, 13);
    if (d.length <= 11) d = '55' + d;
    const pais = d.slice(0, 2);
    const ddd = d.slice(2, 4);
    const resto = d.slice(4);
    let out = '+' + pais;
    if (ddd) out += ' (' + ddd + ')';
    if (resto) {
        out += ' ' + (resto.length > 4 ? resto.slice(0, resto.length - 4) + '-' + resto.slice(-4) : resto);
    }
    return out;
}

// Canais de contato do perfil. Sem nenhum preenchido, a linha e apagada
// (o perfil publicado nao mostra botao de contato nenhum).
export async function salvarContatosTerapeuta(therapistId, contatos) {
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, local: true };
    if (!therapistId) return { error: { message: 'Perfil sem identificador.' } };

    const c = contatos || {};
    const limpar = function (v) { return v && String(v).trim() ? String(v).trim() : null; };

    const row = {
        therapist_id: therapistId,
        whatsapp: limpar(c.whatsapp) ? formatarWhatsApp(c.whatsapp) : null,
        email_publico: limpar(c.email_publico),
        instagram: limpar(c.instagram),
        facebook: limpar(c.facebook),
        youtube: limpar(c.youtube),
        site: limpar(c.site)
    };

    const vazio = !row.whatsapp && !row.email_publico && !row.instagram
        && !row.facebook && !row.youtube && !row.site;

    if (vazio) {
        const { error } = await client.from('therapist_contatos').delete().eq('therapist_id', therapistId);
        if (error) {
            if (tabelaAusente(error)) return { error: null, indisponivel: true };
            return { error };
        }
        return { error: null };
    }

    const { error } = await client
        .from('therapist_contatos')
        .upsert(row, { onConflict: 'therapist_id' });

    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        return { error };
    }

    return { error: null };
}

// ======================================================================
// FOTO DO TERAPEUTA (Supabase Storage — bucket "therapist-fotos")
//   A imagem já chega recortada e quadrada (blob JPEG gerado no canvas,
//   pelo painel do dashboard), então aqui só sobe o arquivo.
// ======================================================================

const BUCKET_FOTOS = 'therapist-fotos';

export async function uploadFotoTerapeuta(userId, blob) {
    const client = await getSupabase();
    if (!client) return { url: null, caminho: null, error: { message: 'Supabase nao conectado.' }, indisponivel: true };
    if (!userId || !blob) return { url: null, caminho: null, error: { message: 'Imagem invalida.' } };

    // Um arquivo por envio: o nome com timestamp evita cache antigo no CDN.
    const caminho = userId + '/foto-' + Date.now() + '.jpg';

    const { error } = await client.storage.from(BUCKET_FOTOS).upload(caminho, blob, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
        upsert: false
    });

    if (error) {
        const msg = (error.message || '') + ' ' + (error.error || '');
        if (/bucket/i.test(msg) || error.statusCode === '404') {
            return { url: null, caminho: null, error: null, indisponivel: true };
        }
        return { url: null, caminho: null, error };
    }

    const pub = client.storage.from(BUCKET_FOTOS).getPublicUrl(caminho);
    return {
        url: pub && pub.data ? pub.data.publicUrl : null,
        caminho: caminho,
        error: null,
        indisponivel: false
    };
}

// Caminho interno a partir da URL pública (para apagar a foto trocada).
export function caminhoFotoTerapeuta(url) {
    const m = String(url || '').match(/\/object\/public\/therapist-fotos\/([^?#]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

export async function removerFotoTerapeuta(caminho) {
    if (!caminho) return { error: null };
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' } };
    const { error } = await client.storage.from(BUCKET_FOTOS).remove([caminho]);
    return { error: error || null };
}

// ======================================================================
// SOLICITACOES DE AGENDAMENTO (Fase F4) — therapist_bookings
//   Anti-double-booking vive no BANCO (constraint de exclusao gist):
//   duas solicitacoes ativas do mesmo terapeuta nao podem se sobrepor.
// ======================================================================

function erroDeConflito(error) {
    if (!error) return false;
    const msg = [error.message, error.details, error.hint].filter(Boolean).join(' ');
    return error.code === '23P01' || /sobrepos|conflict|exclusion/i.test(msg);
}

// O que esta ocupado — sem revelar quem reservou (RPC SECURITY DEFINER)
export async function listarHorariosOcupados(therapistId) {
    const client = await getSupabase();
    if (!client) return { data: [], error: null, indisponivel: true };
    if (!therapistId) return { data: [], error: null, indisponivel: false };

    // Autocura: libera pendentes vencidas antes de listar (o cron do banco
    // roda a cada 15 min; isto garante que a vitrine nunca mostre horario
    // preso por um pedido que ja caducou).
    try { await client.rpc('expirar_solicitacoes_pendentes'); } catch (e) { /* opcional */ }
    // Idem para quem abriu o checkout e nao pagou: o horario volta a ficar
    // livre assim que o prazo de pagamento vence.
    try { await client.rpc('cancelar_pagamentos_vencidos'); } catch (e) { /* opcional */ }

    const { data, error } = await client.rpc('horarios_ocupados', { p_therapist: therapistId });

    if (error) {
        // PGRST202 = funcao nao encontrada (migracao da F4 pendente)
        if (error.code === 'PGRST202' || tabelaAusente(error)) {
            return { data: [], error: null, indisponivel: true };
        }
        return { data: [], error, indisponivel: false };
    }

    return {
        data: (data || []).map(function (b) {
            return {
                data: String(b.data || '').slice(0, 10),
                hora_inicio: hhmm(b.hora_inicio),
                duracao_min: Number(b.duracao_min) || 60
            };
        }),
        error: null,
        indisponivel: false
    };
}

export async function criarSolicitacaoAgendamento(dados) {
    if (!dados || !dados.therapist_id || !dados.consulente_id || !dados.data || !dados.hora_inicio) {
        return { data: null, error: { message: 'Dados da solicitacao incompletos.' } };
    }

    const client = await getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase nao conectado.' }, indisponivel: true };

    const row = {
        therapist_id: dados.therapist_id,
        consulente_id: dados.consulente_id,
        consulente_nome: dados.consulente_nome || null,
        consulente_contato: dados.consulente_contato || null,
        servico_nome: dados.servico_nome || null,
        servico_preco: dados.servico_preco || null,
        data: String(dados.data).slice(0, 10),
        hora_inicio: String(dados.hora_inicio).slice(0, 5),
        duracao_min: Math.min(600, Math.max(15, Number(dados.duracao_min) || 60)),
        observacao: dados.observacao ? String(dados.observacao).trim() : null,
        status: 'pendente'
    };

    const { data, error } = await client
        .from('therapist_bookings')
        .insert(row)
        .select()
        .maybeSingle();

    if (error) {
        if (tabelaAusente(error)) return { data: null, error: null, indisponivel: true };
        if (erroDeConflito(error)) {
            return {
                data: null,
                conflito: true,
                error: { message: 'Esse horario acabou de ser ocupado. Escolha outro.' }
            };
        }
        return { data: null, error };
    }

    return { data: normalizarSolicitacao(data), error: null, indisponivel: false };
}
export function normalizarSolicitacao(row) {
    if (!row) return null;
    const t = Array.isArray(row.therapists) ? row.therapists[0] : row.therapists;

    // Quanto falta para expirar (so faz sentido em pendente)
    let minutosParaExpirar = null;
    if (row.status === 'pendente' && row.expira_em) {
        const ms = new Date(row.expira_em).getTime() - Date.now();
        minutosParaExpirar = Math.max(0, Math.round(ms / 60000));
    }

    return {
        id: row.id,
        therapist_id: row.therapist_id,
        terapeuta_nome: (t && t.nome) || 'Terapeuta',
        terapeuta_slug: (t && t.slug) || '',
        consulente_nome: row.consulente_nome || '',
        consulente_contato: row.consulente_contato || '',
        servico_nome: row.servico_nome || '',
        servico_preco: row.servico_preco || '',
        data: String(row.data || '').slice(0, 10),
        hora_inicio: hhmm(row.hora_inicio),
        duracao_min: Number(row.duracao_min) || 60,
        status: row.status || 'pendente',
        observacao: row.observacao || '',
        resposta: row.resposta || '',
        expira_em: row.expira_em || null,
        minutos_para_expirar: minutosParaExpirar,
        created_at: row.created_at || null,
        pagamento_status: row.pagamento_status || 'aguardando',
        forma_pagamento: row.forma_pagamento || null,
        cupom_codigo: row.cupom_codigo || null,
        valor_cobrado: row.valor_cobrado === null || row.valor_cobrado === undefined
            ? null
            : Number(row.valor_cobrado),
        pagamento_deadline: row.pagamento_deadline || null,
        // Só oferece "Pagar agora" enquanto o prazo está aberto e o pedido
        // ainda vale: depois disso o job cancela e o horário é liberado.
        pode_pagar: (function () {
            if (!row.pagamento_deadline) return false;
            if (row.pagamento_status === 'pago' || row.pagamento_status === 'reembolsado') return false;
            if (row.status === 'cancelado' || row.status === 'recusado' || row.status === 'concluido') return false;
            return new Date(row.pagamento_deadline).getTime() > Date.now();
        })()
    };
}

// Expira as pendentes vencidas (roda no banco; devolve quantas cancelou)
export async function expirarSolicitacoesPendentes() {
    const client = await getSupabase();
    if (!client) return { expiradas: 0, error: null, indisponivel: true };

    const { data, error } = await client.rpc('expirar_solicitacoes_pendentes');

    if (error) {
        if (error.code === 'PGRST202' || tabelaAusente(error)) {
            return { expiradas: 0, error: null, indisponivel: true };
        }
        return { expiradas: 0, error, indisponivel: false };
    }

    return { expiradas: Number(data) || 0, error: null, indisponivel: false };
}

const SELECT_SOLICITACAO = '*, therapists(nome, slug)';

// Painel do consulente: "Meus agendamentos"
export async function listarMinhasSolicitacoes(userId) {
    const client = await getSupabase();
    if (!client) return { data: [], error: null, indisponivel: true };
    if (!userId) return { data: [], error: null, indisponivel: false };

    const { data, error } = await client
        .from('therapist_bookings')
        .select(SELECT_SOLICITACAO)
        .eq('consulente_id', userId)
        .order('data', { ascending: false })
        .order('hora_inicio', { ascending: false })
        .limit(30);

    if (error) {
        if (tabelaAusente(error)) return { data: [], error: null, indisponivel: true };
        return { data: [], error, indisponivel: false };
    }

    return { data: (data || []).map(normalizarSolicitacao), error: null, indisponivel: false };
}

// Painel do terapeuta: "Solicitacoes recebidas"
export async function listarSolicitacoesTerapeuta(therapistId) {
    const client = await getSupabase();
    if (!client) return { data: [], error: null, indisponivel: true };
    if (!therapistId) return { data: [], error: null, indisponivel: false };

    const { data, error } = await client
        .from('therapist_bookings')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })
        .limit(60);

    if (error) {
        if (tabelaAusente(error)) return { data: [], error: null, indisponivel: true };
        return { data: [], error, indisponivel: false };
    }

    return { data: (data || []).map(normalizarSolicitacao), error: null, indisponivel: false };
}

const STATUS_RESPOSTA = ['confirmado', 'recusado', 'concluido'];

export async function responderSolicitacao(id, status, resposta) {
    if (!id || STATUS_RESPOSTA.indexOf(status) === -1) {
        return { error: { message: 'Resposta invalida.' } };
    }

    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, indisponivel: true };

    const { data, error } = await client
        .from('therapist_bookings')
        .update({ status: status, resposta: resposta ? String(resposta).trim() : null })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        if (erroDeConflito(error)) {
            return { error: { message: 'Ja existe outra reserva nesse horario.' }, conflito: true };
        }
        return { error };
    }

    return { data: normalizarSolicitacao(data), error: null };
}

// Consulente so pode cancelar (a policy restringe o status a 'cancelado')
export async function cancelarSolicitacao(id) {
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, indisponivel: true };
    if (!id) return { error: { message: 'Solicitacao sem identificador.' } };

    const { data, error } = await client
        .from('therapist_bookings')
        .update({ status: 'cancelado' })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        return { error };
    }

    return { data: normalizarSolicitacao(data), error: null };
}

// ======================================================================
// AGENDA (Fase F3) — therapist_availability / therapist_blocks
//   Janelas semanais (dia_semana 0=domingo) e folgas pontuais.
//   Horarios em wall-clock de America/Sao_Paulo, no formato HH:MM.
// ======================================================================

export async function salvarDisponibilidadeTerapeuta(therapistId, janelas) {
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, local: true };
    if (!therapistId) return { error: { message: 'Perfil sem identificador.' } };

    const lista = (janelas || []).filter(function (j) {
        return j && j.hora_inicio && j.hora_fim && String(j.hora_inicio) < String(j.hora_fim);
    });

    const { error: erroDel } = await client
        .from('therapist_availability')
        .delete()
        .eq('therapist_id', therapistId);

    if (erroDel) {
        if (tabelaAusente(erroDel)) return { error: null, indisponivel: true };
        return { error: erroDel };
    }

    if (!lista.length) return { error: null, total: 0 };

    const rows = lista.map(function (j) {
        const dur = parseInt(j.duracao_min, 10);
        return {
            therapist_id: therapistId,
            dia_semana: Number(j.dia_semana),
            hora_inicio: String(j.hora_inicio).slice(0, 5),
            hora_fim: String(j.hora_fim).slice(0, 5),
            duracao_min: isNaN(dur) ? 60 : Math.min(480, Math.max(15, dur)),
            ativo: true
        };
    });

    const { error } = await client.from('therapist_availability').insert(rows);
    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        return { error };
    }

    return { error: null, total: rows.length };
}

export async function salvarBloqueiosTerapeuta(therapistId, bloqueios) {
    const client = await getSupabase();
    if (!client) return { error: { message: 'Supabase nao conectado.' }, local: true };
    if (!therapistId) return { error: { message: 'Perfil sem identificador.' } };

    // Folga e "dia inteiro" (sem horas) ou faixa fechada
    const lista = (bloqueios || []).filter(function (b) {
        if (!b || !b.data) return false;
        const temInicio = !!b.hora_inicio;
        const temFim = !!b.hora_fim;
        if (temInicio !== temFim) return false;              // meia faixa: ignora
        if (temInicio && temFim) return String(b.hora_inicio) < String(b.hora_fim);
        return true;                                          // dia inteiro
    });

    const { error: erroDel } = await client
        .from('therapist_blocks')
        .delete()
        .eq('therapist_id', therapistId);

    if (erroDel) {
        if (tabelaAusente(erroDel)) return { error: null, indisponivel: true };
        return { error: erroDel };
    }

    if (!lista.length) return { error: null, total: 0 };

    const rows = lista.map(function (b) {
        return {
            therapist_id: therapistId,
            data: String(b.data).slice(0, 10),
            hora_inicio: b.hora_inicio ? String(b.hora_inicio).slice(0, 5) : null,
            hora_fim: b.hora_fim ? String(b.hora_fim).slice(0, 5) : null,
            motivo: b.motivo ? String(b.motivo).trim() : null
        };
    });

    const { error } = await client.from('therapist_blocks').insert(rows);
    if (error) {
        if (tabelaAusente(error)) return { error: null, indisponivel: true };
        return { error };
    }

    return { error: null, total: rows.length };
}


