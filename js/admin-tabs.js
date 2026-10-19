// js/admin-tabs.js — Gerenciamento de Abas do Painel Admin v2.1.0
import { getSupabase } from './supabase-config.js';
import { carregarConfig, salvarConfig, getSqlSetup } from './admin-config.js';
import { MODELOS_DISPONIVEIS } from './modelos.js';

export async function initTabs(containerEl, userEmail) {
    await renderGeral(containerEl);
    document.querySelectorAll('.admin-tab').forEach(function(tab) {
        tab.addEventListener('click', async function() {
            document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('ativa'); });
            this.classList.add('ativa');
            var aba = this.getAttribute('data-tab');
            containerEl.innerHTML = '<div class="admin-loading"><div class="spin"></div><p>Carregando...</p></div>';
            try {
                switch(aba) {
                    case 'geral': await renderGeral(containerEl); break;
                    case 'visual': renderVisual(containerEl); break;
                    case 'usuarios': await renderUsuarios(containerEl); break;
                    case 'terapeutas': await renderTerapeutas(containerEl); break;
                    case 'leads': await renderLeads(containerEl); break;
                    case 'banco': renderBanco(containerEl); break;
                }
            } catch(e) {
                containerEl.innerHTML = '<div class="admin-card" style="text-align:center;padding:60px;"><h2>Erro</h2><p style="color:#ff6b6b;">' + e.message + '</p></div>';
            }
        });
    });
}

async function renderGeral(el) {
    var config = await carregarConfig() || {};
    var modeloId = config.modelo_ia?.id || window.__OPENROUTER_MODEL__ || '';
    var html = '<div class="admin-card"><h2>Modelo de IA</h2><div id="modelos-lista">';
    var grupos = {};
    MODELOS_DISPONIVEIS.forEach(function(m) { if (!grupos[m.provedor]) grupos[m.provedor] = []; grupos[m.provedor].push(m); });
    Object.keys(grupos).forEach(function(prov) {
        html += '<h4 style="color:var(--dourado-antigo);margin:15px 0 8px;">' + prov + '</h4>';
        grupos[prov].forEach(function(m) {
            html += '<label class="admin-modelo-item ' + (m.id===modeloId?'selecionado':'') + '">';
            html += '<input type="radio" name="modelo-ia" value="' + m.id + '" ' + (m.id===modeloId?'checked':'') + '>';
            html += '<span class="nome">' + m.nome + '</span>';
            html += '<span class="desc">' + m.descricao + '</span>';
            html += '<span class="custo ' + (m.custo==='baixo'?'custo-baixo':'custo-medio') + '">' + m.custo + '</span>';            
            if (m.recomendado) html += '<span style="background:var(--ouro-solar);color:#000;font-size:0.65rem;padding:2px 8px;border-radius:8px;margin-left:6px;">recomendado</span>';
            html += '</label>';
        });
    });
    html += '</div><div id="status-modelo" class="admin-status"></div><button class="btn-admin-save" id="btn-salvar-modelo" disabled>Salvar Modelo</button></div>';
    
    html += '<div class="admin-card"><h2>Frase do Rodape</h2><textarea id="input-afirmacao" style="min-height:120px;width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:8px;color:#fff;">' + (config.afirmacao_footer||'') + '</textarea>';
    html += '<div id="status-afirmacao" class="admin-status"></div><button class="btn-admin-save" id="btn-salvar-afirmacao">Salvar Frase</button></div>';
    
    html += '<div class="admin-card" style="margin-top:30px;"><h2>Cores do Portal</h2><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:25px;">';
    html += '<div style="text-align:center;"><label>Ouro Solar</label><input type="color" id="cor-ouro" value="' + (config.cores?.ouro_solar||'#ffaa00') + '" style="height:60px;width:100%;padding:5px;cursor:pointer;border-radius:8px;"></div>';
    html += '<div style="text-align:center;"><label>Dourado Antigo</label><input type="color" id="cor-dourado" value="' + (config.cores?.dourado_antigo||'#d4af37') + '" style="height:60px;width:100%;padding:5px;cursor:pointer;border-radius:8px;"></div>';
    html += '<div style="text-align:center;"><label>Azul Profundo</label><input type="color" id="cor-azul" value="' + (config.cores?.azul_profundo||'#050510') + '" style="height:60px;width:100%;padding:5px;cursor:pointer;border-radius:8px;"></div>';
    html += '</div><div id="status-cores" class="admin-status"></div><button class="btn-admin-save" id="btn-salvar-cores">Salvar Cores</button></div>';
    el.innerHTML = html;
    configurarEventos(el);
}

