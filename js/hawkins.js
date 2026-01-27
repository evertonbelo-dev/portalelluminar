// js/hawkins.js - O Cérebro da Mesa Radiônica (Com Memória Akáshica de 24h)

const AREAS_VIDA = [
    { id: 'amor', nome: "Amor & Relacionamentos", desc: "A capacidade de dar e receber afeto." },
    { id: 'financas', nome: "Prosperidade Financeira", desc: "O fluxo de abundância material." },
    { id: 'saude', nome: "Saúde & Vitalidade", desc: "O equilíbrio do templo físico." },
    { id: 'familia', nome: "Família & Ancestralidade", desc: "As raízes e a harmonia do lar." },
    { id: 'profissional', nome: "Carreira & Propósito", desc: "A expressão dos talentos no mundo." },
    { id: 'espirito', nome: "Espiritualidade & Conexão", desc: "A ligação com a Fonte Criadora." }
];

const ESCALA_HAWKINS = [
    { hz: 20, emo: "Vergonha", cor: "#adadad", pos: 92, explicacao: "Sentimento de indignidade. A pessoa quer desaparecer.", acao: "Exercício do Espelho: Olhe nos seus olhos e diga 'Eu mereço existir'." },
    { hz: 30, emo: "Culpa", cor: "#a8a8a8", pos: 88, explicacao: "Uso da energia para punir a si mesmo ou aos outros.", acao: "Ho'oponopono: Repita 'Sinto muito, me perdoe, te amo, sou grato'." },
    { hz: 50, emo: "Apatia", cor: "#8f8f8f", pos: 84, explicacao: "Desesperança. Crença de que nada pode ser feito.", acao: "Movimento: Faça uma caminhada de 10 min para mover a energia." },
    { hz: 75, emo: "Tristeza", cor: "#6e6e8c", pos: 80, explicacao: "Sentimento de perda e desânimo crônico.", acao: "Escrita: Escreva o que perdeu e queime o papel para transmutar." },
    { hz: 100, emo: "Medo", cor: "#8c5656", pos: 75, explicacao: "O mundo parece perigoso. Ansiedade constante.", acao: "Enraizamento: Pise na terra descalço e visualize raízes." },
    { hz: 125, emo: "Desejo", cor: "#a85e32", pos: 70, explicacao: "Nunca é o suficiente. Apego ao resultado.", acao: "Gratidão: Liste 3 coisas que você JÁ tem e agradeça." },
    { hz: 150, emo: "Raiva", cor: "#cc2929", pos: 65, explicacao: "Energia explosiva. Pode ser destrutiva ou construtiva.", acao: "Grito Sagrado: Use essa força para faxinar ou organizar algo." },
    { hz: 175, emo: "Orgulho", cor: "#d4af37", pos: 60, explicacao: "Ego inflado. Defensiva constante.", acao: "Escuta: Ouça alguém hoje sem interromper e sem julgar." },
    { hz: 200, emo: "Coragem", cor: "#29cc52", pos: 55, explicacao: "O ponto de virada. Ação e empoderamento.", acao: "Desafio: Faça uma pequena coisa que tem evitado." },
    { hz: 250, emo: "Neutralidade", cor: "#42f5a7", pos: 50, explicacao: "Confiança e flexibilidade.", acao: "Observação: Passe 1 hora sem julgar nada como 'bom' ou 'ruim'." },
    { hz: 310, emo: "Disposição", cor: "#42f5e3", pos: 45, explicacao: "Otimismo e alegria em servir.", acao: "Serviço: Faça um favor a alguém sem esperar nada em troca." },
    { hz: 350, emo: "Aceitação", cor: "#42adf5", pos: 40, explicacao: "Você cria sua realidade. Perdão total.", acao: "Afirmação: Repita 'Eu aceito este momento exatamente como ele é'." },
    { hz: 400, emo: "Razão", cor: "#295ecc", pos: 35, explicacao: "Visão ampla, compreensão e sabedoria.", acao: "Estudo: Leia uma página de um livro elevado." },
    { hz: 500, emo: "Amor", cor: "#d629cc", pos: 25, explicacao: "Amor incondicional. Cura pela presença.", acao: "Conexão: Visualize luz rosa saindo do peito para o mundo." },
    { hz: 540, emo: "Alegria", cor: "#ffaa00", pos: 15, explicacao: "Serenidade, fluxo e sincronicidade.", acao: "Celebração: Dance sozinho e celebre o milagre da vida." },
    { hz: 600, emo: "Paz", cor: "#ffffff", pos: 8, explicacao: "Iluminação. O tempo para. Silêncio.", acao: "Meditação: Fique em silêncio absoluto por 5 minutos." },
    { hz: 700, emo: "Iluminação", cor: "#e6f2ff", pos: 2, explicacao: "Unidade com o Todo. Consciência pura.", acao: "Contemplação: Olhe para o céu e sinta a união com ele." }
];

