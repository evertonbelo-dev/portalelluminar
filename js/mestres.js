// js/mestres.js - O Banco de Dados da Egrégora

// Lista baseada nos arquivos enviados
// NOTA: Ajuste as descrições conforme o seu arquivo mestres.txt
const MESTRES = [
    { 
        id: 'cristo',
        nome: "Cristo Vivo", 
        img: "assets/Mestres/CristoVivo.png", 
        cargo: "Regente da Era de Luz",
        desc: "Eu Sou o Caminho, a Verdade e a Vida. Estou aqui para despertar o Cristo que habita em teu coração. Não busques fora o templo que já reside dentro de ti." 
    },
    { 
        id: 'maria',
        nome: "Mãe Maria", 
        img: "assets/Mestres/Maria.png", 
        cargo: "Mãe Divina Universal",
        desc: "Filho amado, cubro-te com meu manto de estrelas. Onde houver dor, levarei consolo. Onde houver dúvida, levarei a fé materna que tudo acolhe." 
    },
    { 
        id: 'sirian',
        nome: "Comando Siriano", 
        img: "assets/Mestres/Sirian.png", 
        cargo: "Engenheiros Genéticos Estelares",
        desc: "Trazemos a tecnologia da luz azul para recalibrar teus corpos sutis. A conexão com Sirius é a chave para a tua memória cósmica." 
    },
    { 
        id: 'alethira',
        nome: "Mestra Alethira", 
        img: "assets/Mestres/Alethira.png", 
        cargo: "Guardiã dos Registros",
        desc: "A verdade é um espelho límpido. Ajudo-te a olhar para tua história sem julgamentos, apenas com a clareza da luz." 
    },
    { 
        id: 'aurex',
        nome: "Lord Aurex", 
        img: "assets/Mestres/Aurex.png", 
        cargo: "Alquimista do Ouro",
        desc: "A prosperidade é um estado de espírito natural. Permita que o ouro divino flua através de tuas mãos para o mundo." 
    },
    { 
        id: 'brahma',
        nome: "Lord Brahma", 
        img: "assets/Mestres/Brahma.png", // Corrigido o caminho duplo assets/assets
        cargo: "O Criador Universal",
        desc: "O universo se expande a cada respiração tua. Tu és co-criador da realidade. O que desejas manifestar hoje?" 
    },
    { 
        id: 'elion',
        nome: "Mestre Elion", 
        img: "assets/Mestres/Elion.png", 
        cargo: "Vigilante das Estrelas",
        desc: "Mantenho a frequência elevada para que possas acessar as dimensões superiores sem perder o enraizamento." 
    },
    { 
        id: 'kael',
        nome: "Guerreiro Kael", 
        img: "assets/Mestres/Kael.png", 
        cargo: "Protetor do Raio Azul",
        desc: "Minha espada corta os laços do medo. Tenha coragem, pois nenhuma sombra resiste à presença da luz autêntica." 
    },
    { 
        id: 'lyra',
        nome: "Sacerdotisa de Lyra", 
        img: "assets/Mestres/Lyra.png", 
        cargo: "Harmonia das Esferas",
        desc: "A música das esferas cura a alma. Sintoniza-te com a vibração original de onde vieste." 
    },
    { 
        id: 'sabbah',
        nome: "Mestre Sabbah", 
        img: "assets/Mestres/Sabbah.png", 
        cargo: "O Ancião dos Dias",
        desc: "O tempo é uma ilusão da matéria. Na eternidade, tudo já foi realizado. Descansa na certeza do agora." 
    },
    { 
        id: 'seraphion',
        nome: "Seraphion", 
        img: "assets/Mestres/Seraphion.png", 
        cargo: "Serafim da Chama Ardente",
        desc: "Queimo as impurezas com o fogo do amor divino. Deixa ir o que não serve mais ao teu propósito elevado." 
    },
    { 
        id: 'yhanel',
        nome: "Yhanel", 
        img: "assets/Mestres/Yhanel.png", 
        cargo: "Mensageiro da Graça",
        desc: "A leveza é o sinal da presença divina. Não carregues pesos que não são teus. Voa." 
    }
];

// Função para gerar a Galeria
function renderizarGaleria() {
    const container = document.getElementById('galeria-guardioes');
    container.innerHTML = ''; // Limpa

    MESTRES.forEach(mestre => {
        const card = document.createElement('div');
        card.classList.add('card-mestre');
        card.onclick = () => abrirAltar(mestre);

        card.innerHTML = `
            <div class="img-container">
                <img src="${mestre.img}" alt="${mestre.nome}" loading="lazy">
            </div>
            <div class="info-card">
                <h3 class="nome-mestre-card">${mestre.nome}</h3>
                <p class="cargo-mestre">${mestre.cargo}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções do Modal (Altar)
function abrirAltar(mestre) {
    const modal = document.getElementById('modal-altar');
    
    // Preenche os dados
    document.getElementById('modal-img').src = mestre.img;
    document.getElementById('modal-nome').innerText = mestre.nome;
    document.getElementById('modal-desc').innerText = `"${mestre.desc}"`;
    
    // Mostra o modal
    modal.classList.remove('oculto');
    setTimeout(() => modal.classList.add('ativo'), 10); // Delay para animação CSS
}

function fecharAltar(event) {
    // Fecha se clicar no botão X ou no fundo escuro (overlay)
    if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('btn-fechar')) {
        const modal = document.getElementById('modal-altar');
        modal.classList.remove('ativo');
        setTimeout(() => modal.classList.add('oculto'), 300); // Espera animação
    }
}

// Inicializa
document.addEventListener('DOMContentLoaded', renderizarGaleria);