function configurarEventos() {
    var btns = document.querySelectorAll('input[name="modelo-ia"]');
    btns.forEach(function(b) { b.addEventListener('change', function() { document.getElementById('btn-salvar-modelo').disabled = false; }); });
    document.getElementById('btn-salvar-modelo').addEventListener('click', async function() {
        var sel = document.querySelector('input[name="modelo-ia"]:checked');
        if (!sel) return;
        var m = MODELOS_DISPONIVEIS.find(function(x) { return x.id === sel.value; });
        if (!m) return;
        var r = await salvarConfig('modelo_ia', { id: m.id, nome: m.nome }, window._adminUserId);
        var st = document.getElementById('status-modelo');
        st.className = 'admin-status ' + ((r.success||r.local) ? 'success' : 'error');
        st.innerText = (r.success||r.local) ? 'Modelo atualizado!' : 'Erro: ' + JSON.stringify(r.error);
        if (r.success||r.local) window.__OPENROUTER_MODEL__ = m.id;
    });
    document.getElementById('btn-salvar-afirmacao').addEventListener('click', async function() {
        var r = await salvarConfig('afirmacao_footer', document.getElementById('input-afirmacao').value, window._adminUserId);
        var st = document.getElementById('status-afirmacao');
        st.className = 'admin-status ' + ((r.success||r.local) ? 'success' : 'error');
        st.innerText = (r.success||r.local) ? 'Frase salva!' : 'Erro: ' + JSON.stringify(r.error);
    });
    document.getElementById('btn-salvar-cores').addEventListener('click', async function() {
        var r = await salvarConfig('cores', { ouro_solar: document.getElementById('cor-ouro').value, dourado_antigo: document.getElementById('cor-dourado').value, azul_profundo: document.getElementById('cor-azul').value }, window._adminUserId);
        var st = document.getElementById('status-cores');
        st.className = 'admin-status ' + ((r.success||r.local) ? 'success' : 'error');
        st.innerText = (r.success||r.local) ? 'Cores salvas!' : 'Erro: ' + JSON.stringify(r.error);
    });
}

function renderVisual(el) {
    el.innerHTML = '<div class="admin-card"><h2>Configuracao Visual</h2><p style="color:#888;margin:15px 0;">Personalize as imagens, textos e secoes do portal.</p><p style="color:#aaa;font-style:italic;">Em desenvolvimento...</p></div>';
}

async function renderUsuarios(el) {
    try {
        var s = await getSupabase();
        if (!s) { el.innerHTML = '<div class="admin-card"><h2>Usuarios</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>'; return; }
        el.innerHTML = '<div class="admin-card"><h2>Carregando...</h2></div>';
        var { data: users, error: usersErr } = await s.rpc('admin_list_users');
        if (usersErr) { el.innerHTML = '<div class="admin-card"><h2>Usuarios</h2><p style="color:#ff6b6b;">' + usersErr.message + '</p><p style="color:#888;font-size:0.85rem;">Execute o SQL atualizado da aba Banco (função admin_list_users).</p></div>'; return; }
        users = users || [];
        var { data: roles } = await s.from('user_roles').select('user_id, role');
        var roleMap = {};
        if (roles) roles.forEach(function(r) { roleMap[r.user_id] = r.role; });
        var html = '<div class="admin-card"><h2>Gerenciar Usuarios (' + (users?users.length:0) + ')</h2>';
        html += '<table class="admin-tabela"><tr><th>Email</th><th>Nome</th><th>Cadastro</th><th>Perfil</th><th>Acoes</th></tr>';
        users.forEach(function(u) {
            var uid = u.user_id; var email = u.user_email || ''; var role = u.user_role || roleMap[uid] || 'user';
            html += '<tr><td>' + email + '</td><td>' + (u.user_name || '-') + '</td><td>' + (u.user_created_at?new Date(u.user_created_at).toLocaleDateString('pt-BR'):'-') + '</td>';
            html += '<td><span class="' + (role==='admin'||role==='master'?'badge-admin':'badge-user') + '">' + role + '</span></td>';
            html += '<td class="acoes-usuario">';
            if (role !== 'admin' && role !== 'master') {
                html += '<button onclick="window._tornarAdmin(\'' + uid + '\')">Tornar Admin</button>';
            } else {
                html += '<button onclick="window._removerAdmin(\'' + uid + '\')">Remover Admin</button>';
            }
            html += '<button class="btn-excluir" onclick="window._excluirUsuario(\'' + uid + '\',\'' + email + '\')">Excluir</button>';
            html += '</td></tr>';
        });
        html += '</table></div>';
        el.innerHTML = html;
    } catch(e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + e.message + '</p></div>';
    }
}

