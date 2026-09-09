// js/admin-tabs.js — Gerenciamento de Abas do Painel Admin v2.0.0
import { getSupabase } from './supabase-config.js';
import { carregarConfig, salvarConfig, getSqlSetup } from './admin-config.js';
import { MODELOS_DISPONIVEIS } from './modelos.js';

export async function initTabs(containerEl, userEmail) {
    await renderGeral();
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
        var { data: users } = await s.from('auth.users').select('id, email, created_at').limit(100);
        var { data: roles } = await s.from('user_roles').select('user_id, role');
        var roleMap = {};
        if (roles) roles.forEach(function(r) { roleMap[r.user_id] = r.role; });
        var html = '<div class="admin-card"><h2>Gerenciar Usuarios (' + (users?users.length:0) + ')</h2>';
        html += '<table class="admin-tabela"><tr><th>Email</th><th>Cadastro</th><th>Perfil</th><th>Acoes</th></tr>';
        users.forEach(function(u) {
            var role = roleMap[u.id] || 'user';
            html += '<tr><td>' + u.email + '</td><td>' + (u.created_at?new Date(u.created_at).toLocaleDateString('pt-BR'):'-') + '</td>';
            html += '<td><span class="' + (role==='admin'||role==='master'?'badge-admin':'badge-user') + '">' + role + '</span></td>';
            html += '<td class="acoes-usuario">';
            if (role !== 'admin' && role !== 'master') {
                html += '<button onclick="window._tornarAdmin(\'' + u.id + '\')">Tornar Admin</button>';
            } else {
                html += '<button onclick="window._removerAdmin(\'' + u.id + '\')">Remover Admin</button>';
            }
            html += '<button class="btn-excluir" onclick="window._excluirUsuario(\'' + u.id + '\',\'' + u.email + '\')">Excluir</button>';
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
    if (!confirm('CONFIRMACAO FINAL?')) return;
    var s = await getSupabase();
    var r = await s.from('user_roles').delete().eq('user_id', id);
    if (r.error) { alert(r.error.message); return; }
    alert('Excluido!'); location.reload();
};
