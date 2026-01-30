// js/numerologia.js - v1.4.1 (Alinhado ao novo Layout)

// --- DADOS CENTRAIS (Constantes do Universo) ---
const MESTRES_RAIOS = {
    1: { nome: "Mestre El Morya", raio: "1º Raio - Azul (Vontade)", cor: "#0066cc" },
    2: { nome: "Mestre Lanto", raio: "2º Raio - Dourado (Sabedoria)", cor: "#ffcc00" },
    3: { nome: "Mestra Rowena", raio: "3º Raio - Rosa (Amor)", cor: "#ff66b2" },
    4: { nome: "Mestre Serapis Bey", raio: "4º Raio - Branco (Ascensão)", cor: "#ffffff" },
    5: { nome: "Mestre Hilarion", raio: "5º Raio - Verde (Verdade)", cor: "#00cc44" },
    6: { nome: "Mestra Nada", raio: "6º Raio - Rubi Dourado (Paz)", cor: "#cc0033" },
    7: { nome: "Mestre Saint Germain", raio: "7º Raio - Violeta (Magia)", cor: "#9933ff" },
    8: { nome: "Maha Chohan", raio: "Cristal (Justiça/Abundância)", cor: "#e6f2ff" },
    9: { nome: "Mestre Sananda", raio: "Dourado Solar (Compaixão)", cor: "#ffaa00" },
    11: { nome: "Arcanjo Miguel", raio: "Azul Índigo (Proteção)", cor: "#333399" },
    22: { nome: "Maitreya", raio: "Solar (Grande Obra)", cor: "#ffaa00" }
};

const TABELA = {
    'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7, 'h':8, 'i':9,
    'j':1, 'k':2, 'l':3, 'm':4, 'n':5, 'o':6, 'p':7, 'q':8, 'r':9,
    's':1, 't':2, 'u':3, 'v':4, 'w':5, 'x':6, 'y':7, 'z':8
};

// --- FUNÇÃO DE ENTRADA (O Portal) ---

function iniciarTransmutacao() {
    const nomeInput = document.getElementById('input-nome');
    const dataInput = document.getElementById('input-data');
    
    if (!nomeInput.value || !dataInput.value) {
        alert("Viajante, preencha os dados da matriz para a correta decodificação.");
        return;
    }

    const painelEntrada = document.getElementById('fase-entrada');
    painelEntrada.style.transition = 'opacity 0.5s ease-out';
    painelEntrada.style.opacity = '0';

    setTimeout(() => {
        painelEntrada.classList.add('oculto');
        calcularEMostrarMapa(nomeInput.value, dataInput.value);
        
        const painelResultado = document.getElementById('fase-resultado');
        painelResultado.classList.remove('oculto');
    }, 500); // Aguarda a animação de fade-out
}

// --- CÁLCULOS DA ALMA (A Lógica Sagrada) ---

function reduzir(numero) {
    while (numero > 9 && numero !== 11 && numero !== 22) {
        numero = numero.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return numero;
}

function calcularNome(nome) {
    const limpo = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, '');
    let soma = 0, vogais = 0;
    for (const letra of limpo) {
        const valor = TABELA[letra] || 0;
        soma += valor;
        if ('aeiou'.includes(letra)) vogais += valor;
    }
    return { expressao: reduzir(soma), alma: reduzir(vogais) };
}

function calcularData(dataString) {
    const digitos = dataString.replace(/[^0-9]/g, '');
    let total = 0;
    for(const n of digitos) total += parseInt(n);
    return reduzir(total);
}

// --- APRESENTAÇÃO DO MAPA (A Revelação) ---

function calcularEMostrarMapa(nome, data) {
    const numerosNome = calcularNome(nome);
    const numeroMissao = calcularData(data);

    // 1. Preenche os números no Painel de Geometria (Esquerda)
    document.getElementById('num-missao').innerText = numeroMissao;
    document.getElementById('num-expressao').innerText = numerosNome.expressao;
    document.getElementById('num-alma').innerText = numerosNome.alma;

    // 2. Preenche os números no Triângulo Visual (Direita)
    document.getElementById('num-missao-circulo').innerText = numeroMissao;
    document.getElementById('num-expressao-circulo').innerText = numerosNome.expressao;
    document.getElementById('num-alma-circulo').innerText = numerosNome.alma;

    // 3. Revela o Mestre Mentor
    const mestre = MESTRES_RAIOS[numeroMissao] || MESTRES_RAIOS[9]; // Mestre 9 como fallback
    document.getElementById('nome-mestre').innerText = mestre.nome;
    document.getElementById('raio-mestre').innerText = mestre.raio;
    document.getElementById('raio-mestre').style.color = mestre.cor;
    document.getElementById('box-mestre').style.borderColor = mestre.cor;
    
    const brilho = document.getElementById('brilho-raio');
    brilho.style.backgroundColor = mestre.cor;
    brilho.style.boxShadow = `0 0 25px 8px ${mestre.cor}`;

    // Futura chamada da IA para preencher as interpretações
    // ex: interpretarNumero('missao', numeroMissao);
}