function renderBanco(el) {
    el.innerHTML = '<div class="admin-card"><h2>Setup do Banco</h2><div class="sql-box" id="sql-setup-tab"></div><button class="sql-copy" onclick="navigator.clipboard.writeText(document.getElementById(\'sql-setup-tab\').innerText).then(()=>this.innerText=\'Copiado!\').catch(()=>{})">Copiar SQL</button></div>';
    var sql = document.getElementById('sql-setup-tab');
    if (sql) sql.innerText = getSqlSetup();
}

async function renderLeads(el) {
    try {
        var s = await getSupabase();
        if (!s) { el.innerHTML = '<div class="admin-card"><h2>Marketing</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>'; return; }
        
        // Busca todos os perfis com consentimento de marketing
        var { data: leads, error } = await s
            .from('user_profiles')
            .select('email, name, marketing_consent, consent_date, created_at')
            .eq('marketing_consent', true)
            .order('consent_date', { ascending: false });

        if (error) {
            el.innerHTML = '<div class="admin-card"><h2>Marketing</h2><p style="color:#ff6b6b;">' + error.message + ' — Execute o SQL da aba Banco para criar a tabela user_profiles.</p></div>';
            return;
        }

        var emails = (leads || []).map(function(l) { return l.email; });
        var total = (leads || []).length;

        var html = '<div class="admin-card"><h2>📧 Marketing — Leads Autorizados (' + total + ')</h2>';
        if (total === 0) {
            html += '<p style="color:#888;margin:15px 0;">Nenhum lead com consentimento ainda. Os usuarios que marcarem a opção de receber novidades aparecerão aqui.</p>';
        } else {
            html += '<div style="margin:15px 0;">'
                 + '<button class="btn-admin-save" onclick="navigator.clipboard.writeText(\'' + emails.join(';') + '\').then(()=>this.innerText=\'Emails copiados!\')">📋 Copiar Emails</button>'
                 + ' <button class="btn-admin-save" onclick="navigator.clipboard.writeText(\'' + emails.join(',') + '\').then(()=>this.innerText=\'Lista copiada!\')">📋 Copiar CSV</button>'
                 + '</div>';
            html += '<table class="admin-tabela"><tr><th>Nome</th><th>Email</th><th>Consentimento</th></tr>';
            leads.forEach(function(l) {
                var data = l.consent_date ? new Date(l.consent_date).toLocaleDateString('pt-BR') : '-';
                html += '<tr><td>' + (l.name || '-') + '</td><td>' + l.email + '</td><td>' + data + '</td></tr>';
            });
            html += '</table>';
        }
        html += '</div>';
        el.innerHTML = html;
    } catch(e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + e.message + '</p></div>';
    }
}

