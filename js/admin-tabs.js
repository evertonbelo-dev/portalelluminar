// js/admin-tabs.js — Gerenciamento de Abas do Painel Admin v2.3.0
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
                    case 'emails': await renderEmails(containerEl); break;
                    case 'cupons': await renderCupons(containerEl); break;
                    case 'financeiro': await renderFinanceiro(containerEl); break;
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

// ---------- LOG DE E-MAILS (F5b) ----------
async function renderEmails(el) {
    try {
        var s = await getSupabase();
        if (!s) {
            el.innerHTML = '<div class="admin-card"><h2>E-mails</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>';
            return;
        }

        var r = await s.rpc('admin_listar_emails', { p_limite: 100 });

        if (r.error) {
            el.innerHTML = '<div class="admin-card"><h2>✉️ E-mails</h2>'
                + '<p style="color:#ff6b6b;">' + escTera(r.error.message) + '</p>'
                + '<p style="color:#888;margin-top:10px;">Se a funcao nao existe, rode a secao 13 do supabase-schema.sql.</p>'
                + '</div>';
            return;
        }

        var lista = r.data || [];
        var ok = lista.filter(function (l) { return l.status_http === 200; }).length;
        var falhas = lista.length - ok;

        var html = '<div class="admin-card"><h2>✉️ E-mails enviados (' + lista.length + ')</h2>';
        html += '<p style="color:#888;margin-bottom:14px;line-height:1.6;">'
             + ok + ' com HTTP 200 · ' + falhas + ' com pendencia. '
             + 'Aqui fica o que o Portal disparou; o historico completo (aberturas, bounces) esta no painel do Resend.</p>';
        html += '<div style="margin-bottom:14px;"><button class="btn-admin-save" onclick="window._emailsAtualizar()">↻ Atualizar</button></div>';

        if (!lista.length) {
            html += '<p style="color:#888;">Nenhum e-mail registrado ainda. Os avisos aparecem aqui quando houver solicitacao de agendamento.</p>';
        } else {
            html += '<table class="admin-tabela"><tr><th>Quando</th><th>Tipo</th><th>Para</th><th>Assunto</th><th>Status</th><th>HTTP</th><th>Detalhe</th></tr>';
            lista.forEach(function (l) {
                var quando = new Date(l.created_at).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                });
                var cor = l.status_http === 200 ? '#4caf50' : (l.status === 'enfileirado' ? '#aaa' : '#ff6b6b');

                html += '<tr>'
                     + '<td style="font-size:0.78rem;white-space:nowrap;">' + escTera(quando) + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(l.tipo) + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(l.destinatario || '-') + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(l.assunto || '-') + '</td>'
                     + '<td style="font-size:0.75rem;color:' + cor + ';">' + escTera(l.status) + '</td>'
                     + '<td style="font-size:0.78rem;color:' + cor + ';">' + (l.status_http || '—') + '</td>'
                     + '<td style="font-size:0.72rem;color:#888;max-width:220px;">' + escTera(String(l.detalhe || '').slice(0, 120)) + '</td>'
                     + '</tr>';
            });
            html += '</table>';
            html += '<p style="color:#666;font-size:0.72rem;margin-top:12px;">'
                 + '<strong>sem_chave</strong>: falta o segredo <code>resend_api_key</code> no Vault · '
                 + '<strong>sem_destinatario</strong>: o perfil nao tinha contato · '
                 + '<strong>erro</strong>: veja o detalhe.</p>';
        }

        html += '</div>';
        el.innerHTML = html;
    } catch (e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + escTera(e.message) + '</p></div>';
    }
}

window._emailsAtualizar = function () {
    renderEmails(document.getElementById('admin-content'));
};