let indiceAreaAtual = 0;
let resultados = [];
let modoRepeticao = false; // Flag para saber se estamos lendo do histórico
let cacheKey = ""; // Chave única do usuário

const esperar = ms => new Promise(r => setTimeout(r, ms));

// --- 1. GESTÃO DE MEMÓRIA (CACHE 24H) ---
function gerarChaveUsuario(nome, data) {
    // Cria uma ID única baseada no Nome + Data (ex: "hawkins_JOAOSILVA_1980-01-01")
    const nomeLimpo = nome.trim().toUpperCase().replace(/\s+/g, '');
    return `hawkins_${nomeLimpo}_${data}`;
}

function verificarHistorico(nome, data) {
    cacheKey = gerarChaveUsuario(nome, data);
    const salvo = localStorage.getItem(cacheKey);
    
    if (salvo) {
        const dados = JSON.parse(salvo);
        const agora = new Date().getTime();
        const umDia = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

        // Se faz menos de 24h, usa o histórico
        if (agora - dados.timestamp < umDia) {
            console.log("Modo Repetição Ativado: Usando leitura anterior.");
            return dados.resultados;
        }
    }
    return null; // Sem histórico recente ou expirado
}

function salvarNoHistorico() {
    if (!cacheKey) return;
    const dados = {
        timestamp: new Date().getTime(),
        resultados: resultados
    };
    localStorage.setItem(cacheKey, JSON.stringify(dados));
}

// --- 2. INÍCIO DA SESSÃO ---
async function iniciarSessao() {
    const nome = document.getElementById('input-nome').value;
    const data = document.getElementById('input-data').value;
    if (!nome || !data) return alert("Identifique o campo vibracional (Nome e Data).");

    // Verifica se já existe leitura hoje
    const historico = verificarHistorico(nome, data);
    
    if (historico) {
        modoRepeticao = true;
        resultados = []; // Limpa para preencher visualmente de novo
        // Armazena o gabarito (o que vai acontecer) numa variável temporária global ou acessa direto
        window.gabaritoHistorico = historico; 
    } else {
        modoRepeticao = false;
        resultados = [];
    }

    // Trava UI
    document.getElementById('input-nome').disabled = true;
    document.getElementById('input-data').disabled = true;
    document.querySelector('.btn-cristal').style.display = 'none';

    // Animação Cristal
    const cristal = document.getElementById('cristal-testemunho');
    cristal.classList.remove('oculto');
    cristal.classList.add('cristal-caindo');
    
    await esperar(1500);
    iniciarDiagnosticoArea(0);
}

