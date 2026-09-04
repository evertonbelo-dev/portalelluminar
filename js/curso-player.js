// js/curso-player.js - Motor da Sala de Aula (v2.0 - Supabase)
// Agora sincroniza progresso com Supabase quando logado

let moduloAtual = 0;
let progresso = { concluidos: [], anotacoes: {} };
const STORAGE_KEY = 'curso_progresso_linguagem_luz';
const CURSO_ID = 'linguagem_luz';

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    await carregarProgresso();
    renderizarMenuLateral();
    carregarModulo(moduloAtual);
});

// --- CARREGAR DADOS (Supabase + localStorage) ---
async function carregarProgresso() {
    // 1. Tenta carregar do Supabase
    try {
        const { supabase } = await import('./supabase-config.js?v=2.0.0');
        const client = await supabase;
        
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session?.user?.id) {
                const { getCourseProgress } = await import('./supabase-db.js?v=2.0.0');
                const dados = await getCourseProgress(session.user.id, CURSO_ID);
                if (dados && dados.concluidos) {
                    progresso = {
                        concluidos: dados.concluidos || [],
                        anotacoes: dados.anotacoes || {}
                    };
                    // Atualiza localStorage como cache
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso));
                    console.log("📚 Progresso carregado do Supabase!");
                    return;
                }
            }
        }
    } catch (e) {
        console.warn("Supabase não disponível, usando localStorage:", e);
    }

    // 2. Fallback: carrega do localStorage
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
        progresso = JSON.parse(salvo);
    }

    // Define o módulo atual baseado no progresso
    let ultimo = progresso.concluidos.length > 0 ? Math.max(...progresso.concluidos) : -1;
    if (ultimo >= 0 && ultimo < CURSO_DADOS.modulos.length - 1) {
        moduloAtual = ultimo + 1;
    } else if (ultimo === CURSO_DADOS.modulos.length - 1) {
        moduloAtual = ultimo;
    } else {
        moduloAtual = 0;
    }
}

async function salvarProgresso() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso));
    
    // Tenta sincronizar com Supabase
    try {
        const { supabase } = await import('./supabase-config.js?v=2.0.0');
        const client = await supabase;
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session?.user?.id) {
                const { saveCourseProgress } = await import('./supabase-db.js?v=2.0.0');
                await saveCourseProgress(session.user.id, CURSO_ID, progresso.concluidos, progresso.anotacoes);
            }
        }
    } catch (e) {
        // Silencioso - localStorage já salvo como fallback
    }
    
    renderizarMenuLateral();
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