// ---------- CUPONS (F6) ----------
async function renderCupons(el) {
    try {
        var s = await getSupabase();
        if (!s) {
            el.innerHTML = '<div class="admin-card"><h2>Cupons</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>';
            return;
        }

        var r = await s.rpc('admin_listar_cupons', { p_limite: 200 });

        if (r.error) {
            el.innerHTML = '<div class="admin-card"><h2>🎟️ Cupons</h2>'
                + '<p style="color:#ff6b6b;">' + escTera(r.error.message) + '</p>'
                + '<p style="color:#888;margin-top:10px;">Se a funcao nao existe, rode a secao 17 do supabase-schema.sql.</p>'
                + '</div>';
            return;
        }

        var lista = r.data || [];
        var ativos = lista.filter(function (c) { return !c.usado_em && new Date(c.valido_ate) > new Date(); }).length;
        var usados = lista.filter(function (c) { return !!c.usado_em; }).length;

        var html = '<div class="admin-card"><h2>🎟️ Cupons (' + lista.length + ')</h2>';
        html += '<p style="color:#888;margin-bottom:14px;line-height:1.6;">'
             + ativos + ' disponiveis · ' + usados + ' usados.<br>'
             + 'Cada cupom vale uma unica vez, so para a conta dona dele. O cupom de primeira compra nasce automatico no checkout; '
             + 'use o campo abaixo para atender quem pediu desconto por e-mail.</p>';

        html += '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;">'
             + '<label style="flex:1;min-width:220px;font-size:0.78rem;color:#aaa;">E-mail de quem pediu<br>'
             + '<input id="cupom-email" type="email" placeholder="pessoa@email.com" style="width:100%;margin-top:6px;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:8px;color:#fff;"></label>'
             + '<label style="font-size:0.78rem;color:#aaa;">Desconto (%)<br>'
             + '<input id="cupom-pct" type="number" min="1" max="100" value="15" style="width:110px;margin-top:6px;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:8px;color:#fff;"></label>'
             + '<label style="font-size:0.78rem;color:#aaa;">Validade (dias)<br>'
             + '<input id="cupom-dias" type="number" min="1" max="365" value="30" style="width:110px;margin-top:6px;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:8px;color:#fff;"></label>'
             + '<button class="btn-admin-save" onclick="window._cupomCriar()" style="margin:0;">Criar cupom</button>'
             + '</div>';

        if (!lista.length) {
            html += '<p style="color:#888;">Nenhum cupom cadastrado ainda.</p>';
        } else {
            html += '<table class="admin-tabela"><tr><th>Codigo</th><th>%</th><th>Dono</th><th>Origem</th><th>Validade</th><th>Situacao</th><th></th></tr>';
            lista.forEach(function (c) {
                var vencido = !c.usado_em && new Date(c.valido_ate) < new Date();
                var situacao = c.usado_em ? '<span style="color:#4caf50;">usado</span>'
                    : (vencido ? '<span style="color:#ff6b6b;">vencido</span>' : '<span style="color:var(--ouro-solar);">disponivel</span>');
                var validade = new Date(c.valido_ate).toLocaleDateString('pt-BR');

                html += '<tr>'
                     + '<td><code style="color:var(--ouro-solar);">' + escTera(c.codigo) + '</code></td>'
                     + '<td>' + escTera(c.percentual) + '%</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(c.email || '-') + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(c.origem) + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(validade) + '</td>'
                     + '<td style="font-size:0.78rem;">' + situacao + '</td>'
                     + '<td><button class="btn-admin-save" style="padding:6px 10px;font-size:0.72rem;margin:0;" onclick="window._cupomCopiar(this,\'' + escTera(c.codigo) + '\')">Copiar</button></td>'
                     + '</tr>';
            });
            html += '</table>';
        }

        html += '</div>';
        el.innerHTML = html;
    } catch (e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + escTera(e.message) + '</p></div>';
    }
}