// ---------- VITRINE DE TERAPEUTAS (F2) ----------
function escTera(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var ROTULO_STATUS_TERA = { publicado: '🌿 Publicado', pausado: '⏸ Pausado', rascunho: '📝 Rascunho' };

async function renderTerapeutas(el) {
    try {
        var s = await getSupabase();
        if (!s) {
            el.innerHTML = '<div class="admin-card"><h2>Terapeutas</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>';
            return;
        }

        var r = await s.from('therapists')
            .select('id, nome, titulo, cidade, modalidade, status, destaque, slug, foto_url, especialidades, created_at, therapist_services(id)')
            .order('destaque', { ascending: false })
            .order('nome', { ascending: true });

        if (r.error) {
            el.innerHTML = '<div class="admin-card"><h2>🌿 Terapeutas</h2>'
                + '<p style="color:#ff6b6b;">' + escTera(r.error.message) + '</p>'
                + '<p style="color:#888;margin-top:10px;">Se a tabela ainda nao existe, rode a secao 8 do supabase-schema.sql no SQL Editor do Supabase.</p>'
                + '</div>';
            return;
        }

        var lista = r.data || [];
        var publicados = lista.filter(function (t) { return t.status === 'publicado'; }).length;

        var html = '<div class="admin-card"><h2>🌿 Terapeutas (' + lista.length + ')</h2>';
        html += '<p style="color:#888;margin-bottom:15px;line-height:1.6;">'
             + publicados + ' publicado(s) na vitrine · ' + (lista.length - publicados) + ' fora dela. '
             + 'O selo <strong>Destaque</strong> coloca o perfil no topo de '
             + '<a href="terapeutas.html" target="_blank" style="color:var(--dourado-antigo);">terapeutas.html</a>.</p>';

        if (!lista.length) {
            html += '<p style="color:#888;">Nenhum perfil cadastrado ainda. Cada terapeuta cria e publica o proprio perfil no dashboard.</p>';
        } else {
            html += '<table class="admin-tabela"><tr><th></th><th>Terapeuta</th><th>Especialidades</th><th>Cidade</th><th>Servicos</th><th>Status</th><th>Destaque</th><th>Acoes</th></tr>';
            lista.forEach(function (t) {
                var foto = t.foto_url
                    ? '<img src="' + escTera(t.foto_url) + '" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover;">'
                    : '<span style="display:inline-flex;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6b3fa0,var(--ouro-solar));color:#000;font-weight:bold;align-items:center;justify-content:center;">'
                      + escTera(String(t.nome || '?').charAt(0).toUpperCase()) + '</span>';

                var especs = (t.especialidades || []).map(escTera).join(', ') || '-';
                var servicos = (t.therapist_services || []).length;
                var publicado = t.status === 'publicado';

                html += '<tr>';
                html += '<td>' + foto + '</td>';
                html += '<td><strong>' + escTera(t.nome) + '</strong><br><span style="color:#888;font-size:0.78rem;">' + escTera(t.titulo || '') + '</span></td>';
                html += '<td style="font-size:0.8rem;">' + especs + '</td>';
                html += '<td style="font-size:0.8rem;">' + escTera(t.cidade || '-') + '</td>';
                html += '<td style="text-align:center;">' + servicos + '</td>';
                html += '<td>' + (ROTULO_STATUS_TERA[t.status] || escTera(t.status)) + '</td>';
                html += '<td>' + (t.destaque ? '⭐ sim' : '-') + '</td>';
                html += '<td style="white-space:nowrap;">'
                     + '<button class="btn-admin-save" style="padding:6px 10px;font-size:0.72rem;margin:2px;" onclick="window._teraStatus(\'' + t.id + '\',\'' + (publicado ? 'pausado' : 'publicado') + '\')">'
                     + (publicado ? 'Pausar' : 'Publicar') + '</button>'
                     + '<button class="btn-admin-save" style="padding:6px 10px;font-size:0.72rem;margin:2px;" onclick="window._teraDestaque(\'' + t.id + '\',' + (t.destaque ? 'false' : 'true') + ')">'
                     + (t.destaque ? 'Tirar destaque' : 'Destacar') + '</button>'
                     + '</td>';
                html += '</tr>';
            });
            html += '</table>';
        }

        html += '</div>';
        el.innerHTML = html;
    } catch (e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + escTera(e.message) + '</p></div>';
    }
}

async function atualizarTerapeuta(id, campos) {
    var s = await getSupabase();
    var r = await s.from('therapists').update(campos).eq('id', id);
    if (r.error) { alert(r.error.message); return false; }
    await renderTerapeutas(document.getElementById('admin-content'));
    return true;
}

window._teraStatus = function (id, status) { return atualizarTerapeuta(id, { status: status }); };
window._teraDestaque = function (id, valor) { return atualizarTerapeuta(id, { destaque: valor }); };

window._tornarAdmin = async function(id) {
    var s = await getSupabase(); var r = await s.from('user_roles').upsert({ user_id: id, role: 'admin', created_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (r.error) { alert(r.error.message); return; } alert('Admin criado!'); location.reload();
};
window._removerAdmin = async function(id) {
    var s = await getSupabase(); var r = await s.from('user_roles').update({ role: 'user' }).eq('user_id', id);
    if (r.error) { alert(r.error.message); return; } alert('Admin removido!'); location.reload();
};
window._excluirUsuario = async function(id, email) {
    if (!confirm('Excluir ' + email + '?')) return;
    if (!confirm('CONFIRMACAO FINAL? A conta e TODOS os dados do usuario serao apagados.')) return;
    var s = await getSupabase();
    var r = await s.rpc('admin_delete_user', { target_user_id: id });
    if (r.error) { alert(r.error.message); return; }
    alert('Excluido!'); location.reload();
};