// --- 3. DIAGNÓSTICO (COM SIMULAÇÃO) ---
async function iniciarDiagnosticoArea(index) {
    // Remove botão anterior
    const btnAntigo = document.getElementById('btn-temp-container');
    if(btnAntigo) btnAntigo.remove();

    indiceAreaAtual = index;
    const area = AREAS_VIDA[index];

    if (!area) return finalizarSessao();

    // UI Updates
    const tituloArea = document.getElementById('area-atual');
    const statusArea = document.getElementById('status-vibracao');
    tituloArea.innerText = area.nome;
    
    // Frase diferente se for repetição (sutil) ou padrão
    statusArea.innerText = modoRepeticao ? "Acessando registro akáshico..." : "Sintonizando frequência...";
    
    // Ativa Animações (O Show acontece igual!)
    const pendulo = document.getElementById('pendulo-mestre');
    const scanner = document.getElementById('scanner-hawkins');
    const marcador = document.getElementById('marcador-resultado');

    marcador.classList.add('oculto'); 
    pendulo.className = "pendulo-container pendulo-buscando"; 
    scanner.className = "scanner-luz scanner-ativo"; 
    scanner.style.top = ""; 

    // Tempo de suspense (igual para ambos os casos)
    await esperar(3500);

    // --- AQUI ESTÁ O SEGREDO ---
    let nivelFinal;

    if (modoRepeticao) {
        // Pega do histórico (Gabarito)
        // Precisamos encontrar o nível completo na ESCALA_HAWKINS baseado no Hz salvo
        const resultadoSalvo = window.gabaritoHistorico[index];
        // Reencontra o objeto completo na escala pelo Hz (para ter cor, pos, etc)
        nivelFinal = ESCALA_HAWKINS.find(n => n.hz === resultadoSalvo.nivel.hz);
    } else {
        // Sorteia novo
        nivelFinal = sortearFrequencia();
    }

    // Trava Animações e Mostra Resultado
    pendulo.className = "pendulo-container"; 
    scanner.className = "scanner-luz scanner-parado"; 
    scanner.style.top = `${nivelFinal.pos}%`;
    scanner.style.backgroundColor = nivelFinal.cor;
    scanner.style.boxShadow = `0 0 20px ${nivelFinal.cor}`;

    statusArea.innerText = modoRepeticao ? "Frequência Confirmada." : "Frequência Detectada.";

    marcador.querySelector('.valor-hz').innerText = nivelFinal.hz + " Hz";
    marcador.querySelector('.nome-estado').innerText = nivelFinal.emo;
    marcador.style.top = `${nivelFinal.pos}%`;
    marcador.style.color = nivelFinal.cor;
    marcador.classList.remove('oculto');

    // Adiciona ao array da sessão atual
    resultados.push({ area: area.nome, nivel: nivelFinal });
    atualizarListaParcial();

    // Botão Próximo
    const btnHtml = `<button class="btn-proximo" onclick="iniciarDiagnosticoArea(${index + 1})">
                        ${index < AREAS_VIDA.length - 1 ? 'Próxima Área →' : 'Ver Relatório Final ✨'}
                     </button>`;
    
    const divBtn = document.createElement('div');
    divBtn.innerHTML = btnHtml;
    divBtn.id = "btn-temp-container";
    document.querySelector('.status-leitura').appendChild(divBtn);
}

// Funções Auxiliares
function atualizarListaParcial() {
    const container = document.getElementById('lista-parcial');
    const ultimo = resultados[resultados.length - 1];
    
    const item = document.createElement('div');
    item.className = 'item-parcial surgir';
    item.innerHTML = `
        <span class="area-nome">${ultimo.area}</span>
        <span class="area-valor" style="color:${ultimo.nivel.cor}">${ultimo.nivel.hz} Hz</span>
    `;
    container.appendChild(item);
}

function sortearFrequencia() {
    const r = Math.random();
    if (r < 0.2) return ESCALA_HAWKINS[Math.floor(Math.random() * 7)]; 
    if (r < 0.8) return ESCALA_HAWKINS[Math.floor(Math.random() * 6) + 7];
    return ESCALA_HAWKINS[Math.floor(Math.random() * 4) + 13];
}

// --- FINALIZAÇÃO ---
function finalizarSessao() {
    // Se era uma leitura nova, salva agora no cache
    if (!modoRepeticao) {
        salvarNoHistorico();
    }

    const areaCentral = document.querySelector('.pilar-centro');
    
    // Tabela Final
    let linhasTabela = resultados.map(r => `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding:15px; color:#fff;">${r.area}</td>
            <td style="padding:15px; color:${r.nivel.cor}; font-weight:bold;">${r.nivel.hz} Hz<br><small>${r.nivel.emo}</small></td>
            <td style="padding:15px; color:#aaa; font-style:italic;">${r.nivel.explicacao}</td>
            <td style="padding:15px; color:var(--ouro-solar);">${r.nivel.acao}</td>
        </tr>
    `).join('');

    areaCentral.innerHTML = `
        <div class="relatorio-final-container">
            <h2 class="titulo-final">Relatório de Frequência da Alma</h2>
            <p class="sub-final">Diagnóstico Vibracional Completo ${modoRepeticao ? '(Registro Histórico)' : ''}</p>
            
            <div class="tabela-scroll">
                <table class="tabela-hawkins">
                    <thead>
                        <tr>
                            <th>Área da Vida</th>
                            <th>Frequência</th>
                            <th>Significado</th>
                            <th>Ação de Cura ⚡</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linhasTabela}
                    </tbody>
                </table>
            </div>

            <button class="btn-cristal" style="margin-top:30px; width:auto; padding: 15px 40px;" onclick="location.reload()">Nova Leitura</button>
        </div>
    `;
    
    areaCentral.style.overflowY = "auto";
    areaCentral.style.justifyContent = "start";
    areaCentral.style.padding = "20px";
}