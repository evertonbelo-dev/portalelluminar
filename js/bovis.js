// js/bovis.js - Biômetro com Proteção e Média Geral

const CAMPOS = [
    { id: 'fisico', nome: "Campo Físico", cor: "fisico" },
    { id: 'emocional', nome: "Campo Emocional", cor: "emocional" },
    { id: 'mental', nome: "Campo Mental", cor: "mental" },
    { id: 'espiritual', nome: "Campo Espiritual", cor: "espiritual" }
];

let indiceAtual = 0;
let leituras = [];
let modoRepeticao = false;
let cacheKey = "";

const esperar = ms => new Promise(r => setTimeout(r, ms));

// --- 1. MEMÓRIA 24H (Reaproveitada) ---
function gerarChave(nome, data) {
    return `bovis_${nome.trim().toUpperCase().replace(/\s+/g, '')}_${data}`;
}

function verificarHistorico(nome, data) {
    cacheKey = gerarChave(nome, data);
    const salvo = localStorage.getItem(cacheKey);
    if (salvo) {
        const dados = JSON.parse(salvo);
        if (new Date().getTime() - dados.timestamp < 24 * 60 * 60 * 1000) {
            console.log("Usando histórico Bovis.");
            return dados.leituras;
        }
    }
    return null;
}

function salvarHistorico() {
    if (!cacheKey) return;
    localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: new Date().getTime(),
        leituras: leituras
    }));
}

// --- 2. INÍCIO ---
async function iniciarSessao() {
    const nome = document.getElementById('input-nome').value;
    const data = document.getElementById('input-data').value;
    if (!nome || !data) return alert("Identifique o campo vibracional.");

    const historico = verificarHistorico(nome, data);
    if (historico) {
        modoRepeticao = true;
        window.gabarito = historico;
    } else {
        modoRepeticao = false;
    }
    leituras = [];

    // UI Trava
    document.getElementById('input-nome').disabled = true;
    document.getElementById('input-data').disabled = true;
    document.querySelector('.btn-cristal').style.display = 'none';

    // Cristal
    const cristal = document.getElementById('cristal-testemunho');
    cristal.classList.remove('oculto');
    cristal.classList.add('cristal-caindo');
    
    await esperar(1500);
    iniciarLeituraCampo(0);
}

// --- 3. LEITURA ---
async function iniciarLeituraCampo(index) {
    // Remove botão anterior
    const btn = document.getElementById('btn-temp');
    if(btn) btn.remove();

    indiceAtual = index;
    
    // SE TERMINOU OS CAMPOS: GERA O GERAL
    if (index >= CAMPOS.length) {
        return finalizarComGeral();
    }

    const campo = CAMPOS[index];
    
    // UI Updates
    document.getElementById('campo-atual').innerText = campo.nome;
    document.getElementById('valor-leitura').innerText = "...";
    
    // Ativa Scanner e Pêndulo
    const pendulo = document.getElementById('pendulo-bovis');
    const scanner = document.getElementById('scanner-bovis');
    
    pendulo.classList.remove('pendulo-bovis-parado'); // Remove classe de parada se houver
    pendulo.classList.add('pendulo-buscando');
    scanner.classList.add('scan-vertical');

    // Ilumina a Tag do Campo na direita
    document.querySelectorAll('.campo-tag').forEach(t => t.classList.remove('ativo'));
    document.querySelector(`.${campo.cor}`).classList.add('ativo');

    // Tempo de leitura
    await esperar(3000);

    // RESULTADO
    let angstroms;
    if (modoRepeticao) {
        angstroms = window.gabarito[index].valor;
    } else {
        angstroms = sortearAngstroms();
    }

    // Parar Animações
    pendulo.classList.remove('pendulo-buscando');
    scanner.classList.remove('scan-vertical');
    
    // MOVER PÊNDULO PARA O VALOR
    // 0 = -45deg (esquerda), 10000 = +45deg (direita), 5000 = 0deg (centro)
    // Fórmula: (Valor / 10000) * 90 - 45
    const angulo = (angstroms / 10000) * 90 - 45;
    pendulo.style.transform = `translateX(-50%) rotate(${angulo}deg)`;

    // Mostrar Valor
    const displayValor = document.getElementById('valor-leitura');
    displayValor.innerText = angstroms.toLocaleString('pt-BR') + " Å";
    
    // Colorir conforme saúde
    displayValor.style.color = getCorSaude(angstroms);

    leituras.push({ nome: campo.nome, valor: angstroms, cor: campo.cor });
    atualizarLista();

    // Botão Próximo
    const divBtn = document.createElement('div');
    divBtn.id = "btn-temp";
    divBtn.innerHTML = `<button class="btn-proximo" onclick="iniciarLeituraCampo(${index + 1})">Próximo Campo →</button>`;
    document.querySelector('.status-leitura').appendChild(divBtn);
}

