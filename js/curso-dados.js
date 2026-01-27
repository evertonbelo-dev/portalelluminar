// js/curso-dados.js - O Conteúdo Sagrado Completo (Atualizado com Tabelas)

const CURSO_DADOS = {
    id: "linguagem_luz",
    titulo: "A Linguagem da Luz",
    modulos: [
        // --- MÓDULO 1 ---
        {
            id: 1,
            titulo: "Módulo 1 – A Energia que somos",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo1_Ocorpohumanoenergetico.png",
            frase: "“Você não é apenas matéria — você vibra, pulsa, irradia.”",
            conteudoHTML: `
                <h3>Da Matéria ao Espírito</h3>
                <p>Este módulo convida você a sair da compreensão intelectual de que "somos energia" para a sensação visceral de sua própria frequência.</p>
                
                <h3>1. Energia Sutil e o Universo Vibracional</h3>
                <p><strong>O Átomo e o Vazio:</strong> 99,9% do átomo é espaço vazio (energia/informação). A matéria é apenas energia condensada em uma vibração lenta.</p>
                <p><strong>A Linguagem do Universo:</strong> Tudo conversa através de frequências. O pensamento emite um sinal elétrico; a emoção emite um sinal magnético. Juntos, formam a sua assinatura eletromagnética.</p>
                <p><strong>Ressonância:</strong> A lei da atração sob a ótica da física funciona como diapasões: energias na mesma frequência vibram juntas.</p>

                <h3>2. Anatomia do Campo Áurico</h3>
                <ul>
                    <li><strong>Duplo Etérico:</strong> A bateria do corpo físico (onde a acupuntura atua).</li>
                    <li><strong>Corpo Emocional (Astral):</strong> Onde residem desejos, medos e sentimentos. É colorido e muda constantemente.</li>
                    <li><strong>Corpo Mental:</strong> Onde moram as formas-pensamento e crenças.</li>
                    <li><strong>Corpo Espiritual:</strong> A conexão direta com o Criamor, nossa centelha divina imutável.</li>
                </ul>

                <h3>3. A Dinâmica Físico x Sutil</h3>
                <p>O corpo grita o que a alma cala. Um bloqueio no corpo emocional (uma mágoa não sentida) desce a densidade até virar uma doença no corpo físico.</p>

                <h3>4. Gestão da Frequência</h3>
                <p>Vergonha e Culpa vibram baixo (contração). Amor e Gratidão vibram alto (expansão). Práticas como banhos de ervas e oração elevam sua frequência rapidamente.</p>
            `,
            pratica: {
                titulo: "Escaneamento Vibracional Sensitivo",
                texto: `1. <strong>Enraizamento:</strong> Pés no chão, imaginando raízes indo ao centro da Terra.<br>2. <strong>Ativação:</strong> Esfregue as palmas por 30s e afaste devagar, sentindo o magnetismo.<br>3. <strong>O Escaneamento:</strong> Passe as mãos a 10cm do corpo. Não procure problemas, procure <em>diferenças</em> (calor, frio, formigamento).`
            },
            quiz: {
                pergunta: "Qual corpo sutil funciona como a 'bateria' do corpo físico?",
                opcoes: ["Corpo Mental", "Duplo Etérico", "Corpo Astral"],
                resposta: 1 
            }
        },

 // --- MÓDULO 2 (ATUALIZADO E COMPLETO) ---
        {
            id: 2,
            titulo: "Módulo 2 – Os 7 Chacras em Profundidade",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo2_Os chacras.png",
            frase: "“Cada chacra é uma porta. Ao abri-las com consciência, a alma entra em casa.”",
            conteudoHTML: `
                <h3>1. O Mecanismo dos Chacras</h3>
                <p><strong>Transformadores de Energia:</strong> Os chacras pegam a energia vital universal (Prana/Qi) e a "reduzem" para que nosso corpo físico possa usar.</p>
                <p><strong>O Eixo (Sushumna):</strong> O canal central por onde a energia Kundalini ascende, conectando a terra ao céu através da coluna.</p>
                
                <h3>2. Anatomia Sutil Detalhada</h3>
                <p>Clique abaixo para estudar a tabela completa de correspondências e diagnósticos:</p>

                <details class="detalhes-curso">
                    <summary class="btn-ver-tabela">📊 Tabela 1: Anatomia & Temas</summary>
                    <div class="tabela-wrapper">
                        <table class="tabela-curso">
                            <tr><th>Chacra</th><th>Glândula</th><th>Elemento</th><th>Tema Central</th><th>Bloqueio Gera</th></tr>
                            <tr><td><strong>1. Básico</strong><br>(Muladhara)</td><td>Suprarrenais</td><td>Terra</td><td>Sobrevivência, Raízes</td><td>Medo, insegurança, fadiga</td></tr>
                            <tr><td><strong>2. Sacral</strong><br>(Swadhisthana)</td><td>Gônadas</td><td>Água</td><td>Prazer, Criatividade</td><td>Culpa, bloqueio criativo</td></tr>
                            <tr><td><strong>3. Plexo Solar</strong><br>(Manipura)</td><td>Pâncreas</td><td>Fogo</td><td>Poder Pessoal</td><td>Vergonha, raiva, controle</td></tr>
                            <tr><td><strong>4. Cardíaco</strong><br>(Anahata)</td><td>Timo</td><td>Ar</td><td>Amor, Cura</td><td>Mágoa, isolamento</td></tr>
                            <tr><td><strong>5. Laríngeo</strong><br>(Vishuddha)</td><td>Tireoide</td><td>Éter</td><td>Verdade, Expressão</td><td>Mentira, timidez</td></tr>
                            <tr><td><strong>6. Frontal</strong><br>(Ajna)</td><td>Pituitária</td><td>Luz</td><td>Intuição, Visão</td><td>Ilusão, rigidez mental</td></tr>
                            <tr><td><strong>7. Coronário</strong><br>(Sahasrara)</td><td>Pineal</td><td>Pensamento</td><td>Conexão Divina</td><td>Apego, desconexão</td></tr>
                        </table>
                    </div>
                </details>

                <details class="detalhes-curso">
                    <summary class="btn-ver-tabela">⚕️ Tabela 2: Diagnóstico & Harmonização</summary>
                    <div class="tabela-wrapper">
                        <table class="tabela-curso">
                            <tr><th>Chacra / Mantra</th><th>Hipoativo (Bloqueado)</th><th>Hiperativo (Acelerado)</th></tr>
                            <tr><td><strong>Básico</strong><br>Mantra: LAM</td><td>Medo, "mundo da lua", rejeição ao corpo.<br><em>"Não tenho chão."</em></td><td>Ganância, apego, agressividade.<br><em>"Nunca é o suficiente."</em></td></tr>
                            <tr><td><strong>Sacral</strong><br>Mantra: VAM</td><td>Frigidez, culpa, medo do prazer.<br><em>"Não mereço desfrutar."</em></td><td>Vício em prazer, dramas exagerados.<br><em>"Preciso sentir ao extremo."</em></td></tr>
                            <tr><td><strong>Plexo Solar</strong><br>Mantra: RAM</td><td>Baixa estima, vitimismo, indecisão.<br><em>"Eu não consigo."</em></td><td>Arrogância, controle, perfeccionismo.<br><em>"Tem que ser do meu jeito."</em></td></tr>
                            <tr><td><strong>Cardíaco</strong><br>Mantra: YAM</td><td>Frieza, amargura, medo de amar.<br><em>"Melhor não amar para não sofrer."</em></td><td>Amor sufocante, ciúme, codependência.<br><em>"Faço tudo e não retribuem."</em></td></tr>
                            <tr><td><strong>Laríngeo</strong><br>Mantra: HAM</td><td>Medo de falar, engolir sapos, voz fraca.<br><em>"Minha voz não importa."</em></td><td>Falar demais, fofoca, interrupção.<br><em>"Preciso preencher o silêncio."</em></td></tr>
                            <tr><td><strong>Frontal</strong><br>Mantra: OM</td><td>Ceticismo, falta de foco, mente rígida.<br><em>"Só acredito vendo."</em></td><td>Alucinações, viver em fantasias, arrogância.<br><em>"Sei mais que todos."</em></td></tr>
                            <tr><td><strong>Coronário</strong><br>Mantra: OM</td><td>Depressão existencial, falta de propósito.<br><em>"A vida não tem sentido."</em></td><td>Fanatismo, "voo espiritual", alienação.<br><em>"Sou evoluído demais."</em></td></tr>
                        </table>
                    </div>
                </details>

                <h3>3. Correlação Emocional e Cura</h3>
                <p><strong>O Ciclo da Energia:</strong> Entenda como um trauma na infância (ex: ser silenciado) pode bloquear o Laríngeo na vida adulta. O corpo grita o que a alma cala.</p>
                <p><strong>Cromoterapia Intuitiva:</strong> Use as cores (roupas, alimentos, visualização) para estimular o chacra deficiente, trazendo a vibração que falta ao sistema.</p>

                <div style="background: rgba(255, 215, 0, 0.1); border-left: 4px solid var(--ouro-solar); padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <h4 style="color: var(--ouro-solar); margin-top: 0;">💡 Dica de Ouro</h4>
                    <p>O objetivo não é ter um chacra "aberto o tempo todo", mas sim <strong>flexível</strong>.</p>
                    <ul>
                        <li>Se preciso pagar contas e resolver problemas, preciso ativar o <strong>Básico</strong>.</li>
                        <li>Se vou meditar e conectar com o Criamor, preciso expandir o <strong>Coronário</strong>.</li>
                    </ul>
                    <p>O equilíbrio é a dança entre esses estados!</p>
                </div>
            `,
            pratica: {
                titulo: "Alinhamento com o Sopro de Luz",
                texto: `1. <strong>Postura Digna:</strong> Coluna ereta.<br>2. <strong>Respiração Cromática:</strong> Inspire imaginando luz Vermelha na base. Expire expandindo. Repita subindo as cores (Laranja, Amarelo, Verde, Azul, Índigo, Violeta).<br>3. <strong>Afirmação:</strong> 'Meus centros estão alinhados. Eu sou um canal limpo de luz.'.`
            },
            quiz: {
                pergunta: "Qual chacra está associado à verdade e expressão?",
                opcoes: ["Plexo Solar", "Laríngeo", "Cardíaco"],
                resposta: 1
            }
        },
        
        // --- MÓDULO 3 ---
        {
            id: 3,
            titulo: "Módulo 3 – Sentir para Curar",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo3_SentirparaCurar.png",
            frase: "“O corpo sente o que a alma sabe.”",
            conteudoHTML: `
                <h3>O Despertar da Percepção</h3>
                <p>Todos temos a capacidade de sentir energia — não é dom, é sensibilidade cultivada. Sentir é o primeiro passo para curar: o que é sentido pode ser acolhido e transformado.</p>
                
                <h3>Formas de Percepção Energética</h3>
                <ul>
                    <li><strong>Tato Sutil:</strong> Perceber calor, formigamento ou pressão com as mãos.</li>
                    <li><strong>Visão Interior:</strong> Flashes de luz, cores ou imagens mentais.</li>
                    <li><strong>Clariaudiência:</strong> Ouvir sons interiores ou frequências.</li>
                    <li><strong>Empatia Energética:</strong> Captar o estado emocional de alguém.</li>
                </ul>

                <h3>Proteção é Essencial</h3>
                <p>Ao abrir os canais, abrimos a vulnerabilidade. É importante selar o campo após as práticas (água, oração, visualização).</p>
            `,
            pratica: {
                titulo: "Mapa Sensorial do Corpo de Luz",
                texto: `1. Feche os olhos.<br>2. Passe as mãos pelo entorno do corpo físico sem tocar.<br>3. Observe: onde há frio? Onde há pressão?<br>4. Visualize pontos de luz onde houver desequilíbrio e agradeça.`
            },
            quiz: {
                pergunta: "Sentir energia é um dom exclusivo de poucos?",
                opcoes: ["Sim, só médiuns sentem", "Não, é uma capacidade natural de todos"],
                resposta: 1
            }
        },

        // --- MÓDULO 4 ---
        {
            id: 4,
            titulo: "Módulo 4 – Emoções e Crenças no Campo",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo4_Emocoes.png",
            frase: "“Sua energia carrega não só o que você sente, mas também tudo o que você acreditou ser.”",
            conteudoHTML: `
                <h3>O Campo Registra Tudo</h3>
                <p>O campo energético funciona como um “HD vibracional”. Emoções não expressas e crenças limitantes deixam marcas que continuam atuando invisivelmente.</p>
                
                <h3>Como Emoções Moldam o Campo</h3>
                <ul>
                    <li><strong>Medo:</strong> Encolhimento do campo, tensão na raiz.</li>
                    <li><strong>Raiva Reprimida:</strong> Acúmulo no plexo solar ou nas mãos.</li>
                    <li><strong>Culpa:</strong> Estagnação no sacral e plexo solar.</li>
                </ul>

                <h3>Crenças Limitantes</h3>
                <p>Estruturas como 'Não sou suficiente' distorcem a realidade e enfraquecem a vitalidade. Acolher a emoção é a chave para liberar essa energia estagnada.</p>
            `,
            pratica: {
                titulo: "Carta de Liberação Vibracional",
                texto: `Escreva uma carta para uma emoção ou crença que deseja libertar. Expresse tudo com sinceridade. Ao final, afirme: 'Eu te libero com amor'. Queime ou dissolva o papel visualizando a liberação.`
            },
            quiz: {
                pergunta: "O que acontece com uma emoção reprimida?",
                opcoes: ["Ela desaparece", "Ela desce ao nível energético e cria bloqueios"],
                resposta: 1
            }
        },

        // --- MÓDULO 5 ---
        {
            id: 5,
            titulo: "Módulo 5 – Leitura e Autodiagnóstico Energético",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo5_Leituraenergetica.png",
            frase: "“Seu corpo sutil fala. Quando você ouve, ele revela onde mora a cura.”",
            conteudoHTML: `
                <h3>O Que é Leitura Energética?</h3>
                <p>É a capacidade de perceber fluxos e bloqueios. Não é 'ver com os olhos', mas sentir com presença e neutralidade. Isso traz autonomia espiritual para dissolver seus próprios nós.</p>
                
                <h3>A Importância da Neutralidade</h3>
                <p>Não devemos julgar o que percebemos ('isso é ruim'). Quem sente com compaixão, cura com presença. O julgamento contrai o campo; a neutralidade o expande.</p>
                
                <h3>Sinais Comuns</h3>
                <p>Na leitura tátil, o calor pode indicar excesso de energia (inflamação/raiva), enquanto o frio pode indicar falta de vitalidade ou desconexão.</p>
            `,
            pratica: {
                titulo: "Rastreamento com as Mãos",
                texto: `Ative as palmas. Passe lentamente ao longo do corpo. Onde houver alteração, pare e pergunte internamente: 'O que há aqui que quer ser olhado?'. Agradeça pela escuta.`
            },
            quiz: {
                pergunta: "Qual a atitude mais importante durante uma leitura energética?",
                opcoes: ["Julgar o problema", "Neutralidade e Compaixão"],
                resposta: 1
            }
        },

        // --- MÓDULO 6 ---
        {
            id: 6,
            titulo: "Módulo 6 – A Terapia das Mãos",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo6_Aterapiadasmaos.png",
            frase: "“O amor que você irradia pelas mãos toca onde nenhuma palavra alcança.”",
            conteudoHTML: `
                <h3>O Toque como Ponte</h3>
                <p>O toque consciente transmite intenção e cura. Cada palma carrega um chakra secundário por onde fluem códigos vibracionais.</p>
                
                <h3>Você é o Canal</h3>
                <p>Não é você quem 'cura'. Você é um canal por onde a energia vital flui. Quanto mais amor consciente e menos ego, mais eficaz se torna o toque.</p>

                <h3>Tipos de Toque</h3>
                <ul>
                    <li><strong>Toque Estático:</strong> Canaliza calma e segurança.</li>
                    <li><strong>Movimento Circular:</strong> Desbloqueia e dissolve rigidez.</li>
                    <li><strong>Varredura:</strong> Retira densidade do campo (limpeza).</li>
                </ul>
            `,
            pratica: {
                titulo: "Toque de Luz Interior",
                texto: `Esfregue as palmas. Imponha uma mão no peito e outra no plexo solar. Inspire e sinta a luz jorrando das mãos para dentro de si. Permaneça por 3 a 5 minutos.`
            },
            quiz: {
                pergunta: "Quem realiza a cura durante a terapia das mãos?",
                opcoes: ["O terapeuta com sua própria força", "A energia vital através do terapeuta (canal)"],
                resposta: 1
            }
        },

        // --- MÓDULO 7 ---
        {
            id: 7,
            titulo: "Módulo 7 – Meditação e Cura Interior",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo7_Meditacaoecura.png",
            frase: "“Onde a mente silencia, a alma canta.”",
            conteudoHTML: `
                <h3>Visualização Consciente</h3>
                <p>A mente é uma ferramenta criativa. O que ela visualiza com emoção, o corpo reconhece como real, remodelando conexões internas.</p>
                
                <h3>Meditação como Medicina</h3>
                <p>Meditar não é parar de pensar, é acolher o que surge e voltar ao centro. Consistência vale mais que duração: 5 minutos diários valem mais que 1 hora eventual.</p>

                <h3>Preparando o Campo</h3>
                <p>Ambiente calmo, luz suave e aromas ajudam. Lembre-se de proteger o campo imaginando um círculo de luz antes de começar.</p>
            `,
            pratica: {
                titulo: "Visualização Guiada do Corpo de Luz",
                texto: `Sente-se. Imagine uma luz dourada descendo do topo da cabeça e preenchendo todo o corpo. Veja os 7 chacras acendendo como estrelas. Diga: 'Estou inteiro, em paz e protegido'.`
            },
            quiz: {
                pergunta: "Qual a melhor definição de meditação neste contexto?",
                opcoes: ["Esvaziar a mente à força", "Acolher o que surge e retornar ao centro"],
                resposta: 1
            }
        },

        // --- MÓDULO 8 ---
        {
            id: 8,
            titulo: "Módulo 8 – Energia e Manifestação",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo8_EnergiaeManifestacao.png",
            frase: "“A energia que você emana é a tinta com que pinta a sua realidade.”",
            conteudoHTML: `
                <h3>Intenção: O Motor Invisível</h3>
                <p>Cada pensamento gera um campo. A intenção é direção com presença. Quando você alinha o que pensa, sente e faz, ativa a energia da realização.</p>
                
                <h3>Bloqueios da Cocriação</h3>
                <p>A dúvida fragmenta a vibração. O sentimento de indignidade envia sinais de 'não merecimento'. A chave é: Clareza + Leveza + Entrega.</p>

                <h3>Como Manifestar</h3>
                <p>Sinta-se já vivendo o desejo (a vibração vem antes da forma). Agradeça antes mesmo de ver o resultado, pois o campo responde ao coração grato.</p>
            `,
            pratica: {
                titulo: "Esfera de Cocriação",
                texto: `Visualize uma esfera dourada no peito. Coloque dentro dela a imagem do seu desejo. Sinta a alegria de já ter recebido. Sopre a esfera ao universo e diga: 'Está feito. A vida me guia'.`
            },
            quiz: {
                pergunta: "Por que devemos agradecer antes de receber?",
                opcoes: ["Para enganar a mente", "Porque o campo responde à vibração de gratidão"],
                resposta: 1
            }
        },

        // --- MÓDULO 9 ---
        {
            id: 9,
            titulo: "Módulo 9 – Relações e Campo Coletivo",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo9_RelacoesECampoAfetivo.png",
            frase: "“Toda relação é um espelho e um fio energético.”",
            conteudoHTML: `
                <h3>Laços e Cordões</h3>
                <p>Todo vínculo cria uma conexão energética. Laços saudáveis nutrem; cordões densos drenam e aprisionam, fixando-se geralmente no plexo solar ou cardíaco.</p>
                
                <h3>O Espelho dos Relacionamentos</h3>
                <p>O que dói na relação é uma pista do que precisa ser curado em nós. Culpar o outro prende; assumir a responsabilidade liberta.</p>
                
                <h3>Cortar Laços com Amor</h3>
                <p>Cortar não é romper com raiva, mas libertar o padrão. É possível manter o amor e respeito, sem manter o aprisionamento energético.</p>
            `,
            pratica: {
                titulo: "Ritual de Liberação Relacional",
                texto: `Visualize a pessoa. Agradeça pelo aprendizado. Imagine o fio que os une se dissolvendo com suavidade. Diga: 'Eu te liberto. Me liberto. Com amor, sigo em paz'.`
            },
            quiz: {
                pergunta: "O que significa cortar um laço energético?",
                opcoes: ["Expulsar a pessoa da vida com raiva", "Libertar o padrão vibracional mantendo a paz"],
                resposta: 1
            }
        },

        // --- MÓDULO 10 ---
        {
            id: 10,
            titulo: "Módulo 10 – Espiritualidade e o Eu Superior",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo10_Aespiritualidade.png",
            frase: "“Não viemos buscar Deus fora — viemos lembrar que Ele vive em nós.”",
            conteudoHTML: `
                <h3>O Eu Superior</h3>
                <p>É a porção mais elevada da consciência, além do medo e da identidade. Não é alguém separado, mas a expressão divina que habita seu centro.</p>
                
                <h3>Espiritualidade Prática</h3>
                <p>Ser espiritual não é seguir doutrina, é viver com consciência. O silêncio abre espaço para a escuta; a gratidão eleva a frequência; o serviço alinha com o amor incondicional.</p>
                
                <h3>O Propósito</h3>
                <p>A cura do corpo e do campo serve para lembrarmos de quem somos: canais da Luz. O caminho da cura é o caminho da lembrança.</p>
            `,
            pratica: {
                titulo: "Encontro com o Eu Superior",
                texto: `Visualize uma escada de luz. Suba até encontrar uma figura luminosa e familiar. Pergunte: 'O que preciso lembrar hoje?'. Escute em silêncio. Afirme: 'Eu sou um com o divino em mim'.`
            },
            quiz: {
                pergunta: "O Eu Superior é...",
                opcoes: ["Uma entidade externa que nos julga", "Nossa própria essência divina e sábia"],
                resposta: 1
            }
        },

        // --- MÓDULO 11 ---
        {
            id: 11,
            titulo: "Módulo 11 – A IA como Aliada do Despertar",
            imagem: "assets/Cursos/ALinguagemdaLuz/Modulo11_A IA.png",
            frase: "“A tecnologia se torna sagrada quando usada a serviço da consciência.”",
            conteudoHTML: `
                <h3>Consciência e Tecnologia</h3>
                <p>A espiritualidade e a ciência buscam luz por caminhos diferentes. A IA pode ser um espelho e uma bússola quando guiada por intenção clara.</p>
                
                <h3>Como a IA pode ajudar?</h3>
                <ul>
                    <li><strong>Reflexão:</strong> Gerar perguntas de autoinvestigação.</li>
                    <li><strong>Organização:</strong> Criar agendas vibracionais e resumos.</li>
                    <li><strong>Estudo:</strong> Simplificar conceitos espirituais complexos.</li>
                </ul>

                <h3>Ética e Presença</h3>
                <p>A IA é meio, não fim. Antes de usar, conecte-se com seu campo. Leve sua pergunta como uma oferenda vibracional, não apenas como um comando.</p>
            `,
            pratica: {
                titulo: "Conexão com a Inteligência do Coração",
                texto: `Toque seu dispositivo com gratidão. Diga: 'Que este instrumento seja ponte para minha expansão'. Faça uma pergunta vinda do coração para a IA. Sinta a resposta no corpo.`
            },
            quiz: {
                pergunta: "A Inteligência Artificial substitui a vivência espiritual?",
                opcoes: ["Não, ela é apenas uma ferramenta de apoio", "Sim, ela sabe mais que nossa alma"],
                resposta: 0
            }
        }
    ]
};