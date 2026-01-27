// js/curso-player.js - Motor da Sala de Aula

let moduloAtual = 0;
let progresso = { concluidos: [], anotacoes: {} };
const STORAGE_KEY = 'curso_progresso_linguagem_luz';

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarProgresso();
    renderizarMenuLateral();
    carregarModulo(moduloAtual); // Carrega o último salvo ou o primeiro
});

// --- CARREGAR DADOS ---
function carregarProgresso() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
        progresso = JSON.parse(salvo);
        // Tenta voltar onde parou (último concluído + 1, ou o 0)
        let ultimo = Math.max(...progresso.concluidos);
        if (ultimo >= 0 && ultimo < CURSO_DADOS.modulos.length - 1) {
            moduloAtual = ultimo + 1; // Vai para o próximo não feito
        } else if (ultimo === CURSO_DADOS.modulos.length - 1) {
            moduloAtual = ultimo; // Se acabou, fica no último
        } else {
            moduloAtual = 0;
        }
    }
}

function salvarProgresso() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso));
    renderizarMenuLateral(); // Atualiza ícones
}

// --- RENDERIZAÇÃO ---
function renderizarMenuLateral() {
    const lista = document.getElementById('lista-modulos');
    lista.innerHTML = '';

    CURSO_DADOS.modulos.forEach((mod, index) => {
        const item = document.createElement('div');
        item.className = `item-modulo ${index === moduloAtual ? 'ativo' : ''}`;
        item.onclick = () => carregarModulo(index);

        // Ícone de Status
        let icone = '🔒';
        if (index === 0 || progresso.concluidos.includes(index - 1) || progresso.concluidos.includes(index)) icone = '🔓';
        if (progresso.concluidos.includes(index)) icone = '✅';

        item.innerHTML = `
            <span class="icone-status">${icone}</span>
            <span>${mod.titulo}</span>
        `;
        lista.appendChild(item);
    });
}

function carregarModulo(index) {
    // Validação de Acesso (só pode acessar se o anterior estiver feito ou for o atual)
    if (index > 0 && !progresso.concluidos.includes(index - 1) && !progresso.concluidos.includes(index)) {
        alert("Complete o módulo anterior para avançar na jornada! 🦁");
        return;
    }

    moduloAtual = index;
    const mod = CURSO_DADOS.modulos[index];
    const container = document.getElementById('conteudo-dinamico');

    // Monta o HTML da aula
    container.innerHTML = `
        <div class="aula-header">
            <img src="${mod.imagem}" class="aula-img-destaque" onerror="this.style.display='none'">
            <h1 class="aula-titulo">${mod.titulo}</h1>
            <p class="aula-frase">${mod.frase}</p>
        </div>
        <div class="aula-texto">
            ${mod.conteudoHTML}
        </div>
        <div class="box-pratica">
            <h4>🧘‍♂️ Prática Vibracional: ${mod.pratica.titulo}</h4>
            <p>${mod.pratica.texto}</p>
        </div>
    `;

    // Atualiza Menu e Ferramentas
    renderizarMenuLateral();
    carregarQuiz(mod.quiz);
    document.getElementById('texto-diario').value = progresso.anotacoes[index] || '';
    
    // Botão Concluir (Se já fez, muda estilo)
    const btnConcluir = document.getElementById('btn-concluir');
    if (progresso.concluidos.includes(index)) {
        btnConcluir.innerText = "Módulo Concluído ✅";
        btnConcluir.classList.remove('destaque');
    } else {
        btnConcluir.innerText = "Concluir Módulo ✅";
        btnConcluir.classList.add('destaque');
    }

    // Scroll para o topo
    document.querySelector('.area-conteudo').scrollTop = 0;
}

// --- NAVEGAÇÃO ---
function mudarModulo(delta) {
    const novoIndex = moduloAtual + delta;
    if (novoIndex >= 0 && novoIndex < CURSO_DADOS.modulos.length) {
        carregarModulo(novoIndex);
    }
}

function concluirModulo() {
    if (!progresso.concluidos.includes(moduloAtual)) {
        progresso.concluidos.push(moduloAtual);
        salvarProgresso();
        alert("Parabéns! Módulo concluído. A luz se expande! ✨");
        
        // Se houver próximo, pergunta se quer ir
        if (moduloAtual < CURSO_DADOS.modulos.length - 1) {
            carregarModulo(moduloAtual + 1);
        } else {
            alert("Você completou a jornada! Gratidão! 🙏");
        }
    }
}

// --- FERRAMENTAS ---
function toggleDiario() {
    const modal = document.getElementById('modal-diario');
    if (modal.classList.contains('oculto')) {
        modal.classList.remove('oculto');
    } else {
        modal.classList.add('oculto');
    }
}

function salvarDiario() {
    const texto = document.getElementById('texto-diario').value;
    progresso.anotacoes[moduloAtual] = texto;
    salvarProgresso();
    const status = document.getElementById('status-diario');
    status.innerText = "Salvo com sucesso!";
    setTimeout(() => status.innerText = "", 2000);
}

// --- QUIZ ---
function carregarQuiz(quizData) {
    const container = document.getElementById('quiz-opcoes');
    document.querySelector('.quiz-pergunta').innerText = quizData.pergunta;
    document.getElementById('quiz-feedback').innerText = "";
    
    container.innerHTML = '';
    quizData.opcoes.forEach((opcao, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcao';
        btn.innerText = opcao;
        btn.onclick = () => verificarQuiz(i, quizData.resposta, btn);
        container.appendChild(btn);
    });
}

function verificarQuiz(escolha, correta, elementoBtn) {
    if (escolha === correta) {
        elementoBtn.classList.add('correto');
        document.getElementById('quiz-feedback').innerText = "Correto! 🌟";
        document.getElementById('quiz-feedback').style.color = "#4caf50";
    } else {
        elementoBtn.classList.add('errado');
        document.getElementById('quiz-feedback').innerText = "Tente novamente.";
        document.getElementById('quiz-feedback').style.color = "#f44336";
    }
}