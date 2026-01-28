// js/app.js - Versão Restaurada, Completa e Sintonizada com o Servidor

// 1. DADOS E NAVEGAÇÃO
let consulente = { nome: "", nascimento: "", tarologo: "" };
let tiragemAtual = [];
let essenciaAtual = null;
let tipoTiragem = "";

const CONFIG_LEITURAS = {
    'unica' : { titulos: ["Resposta do Oráculo"] },
    'triade': { titulos: ["1. Passado / Origem", "2. Presente / Ação", "3. Futuro / Direção"] },
    'cruz'  : { titulos: ["1. O Coração (Você)", "2. O Desafio (O que cruza)", "3. A Raiz (Inconsciente)", "4. A Coroa (Consciente)", "5. O Destino (Síntese)"] }
};

function mostrarTela(idTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(idTela).classList.add('ativa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function iniciarJornada() {
    const nome = document.getElementById('nome-consulente').value;
    const nascimento = document.getElementById('data-nascimento').value;
    const tarologo = document.getElementById('nome-tarologo').value;

    if(!nome.trim()) {
        return alert("Por favor, diga-nos o nome do consulente para abrir o canal.");
    }
    if(!nascimento) {
        return alert("Por favor, informe a Data de Nascimento para a conexão astral.");
    }

    const dataNasc = new Date(nascimento);
    const hoje = new Date();
    if(dataNasc > hoje) {
        return alert("A data de nascimento não pode ser no futuro, viajante.");
    }
    
    consulente.nome = nome;
    consulente.nascimento = nascimento;
    consulente.tarologo = tarologo; 
    
    mostrarTela('tela-sintonia');
    
    const msg = document.getElementById('msg-sintonia');
    msg.innerText = "Consultando a Egrégora...";
    
    setTimeout(() => {
        msg.innerText = "Permissão Concedida pela Luz.";
        setTimeout(() => mostrarTela('tela-meditacao'), 1500);
    }, 2500);
}

function irParaMesa() {
    let textoDisplay = consulente.nome;
    if(consulente.tarologo) textoDisplay += ` (Guia: ${consulente.tarologo})`;
    document.getElementById('nome-display').innerText = textoDisplay;
    mostrarTela('tela-mesa');
}

function prepararTiragem(tipo, elementoClicado) {
    tipoTiragem = tipo;
    document.querySelectorAll('.card-opcao-visual').forEach(c => c.classList.remove('selecionado'));
    if(elementoClicado) elementoClicado.classList.add('selecionado');
    const areaPergunta = document.getElementById('area-pergunta');
    areaPergunta.classList.remove('oculto');
    areaPergunta.scrollIntoView({behavior: "smooth"});
    document.getElementById('pergunta-consulente').focus();
}

function novaPergunta() {
    document.getElementById('pergunta-consulente').value = "";
    mostrarTela('tela-mesa');
}

// 3. LEITURA
function realizarLeitura() {
    const pergunta = document.getElementById('pergunta-consulente').value;
    if(!pergunta) return alert("O Universo aguarda sua pergunta...");
    mostrarTela('tela-leitura');
    const mesa = document.getElementById('mesa-cartas-resultado');
    mesa.innerHTML = ""; 
    tiragemAtual = [];
    essenciaAtual = null; 
    mesa.className = `mesa-cartas-grid layout-${tipoTiragem}`;
    
    let deck = [...ARCANOS_CELESTES, ...CARTAS_REINO];
    let qtdCartas = 1;
    if (tipoTiragem === 'triade') qtdCartas = 3;
    if (tipoTiragem === 'cruz') qtdCartas = 5;
    
    let titulos = CONFIG_LEITURAS[tipoTiragem].titulos;
    for(let i=0; i<qtdCartas; i++) {
        const indice = Math.floor(Math.random() * deck.length);
        const carta = deck[indice];
        deck.splice(indice, 1); 
        tiragemAtual.push(carta);
        const slot = document.createElement('div');
        slot.className = 'slot-carta'; 
        const caminhoImagem = `assets/cartas/${carta.imagem}`;
        slot.innerHTML = `
            <div class="carta-inner">
                <div class="carta-verso"></div>
                <div class="carta-frente"><img src="${caminhoImagem}" alt="${carta.nome}" onerror="this.src='assets/cartas/verso.png'"></div>
            </div>
            <div class="legenda-carta">
                <span class="posicao-titulo" style="display:block; font-size:0.7rem; color:#aaa; margin-bottom:5px;">${titulos[i] || 'Posição'}</span>
                <span class="nome-arcano" style="color:var(--ouro-solar); font-family:'Cinzel'; font-size: 0.9rem;">${carta.nome}</span>
            </div>`;
        mesa.appendChild(slot);
        setTimeout(() => { slot.classList.add('revelada'); }, (i * 500) + 300);
    }
    gerarInterpretacaoLocal(pergunta, tiragemAtual);
}

function gerarInterpretacaoLocal(pergunta, cartas) {
    const divTexto = document.getElementById('texto-interpretacao');
    divTexto.innerHTML = "<p><em>Sintonizando a frequência dos Mestres...</em></p>";
    setTimeout(() => {
        let html = `
            <p class="saudacao" style="text-align:center; color:#ccc; margin-bottom:20px;">Leitura para <strong>${consulente.nome}</strong><br>Questão: <em>"${pergunta}"</em></p>
            <hr class="divisor-luz">`;
        cartas.forEach((carta, index) => {
            let titulo = CONFIG_LEITURAS[tipoTiragem].titulos[index] || "Carta";
            let detalhes = "";
            if(carta.palavra) detalhes += `<span style="color: var(--ouro-solar);">⚡ ${carta.palavra}</span> &nbsp; `;
            if(carta.bencao) detalhes += `<br><br><strong>🌟 Bênção:</strong> ${carta.bencao}`;
            if(carta.desafio) detalhes += `<br><strong>⚔️ Desafio:</strong> ${carta.desafio}`;
            if(carta.sinais) detalhes += `<br><strong>👁️ Sinais:</strong> ${carta.sinais}`;
            html += `
                <div style="background:rgba(0,0,0,0.4); padding:20px; border-radius:10px; border:1px solid #333; margin-bottom:20px;">
                    <h5 style="color:#888; text-transform:uppercase; font-size:0.8rem;">${titulo}</h5>
                    <h3 style="color:var(--dourado-antigo); font-family:'Cinzel'; margin:10px 0;">${carta.nome}</h3>
                    <p style="font-style:italic; line-height:1.6; color:#eee;">"${carta.canalizacao || carta.msg}"</p>
                    <div style="margin-top:15px; font-size:0.9rem; color:#ccc;">${detalhes}</div>
                </div>`;
        });
        divTexto.innerHTML = html;
        divTexto.scrollIntoView({behavior: "smooth"});
    }, 1500);
}

// --- FUNÇÃO FINALIZAR COM ESSÊNCIA (PRESERVADA E COMPLETA) ---
async function finalizarComEssencia() {
    mostrarTela('tela-essencia');
    if (typeof CARTAS_ESSENCIA !== 'undefined' && CARTAS_ESSENCIA.length > 0) {
        const indice = Math.floor(Math.random() * CARTAS_ESSENCIA.length);
        essenciaAtual = CARTAS_ESSENCIA[indice];
        const caminhoImagem = `assets/cartas/${essenciaAtual.imagem}`;
        
        // Mantendo exatamente a exibição de detalhes que você solicitou
        document.getElementById('carta-essencia-display').innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <img src="${caminhoImagem}" style="width:140px; border-radius:50%; border:3px solid var(--ouro-solar); box-shadow: 0 0 20px rgba(255, 170, 0, 0.4);">
                <h3 style="color:var(--ouro-solar); font-family:'Cinzel'; margin-top:15px; font-size:1.5rem;">${essenciaAtual.nome}</h3>
                <p style="color:#aaa;">${essenciaAtual.titulo || ''}</p>
            </div>`;
        
        let htmlDetalhes = "";
        if(essenciaAtual.sinais) htmlDetalhes += `<p><strong>✨ Sinais:</strong> ${essenciaAtual.sinais}</p>`;
        if(essenciaAtual.bencao) htmlDetalhes += `<p><strong>🙏 Bênção:</strong> ${essenciaAtual.bencao}</p>`;
        if(essenciaAtual.desafio) htmlDetalhes += `<p><strong>⚔️ Desafio:</strong> ${essenciaAtual.desafio}</p>`;
        if(essenciaAtual.afirmacao) htmlDetalhes += `<div class="afirmacao-final" style="margin-top:20px; font-style:italic; border:1px solid #d4af37; padding:15px; border-radius:10px; color: var(--ouro-solar);">"${essenciaAtual.afirmacao}"</div>`;
        
        document.getElementById('msg-essencia').innerHTML = `
            <p style="font-size:1.1rem; font-style:italic; text-align:center; margin-bottom:20px;">"${essenciaAtual.canalizacao || essenciaAtual.msg}"</p>
            ${htmlDetalhes}`;
        
        // DISPARO AUTOMÁTICO PARA O GEMINI VIA SERVIDOR
        chamarOraculoSiriano();
    }
}

// --- FUNÇÃO DE CONEXÃO SEGURA COM O SERVIDOR (AI LOGIC) ---
async function chamarOraculoSiriano() {
    const outputIA = document.getElementById('retorno-ia');
    const pergunta = document.getElementById('pergunta-consulente').value;

    outputIA.value = "Sintonizando a frequência do Criamor no servidor... Aguarde a canalização.";

    // Lógica de concatenação dos dados da leitura
    let resumoLeitura = `Oráculo do Tarô Siriano | Consulente: ${consulente.nome} | Pergunta: "${pergunta}"\n\nCARTAS:\n`;
    tiragemAtual.forEach((c, i) => { 
        resumoLeitura += `Posição ${i+1}: ${c.nome} - "${c.canalizacao || c.msg}"\n`; 
    });
    if (essenciaAtual) {
        resumoLeitura += `\nBÊNÇÃO DA ESSÊNCIA: ${essenciaAtual.nome} - "${essenciaAtual.canalizacao || essenciaAtual.msg}"`;
    }

    const promptFinal = `Você é o Oráculo Siriano do Portal El'Luminar. 
    Analise os dados abaixo e crie uma síntese espiritual profunda e amorosa para o consulente.
    Use o termo "Criamor". Seja direto, mas mantenha a vibração elevada.
    
    DADOS DA LEITURA:
    ${resumoLeitura}`;

    try {
        // Chamada segura usando o modelo inicializado no taro2.html
        const result = await window.modeloGemini.generateContent(promptFinal);
        const response = await result.response;
        
        // Preenche o quadro do Oráculo Digital com a resposta da IA
        outputIA.value = response.text();
    } catch (e) {
        console.error("Erro AI Logic:", e);
        outputIA.value = "Interferência técnica no servidor. Verifique a ativação do Firebase AI Logic.";
    }
}

function gerarPDFReal() {
    // 1. PREENCHER DADOS DA CAPA
    document.getElementById('pdf-nome-consulente').innerText = consulente.nome || "Consulente";
    document.getElementById('pdf-nasc-consulente').innerText = consulente.nascimento || "-";
    document.getElementById('pdf-pergunta').innerText = document.getElementById('pergunta-consulente').value || "Busca Interior";
    document.getElementById('pdf-data-leitura').innerText = new Date().toLocaleDateString('pt-BR');
    document.getElementById('pdf-tarologo').innerText = consulente.tarologo || "Guardião";

    // 2. RENDERIZAR CARTAS
    const areaCartasPDF = document.getElementById('pdf-area-cartas');
    areaCartasPDF.innerHTML = "";
    
    tiragemAtual.forEach((carta, index) => {
        let titulo = CONFIG_LEITURAS[tipoTiragem].titulos[index] || `Carta ${index+1}`;
        let imgPath = `assets/cartas/${carta.imagem}`;

        let dadosExtrasPDF = "";
        if(carta.palavra) dadosExtrasPDF += `<p style="font-size:0.9rem; margin-top:5px; color:#b8860b;"><strong>⚡ Palavra-Chave:</strong> ${carta.palavra}</p>`;
        if(carta.sinais) dadosExtrasPDF += `<p style="font-size:0.9rem; margin-top:5px; color:#000;"><strong>👁️ Sinais:</strong> ${carta.sinais}</p>`;
        if(carta.desafio) dadosExtrasPDF += `<p style="font-size:0.9rem; margin-top:5px; color:#800000;"><strong>⚔️ Desafio:</strong> ${carta.desafio}</p>`;
        if(carta.bencao) dadosExtrasPDF += `<p style="font-size:0.9rem; margin-top:5px; color:#005580;"><strong>✨ Bênção:</strong> ${carta.bencao}</p>`;
        if(carta.afirmacao) dadosExtrasPDF += `<div style="background:#fff8e1; padding:10px; margin-top:10px; border-left:4px solid #d4af37; font-style:italic; font-size:0.95rem; color:#000;"><strong>🗣️ Afirmação:</strong> "${carta.afirmacao}"</div>`;

        areaCartasPDF.innerHTML += `
            <div class="carta-pdf-item" style="display:flex; gap:20px; margin-bottom:30px; border-bottom:1px solid #ccc; padding-bottom:20px;">
                <img src="${imgPath}" style="width:100px; height:150px; object-fit:cover; border:1px solid #999; border-radius:5px;" crossorigin="anonymous">
                <div style="flex:1;">
                    <h5 style="color:#666; font-size:0.8rem; margin:0; text-transform:uppercase;">${titulo}</h5>
                    <h4 style="color:#b8860b; margin:5px 0; font-family:'Times New Roman', serif; font-size:1.3rem;">${carta.nome}</h4>
                    <p style="font-style:italic; font-size:1rem; color:#000; margin-bottom:10px;">"${carta.canalizacao || carta.msg}"</p>
                    ${dadosExtrasPDF}
                </div>
            </div>`;
    });

    // 3. RENDERIZAR ESSÊNCIA
    const areaEssencia = document.getElementById('pdf-area-essencia');
    areaEssencia.innerHTML = "";
    if (essenciaAtual) {
        let extrasEssencia = "";
        if(essenciaAtual.palavra) extrasEssencia += `<p style="font-size:0.9rem; margin-top:5px; color:#b8860b;"><strong>⚡ Palavra:</strong> ${essenciaAtual.palavra}</p>`;
        if(essenciaAtual.sinais) extrasEssencia += `<p style="font-size:0.9rem; margin-top:5px; color:#000;"><strong>👁️ Sinais:</strong> ${essenciaAtual.sinais}</p>`;
        if(essenciaAtual.desafio) extrasEssencia += `<p style="font-size:0.9rem; margin-top:5px; color:#800000;"><strong>⚔️ Desafio:</strong> ${essenciaAtual.desafio}</p>`;
        if(essenciaAtual.bencao) extrasEssencia += `<p style="font-size:0.9rem; margin-top:5px; color:#005580;"><strong>✨ Bênção:</strong> ${essenciaAtual.bencao}</p>`;
        if(essenciaAtual.afirmacao) extrasEssencia += `<div style="font-weight:bold; margin-top:10px; color:#b8860b; background:#fff; padding:5px;">"${essenciaAtual.afirmacao}"</div>`;

        areaEssencia.innerHTML = `
            <div class="essencia-pdf-box" style="text-align:center; padding:20px; border:2px solid #d4af37; border-radius:10px; background:#fffbe6; margin-bottom:20px;">
                <img src="assets/cartas/${essenciaAtual.imagem}" style="width:120px; border-radius:50%; margin:0 auto 15px; display:block; border:3px solid #d4af37;" crossorigin="anonymous">
                <h3 style="color:#b8860b; margin:0;">${essenciaAtual.nome}</h3>
                <p style="font-style:italic; margin:10px 0; font-size:1.1rem; color:#000;">"${essenciaAtual.canalizacao}"</p>
                ${extrasEssencia}
            </div>`;
    }

    // 4. TEXTOS FINAIS
    document.getElementById('pdf-texto-ia').innerText = document.getElementById('retorno-ia').value || "Leitura intuitiva.";
    document.getElementById('pdf-texto-tarologo').innerText = document.getElementById('notas-tarologo').value || "Bênçãos do Guardião.";

    // 5. ACIONAR IMPRESSÃO
    setTimeout(() => { window.print(); }, 500);
}