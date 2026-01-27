// js/dna.js - O Ritual da Câmara Solar (Versão Profunda - 1 Minuto)

const FILAMENTOS_SOLARES = [
    { nome: "Filamento 1: A Coragem Safira", cor: "#0066cc", msg: "A verdade vibra em ti.", mantra: "Minha voz molda a realidade." },
    { nome: "Filamento 2: A Cura Esmeralda", cor: "#00cc44", msg: "Regeneração celular sagrada.", mantra: "Sou a cura em movimento." },
    { nome: "Filamento 3: A Sabedoria Dourada", cor: "#ffaa00", msg: "Conexão direta com a Fonte.", mantra: "Eu sei, pois sou." },
    { nome: "Filamento 4: O Amor Rosa-Cristal", cor: "#ff66b2", msg: "Força na vulnerabilidade.", mantra: "Amar é minha proteção." },
    { nome: "Filamento 5: A Visão Ametista", cor: "#9933ff", msg: "O terceiro olho desperta.", mantra: "Vejo além do véu." },
    { nome: "Filamento 6: A Força Rubi", cor: "#cc0000", msg: "Materialização potente.", mantra: "A Terra me sustenta." },
    { nome: "Filamento 7: A Paz Diamante", cor: "#e6f2ff", msg: "Transparência inabalável.", mantra: "Sou o silêncio no caos." },
    { nome: "Filamento 8: O Fluxo Turquesa", cor: "#00e6e6", msg: "Sincronicidade pura.", mantra: "Navego nas ondas da Luz." },
    { nome: "Filamento 9: A Compaixão Pérola", cor: "#f0f0f5", msg: "Abrigo para o mundo.", mantra: "Meu abraço é um portal." },
    { nome: "Filamento 10: O Mistério Índigo", cor: "#330066", msg: "Respostas profundas.", mantra: "Minha luz vem de dentro." },
    { nome: "Filamento 11: A Alegria Citrina", cor: "#ffee00", msg: "O riso que dissolve o karma.", mantra: "Minha alegria é sagrada." },
    { nome: "Filamento 12: A Unidade Branca", cor: "#ffffff", msg: "Integração total com o Todo.", mantra: "Eu Sou O Que Eu Sou." }
];

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.iniciarRitual = async function(event) {
    
    // 1. SORTEIO
    const indice = Math.floor(Math.random() * FILAMENTOS_SOLARES.length);
    const ativacao = FILAMENTOS_SOLARES[indice];
    const corLuz = ativacao.cor;

    const nucleo = document.getElementById('nucleo-interativo');
    const textoInfo = document.getElementById('texto-impacto');
    const contador = document.getElementById('contador-progresso');
    const ondaLuz = document.getElementById('onda-choque');
    const resultado = document.getElementById('resultado-ativacao');

    // POSICIONAR A LUZ
    const rect = nucleo.getBoundingClientRect();
    const centroX = rect.left + (rect.width / 2);
    const centroY = rect.top + (rect.height / 2);
    ondaLuz.style.left = `${centroX}px`;
    ondaLuz.style.top = `${centroY}px`;

    // --- ETAPA 1: PREPARAÇÃO (5s) ---
    nucleo.onclick = null; 
    nucleo.style.transform = "scale(0.9)";
    nucleo.style.opacity = "0.7";
    
    textoInfo.classList.remove('oculto');
    
    const msgsPrep = ["CONECTANDO...", "ALINHANDO CHAKRAS...", "ABRINDO PORTAL...", "CALIBRANDO ENERGIA..."];
    
    for (let msg of msgsPrep) {
        textoInfo.innerText = msg;
        textoInfo.style.animation = 'none';
        textoInfo.offsetHeight; 
        textoInfo.style.animation = 'zoomImpacto 0.8s ease-out';
        await esperar(1200); 
    }

    // --- ETAPA 2: DOWNLOAD (1 Minuto) ---
    textoInfo.innerText = "RECEBENDO CÓDIGO...";
    textoInfo.style.color = corLuz;
    
    ondaLuz.style.color = corLuz; 
    ondaLuz.classList.add('emitindo');
    
    contador.classList.remove('oculto');
    
    // De 0% a 100% em 60 segundos
    for(let i=0; i<=100; i++) {
        contador.innerText = i + "%";
        contador.style.color = corLuz;
        contador.style.borderColor = corLuz;
        
        // MATEMÁTICA DO TEMPO:
        // 1 Minuto = 60.000ms
        // Dividido por 100 passos = 600ms por passo
        await esperar(600); 
    }

    // --- ETAPA 3: ANCORAGEM (3s) ---
    textoInfo.style.color = "#fff";
    textoInfo.innerText = "SINTONIA ANCORADA";
    ondaLuz.classList.remove('emitindo');
    contador.classList.add('oculto');
    
    await esperar(3000); // Um pouco mais de tempo para respirar no final

    // --- ETAPA 4: REVELAÇÃO ---
    textoInfo.classList.add('oculto'); 
    
    document.getElementById('titulo-filamento').innerText = ativacao.nome;
    document.getElementById('titulo-filamento').style.color = ativacao.cor;
    
    const bolinha = document.getElementById('cor-frequencia');
    bolinha.style.backgroundColor = ativacao.cor;
    bolinha.style.boxShadow = `0 0 50px ${ativacao.cor}`;

    document.getElementById('mensagem-ativacao').innerText = ativacao.msg;
    document.getElementById('mantra-texto').innerText = `"${ativacao.mantra}"`;

    resultado.classList.remove('oculto');
    setTimeout(() => resultado.classList.add('visivel'), 100);
}