window._cupomCriar = async function () {
    var email = (document.getElementById('cupom-email') || {}).value || '';
    var pct = Number((document.getElementById('cupom-pct') || {}).value || 15);
    var dias = Number((document.getElementById('cupom-dias') || {}).value || 30);

    if (!email.trim()) { alert('Informe o e-mail de quem pediu o cupom.'); return; }

    var s = await getSupabase();
    if (!s) { alert('Supabase indisponivel'); return; }

    var r = await s.rpc('admin_criar_cupom', { p_email: email.trim(), p_percentual: pct, p_dias: dias });

    if (r.error) { alert(r.error.message); return; }

    var c = (r.data || [])[0] || {};
    await renderCupons(document.getElementById('admin-content'));
    alert('Cupom criado: ' + (c.codigo || '') + ' (' + (c.percentual || pct) + '%)');
};

window._cupomCopiar = function (btn, codigo) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(codigo);
    var antigo = btn.textContent;
    btn.textContent = 'Copiado';
    setTimeout(function () { btn.textContent = antigo; }, 1400);
};

// ---------- FINANCEIRO (F7) ----------
// O Portal não retém nada: todo valor cobrado tem que chegar ao terapeuta.
// Aqui o admin vê o que falta repassar e o que o consulente acerta direto.
async function renderFinanceiro(el) {
    try {
        var s = await getSupabase();
        if (!s) {
            el.innerHTML = '<div class="admin-card"><h2>Financeiro</h2><p style="color:#ff6b6b;">Supabase indisponivel</p></div>';
            return;
        }

        var r = await s.rpc('admin_listar_financeiro', { p_limite: 300 });

        if (r.error) {
            el.innerHTML = '<div class="admin-card"><h2>💰 Financeiro</h2>'
                + '<p style="color:#ff6b6b;">' + escTera(r.error.message) + '</p>'
                + '<p style="color:#888;margin-top:10px;">Se a funcao nao existe, rode a secao 20 do supabase-schema.sql.</p>'
                + '</div>';
            return;
        }

        var lista = r.data || [];
        var aRepassar = 0, aReceberDireto = 0, repassado = 0, taxas = 0;
        var porTerapeuta = {};

        lista.forEach(function (l) {
            var valor = Number(l.valor) || 0;
            var taxa = Number(l.taxa) || 0;
            taxas += taxa;

            if (!porTerapeuta[l.terapeuta]) porTerapeuta[l.terapeuta] = { repassar: 0, direto: 0 };

            if (l.status === 'a_receber') {
                if (l.tipo === 'repasse_portal') {
                    aRepassar += Math.max(0, valor - taxa);
                    porTerapeuta[l.terapeuta].repassar += Math.max(0, valor - taxa);
                } else {
                    aReceberDireto += valor;
                    porTerapeuta[l.terapeuta].direto += valor;
                }
            } else if (l.status === 'acertado' && l.tipo === 'repasse_portal') {
                repassado += valor;
            }
        });

        var brl = function (v) {
            return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        var cartao = function (titulo, valor, nota, cor) {
            return '<div style="flex:1;min-width:180px;background:rgba(255,255,255,0.03);border:1px solid rgba(212,175,55,0.25);border-radius:12px;padding:14px 16px;">'
                + '<div style="font-size:0.7rem;letter-spacing:0.06em;text-transform:uppercase;color:#8f8fa5;">' + titulo + '</div>'
                + '<div style="font-size:1.4rem;font-weight:bold;margin:6px 0 2px;color:' + (cor || 'var(--ouro-solar)') + ';">' + brl(valor) + '</div>'
                + '<div style="font-size:0.7rem;color:#7f7f95;line-height:1.4;">' + nota + '</div>'
                + '</div>';
        };

        var html = '<div class="admin-card"><h2>💰 Financeiro</h2>';
        html += '<p style="color:#888;margin-bottom:14px;line-height:1.6;">'
             + 'O Portal não retém nenhum valor: o sinal cai no Stripe e é repassado ao terapeuta, '
             + 'e a diferença é acertada direto entre consulente e terapeuta.</p>';

        html += '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">'
             + cartao('A repassar aos terapeutas', aRepassar, 'já sem a taxa do Stripe', '#ffcc80')
             + cartao('A receber direto', aReceberDireto, 'acerto entre consulente e terapeuta')
             + cartao('Já repassado', repassado, 'acertos confirmados')
             + cartao('Taxas do Stripe', taxas, 'custo por transação', '#cfcfdc')
             + '</div>';

        var nomes = Object.keys(porTerapeuta);
        if (nomes.length) {
            html += '<h3 style="font-size:0.95rem;color:var(--dourado-antigo);margin:0 0 8px;">Por terapeuta</h3>';
            html += '<table class="admin-tabela"><tr><th>Terapeuta</th><th>A repassar</th><th>A receber direto</th></tr>';
            nomes.forEach(function (n) {
                html += '<tr><td>' + escTera(n) + '</td>'
                     + '<td style="color:#ffcc80;">' + brl(porTerapeuta[n].repassar) + '</td>'
                     + '<td style="color:#cfcfdc;">' + brl(porTerapeuta[n].direto) + '</td></tr>';
            });
            html += '</table>';
        }

        if (!lista.length) {
            html += '<p style="color:#888;margin-top:16px;">Nenhum lançamento ainda. Eles nascem quando um atendimento é pago.</p>';
        } else {
            html += '<h3 style="font-size:0.95rem;color:var(--dourado-antigo);margin:22px 0 8px;">Lançamentos</h3>';
            html += '<table class="admin-tabela"><tr><th>Data</th><th>Terapeuta</th><th>Consulente</th><th>Tipo</th><th>Valor</th><th>Taxa</th><th>Situação</th><th></th></tr>';

            lista.forEach(function (l) {
                var tipo = l.tipo === 'repasse_portal' ? 'Sinal (Portal)' : 'Restante (direto)';
                var cor = l.status === 'acertado' ? '#4caf50' : (l.status === 'cancelado' ? '#777' : 'var(--ouro-solar)');
                var situacao = l.status === 'acertado' ? 'recebido'
                    : (l.status === 'cancelado' ? 'cancelado' : 'a receber');
                var data = l.data_atendimento ? String(l.data_atendimento).split('-').reverse().join('/') : '-';
                var acao = l.status === 'a_receber'
                    ? '<button class="btn-admin-save" style="padding:5px 10px;font-size:0.7rem;margin:0;" onclick="window._finAcertar(\'' + l.id + '\')">Marcar recebido</button>'
                    : '';

                html += '<tr>'
                     + '<td style="font-size:0.78rem;white-space:nowrap;">' + escTera(data) + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(l.terapeuta || '-') + '</td>'
                     + '<td style="font-size:0.78rem;">' + escTera(l.consulente || '-') + '</td>'
                     + '<td style="font-size:0.75rem;">' + tipo + '</td>'
                     + '<td style="font-size:0.82rem;color:' + cor + ';">' + brl(l.valor) + '</td>'
                     + '<td style="font-size:0.75rem;color:#888;">' + (Number(l.taxa) > 0 ? brl(l.taxa) : '-') + '</td>'
                     + '<td style="font-size:0.75rem;color:' + cor + ';">' + situacao + (l.forma ? ' · ' + escTera(l.forma) : '') + '</td>'
                     + '<td>' + acao + '</td>'
                     + '</tr>';
            });

            html += '</table>';
        }

        el.innerHTML = html + '</div>';
    } catch (e) {
        el.innerHTML = '<div class="admin-card"><h2>Erro</h2><p style="color:#ff6b6b;">' + escTera(e.message) + '</p></div>';
    }
}

window._finAcertar = async function (id) {
    var forma = prompt('Forma do acerto com o terapeuta (pix, transferencia ou dinheiro):', 'pix');
    if (forma === null) return;

    var s = await getSupabase();
    var r = await s.rpc('admin_marcar_repasse', { p_ids: [id], p_forma: forma || 'pix' });

    if (r.error) { alert(r.error.message); return; }

    await renderFinanceiro(document.getElementById('admin-content'));
};

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