// --- UTILITÁRIOS ---
function sortearAngstroms() {
    // Simula uma distribuição realista (maioria entre 5500 e 8500)
    const r = Math.random();
    if (r < 0.15) return Math.floor(Math.random() * 3000) + 3000; // 3000-6000 (Baixo)
    if (r < 0.85) return Math.floor(Math.random() * 2500) + 6000; // 6000-8500 (Normal/Bom)
    return Math.floor(Math.random() * 1500) + 8500; // 8500-10000 (Alto/Espiritual)
}

function getCorSaude(valor) {
    if (valor < 5000) return '#ff3333'; // Crítico
    if (valor < 6500) return '#ffff33'; // Atenção
    return '#00e6e6'; // Saudável
}

function atualizarLista() {
    const container = document.getElementById('lista-bovis');
    const u = leituras[leituras.length-1];
    container.innerHTML += `
        <div class="item-bovis surgir">
            <span>${u.nome}</span>
            <span style="color:${getCorSaude(u.valor)}">${u.valor.toLocaleString()} Å</span>
        </div>
    `;
}

// --- FINALIZAÇÃO (MÉDIA GERAL) ---
async function finalizarComGeral() {
    // Calcula Média
    const total = leituras.reduce((acc, curr) => acc + curr.valor, 0);
    const media = Math.floor(total / leituras.length);

    // Salva a média como se fosse uma leitura extra para o histórico
    const resultadoFinal = [...leituras, { nome: "MÉDIA GERAL", valor: media }];
    if (!modoRepeticao) {
        // Substitui o array para salvar com a média
        leituras = resultadoFinal; 
        salvarHistorico();
    }

    // UI Final
    const areaCentral = document.querySelector('.pilar-centro');
    let linhas = resultadoFinal.map(r => `
        <tr>
            <td>${r.nome}</td>
            <td style="color:${getCorSaude(r.valor)}; font-weight:bold; font-size:1.2rem;">
                ${r.valor.toLocaleString()} Å
            </td>
            <td>${getDiagnostico(r.valor)}</td>
        </tr>
    `).join('');

    areaCentral.innerHTML = `
        <div class="relatorio-final-container surgir">
            <h2 class="titulo-pilar" style="font-size:2rem;">Leitura Bioenergética</h2>
            <div style="font-size:4rem; color:${getCorSaude(media)}; font-weight:bold; margin: 20px 0;">
                ${media.toLocaleString()} Å
            </div>
            <p style="color:#aaa;">Vibração Geral do Campo</p>
            
            <table class="tabela-bovis">
                <tr><th>Campo</th><th>Energia</th><th>Estado</th></tr>
                ${linhas}
            </table>
            
            <button class="btn-cristal" style="margin-top:30px; width:auto;" onclick="location.reload()">Nova Medição</button>
        </div>
    `;
    areaCentral.style.justifyContent = 'flex-start';
    areaCentral.style.overflowY = 'auto';
}

function getDiagnostico(v) {
    if (v < 3000) return "Desvitalização Grave";
    if (v < 5000) return "Baixa Vitalidade";
    if (v < 6500) return "Abaixo do Normal";
    if (v < 7500) return "Normal / Saudável";
    if (v < 9000) return "Energia Elevada";
    return "Espiritual / Expandida";
}