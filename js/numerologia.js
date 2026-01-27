// js/numerologia.js - O Código da Alma (Versão Mágica)

// 1. DICIONÁRIO DE ARQUÉTIPOS (Novidade!)
const ARQUETIPOS = {
    1: "O LÍDER PIONEIRO",
    2: "O DIPLOMATA",
    3: "O COMUNICADOR",
    4: "O CONSTRUTOR",
    5: "O VIAJANTE LIVRE",
    6: "O CUIDADOR",
    7: "O SÁBIO MÍSTICO",
    8: "O VISIONÁRIO",
    9: "O HUMANITÁRIO",
    11: "O MESTRE INSPIRADOR",
    22: "O MESTRE CONSTRUTOR"
};

// 2. DADOS DOS MESTRES (Raios)
const MESTRES_RAIOS = {
    1: { nome: "Mestre El Morya", raio: "1º Raio - Azul (Vontade)", cor: "#0066cc", msg: "Vieste para liderar e abrir caminhos. Tua vontade é tua espada." },
    2: { nome: "Mestre Lanto", raio: "2º Raio - Dourado (Sabedoria)", cor: "#ffcc00", msg: "Tua missão é iluminar mentes com paciência e sabedoria." },
    3: { nome: "Mestra Rowena", raio: "3º Raio - Rosa (Amor)", cor: "#ff66b2", msg: "A beleza é tua linguagem. Tu curas o mundo através do amor." },
    4: { nome: "Mestre Serapis Bey", raio: "4º Raio - Branco (Ascensão)", cor: "#ffffff", msg: "Disciplina e pureza. Vieste elevar a matéria ao espírito." },
    5: { nome: "Mestre Hilarion", raio: "5º Raio - Verde (Verdade)", cor: "#00cc44", msg: "A verdade é teu escudo. Tu vieste libertar e curar." },
    6: { nome: "Mestra Nada", raio: "6º Raio - Rubi Dourado (Paz)", cor: "#cc0033", msg: "Serviço devocional. Tua presença pacifica guerras e une." },
    7: { nome: "Mestre Saint Germain", raio: "7º Raio - Violeta (Magia)", cor: "#9933ff", msg: "Tu és o alquimista. Onde há dor, tu fazes luz." },
    8: { nome: "Maha Chohan", raio: "Cristal (Justiça/Abundância)", cor: "#e6f2ff", msg: "A justiça divina se manifesta através da tua prosperidade." },
    9: { nome: "Mestre Sananda", raio: "Dourado Solar (Compaixão)", cor: "#ffaa00", msg: "O encerramento de ciclos. Vieste ensinar o amor universal." },
    11: { nome: "Arcanjo Miguel", raio: "Azul Índigo (Proteção)", cor: "#333399", msg: "Um portal vivo. Tua intuição é um radar divino." },
    22: { nome: "Maitreya", raio: "Solar (Grande Obra)", cor: "#ffaa00", msg: "Construir obras que beneficiem a humanidade por séculos." }
};

const TABELA = {
    'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7, 'h':8, 'i':9,
    'j':1, 'k':2, 'l':3, 'm':4, 'n':5, 'o':6, 'p':7, 'q':8, 'r':9,
    's':1, 't':2, 'u':3, 'v':4, 'w':5, 'x':6, 'y':7, 'z':8
};

// --- EFEITOS ESPECIAIS (MAGIA) ---

// 1. Partículas ao Digitar
document.getElementById('input-nome').addEventListener('input', function(e) {
    const container = document.getElementById('container-nome');
    // Cria uma partícula
    const span = document.createElement('span');
    span.classList.add('particula-flutuante');
    
    // Escolhe conteúdo aleatório (Número ou Letra Grega)
    const simbolos = ["1", "3", "7", "9", "α", "Ω", "π", "φ", "∞"];
    span.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
    
    // Posição aleatória perto do input
    const x = Math.random() * 80 + 10; // entre 10% e 90%
    span.style.left = `${x}%`;
    span.style.bottom = "40px"; // Começa dentro do input
    
    container.appendChild(span);
    
    // Remove após a animação
    setTimeout(() => span.remove(), 1500);
});

// 2. Transmutação: O Nome vira Números
function iniciarTransmutacao() {
    let nomeInput = document.getElementById('input-nome');
    let dataInput = document.getElementById('input-data');
    
    if(!nomeInput.value || !dataInput.value) return alert("Viajante, preencha os dados da matriz.");

    const nomeOriginal = nomeInput.value;
    let iteracoes = 0;
    
    // Efeito "Matrix": troca letras por números rapidamente
    let intervalo = setInterval(() => {
        nomeInput.value = nomeInput.value.split('').map(char => {
            if(char === ' ') return ' ';
            return Math.floor(Math.random() * 9) + 1;
        }).join('');
        
        iteracoes++;
        if(iteracoes > 15) { // Para depois de um tempo
            clearInterval(intervalo);
            nomeInput.value = nomeOriginal; // Restaura (opcional, mas vamos trocar de tela)
            calcularMapa(); // Chama o cálculo real
        }
    }, 50);
}

// --- CÁLCULOS REAIS ---

function reduzir(numero) {
    while (numero > 9 && numero !== 11 && numero !== 22) {
        numero = numero.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return numero;
}

function calcularNome(nome) {
    let limpo = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, '');
    let soma = 0;
    let vogais = 0;
    for (let letra of limpo) {
        let valor = TABELA[letra] || 0;
        soma += valor;
        if ('aeiou'.includes(letra)) vogais += valor;
    }
    return { expressao: reduzir(soma), alma: reduzir(vogais) };
}

function calcularData(dataString) {
    let digitos = dataString.replace(/[^0-9]/g, '');
    let total = 0;
    for(let n of digitos) total += parseInt(n);
    return reduzir(total);
}

function calcularMapa() {
    let nome = document.getElementById('input-nome').value;
    let data = document.getElementById('input-data').value;

    let numerosNome = calcularNome(nome);
    let numeroMissao = calcularData(data);

    // Preenche Números
    document.getElementById('num-missao').innerText = numeroMissao;
    document.getElementById('num-expressao').innerText = numerosNome.expressao;
    document.getElementById('num-alma').innerText = numerosNome.alma;

    // Preenche Arquétipos (Títulos)
    preencherArquetipo('arq-missao', numeroMissao);
    preencherArquetipo('arq-expressao', numerosNome.expressao);
    preencherArquetipo('arq-alma', numerosNome.alma);

    // Preenche Mestre
    let mestre = MESTRES_RAIOS[numeroMissao] || MESTRES_RAIOS[9]; 
    document.getElementById('nome-mestre').innerText = mestre.nome;
    document.getElementById('raio-mestre').innerText = mestre.raio;
    document.getElementById('raio-mestre').style.color = mestre.cor;
    document.getElementById('msg-mestre').innerText = `"${mestre.msg}"`;
    
    document.getElementById('brilho-mestre').style.backgroundColor = mestre.cor;
    document.getElementById('brilho-mestre').style.boxShadow = `0 0 30px 10px ${mestre.cor}`;
    document.getElementById('box-mestre').style.borderColor = mestre.cor;

    // Troca de Tela
    document.getElementById('fase-entrada').style.display = 'none'; 
    document.getElementById('fase-resultado').classList.remove('oculto');
    
    // Mostra os arquétipos com delay (elegância)
    setTimeout(() => {
        document.querySelectorAll('.arquetipo-ponta').forEach(el => el.style.display = 'block');
    }, 1000);
}

function preencherArquetipo(id, numero) {
    let texto = ARQUETIPOS[numero] || "O MISTERIOSO"; // Fallback
    document.getElementById(id).innerText = texto;
}

function mostrarDetalhe(tipo) {
    const textos = {
        'missao': "MISSÃO: O contrato da tua alma. O aprendizado central desta encarnação.",
        'expressao': "EXPRESSÃO: Teus talentos naturais. A ferramenta que usas para interagir com o mundo.",
        'alma': "ALMA: A motivação oculta. O combustível que só tu conheces."
    };
    const titulos = { 'missao': 'CAMINHO DE VIDA', 'expressao': 'QUEM ÉS', 'alma': 'DESEJO INTERIOR' };

    document.getElementById('titulo-resumo').innerText = titulos[tipo];
    document.getElementById('texto-resumo').innerText = textos[tipo];
}