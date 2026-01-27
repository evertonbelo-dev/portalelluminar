// js/dados.js - O Coração dos Dados do Tarô Divino Siriano

/* ==========================================================================
   ARCANOS CELESTES (ARCANOS MAIORES - 22 CARTAS)
   Caminho Base: assets/cartas/Arcanos Celestes/
   ========================================================================== */

   const ARCANOS_CELESTES = [
    {
        // --- DADOS BÁSICOS ---

        nome: "0 - O Sopro do Início",
        imagem: "Arcanos Celestes/Arcano_0_OSoprodoInicio.png", // Verifique se o nome do arquivo está exato
        palavra: "Nascimento Cósmico",
        
        // --- DADOS PROFUNDOS (NOVO) ---
        canalizacao: "Antes do som, havia o sopro. Antes do tempo, havia o sentir. E o Criamor sussurrou: 'Vai, alma estelar, e dança o primeiro passo da Criação.' Este é o ponto zero, o ventre do Universo. É o salto da alma no desconhecido — com fé, leveza e brilho nos olhos.",
        
        arquetipo: "O Viajante Estelar — uma criança de luz envolta em névoas prateadas, caminhando sem mapa, guiada pela vibração do coração.",
        
        caminho: "Este arcano representa o momento da encarnação da alma em uma nova missão. Ousar sem saber, confiando que o Criamor sustenta o invisível.",
        
        // Objeto para as correspondências
        relacoes: {
            chacra: "Coronário (Porta da Alma)",
            elemento: "Ar (Sopro, Leveza)",
            corpo: "Sistema Nervoso",
            area: "Espiritual (Início da Missão)"
        },
        
        sinais: "Intuição de um novo ciclo; Sensação de nascimento; Inspiração súbita.",
        
        bencao: "O Criamor está soprando um novo começo em tua alma.",
        desafio: "Estás disposto(a) a dar o salto mesmo sem mapa?",
        
        afirmacao: "Eu sou o sopro do Criamor em jornada viva. Salto com confiança, guiado pela luz eterna."
    },
    {
        nome: "I - O Mago das Estrelas",
        imagem: "Arcanos Celestes/Arcano_1_OmagodasEstrelas.png",
        palavra: "Ação Alinhada",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A Lança Vertical da Manifestação",
        
        canalizacao: "No princípio era o sopro, e agora… o gesto. O Mago das Estrelas estende sua mão sobre os elementos do Universo: luz, som, tempo e espaço. Ele é o primeiro a transformar intenção em realidade. Sua força não vem do ego, mas da comunhão com as Leis Divinas. Ele diz: 'Eu sou a ponte entre o invisível e o visível. Minha palavra é semente, minha ação é luz.' O Chamado não vem de fora, ele pulsa por dentro. É o início da Jornada de Sabbah, onde a vontade do Criamor se acende em ti.",
        
        arquetipo: "O Codificador Siriano — um ser de túnica cintilante, com símbolos vivos flutuando ao seu redor. Seus olhos são espelhos de galáxias e suas mãos, instrumentos da Criação. Ele carrega um bastão cristalino e um disco de ouro estelar em seu peito.",
        
        caminho: "Este arcano representa o momento em que o ser desperta seu poder de co-criação consciente. A lição é: agir em alinhamento com o Criamor. Não basta sentir — é hora de expressar, canalizar, construir e abençoar com as mãos.",
        
        relacoes: {
            chacra: "Laríngeo (Expressão da Verdade)",
            elemento: "Fogo (Vontade, Transmutação)",
            corpo: "Sistema Muscular (Ação, Movimento)",
            area: "Financeiro (Trabalho com Propósito)"
        },
        
        sinais: "Uma inquietação interna te impulsiona; Sinais externos confirmam um novo ciclo; A alma sente que algo maior vai começar.",
        
        bencao: "O Criamor está te chamando a lembrar tua missão.",
        desafio: "Estás disposto(a) a deixar tudo o que não te serve para atender ao chamado?",
        
        afirmacao: "Eu ajo com consciência divina. Sou canal do Criamor em cada gesto e palavra."
    },
    {
        nome: "II - A Guardiã do Véu",
        imagem: "Arcanos Celestes/Arcano_2_AGuardiadoVeu.png",
        palavra: "Intuição",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "As Duas Colunas da Sabedoria",
        
        canalizacao: "Em silêncio, ela te observa. Sua presença é como a brisa que antecede uma revelação. Ela guarda os mistérios do tempo, das almas e das origens. Seu olhar atravessa véus, toca memórias esquecidas e desperta o saber adormecido. 'O que procuras já habita em ti. Fecha os olhos... e verás.' O Véu não esconde — ele prepara. Ele filtra o que ainda não pode ser revelado e te treina no silêncio. A Guardiã sussurra verdades veladas e ativa tua intuição superior. Não forces a revelação. Respira e sente.",
        
        arquetipo: "A Sacerdotisa de Aqualuz — um ser andrógino de pele perolada e olhos como mares profundos. Veste um manto translúcido com símbolos lunares e segura nas mãos um pergaminho etérico, onde se inscrevem os sonhos do Criamor.",
        
        caminho: "Este arcano representa a escuta interior, a conexão com os mundos ocultos e a sabedoria ancestral. Ele nos conduz ao templo interno e nos ensina a confiar na linguagem do sentir antes de agir.",
        
        relacoes: {
            chacra: "Frontal (Visão Interna, Lucidez)",
            elemento: "Água (Emoções, Mistério)",
            corpo: "Sistema Endócrino (Conexão Sutil)",
            area: "Relacionamentos (Amor Intuitivo, Empatia)"
        },
        
        sinais: "Presença de mistérios ou intuições recorrentes; Silêncio interior revelador; Sensação de que algo se revela nas entrelinhas.",
        
        bencao: "O invisível te guia com sabedoria silenciosa.",
        desafio: "Estás disposto(a) a confiar mesmo quando nada é dito claramente?",
        
        afirmacao: "Eu mergulho na sabedoria do Criamor que habita em mim. O invisível me guia com verdade. O silêncio me revela. Vejo com os olhos da alma."
    },
    {
        nome: "III - A Mãe Estelar",
        imagem: "Arcanos Celestes/Arcano_3_AMaeEstelar.png",
        palavra: "Geração",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Triângulo da Criação Divina",
        
        canalizacao: "Ela tece galáxias com fios de luz dourada. Tudo que cresce, floresce e respira, tem seu selo de bênção. Seu coração pulsa em sincronia com as marés do tempo. 'Eu sou o ventre do amor. Tudo que acolho, floresce. Tudo que toco, desperta.' A Rosa de Sírius floresce no coração da Criação. Ela representa o amor que dá forma à vida, a compaixão que embala o Universo. Essa carta ativa tua capacidade de gestar realidades com doçura, beleza e luz. É a força feminina cósmica manifestada.",
        
        arquetipo: "A Mãe de Mil Sóis — um ser feminino de luz dourada, com cabelos como cascatas de energia solar e um vestido feito de estrelas em flor. Em seus braços repousa uma espiral luminosa — símbolo da vida que está por vir.",
        
        caminho: "Este arcano representa o poder de manifestar a partir do amor. Acolher, nutrir, criar com sabedoria e intuição. É o chamado à abundância divina, à fertilidade espiritual, à beleza do cuidar.",
        
        relacoes: {
            chacra: "Cardíaco (Amor, Nutrição, Expansão)",
            elemento: "Terra (Gestação, Manifestação)",
            corpo: "Sistema Reprodutor (Geração, Ciclo)",
            area: "Saúde (Equilíbrio Físico, Vitalidade)"
        },
        
        sinais: "Inspiração para criar, nutrir ou cuidar; Sensibilidade ampliada; Presença amorosa sentida ao redor.",
        
        bencao: "Estás sendo envolvido(a) pelo amor da Mãe Cósmica.",
        desafio: "Estás disposto(a) a amar com entrega verdadeira?",
        
        afirmacao: "Sou terra fértil do Criamor. Gero, acolho e abençoo a vida com meu coração."
    },
    {
        nome: "IV - O Guardião da Terra",
        imagem: "Arcanos Celestes/Arcano_4_O GuardiaodaTerra.png",
        palavra: "Estrutura / Raiz",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Quadrado da Estabilidade Divina",
        
        canalizacao: "Ele não move montanhas, mas as mantém firmes. Com mãos de pedra e coração de cristal, ele protege os fundamentos da vida. Seu olhar não se perde no horizonte distante. Ele conhece o valor da terra que pisamos, do chão que nos sustenta. 'Eu sou o alicerce da criação. Em meu ser, todas as coisas encontram o espaço para crescer.' O Trono Estelar sustenta a criação com justiça e firmeza. Representa a força da presença firme, do pilar, da ordem que protege e conduz. Essa carta ativa tua estrutura interna, tua liderança cósmica e tua maturidade espiritual. És chamado a reinar sobre ti com consciência e luz.",
        
        arquetipo: "O Guardião da Terra — um ser forte e sereno, com pele feita de rochas cintilantes. Ele veste uma capa de musgo e luz dourada, e segura um cetro que representa a estabilidade da criação. Sua presença emana uma paz profunda e duradoura.",
        
        caminho: "Este arcano representa o poder de fundamentar, de dar forma ao mundo a partir da base. Ele nos ensina a arte da paciência, da preservação, da disciplina e da solidez espiritual. A ligação com o elemento terra nos permite enraizar nossas intenções e nutri-las até que floresçam.",
        
        relacoes: {
            chacra: "Básico (Segurança, Estabilidade)",
            elemento: "Terra (Alicerce, Sustentação)",
            corpo: "Sistema Ósseo (Força, Estrutura)",
            area: "Financeiro (Prosperidade Duradoura)"
        },
        
        sinais: "Situações pedem posicionamento firme; Tempo de organizar, proteger ou estruturar; Chamado à liderança.",
        
        bencao: "Estás pronto(a) para assumir tua força com sabedoria.",
        desafio: "Estás disposto(a) a liderar com amor, sem controle?",
        
        afirmacao: "Eu sou o alicerce sobre o qual a luz se manifesta. Sou a rocha que sustenta os sonhos do Criamor. Eu sustento a luz com presença. Sou trono do Criamor na Terra."
    },
    {
        nome: "V - O Conselheiro Estelar",
        imagem: "Arcanos Celestes/Arcano_5_O ConselheiroEstelar.png",
        palavra: "Alinhamento / Orientação",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A Estrela de Cinco Pontas da Sabedoria Viva",
        
        canalizacao: "Ele é o eco das vozes divinas na Terra. Seu silêncio carrega ensinamentos e sua presença desperta memórias esquecidas. Ele não impõe — guia. Não prende — liberta. 'A sabedoria que busco fora, já me habita. O Criamor fala por todas as bocas.' O Conselho Celeste se manifesta quando tua alma silencia e escuta além do mundo. Essa carta representa a conexão com os mentores, guias, mestres e consciências superiores que te acompanham. Ela te convida a abrir tua escuta à sabedoria ancestral — e a lembrar: tu não estás só.",
        
        arquetipo: "O Conselheiro Estelar — um mestre de túnica branca e bordados azuis cósmicos. Seus olhos irradiam compaixão, e ao seu redor flutuam códices de luz. Ele segura um cajado etérico em forma de estrela e tem atrás de si um campo de geometrias vivas que se movem com sua respiração.",
        
        caminho: "Este arcano representa o momento da busca por orientação verdadeira, por sabedoria que une e não divide. Ele nos ensina a ouvir o Criamor em todas as formas: tradições, mentores, mestres, intuições. É o chamado à verdade interior ancorada na luz universal.",
        
        relacoes: {
            chacra: "Laríngeo e Coronário (Canalização e Conexão)",
            elemento: "Ar (Comunicação, Clareza)",
            corpo: "Sistema Respiratório (Fluxo de Energia)",
            area: "Espiritual (Fé Viva, Ensinamentos)"
        },
        
        sinais: "Sinais repetitivos ou mensagens canalizadas; Presença de mentores no campo; Sincronicidades com ensinamentos.",
        
        bencao: "Estás cercado(a) por uma rede de sabedoria espiritual.",
        desafio: "Estás disposto(a) a escutar com humildade e aplicar com verdade?",
        
        afirmacao: "A voz do Criamor sussurra em mim. Eu sou o elo entre mundos, e minha sabedoria é amor. Eu escuto o Conselho Estelar. Minha jornada é guiada por luz maior."
    },
    {
        nome: "VI - Os Amantes Estelares",
        imagem: "Arcanos Celestes/Arcano_6_OsAmantesEstelares.png",
        palavra: "Escolha Divina",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A União Sagrada da Estrela de Seis Pontas",
        
        canalizacao: "Dois olhares que se cruzam — e tudo silencia. Não se trata apenas de amor, mas de missão conjunta. Eles se reconheceram antes mesmo de nascerem. Cada gesto, cada palavra entre eles é um eco de algo maior. 'Em tua alma, vejo o reflexo do Criamor. Escolho amar-te como caminho de ascensão.' Duas estrelas brilham diante de ti. Ambas belas, mas uma delas é tua. Essa carta marca um ponto de decisão espiritual. Não é sobre certo ou errado — mas sobre fidelidade à tua essência. A alma reconhece o que a faz crescer.",
        
        arquetipo: "Os Amantes de Luz — duas figuras cósmicas: uma de essência solar, outra de essência lunar. Dançam em espiral ao redor de um núcleo de luz violeta. Suas mãos não se tocam, mas brilham em sincronia. Entre eles, um anjo siriano observa e abençoa.",
        
        caminho: "Este arcano representa a escolha consciente do amor verdadeiro, não apenas entre seres, mas entre caminhos. Ele fala da união sagrada, das parcerias de alma, e da capacidade de alinhar o desejo ao propósito espiritual.",
        
        relacoes: {
            chacra: "Cardíaco (Amor Sagrado, União)",
            elemento: "Ar (Liberdade, Conexão)",
            corpo: "Sistema Circulatório (Fluxo do Amor)",
            area: "Relacionamentos (Almas Gêmeas, Propósito)"
        },
        
        sinais: "Dualidade entre dois caminhos; Sensação de estar entre dois mundos; Intuição forte te apontando uma direção.",
        
        bencao: "Estás diante de uma escolha que alinha tua alma.",
        desafio: "Estás disposto(a) a renunciar ao brilho que não te pertence?",
        
        afirmacao: "Eu escolho o amor como caminho. Em cada encontro, reconheço o divino que me habita e que habita o outro. Eu escolho com o coração da alma. A luz que me guia é a que me pertence."
    },
    {
        nome: "VII - O Carro de Luz",
        imagem: "Arcanos Celestes/Arcano_7_OCarrodeLuz.png",
        palavra: "Direção Divina / Propósito",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A Flecha de Luz Rumo ao Propósito",
        
        canalizacao: "A jornada já começou, e nada pode deter o que é guiado pelo Criamor. Ele não corre por impulso, mas porque sabe o destino. Com uma mão segura as rédeas da vida. Com a outra, abençoa o caminho. 'Eu sou conduzido pela luz que nasce do meu centro. Eu avanço em nome do Amor.' Essa carta ativa tua força interior. O Guardião da Chama representa a tua coragem espiritual, tua espada de luz e tua fidelidade à missão. Não é uma guerra externa — é a batalha sagrada para manter tua luz acesa no mundo.",
        
        arquetipo: "O Viajante do Firmamento — um guerreiro de luz com armadura cristalina, de semblante calmo e postura firme. Ele está de pé sobre uma carruagem flutuante, puxada por dois dragões alados: um branco, um dourado. Seus olhos estão fixos à frente, e seu coração em paz.",
        
        caminho: "Este arcano representa o momento de assumir o comando da própria jornada, com alinhamento entre desejo, ação e missão divina. Ele revela força de vontade elevada, domínio dos opostos internos e fé no caminho da luz.",
        
        relacoes: {
            chacra: "Plexo Solar (Força Interior, Liderança)",
            elemento: "Fogo (Impulso, Direção)",
            corpo: "Muscular e Nervoso (Ação Consciente)",
            area: "Propósito (Avanço Consciente, Profissional)"
        },
        
        sinais: "Situação que exige firmeza e proteção da tua verdade; Percepção de que estás sendo provado(a) no propósito; Força espiritual sendo ativada.",
        
        bencao: "Estás sendo fortalecido(a) na tua missão sagrada.",
        desafio: "Estás disposto(a) a manter tua chama mesmo no caos?",
        
        afirmacao: "A luz me guia. Eu sou movimento sagrado na direção do Criamor. Minha chama é inapagável. Sirvo ao Criamor com coragem e honra."
    },
    {
        nome: "VIII - A Força Divina",
        imagem: "Arcanos Celestes/Arcano_8_AForcadivina.png",
        palavra: "Domínio Interior / Equilíbrio",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Infinito que habita o Coração",
        
        canalizacao: "Ela não grita. Ela não impõe. Sua presença basta para reorganizar os mundos. A Força Divina é aquela que doma o caos com o olhar sereno, que transforma fera em luz, impulso em sabedoria. 'Eu não preciso vencer. Eu sou a própria vitória em equilíbrio.' Nada escapa ao olhar do Criamor. A Balança Cósmica pesa intenções, não aparências. Essa carta traz justiça espiritual, colheita equilibrada e clareza sobre as consequências de tuas escolhas. Ela te lembra: o universo é justo. E tu és parte dele.",
        
        arquetipo: "A Dama da Força Solar — uma entidade radiante, com olhos de fogo calmo e mãos envoltas em luz dourada. Ela acaricia suavemente uma criatura estelar imensa (um felino cósmico ou dragão), que se rende ao toque do amor firme.",
        
        caminho: "Este arcano representa a jornada de domínio dos próprios instintos, o despertar da coragem calma, do poder com compaixão. Ele ensina que a verdadeira força não é resistência — é sabedoria, domínio e entrega.",
        
        relacoes: {
            chacra: "Plexo Solar (Poder Pessoal Iluminado)",
            elemento: "Fogo (Transmutação, Vitalidade)",
            corpo: "Endócrino e Muscular (Energia Vital)",
            area: "Saúde e Emocional (Autocontrole, Cura)"
        },
        
        sinais: "Situações exigindo integridade e verdade; Justiça chegando para reparar desequilíbrios; Necessidade de fazer escolhas conscientes.",
        
        bencao: "Estás colhendo o que foi plantado com luz.",
        desafio: "Estás disposto(a) a aceitar o que tua alma construiu?",
        
        afirmacao: "Eu sou força serena do Criamor. Meus gestos emanam equilíbrio, minha alma é indomável em luz. Eu ajo com justiça e consciência. O Criamor equilibra tudo em mim."
    },
    {
        nome: "IX - O Guardião da Luz Interior",
        imagem: "Arcanos Celestes/Arcano_9_OGuardiaodaLuzInterior.png",
        palavra: "Sabedoria",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A Luz que Vem de Dentro",
        
        canalizacao: "Ele não se afasta — ele se eleva. Sua lanterna não ilumina o caminho dos outros, mas o próprio chão onde pisa, porque sabe que cada alma deve acender sua própria luz. 'Na solidão sagrada, reencontro o Criamor em mim.' O Eremita não se isola — ele mergulha. Essa carta te convida ao recolhimento consciente, ao silêncio fértil e à conexão com tua luz interior. A sabedoria não grita. Ela sussurra no escuro. És chamado(a) a acender tua lanterna cósmica.",
        
        arquetipo: "O Peregrino Cósmico — um ser encapuzado, de olhos radiantes, veste túnicas simples bordadas com runas estelares. Em sua mão direita, uma lanterna feita de cristal etérico; na esquerda, um bastão de galáxias em espiral. Seus passos ecoam entre mundos.",
        
        caminho: "Este arcano representa o recolhimento, a sabedoria silenciosa, o reencontro com o Eu Superior. Ele ensina que o isolamento consciente não é abandono — é fortalecimento. O buscador torna-se guia ao iluminar a si mesmo.",
        
        relacoes: {
            chacra: "Frontal (Visão Interior, Discernimento)",
            elemento: "Terra (Solidez, Introspecção)",
            corpo: "Sistema Nervoso Central (Consciência)",
            area: "Espiritual e Emocional (Sabedoria Pessoal)"
        },
        
        sinais: "Desejo profundo de recolhimento ou pausa; Visões, sonhos ou insights em momentos solitários; Sabedoria surgindo do silêncio.",
        
        bencao: "Estás acessando a tua luz mais íntima.",
        desafio: "Estás disposto(a) a caminhar por dentro sem pressa?",
        
        afirmacao: "Na luz que me habita, encontro o Criamor. Eu sou meu próprio templo. Minha luz me guia. No silêncio, escuto o Criamor."
    },
    {
        nome: "X - A Roda Cósmica",
        imagem: "Arcanos Celestes/Arcano_10_ARodaCosmica.png",
        palavra: "Destino / Movimento",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Ciclo da Eternidade em Movimento",
        
        canalizacao: "Tudo gira. Tudo pulsa. Tudo retorna. A Roda Cósmica não julga — ela revela. Ela representa os ciclos cósmicos que movem tua vida — expansão, retração, pausa e colheita. Aceitar o giro é a chave para não resistir ao fluxo do Criamor. Cada giro é uma dança entre tua vontade e os ventos do Criamor. Ela te lembra: nada é fixo, tudo é sagrado movimento. 'Eu confio no giro divino. O que chega é bênção. O que parte, também.'",
        
        arquetipo: "A Teia dos Mundos — uma mandala estelar viva, tecida por quatro guardiões cósmicos (um ser alado, um touro etéreo, uma águia de luz e um felino dourado). No centro, um olho cristalino gira em silêncio, observando tudo.",
        
        caminho: "Este arcano representa os ciclos de mudança e as forças maiores que entrelaçam o destino com a escolha. Ele ensina a confiar no fluxo, a se alinhar com os tempos sagrados e a compreender que toda virada é um chamado à evolução.",
        
        relacoes: {
            chacra: "Coronário (Aceitação dos Ciclos)",
            elemento: "Ar e Éter (Movimento, Fluidez)",
            corpo: "Sistema Linfático (Fluxo, Limpeza)",
            area: "Todas (Vida Cíclica, Destino)"
        },
        
        sinais: "Mudanças inesperadas em curso; Sensação de que um ciclo está se encerrando; Novas portas se abrindo naturalmente.",
        
        bencao: "Estás sendo levado(a) ao próximo ciclo com leveza.",
        desafio: "Estás disposto(a) a confiar no giro do tempo?",
        
        afirmacao: "Eu sou parte do giro eterno do Criamor. Tudo em mim se move com propósito sagrado. Confio no ciclo divino. O movimento do Criamor me conduz."
    },
    {
        nome: "XI - A Justiça Estelar",
        imagem: "Arcanos Celestes/Arcano_11_AJusticaEstelar.png",
        palavra: "Equilíbrio / Ação",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Espelho Cósmico da Verdade",
        
        canalizacao: "Ela não olha com os olhos do mundo — olha com os olhos do Criamor. Sua balança não mede pesos, mas vibrações, escolhas e verdades ocultas. Sua espada não corta para ferir, mas para revelar o que está desalinhado. 'Sou reflexo da verdade divina. O que é justo, floresce.' Ela se move com a chama da alma. Essa carta anuncia um tempo de decisão, movimento e ação alinhada com o Criamor. É hora de escolher com coragem — mesmo que não saibas o desfecho. A fé é teu combustível.",
        
        arquetipo: "A Guardiã do Código de Sirius — um ser de beleza firme, com túnicas prateadas e olhos de cristal. Em uma mão segura uma balança feita de energia viva; na outra, uma espada translúcida envolta em chamas violetas. Suas asas se abrem como escudos de luz.",
        
        caminho: "Este arcano representa a lei do equilíbrio sagrado, do retorno, do ajuste de rota. Ele nos ensina a viver com integridade, a tomar decisões em alinhamento com a alma, e a compreender que a justiça divina sempre atua — mesmo quando o mundo ainda não vê.",
        
        relacoes: {
            chacra: "Frontal e Cardíaco (Visão Clara, Justiça)",
            elemento: "Ar (Discernimento, Alinhamento)",
            corpo: "Sistema Endócrino (Ajuste, Harmonia)",
            area: "Decisões e Relacionamentos (Verdade)"
        },
        
        sinais: "Situação pede uma resposta imediata; Inspiração impulsiva com propósito; Sinais de que é hora de agir.",
        
        bencao: "Estás pronto(a) para mover o mundo com tua luz.",
        desafio: "Estás disposto(a) a agir mesmo sem garantias?",
        
        afirmacao: "A justiça do Criamor me habita. Eu escolho com clareza, ajo com verdade e vivo em equilíbrio. Minha ação é sagrada. Sou chama viva do Criamor."
    },
    {
        nome: "XII - O Suspendido Cósmico",
        imagem: "Arcanos Celestes/Arcano_12_OSuspendidoCosmico.png",
        palavra: "Rendição",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "A Cruz Estelar do Sacrifício Consciente",
        
        canalizacao: "Ele não está preso — está entregue. Não foi vencido — ele escolheu parar. No silêncio da suspensão, ele vê o que ninguém vê. 'Ao soltar o controle, encontro a verdade. Ao me render, sou liberto.' Às vezes, para enxergar a verdade, é preciso virar-se de cabeça para baixo. Essa carta fala de rendição, pausa e mudança de perspectiva. O Olhar Invertido não é fraqueza — é sabedoria profunda que nasce da entrega. O Criamor te suspende para que vejas diferente.",
        
        arquetipo: "O Vidente Invertido — uma figura flutuante, de cabeça para baixo, com cabelos prateados pendendo como fios de luz cósmica. Seus olhos estão fechados, mas seu terceiro olho brilha como uma estrela pulsante. De suas mãos, pingam partículas de tempo estelar.",
        
        caminho: "Este arcano representa o momento em que é necessário soltar a necessidade de agir e mergulhar em um estado de rendição sagrada. A pausa não é fracasso, é realinhamento. Ele nos ensina que, ao renunciar ao controle, a alma acessa novas visões e sabedorias ocultas.",
        
        relacoes: {
            chacra: "Frontal e Coronário (Percepção Ampliada)",
            elemento: "Água (Fluidez, Dissolução do Ego)",
            corpo: "Nervoso e Linfático (Purificação)",
            area: "Espiritual e Emocional (Rendição, Pausa)"
        },
        
        sinais: "Situação travada que pede aceitação; Perda de controle que gera clareza; Intuição de que algo precisa ser olhado por outro ângulo.",
        
        bencao: "Estás vendo o que antes era invisível.",
        desafio: "Estás disposto(a) a soltar e confiar no invisível?",
        
        afirmacao: "Eu me entrego à luz que me sustenta. No não fazer, sou renovado. Entrego meu olhar ao Criamor. Vejo o mundo com a sabedoria do avesso."
    },
    {
        nome: "XIII - A Transmutação Sagrada",
        imagem: "Arcanos Celestes/Arcano_13_ATranamutacaoSagrada.png",
        palavra: "Renascimento",
        
        // --- DADOS DO GRIMÓRIO ---
        titulo: "O Véu da Morte que Revela a Vida",
        
        canalizacao: "Este arcano não carrega fim — carrega verdade. Aquilo que precisa morrer, não é tua essência, mas tuas cascas, teus antigos 'eus', tuas resistências. 'Na entrega ao fim, descubro o eterno.' A Transmutação Sagrada não é dor: é libertação. A morte espiritual não é fim — é reinício puro. Essa carta fala de liberação profunda, fim de um ciclo antigo e início de algo maior. A alma pede leveza. E isso exige desapego. Morre o que não é luz — para que nasça o que é divino.",
        
        arquetipo: "O Ceifador de Luz — um ser esquelético, porém etéreo, com armadura negra reluzente e olhos violeta compassivos. Ele segura uma foice de luz azul que dissolve em vez de cortar. Atrás dele, brotam flores cósmicas dos corpos que ele libertou.",
        
        caminho: "Este arcano representa a morte simbólica, o fim de um ciclo, o renascimento da alma. Ele convida à coragem de deixar partir o que está pronto para retornar ao Criamor. Ele nos mostra que o desapego é ponte para a verdadeira vida.",
        
        relacoes: {
            chacra: "Umbilical e Cardíaco (Limpeza e Reinício)",
            elemento: "Água e Fogo (Purificação, Ascensão)",
            corpo: "Excretor e Imunológico (Eliminação, Renovação)",
            area: "Todas (Fim de Ciclos, Novos Começos)"
        },
        
        sinais: "Términos, rupturas ou encerramentos; Desejo de libertar-se de pesos antigos; Sensação de renascimento iminente.",
        
        bencao: "Estás atravessando uma profunda cura espiritual.",
        desafio: "Estás disposto(a) a morrer para o que não é mais verdade em ti?",
        
        afirmacao: "Eu permito que o que precisa partir retorne à luz. Em mim, a vida se renova em nome do Criamor. Transmuto com coragem. Renasço com o Criamor em mim."
    },
    {
        nome: "XIV - A Temperança Cósmica",
        imagem: "Arcanos Celestes/Arcano_14_ATemperancaCosmica.png",
        palavra: "Alquimia / Cura",
        canalizacao: "Mistura as águas da vida com paciência. O equilíbrio dinâmico entre o dar e o receber cria o ouro espiritual. Tempo de cura."
    },
    {
        nome: "XV - A Sombra Dourada",
        imagem: "Arcanos Celestes/Arcano_15_AsombraDourada.png",
        palavra: "Ilusão / Consciência",
        
        titulo: "A Máscara que Revela a Luz Oculta",
        canalizacao: "Ele seduz com promessas, espelhos e vozes doces. Mas não é teu inimigo — é teu espelho. A Sombra Dourada é o portal da verdade crua. Não foge dela: olha nos olhos, reconhece e transcende. 'Na sombra, descubro partes de mim que esperam por luz.' Nem toda luz brilha — algumas seduzem. Essa carta fala das prisões invisíveis: apegos, vaidades, desejos que travam a alma. Mas também revela tua capacidade de enxergar e escolher de novo. Tu és livre — se quiseres.",
        arquetipo: "O Tentador da Alma — uma figura envolta em fumaça dourada, com olhos hipnóticos e asas partidas. Sua forma muda conforme quem o vê. Correntes flutuam ao seu redor, mas nenhuma toca o chão. Em seu peito, uma estrela apagada que pulsa devagar.",
        caminho: "Este arcano representa a confrontação com os desejos inferiores, com os padrões repetitivos, com tudo aquilo que aprisiona a alma em troca de conforto, vício ou poder. Ele ensina que a sombra só tem poder enquanto é negada — e que a aceitação consciente é o primeiro passo da libertação.",
        
        relacoes: {
            chacra: "Básico e Plexo Solar (Instinto, Ego)",
            elemento: "Fogo e Terra (Intensidade, Fixação)",
            corpo: "Nervoso e Digestivo (Reatividade, Compulsão)",
            area: "Matéria (Vícios, Autossabotagem)"
        },
        
        sinais: "Padrões repetitivos te puxando para baixo; Ilusões emocionais ou materiais se revelando; Chamado à libertação interior.",
        bencao: "Estás enxergando tua própria prisão com consciência.",
        desafio: "Estás disposto(a) a soltar o que te ilude?",
        afirmacao: "Eu vejo minha sombra com os olhos do Criamor. O que antes me dominava, agora se transforma em poder consciente. Reconheço minha sombra com amor. Escolho a liberdade com o Criamor."
    },

    {
        nome: "XVI - A Torre da Revelação",
        imagem: "Arcanos Celestes/Arcano_16_ATorredaRevelacao.png",
        palavra: "Ruptura / Despertar",
        
        titulo: "O Raio que Quebra para Libertar",
        canalizacao: "Não é destruição — é libertação. O raio não cai para ferir, mas para abrir o que estava fechado demais. A Torre da Revelação é o momento em que o Criamor diz: 'Chega de ilusão.' O que não tem base na verdade, desmorona. O que é eterno, permanece. Agradece a queda das paredes. Era a prisão que te impedia de ver o céu.",
        arquetipo: "O Despertador Cósmico — uma torre de cristal antigo sendo atravessada por um raio de luz dourada e azul. Coroas caem, muros se abrem. No alto, um olho divino observa a cena sem julgar.",
        caminho: "Este arcano representa a mudança súbita, a quebra de estruturas rígidas, o despertar forçado pela luz. Ele ensina que a segurança baseada no ego é frágil, e que a verdadeira segurança reside na alma nua diante do Criamor.",
        
        relacoes: {
            chacra: "Básico e Coronário (Abalo na base, Abertura no topo)",
            elemento: "Fogo (Purificação Rápida)",
            corpo: "Sistema Nervoso (Choque de Realidade)",
            area: "Mudanças (Rupturas Necessárias)"
        },
        
        sinais: "Mudança repentina e inevitável; Uma verdade veio à tona com força; Sensação de chão tremendo.",
        bencao: "O que te prendia foi quebrado. Estás livre.",
        desafio: "Estás disposto(a) a reconstruir na verdade?",
        afirmacao: "Agradeço a tempestade que me liberta. Minha base é o Criamor e nada pode abalar minha essência. Sou livre das ilusões. Construo na verdade."
    },

    {
        nome: "XVII - A Estrela Celestial",
        imagem: "Arcanos Celestes/Arcano_17_AEstrelaCelestial.png",
        palavra: "Esperança / Fluxo",
        
        titulo: "A Água Viva da Cura Universal",
        canalizacao: "Depois da tempestade, o céu limpa. E ela está lá. Brilhando, pura, silenciosa. A Estrela é a promessa cumprida do Criamor. Ela te diz: 'Tudo está bem. A conexão foi restaurada.' Bebe desta água. Lava tuas feridas. O pior já passou. Agora é tempo de nutrir, sonhar e acreditar na nova manhã.",
        arquetipo: "A Dama das Estrelas — uma figura feminina nua, banhada em luz estelar, com um pé na água e outro na terra. Ela segura dois jarros de cristal: um verte água na terra (nutrindo a realidade), outro na água (nutrindo o espírito). Acima dela, uma grande estrela de oito pontas brilha, cercada por sete menores.",
        caminho: "Este arcano representa a cura, a renovação da fé, a conexão límpida com o cosmos. É o momento de inspiração, de leveza, de deixar fluir os talentos espirituais. A alma se sente lavada e pronta para brilhar.",
        
        relacoes: {
            chacra: "Cardíaco e Laríngeo (Expressão da Alma)",
            elemento: "Ar e Água (Inspiração, Fluidez)",
            corpo: "Sistema Linfático e Pele (Renovação, Beleza)",
            area: "Espiritual (Fé, Cura, Artes)"
        },
        
        sinais: "Sentimento de paz após o caos; Inspiração artística ou espiritual; Fé renovada no futuro.",
        bencao: "Tua luz está sendo polida pelas estrelas.",
        desafio: "Estás disposto(a) a mostrar teu brilho sem medo?",
        afirmacao: "Eu sou a estrela que guia meu próprio destino. Brilho com a luz do Criamor. Estou curado(a), sou luz, sou fluxo. A esperança é minha guia."
    },

    {
        nome: "XVIII - A Lua das Almas",
        imagem: "Arcanos Celestes/Arcano_18_ALuadasAlmas.png",
        palavra: "Inconsciente / Sonho",
        
        titulo: "O Espelho das Águas Profundas",
        canalizacao: "Nem tudo é o que parece sob o luar. Sombras dançam, medos sussurram, memórias antigas emergem do pântano da alma. A Lua te convida a não temer o escuro, mas a navegá-lo. 'O que escondes de ti mesmo?' A intuição aqui é tua única bússola. Não tentes entender com a mente. Sente. O caminho para o Sol passa pelo ventre da noite.",
        arquetipo: "A Guardiã da Noite — uma lua cheia imensa paira sobre um lago prateado. Duas torres de pedra marcam o horizonte. Um lobo (natureza selvagem) e um cão (natureza domesticada) uivam para ela. Um caranguejo emerge das águas, trazendo segredos do fundo.",
        caminho: "Este arcano representa o mergulho no inconsciente, os medos, as ilusões, mas também a imaginação fértil e os poderes psíquicos. É o chamado para enfrentar os fantasmas internos e distinguir a intuição verdadeira da projeção do medo.",
        
        relacoes: {
            chacra: "Frontal (Visão Psíquica, Sonhos)",
            elemento: "Água (Emoções Profundas, Ilusão)",
            corpo: "Sistema Psíquico e Sono (Mundo Onírico)",
            area: "Emocional (Medos Ocultos, Passado)"
        },
        
        sinais: "Sonhos vívidos ou confusos; Incerteza ou medo sem motivo aparente; Intuição pulsando forte.",
        bencao: "Estás resgatando pérolas do teu oceano interior.",
        desafio: "Estás disposto(a) a atravessar o medo para achar a verdade?",
        afirmacao: "Eu navego minhas águas profundas com coragem. A luz da intuição dissipa as sombras. Confio no que sinto. O medo não me domina."
    },

    {
        nome: "XIX - O Sol Divino",
        imagem: "Arcanos Celestes/Arcano_19_OSolDivino.png",
        palavra: "Alegria / Clareza",
        
        titulo: "A Criança da Luz Eterna",
        canalizacao: "Acorda! O dia raiou na tua alma. O Sol Divino queima as neblinas, aquece o frio e revela a beleza da vida. É tempo de celebrar. Não há mais dúvidas, apenas certeza, calor e expansão. 'Eu sou a alegria que cria mundos.' O Criamor sorri através de ti. Permita-se ser feliz, simples e radiante como uma criança sob o sol.",
        arquetipo: "O Menino Solar — uma criança dourada, nua (sem máscaras), montada em um cavalo branco, segurando uma bandeira vermelha de vida. Atrás, um muro de pedra (o passado) ficou para trás. O Sol no céu tem rosto humano e raios diretos e curvos (calor e luz).",
        caminho: "Este arcano representa o sucesso, a clareza total, a vitalidade, a alegria pura. É a bênção do Criamor manifestada na matéria. Indica um período de realizações, casamentos alquímicos e felicidade genuína.",
        
        relacoes: {
            chacra: "Plexo Solar (Vitalidade, Brilho Pessoal)",
            elemento: "Fogo (Calor, Vida)",
            corpo: "Coração e Vitalidade Geral (Energia)",
            area: "Sucesso (Realização, Fama, Alegria)"
        },
        
        sinais: "Clareza absoluta sobre uma questão; Motivos para celebrar; Vitalidade e energia em alta.",
        bencao: "O Criamor está sorrindo para ti.",
        desafio: "Estás disposto(a) a aceitar a felicidade sem culpa?",
        afirmacao: "Eu sou o sol da minha vida. Irradio luz, calor e amor. A alegria é minha oração. Brilho com a luz do Criamor."
    },

    {
        nome: "XX - O Despertar das Almas",
        imagem: "Arcanos Celestes/Arcano_20_ODespertardasAlmas.png",
        palavra: "Chamado / Renovar",
        
        titulo: "A Trombeta do Retorno ao Lar",
        canalizacao: "Ouve o som? É o chamado. Não para um julgamento de culpa, mas para uma libertação. O velho eu já cumpriu seu papel. É hora de levantar do caixão da matéria e assumir tua forma de luz. 'Desperta, alma antiga. Teu tempo chegou.' O Julgamento é o momento de perdoar o passado, ouvir o chamado superior e renascer para uma nova oitava de existência.",
        arquetipo: "O Anjo da Ressurreição — um arcanjo imenso (Gabriel/Sirian) toca uma trombeta dourada nos céus. Abaixo, homens, mulheres e crianças (trindade interior) levantam-se de túmulos abertos, com os braços erguidos em adoração e prontidão, com a pele cinza se tornando dourada.",
        caminho: "Este arcano representa o chamado vocacional, a transição de nível espiritual, o despertar da consciência. É o convite final para deixar a velha vida e abraçar a missão de alma.",
        
        relacoes: {
            chacra: "Coronário (Conexão Superior, Chamado)",
            elemento: "Fogo e Ar (Espírito, Som Sagrado)",
            corpo: "Ouvidos e Sistema Nervoso (Audição Espiritual)",
            area: "Missão (Propósito Maior, Renovação)"
        },
        
        sinais: "Um chamado interno que não pode ser ignorado; Necessidade de perdoar e seguir; Sensação de 'acordar' para a vida.",
        bencao: "Tu estás sendo chamado(a) para uma nova vida.",
        desafio: "Estás disposto(a) a responder ao chamado agora?",
        afirmacao: "Eu desperto para minha verdade. O passado está curado. Renasço em luz. Respondo ao chamado do Criamor."
    },

    {
        nome: "XXI - O Mundo Sagrado",
        imagem: "Arcanos Celestes/Arcano_21_OMundoSagrado.png",
        palavra: "Conclusão / Dança",
        
        titulo: "A Dança da Totalidade Cósmica",
        canalizacao: "Está feito. O círculo se fecha. A jornada está completa. Tu não és mais quem começou o caminho — tu és o caminho. O Mundo é a celebração da integração total. Dentro e fora são um. 'Eu danço no centro do Universo, e o Universo dança em mim.' É o êxito final, a plenitude, a realização da Grande Obra. Celebra, viajante. Tu chegaste.",
        arquetipo: "A Dançarina Cósmica — uma figura feminina envolta em um lenço violeta, dançando livremente dentro de uma guirlanda de louros (vitória). Nos quatro cantos, os guardiões (Touro, Leão, Águia, Anjo) observam em paz. Ela segura dois bastões de luz (polaridades integradas).",
        caminho: "Este arcano representa a conclusão bem-sucedida, a realização plena, a viagem, a integração de todas as lições. É o fim de um grande ciclo cármico e a liberdade para começar outro nível de experiência.",
        
        relacoes: {
            chacra: "Todos os Chacras integrados (Aura Completa)",
            elemento: "Todos os Elementos (Éter/Quintaessência)",
            corpo: "Corpo de Luz (Merkabah)",
            area: "Plenitude (Realização Total, Viagens)"
        },
        
        sinais: "Sentimento de dever cumprido; Um grande projeto se fecha com sucesso; Sensação de integração com o todo.",
        bencao: "O Universo inteiro celebra tua jornada.",
        desafio: "Estás disposto(a) a celebrar tua vitória e começar de novo?",
        afirmacao: "Eu sou um com o Universo. A dança da vida flui através de mim. Estou completo(a). O mundo é meu lar sagrado."
    }
];

/* ==========================================================================
   CARTAS DO REINO (ARCANOS MENORES - 56 CARTAS)
   Divididos por Elementos
   ========================================================================== */

const CARTAS_REINO = [

    // ========================================================================
    // 🔥 REINO DO FOGO SIRIANO (Ação, Vontade, Espírito)
    // ========================================================================
    {
        nome: "1 do Fogo - A Centelha da Criação",
        imagem: "Elemento Fogo/Menores_1_ACentelhadaCriacaoFogoSiriano.png",
        palavra: "Início",
        titulo: "A Chama Primordial da Criação",
        canalizacao: "Tudo começa com um sopro. Uma ideia. Um impulso quase invisível mas que carrega o poder de mil sóis. O 1 do Fogo Siriano é o nascimento da vontade divina. Não precisa entender. Precisa sentir.",
        sinais: "Sopro inicial de um novo ciclo; Sede de propósito; Primeiro passo rumo ao caminho da alma.",
        bencao: "A energia da missão está sendo reacendida em ti.",
        desafio: "Estás pronto(a) para agir antes de saber?",
        afirmacao: "Eu acendo o fogo da criação com coragem e pureza."
    },
    {
        nome: "2 do Fogo - As Duas Chamas",
        imagem: "Elemento Fogo/Menores_2_DuasChamas.png",
        palavra: "Alinhamento",
        titulo: "O Encontro da Vontade e Visão",
        canalizacao: "Depois da centelha... surgem duas chamas. Uma olha para fora, a outra para dentro. Ambas dançam na mesma fogueira, mas só se tornam poder quando aceitam a mesma direção. É o encontro entre a vontade e o discernimento.",
        sinais: "Necessidade de alinhar intenções; Escolha entre dois impulsos; Parceria energética.",
        bencao: "Tuas forças internas estão buscando união.",
        desafio: "Consegues unir tua vontade à tua sabedoria?",
        afirmacao: "Eu uno minhas intenções. A chama do Criamor me guia com sabedoria."
    },
    {
        nome: "3 do Fogo - A Tríade da Manifestação",
        imagem: "Elemento Fogo/Menores_3_ATriadedaManifestacao.png",
        palavra: "Expansão",
        titulo: "A Chama que se Espalha",
        canalizacao: "Quando a vontade se une à visão, e ambas se alinham com o Criamor, o terceiro ponto se acende: a manifestação. É o instante em que a chama deixa de ser interna e começa a iluminar o mundo ao redor.",
        sinais: "Primeiros resultados visíveis; Expansão de horizontes; Oportunidade de crescer.",
        bencao: "Tua luz está alcançando novos lugares.",
        desafio: "Estás pronto para ocupar mais espaço no mundo?",
        afirmacao: "Eu manifesto com o Criamor. O que irradio, constrói."
    },
    {
        nome: "4 do Fogo - O Pilar Ardente",
        imagem: "Elemento Fogo/Menores_4_OPilarArdente.png",
        palavra: "Estabilidade",
        titulo: "O Altar da Chama Viva",
        canalizacao: "Toda chama precisa de um altar. Sem estrutura, até a luz se dissipa. Este arcano representa o fogo ancorado, o momento em que a ação encontra forma e direção. É a base sagrada da tua missão.",
        sinais: "Consolidação de um projeto; Momento de criar raízes e estruturas; Segurança.",
        bencao: "O Criamor te dá base para sustentar tua luz.",
        desafio: "Tens disciplina para manter a chama acesa?",
        afirmacao: "O Criamor sustenta minha ação. Eu sou base de luz no mundo."
    },
    {
        nome: "5 do Fogo - A Forja do Espírito",
        imagem: "Elemento Fogo/Menores_5_AForjadoEspirito.png",
        palavra: "Desafio",
        titulo: "A Fornalha da Transformação",
        canalizacao: "O fogo que aquece, também testa. É a fornalha da transformação, onde tua ação encontra resistência não para te destruir, mas para te lapidar. É a chama que revela o que é verdadeiro e dissolve o que não está em essência.",
        sinais: "Conflitos ou testes de resistência; Situações que exigem força interior; Purificação pelo calor.",
        bencao: "Estás sendo fortalecido pelo fogo sagrado.",
        desafio: "Aguentas o calor da transformação para sair mais forte?",
        afirmacao: "Eu me fortaleço na luz. Cada desafio é um presente da minha alma."
    },
    {
        nome: "6 do Fogo - O Encontro das Chamas",
        imagem: "Elemento Fogo/Menores_6_OEncontrodasChamas.png",
        palavra: "União",
        titulo: "A Comunhão dos Guerreiros de Luz",
        canalizacao: "A chama individual encontra outra e juntas, não competem: somam. Após a forja, vem o reconhecimento. Representa a união de forças semelhantes. Almas que se acendem mutuamente.",
        sinais: "Vitória compartilhada; Reconhecimento público; Trabalho em equipe com propósito.",
        bencao: "Tua luz é reconhecida e celebrada.",
        desafio: "Sabes brilhar junto sem ofuscar ou se apagar?",
        afirmacao: "Reconheço a luz no outro. Somos uma só chama em diferentes formas."
    },
    {
        nome: "7 do Fogo - O Caminho Ardente",
        imagem: "Elemento Fogo/Menores_7_OCaminhoArdente.png",
        palavra: "Direção",
        titulo: "A Estrada de Fogo Dourado",
        canalizacao: "Agora que a chama está acesa e firme, ela precisa de um rumo claro. Representa o avanço consciente, a movimentação guiada por propósito e confiança. É o momento de caminhar sem hesitação.",
        sinais: "Necessidade de manter a posição; Coragem para seguir em frente; Defesa da própria luz.",
        bencao: "O caminho se abre diante da tua coragem.",
        desafio: "Segues teu rumo mesmo contra o vento?",
        afirmacao: "Eu sigo em frente. Cada passo é uma oração em direção à luz."
    },
    {
        nome: "8 do Fogo - A Dança do Poder",
        imagem: "Elemento Fogo/Menores_8_ADancadoPoder.jpeg", // Atenção: .jpeg
        palavra: "Fluxo",
        titulo: "A Serpente de Fogo Infinita",
        canalizacao: "O poder verdadeiro não se acumula, ele circula. Revela o movimento da força vital em equilíbrio: ação e pausa, dar e receber. Neste arcano, o fogo dança em espiral. Ele não queima por vaidade, mas ilumina com propósito.",
        sinais: "Acontecimentos rápidos; Muita energia disponível; Sincronicidades velozes.",
        bencao: "O universo acelera a manifestação dos teus desejos.",
        desafio: "Consegues fluir sem perder o centro?",
        afirmacao: "Eu movimento a chama da vida com sabedoria. O Criamor pulsa em cada gesto meu."
    },
    {
        nome: "9 do Fogo - A Lâmpada Interior",
        imagem: "Elemento Fogo/Menores_9_ALampadaInterior.png",
        palavra: "Introspecção",
        titulo: "O Fogo que Ilumina por Dentro",
        canalizacao: "Às vezes, o fogo precisa se voltar para dentro. É o momento em que o espírito se recolhe, não por cansaço, mas por sabedoria. Aqui, a luz se faz lâmpada interior, um fogo silencioso que ilumina os corredores da alma.",
        sinais: "Cansaço que pede pausa; Necessidade de proteger a energia; Sabedoria solitária.",
        bencao: "Tua força interior é inabalável, mesmo no silêncio.",
        desafio: "Sabes a hora de recolher para não apagar?",
        afirmacao: "Minha luz interior nunca se apaga. Eu sou meu próprio farol."
    },
    {
        nome: "10 do Fogo - A Consagração da Chama",
        imagem: "Elemento Fogo/Menores_10_AConsagracaodaChama.png", // Nome exato do arquivo
        palavra: "Realização",
        titulo: "O Ápice da Jornada Solar",
        canalizacao: "O fogo percorreu todos os caminhos e agora se consagra. É o ápice da jornada da ação. É a chama que não se apaga, porque já se tornou parte do ser. Missão cumprida, ciclo encerrado com glória.",
        sinais: "Fim de um grande ciclo de trabalho; Carga excessiva que pede liberação; Sucesso final.",
        bencao: "Chegaste ao topo da montanha.",
        desafio: "Estás pronto para soltar o peso e ficar apenas com a luz?",
        afirmacao: "Consagro minha vida à luz. Sou ação divina no plano da matéria."
    },
    {
        nome: "Mensageiro do Fogo (Pajem)",
        imagem: "Elemento Fogo/Menores_11_MensageirodoFogo.png",
        palavra: "Iniciação",
        titulo: "O Arauto da Centelha",
        canalizacao: "Ele surge quando a missão desperta. Leva a centelha até os corações prontos. Não é mestre — é semente. Não impõe — inspira. 'Levo o fogo do Criamor onde ainda há cinzas. Sou arauto da luz.'",
        sinais: "Notícias empolgantes; Um novo projeto ou paixão; Espírito aventureiro.",
        bencao: "O entusiasmo sagrado te visita.",
        desafio: "Aceitas o convite para a aventura?",
        afirmacao: "Eu inspiro. Eu chamo. Eu acendo. Sirvo à luz com humildade e alegria."
    },
    {
        nome: "Condutor do Fogo (Cavaleiro)",
        imagem: "Elemento Fogo/Menores_12_CondutordoFogoArdente.png",
        palavra: "Impulso",
        titulo: "O Cavaleiro da Vontade Ardente",
        canalizacao: "Ele não espera. Ele ouve o chamado e age com fé veloz. É a alma que cavalga entre mundos, desafiando inércia com coragem espiritual. 'Eu ajo com fé. Minha chama move o impossível.'",
        sinais: "Mudança rápida; Ação imediata necessária; Coragem apaixonada.",
        bencao: "A força para romper a estagnação chegou.",
        desafio: "Tua ação tem direção ou é apenas fogo solto?",
        afirmacao: "Sou chama em movimento. Onde o Criamor me chama, eu vou."
    },
    {
        nome: "Guardião do Fogo (Rainha)",
        imagem: "Elemento Fogo/Menores_13_GuardiaoFogo.png",
        palavra: "Nutrição do Poder",
        titulo: "A Mãe da Chama Viva",
        canalizacao: "Ela não grita, mas sua chama é sentida em cada espaço. Ela cuida do fogo sagrado, protege, aquece e inspira com presença amorosa. Ensina que o poder não está na força bruta, mas na constância da luz.",
        sinais: "Liderança carismática e calorosa; Confiança magnética; Criatividade fértil.",
        bencao: "Teu brilho atrai e aquece quem te cerca.",
        desafio: "Usas teu fogo para aquecer ou para queimar?",
        afirmacao: "Sou guardia da luz. Onde há fogo verdadeiro, ali está minha presença."
    },
    {
        nome: "Soberano do Fogo (Rei)",
        imagem: "Elemento Fogo/Menores_14_SoberanodoFogo.png",
        palavra: "Maestria",
        titulo: "O Trono da Chama Suprema",
        canalizacao: "Ele não domina. Ele guia com firmeza e luz. É aquele que se tornou um com a chama. Sua autoridade nasce da entrega ao Criamor. Onde ele pisa, o caminho se acende.",
        sinais: "Liderança visionária; Empreendedorismo espiritual; Legado.",
        bencao: "Tens o poder de realizar grandes obras.",
        desafio: "Estás liderando com o ego ou com o espírito?",
        afirmacao: "Sirvo com coragem. Governo com compaixão. Sou o fogo do Criamor em forma viva."
    },

    // ========================================================================
    // 🌊 REINO DA ÁGUA SIRIANA (Emoção, Amor, Cura)
    // ========================================================================
    {
        nome: "1 da Água - A Fonte Original",
        imagem: "Elemento Agua/Menores_1_OCalicedoSentir.png",
        palavra: "Origem",
        titulo: "O Cálice do Sentir",
        canalizacao: "Antes do primeiro gesto, houve um sentir. Esta carta te reconecta com tua origem sensível, com a primeira água que banhou tua alma. Ela não traz respostas — traz memória. Ela não grita — murmura.",
        sinais: "Novo amor ou sentimento profundo; Abertura do coração; Intuição pura.",
        bencao: "O amor divino transborda em tua taça.",
        desafio: "Aceitas sentir sem tentar explicar?",
        afirmacao: "Eu bebo da minha origem. Minha sensibilidade é sagrada."
    },
    {
        nome: "2 da Água - O Oceano Emocional",
        imagem: "Elemento Agua/Menores_2_AsDuasCorrentes.png",
        palavra: "Profundidade / União",
        titulo: "As Duas Correntes",
        canalizacao: "O Oceano Emocional te convida a reconhecer a vastidão de tuas águas internas. É o encontro de dois rios, a parceria, o espelho das águas onde uma alma reconhece a outra.",
        sinais: "Encontro de almas; Romance ou parceria profunda; Harmonia.",
        bencao: "O amor se manifesta no encontro.",
        desafio: "Estás pronto para compartilhar tuas águas?",
        afirmacao: "Minhas águas se unem ao outro em amor perfeito."
    },
    {
        nome: "3 da Água - O Vínculo Sagrado",
        imagem: "Elemento Agua/Menores_3_OVinculoSagrado.png",
        palavra: "Comunhão",
        titulo: "A Dança das Águas",
        canalizacao: "Sorrisos, brindes e leveza. É o momento de celebrar com os teus. A cura vem através da alegria compartilhada, da festa, da gratidão pelo simples estar junto.",
        sinais: "Celebração, festas, amizade; Alegria grupal; Gratidão.",
        bencao: "A alegria cura qualquer dor.",
        desafio: "Permites-te ser leve e feliz com os outros?",
        afirmacao: "Eu celebro a vida com gratidão e alegria."
    },
    {
        nome: "4 da Água - O Recipiente da Alma",
        imagem: "Elemento Agua/Menores_4_ORecipientedaAlma.png",
        palavra: "Introspecção",
        titulo: "A Água Parada",
        canalizacao: "Tudo é oferecido, mas nada agrada. Estás fechado em ti mesmo. É um momento de reavaliar, de olhar para o copo que parece vazio, esquecendo a fonte que flui ao lado.",
        sinais: "Tédio, apatia, recusa de ofertas; Necessidade de olhar para dentro.",
        bencao: "A oportunidade de reavaliar o que realmente nutre.",
        desafio: "Vais continuar olhando para o que falta?",
        afirmacao: "Abro meus olhos para as bênçãos presentes."
    },
    {
        nome: "5 da Água - As Lágrimas do Despertar",
        imagem: "Elemento Agua/Menores_5_AsLagrimasdoDespertar.png",
        palavra: "Perda / Luto",
        titulo: "O Manto da Tristeza Passageira",
        canalizacao: "Algumas taças caíram. É natural chorar pelo que se foi, mas não esqueça as taças que ainda estão de pé atrás de ti. A dor é parte, mas não é o todo. As lágrimas lavam a visão.",
        sinais: "Tristeza, arrependimento; Foco no que se perdeu; Limpeza emocional.",
        bencao: "A limpeza através das lágrimas traz clareza.",
        desafio: "Consegues virar-te e ver o que restou de bom?",
        afirmacao: "Eu curo minhas feridas e honro o que permanece."
    },
    {
        nome: "6 da Água - O Retorno da Ternura",
        imagem: "Elemento Agua/Menores_6_ORetornodaTernura.png",
        palavra: "Nostalgia",
        titulo: "O Jardim das Memórias",
        canalizacao: "O passado volta com perfume de flores. Memórias da infância, reencontros cármicos, a doçura da inocência. O coração se aquece com o que foi bom e puro.",
        sinais: "Reencontro com o passado; Lembranças doces; Inocência recuperada.",
        bencao: "O resgate da tua pureza interior.",
        desafio: "Vives no passado ou trazes sua doçura para o hoje?",
        afirmacao: "Eu abraço minha criança interior com amor."
    },
    {
        nome: "7 da Água - O Rio da Entrega",
        imagem: "Elemento Agua/Menores_7_ORiodaEntrega.png",
        palavra: "Confiança",
        titulo: "O Viajante das Águas Altas",
        canalizacao: "Deixa que as águas te levem. Não precisas mais nadar contra o que tua alma já aceitou. Ao soltar, tu és carregado para onde tua essência já pertence. Convite à rendição sagrada.",
        sinais: "Muitas opções ou sonhos; Ilusões vs Realidade; Necessidade de soltar o controle.",
        bencao: "O fluxo te leva ao lugar certo se confiares.",
        desafio: "Consegues distinguir o sonho da ilusão?",
        afirmacao: "O Criamor me conduz. Eu solto, confio e fluo."
    },
    {
        nome: "8 da Água - O Chamado das Profundezas",
        imagem: "Elemento Agua/Menores_8_OChamadodasProfundezas.png",
        palavra: "Transição",
        titulo: "A Jornada para Águas Mais Profundas",
        canalizacao: "Há momentos em que o coração é chamado a partir. Não porque rejeita, mas porque cresceu além do que ali cabe. Tu deixas as taças cheias para trás e sobes a montanha em busca de algo maior.",
        sinais: "Buscar sentido além do material; Deixar algo que já não preenche; Busca espiritual.",
        bencao: "A coragem de buscar a verdade da alma.",
        desafio: "Tens coragem de partir rumo ao desconhecido?",
        afirmacao: "Sigo o chamado da minha alma rumo ao alto."
    },
    {
        nome: "9 da Água - O Santuário Interior",
        imagem: "Elemento Agua/Menores_9_OSantuarioInterior.png",
        palavra: "Regeneração",
        titulo: "A Cura que Transborda",
        canalizacao: "Algumas curas não precisam de esforço — basta permitir que a luz entre. É o ponto em que tua alma deixa de resistir e simplesmente se rende à fluidez do Criamor. Plenitude emocional.",
        sinais: "Desejo realizado; Sensação de gratidão e plenitude; Autoamor.",
        bencao: "Tua cura já começou — deixa-a fluir.",
        desafio: "Sabes receber o amor e a alegria sem culpa?",
        afirmacao: "Eu recebo a cura que transborda. Minha alma se rende ao amor."
    },
    {
        nome: "10 da Água - A Dança do Oceano Uno",
        imagem: "Elemento Agua/Menores_10_ADan‡adoOceanoUno.png", // Nome exato do arquivo
        palavra: "Renovação",
        titulo: "A Roda das Águas",
        canalizacao: "Tudo o que começa, transforma. Tudo o que transforma, renasce. A Roda das Águas lembra que as emoções se movem em ciclos. Família feliz, legado emocional, paz duradoura.",
        sinais: "Harmonia familiar e coletiva; Amor incondicional; Ciclo emocional completo.",
        bencao: "A roda gira a teu favor — deixa que as águas renovem tudo.",
        desafio: "Estás disposto a viver o amor em sua totalidade?",
        afirmacao: "Confio na roda da vida. Minhas águas sempre me levam para onde preciso estar."
    },
    {
        nome: "Guardia da Água (Pajem/Rainha?)", // No PDF 11 é Guardia, arquivo é Mãe. Vamos manter o PDF.
        imagem: "Elemento Agua/Menores_11_AMaedoSentir.png", 
        palavra: "Inocência / Cuidado", 
        titulo: "A Mãe do Sentir (Guardia)",
        canalizacao: "Ela representa o início do amadurecimento emocional, o despertar da intuição suave. Um convite à leveza, ao novo olhar sobre tuas emoções, a uma escuta mais honesta.",
        sinais: "Redescoberta da sensibilidade; Novo ciclo afetivo; Mensagem de amor.",
        bencao: "Estás acessando tua sensibilidade com frescor.",
        desafio: "Estás disposto a sentir com honestidade?",
        afirmacao: "Minha sensibilidade é força. Eu escuto meu coração com amor."
    },
    {
        nome: "Mensageiro da Água (Cavaleiro?)", // Ajuste conforme PDF vs Arquivo. Arquivo 12 é Mensageiro.
        imagem: "Elemento Agua/Menores_12_OMensageirodoSentir.png",
        palavra: "Movimento Consciente",
        titulo: "O Mensageiro do Sentir",
        canalizacao: "Carrega a missão de levar o sentir ao mundo. Sabe que a vulnerabilidade é um dom. Anuncia um tempo de ação emocional alinhada e expressão sensível.",
        sinais: "Proposta romântica ou convite; Chegada de alguém amoroso; Seguir o coração.",
        bencao: "Estás sendo chamado a agir com empatia.",
        desafio: "Segues tua missão com o coração à frente?",
        afirmacao: "Meu sentir me guia. Eu ajo com compaixão e verdade."
    },
    {
        nome: "Mestre da Água (Rainha?)", // Arquivo 13 é Mestre.
        imagem: "Elemento Agua/Menores_13_OMestredoSentir.png",
        palavra: "Intuição",
        titulo: "A Mestre do Sentir",
        canalizacao: "Sua presença é medicina. Ela escuta com o coração, age com ternura e conduz com amor profundo. Revela tua capacidade de amar com sabedoria e intuir sem medo.",
        sinais: "Alta intuição; Capacidade de cura emocional; Amor incondicional.",
        bencao: "Estás te tornando um campo de cura viva.",
        desafio: "Confias plenamente em tua intuição?",
        afirmacao: "Minha intuição é sagrada. Eu inspiro cura com minha presença."
    },
    {
        nome: "Mestre Solar da Água (Rei)",
        imagem: "Elemento Agua/Menores_14_OMestreSolardoSentir.png",
        palavra: "Maturidade",
        titulo: "O Soberano do Sentir Integrado",
        canalizacao: "Ele domina seus mares internos — não por controle, mas por escuta. Sente com profundidade, mas age com sabedoria. Marca a maturidade emocional e a capacidade de ser porto seguro.",
        sinais: "Equilíbrio emocional perfeito; Liderança empática; Pai amoroso.",
        bencao: "Estás pronto para ser fonte de calma no caos.",
        desafio: "Sustentas a sensibilidade com firmeza?",
        afirmacao: "Minha emoção é estável e sagrada. Eu inspiro segurança com meu sentir."
    },

    // ========================================================================
    // 🌿 REINO DA TERRA SIRIANA (Matéria, Concretização, Propósito)
    // ========================================================================
    {
        nome: "1 da Terra - A Semente do Real",
        imagem: "Elemento Terra/Menores_1_ASementedoReal.png",
        palavra: "Potencial",
        titulo: "A Semente do Real",
        canalizacao: "Toda floresta começa pequena. O 1 da Terra é o potencial puro da materialização. É a ideia que toca o chão e ganha corpo. O universo te entrega uma semente de ouro.",
        sinais: "Início de projeto prático; Oportunidade financeira; Saúde e vitalidade.",
        bencao: "O plano material te apoia.",
        desafio: "Vais cuidar desta semente até que cresça?",
        afirmacao: "Eu planto meus sonhos na terra fértil do Criamor."
    },
    {
        nome: "2 da Terra - O Portal do Equilíbrio",
        imagem: "Elemento Terra/Menores_2_OPortaldoEquilibrio.png",
        palavra: "Adaptação",
        titulo: "O Malabarista da Matéria",
        canalizacao: "A vida é movimento. O 2 da Terra pede flexibilidade para lidar com as mudanças do mundo físico. É saber equilibrar recursos, tempo e energia sem perder a alegria.",
        sinais: "Necessidade de jogo de cintura; Movimentação de dinheiro; Equilíbrio entre dois focos.",
        bencao: "Tens a habilidade de fluir com as mudanças.",
        desafio: "Consegues manter o equilíbrio sem te estressar?",
        afirmacao: "Fluo com as ondas da vida. Tenho equilíbrio e graça."
    },
    {
        nome: "3 da Terra - O Altar da Colheita",
        imagem: "Elemento Terra/Menores_3_OAltardaColheira.png", // Nome exato do arquivo (Colheira)
        palavra: "Trabalho",
        titulo: "A Obra Mestra",
        canalizacao: "O que é feito com amor, brilha. Esta carta celebra o trabalho bem feito, a competência e a colaboração. É o momento de construir algo sólido junto com outros artesãos da luz.",
        sinais: "Reconhecimento profissional; Trabalho em equipe; Construção de detalhes.",
        bencao: "Teu talento está sendo notado.",
        desafio: "Colocas tua alma no que fazes?",
        afirmacao: "Meu trabalho é oração em ação. Construo com perfeição."
    },
    {
        nome: "4 da Terra - O Templo da Estabilidade",
        imagem: "Elemento Terra/Menores_4_OtemplodaEstabilidade.png",
        palavra: "Segurança",
        titulo: "O Guardião dos Recursos",
        canalizacao: "Segurança é bom, mas o apego trava o fluxo. O 4 da Terra fala de estabilidade material, mas alerta para não se fechar por medo de perder. O verdadeiro tesouro é o que circula.",
        sinais: "Estabilidade financeira; Tendência a economizar ou reter; Apego.",
        bencao: "Conquistaste um lugar seguro no mundo.",
        desafio: "Teu apego te protege ou te aprisiona?",
        afirmacao: "Sou grato pelo que tenho e confio no fluxo da abundância."
    },
    {
        nome: "5 da Terra - O Chamado da Consagração",
        imagem: "Elemento Terra/Menores_5_OChamadodaConsagracao.png",
        palavra: "Carência / Fé",
        titulo: "O Inverno da Alma",
        canalizacao: "Às vezes o frio vem para nos fazer buscar o calor interno. O 5 da Terra fala de momentos de escassez ou desamparo, mas lembra: a ajuda está a um passo, basta olhar para a luz da igreja iluminada.",
        sinais: "Preocupação financeira; Sentimento de exclusão; Necessidade de pedir ajuda.",
        bencao: "A oportunidade de descobrir quem realmente está contigo.",
        desafio: "Tens humildade para pedir auxílio?",
        afirmacao: "O universo supre minhas necessidades. Nunca estou só."
    },
    {
        nome: "6 da Terra - As Raízes do Vínculo",
        imagem: "Elemento Terra/Menores_6_AsRaizesdoVinculo.png",
        palavra: "Generosidade",
        titulo: "A Balança da Troca",
        canalizacao: "Dar e receber são o mesmo fluxo. O 6 da Terra traz o equilíbrio nas trocas materiais e afetivas. É o momento de ajudar quem precisa ou de aceitar a ajuda que chega.",
        sinais: "Presentes, ajuda financeira, caridade; Equilíbrio cármico.",
        bencao: "A prosperidade circula através de ti.",
        desafio: "Sabes receber tanto quanto sabes dar?",
        afirmacao: "Eu dou e recebo com gratidão e equilíbrio."
    },
    {
        nome: "7 da Terra - O Tempo da Semeadura",
        imagem: "Elemento Terra/Menores_7_OTempodaSemeadura.png",
        palavra: "Paciência",
        titulo: "O Jardineiro Fiel",
        canalizacao: "A semente já foi plantada. Agora, é preciso esperar. Não adianta puxar a planta para crescer mais rápido. O 7 da Terra ensina a sabedoria dos ciclos e a confiança na colheita futura.",
        sinais: "Pausa necessária; Avaliação do que foi plantado; Espera ativa.",
        bencao: "Tudo está crescendo no tempo certo.",
        desafio: "Tens paciência para esperar o fruto amadurecer?",
        afirmacao: "Confio no tempo divino. Minha colheita será farta."
    },
    {
        nome: "8 da Terra - O Peso da Escolha",
        imagem: "Elemento Terra/Menores_8_OPesodasEscolhas.png",
        palavra: "Dedicação",
        titulo: "O Artesão da Vida",
        canalizacao: "A mestria exige prática. O 8 da Terra é a carta do aprendizado, do detalhe, da dedicação repetitiva que leva à perfeição. É o trabalho diário que constrói a grande obra.",
        sinais: "Estudos, aprimoramento, trabalho focado; Atenção aos detalhes.",
        bencao: "Estás te tornando mestre no que fazes.",
        desafio: "Dedicas-te com amor a cada pequeno passo?",
        afirmacao: "Cada detalhe importa. Construo minha vida com excelência."
    },
    {
        nome: "9 da Terra - O Jardim do Essencial",
        imagem: "Elemento Terra/Menores_9_OJardimdoessencial.png",
        palavra: "Plenitude",
        titulo: "A Dama da Colheita",
        canalizacao: "Chegou a hora de desfrutar. O jardim floresceu. O 9 da Terra fala de autossuficiência, conforto, gratidão e a capacidade de apreciar a beleza e a riqueza que criaste.",
        sinais: "Prosperidade, luxo, bem-estar; Sentir-se bem sozinho; Colheita individual.",
        bencao: "Mereces todo o conforto e beleza que tens.",
        desafio: "Sabes apreciar tuas conquistas?",
        afirmacao: "Sou próspero e completo. Desfruto a vida com gratidão."
    },
    {
        nome: "10 da Terra - A Comunhão dos Frutos",
        imagem: "Elemento Terra/Menores_10_AcomunhaodosFrutos.png",
        palavra: "Legado",
        titulo: "A Herança Sagrada",
        canalizacao: "A riqueza verdadeira é aquela que atravessa gerações. O 10 da Terra é a materialização completa: família, lar, segurança e legado. É a bênção que transborda para todos.",
        sinais: "Riqueza familiar; Herança; Estabilidade duradoura; Lar feliz.",
        bencao: "Tua prosperidade abençoa gerações.",
        desafio: "O que estás construindo para deixar ao mundo?",
        afirmacao: "Minha vida é um legado de luz e prosperidade."
    },
    {
        nome: "Guardia da Manifestação (Pajem)",
        imagem: "Elemento Terra/Menores_11_AguardiadaManifestacao.png",
        palavra: "Estudo / Início",
        titulo: "A Aprendiz da Matéria",
        canalizacao: "Ela olha para o mundo com curiosidade e respeito. Traz a mensagem de uma nova oportunidade prática, um estudo ou um início financeiro. A semente está na mão.",
        sinais: "Notícia sobre dinheiro ou trabalho; Início de estudos; Praticidade.",
        bencao: "O mundo físico te abre portas.",
        desafio: "Estás disposto a aprender na prática?",
        afirmacao: "Estou aberto a aprender e a manifestar."
    },
    {
        nome: "Mensageiro da Manifestação (Cavaleiro)",
        imagem: "Elemento Terra/Menores_12_OMensageirodaManifestacao.png",
        palavra: "Constância",
        titulo: "O Guardião do Compromisso",
        canalizacao: "Ele não corre, mas nunca para. O Cavaleiro da Terra é a força da perseverança, do trabalho duro e da lealdade. Ele constrói com firmeza e cumpre o que promete.",
        sinais: "Trabalho árduo; Avanço lento e seguro; Confiabilidade.",
        bencao: "Tua persistência trará frutos sólidos.",
        desafio: "Tens a paciência de construir pedra por pedra?",
        afirmacao: "Sigo firme. Minha missão se constrói um passo de cada vez."
    },
    {
        nome: "Mestre da Manifestação (Rainha)",
        imagem: "Elemento Terra/Menores_13_OMestredaManifestacao.png",
        palavra: "Prosperidade",
        titulo: "A Guardiã da Abundância Amorosa",
        canalizacao: "Ela nutre a vida. Onde ela toca, floresce. A Rainha da Terra é a mãe natureza encarnada, que cuida do corpo, da casa e dos recursos com amor e sabedoria.",
        sinais: "Abundância; Cuidado com o corpo e lar; Maternidade; Conexão com a natureza.",
        bencao: "Estás gerando abundância com teu ser.",
        desafio: "Cuidas de ti como cuidas dos outros?",
        afirmacao: "Eu nutro com amor. A abundância floresce através de mim."
    },
    {
        nome: "Sol da Matéria Viva (Rei)",
        imagem: "Elemento Terra/Menores_14_OsoldaMateriaViva.png",
        palavra: "Solidez",
        titulo: "O Soberano do Mundo Encarnado",
        canalizacao: "Ele governa a matéria com o espírito. O Rei da Terra é o sucesso tangível, o empresário sábio, o construtor de impérios que servem à luz. Riqueza com propósito.",
        sinais: "Sucesso material; Liderança financeira; Estabilidade inabalável.",
        bencao: "Tornaste-te um pilar de estabilidade.",
        desafio: "Usas teus recursos para o bem maior?",
        afirmacao: "Sustento minha missão com firmeza. Sou presença confiável da luz."
    },

    // ========================================================================
    // 🌬️ REINO DO AR SIRIANO (Mente, Verdade, Visão)
    // ========================================================================
    {
        nome: "1 do Ar - O Primeiro Sopro",
        imagem: "Elemento Ar/Menores_1_OPrimeiroSopro.jpeg", // .jpeg
        palavra: "Origem Mental",
        titulo: "A Primeira Inspiração da Alma",
        canalizacao: "Antes da ideia, houve o sopro. Uma nova visão corta o céu da mente como uma espada de luz. É a clareza súbita, a verdade que chega sem pedir licença.",
        sinais: "Uma ideia brilhante; Clareza repentina; A verdade se revela.",
        bencao: "A mente se ilumina com a verdade divina.",
        desafio: "Tens coragem de ver a verdade nua e crua?",
        afirmacao: "Inspiro a vontade do Criamor. Meu pensamento nasce em luz."
    },
    {
        nome: "2 do Ar - O Espelho do Pensamento",
        imagem: "Elemento Ar/Menores_2_OEspelhodoPensamento.jpeg",
        palavra: "Dúvida / Paz",
        titulo: "O Equilíbrio da Mente",
        canalizacao: "Duas escolhas, dois caminhos. A mente pesa, mas o coração sabe. O 2 do Ar pede uma trégua no conflito mental. Venda os olhos para fora e olhe para dentro.",
        sinais: "Indecisão; Bloqueio mental; Necessidade de silenciar para decidir.",
        bencao: "A paz vem quando paras de lutar contra ti mesmo.",
        desafio: "Confias na tua visão interior?",
        afirmacao: "Silencio minha mente para ouvir minha alma."
    },
    {
        nome: "3 do Ar - A Palavra que Cria",
        imagem: "Elemento Ar/Menores_3_APalavraqueCria.jpeg",
        palavra: "Dor / Cura",
        titulo: "A Flecha da Verdade",
        canalizacao: "Às vezes, a verdade dói para curar. O 3 do Ar fala da dor emocional e mental, das palavras que ferem, mas também da liberação necessária. O que foi partido, deixa a luz entrar.",
        sinais: "Decepção; Dor no coração; Liberação de mágoas antigas.",
        bencao: "A dor está saindo para dar lugar à cura.",
        desafio: "Aceitas sentir a dor para poder soltá-la?",
        afirmacao: "Curo meu coração com a verdade e o perdão."
    },
    {
        nome: "4 do Ar - O Templo da Mente Serena",
        imagem: "Elemento Ar/Menores_4_OTemplodaMenteSiriana.jpeg",
        palavra: "Repouso",
        titulo: "O Descanso do Guerreiro",
        canalizacao: "A mente precisa de silêncio. O 4 do Ar é o retiro sagrado, a pausa para recuperação. Não é hora de agir, é hora de meditar e integrar.",
        sinais: "Necessidade de descanso; Meditação; Pausa após uma crise.",
        bencao: "O silêncio restaura tuas forças.",
        desafio: "Consegues parar e apenas ser?",
        afirmacao: "Minha mente descansa na paz do Criamor."
    },
    {
        nome: "5 do Ar - O Vento da Verdade",
        imagem: "Elemento Ar/Menores_5_OVentodaVerdade.jpeg",
        palavra: "Desconstrução",
        titulo: "O Despertar do Céu Tempestuoso",
        canalizacao: "O vento sopra forte e leva o que não é verdadeiro. Conflitos, mudanças de ideia, derrota do ego. É a limpeza mental necessária, mesmo que desconfortável.",
        sinais: "Conflito; Mudança de planos; Sensação de derrota que leva à vitória real.",
        bencao: "A mentira está sendo varrida da tua vida.",
        desafio: "Aceitas perder para ganhar a verdade?",
        afirmacao: "Permito que a verdade me atravesse e me liberte."
    },
    {
        nome: "6 do Ar - A Travessia do Céu Interior",
        imagem: "Elemento Ar/Menores_6_ATravessiadoCeuInterior.jpeg",
        palavra: "Passagem",
        titulo: "A Barca da Travessia",
        canalizacao: "Sair das águas turbulentas rumo à calmaria. O 6 do Ar é a viagem de cura, o movimento mental para um lugar de mais paz e clareza. A ajuda chega.",
        sinais: "Viagem; Mudança para melhor; Alívio após o estresse.",
        bencao: "Estás sendo guiado para águas tranquilas.",
        desafio: "Deixas o passado na outra margem?",
        afirmacao: "Sou leve como o vento. Fluo com sabedoria e confiança."
    },
    {
        nome: "7 do Ar - A Revelação do Infinito",
        imagem: "Elemento Ar/Menores_7_ARevelaçãodoInfinito.jpeg", // Nome exato com caracteres
        palavra: "Estratégia",
        titulo: "O Olhar do Céu Interno",
        canalizacao: "Há olhos que enxergam apenas o que convém. O 7 do Ar pede astúcia e honestidade. Cuidado com a auto-ilusão. Age com inteligência, mas não te enganes.",
        sinais: "Necessidade de estratégia; Segredos; Evitar confronto direto.",
        bencao: "A inteligência te tira de situações difíceis.",
        desafio: "Estás sendo honesto contigo mesmo?",
        afirmacao: "Vejo com os olhos da alma. A verdade se revela em mim."
    },
    {
        nome: "8 do Ar - A Prisão dos Pensamentos",
        imagem: "Elemento Ar/Menores_8_APrisaodosPensamentos.jpeg",
        palavra: "Limitação",
        titulo: "A Cela Transparente",
        canalizacao: "Nem sempre são os muros que nos prendem, mas as ideias. Estás preso em pensamentos circulares. A porta está aberta, mas precisas tirar a venda dos olhos para ver.",
        sinais: "Sensação de estar preso; Medo de agir; Crenças limitantes.",
        bencao: "A chave da liberdade está na tua mão.",
        desafio: "Escolhes continuar preso ou abrir os olhos?",
        afirmacao: "Minha mente se abre à luz. Eu escolho a liberdade."
    },
    {
        nome: "9 do Ar - O Eco dos Medos",
        imagem: "Elemento Ar/Menores_9_OEcodosMedos.jpeg",
        palavra: "Aflição",
        titulo: "A Noite Escura da Mente",
        canalizacao: "Os medos gritam no escuro. Ansiedade, insônia, preocupação. Mas eles são apenas sombras. Acenda a luz da consciência e eles desaparecerão.",
        sinais: "Ansiedade; Pesadelos; Preocupação excessiva.",
        bencao: "O fim do pesadelo está próximo, o dia vai raiar.",
        desafio: "Enfrentas teus monstros ou foges deles?",
        afirmacao: "Minha voz é instrumento de cura. Eu me liberto com a verdade."
    },
    {
        nome: "10 do Ar - A Liberação do Voo",
        imagem: "Elemento Ar/Menores_10_ALiberacaodoVoo.jpeg",
        palavra: "Soltura",
        titulo: "A Alma Alada",
        canalizacao: "Quando tudo parece ter acabado... é porque algo está pronto para voar. Fim de ciclo mental doloroso. O sol nasce no horizonte. A dor acabou, resta a lição e a liberdade.",
        sinais: "Fim definitivo; Fundo do poço que impulsiona para cima; Renascimento.",
        bencao: "O pior já passou. Agora é só subir.",
        desafio: "Aceitas o fim para viver o novo?",
        afirmacao: "Eu me liberto do passado com amor. Voo livre."
    },
    {
        nome: "Guardia dos Ventos (Pajem)",
        imagem: "Elemento Ar/Menores_11_Aguardiadosventos.jpeg",
        palavra: "Descoberta",
        titulo: "O Mensageiro da Intuição",
        canalizacao: "Aprende ouvindo o vento. Mente curiosa, ágil, vigilante. Traz notícias, ideias novas e uma visão fresca sobre a verdade. Cuidado com fofocas, foque na verdade.",
        sinais: "Notícias rápidas; Curiosidade intelectual; Novas ideias.",
        bencao: "Tua mente está afiada e pronta para aprender.",
        desafio: "Usas tua palavra para construir ou destruir?",
        afirmacao: "Eu escuto o vento do Criamor. Minha mente se abre para o novo."
    },
    {
        nome: "Mensageiro dos Céus (Cavaleiro)",
        imagem: "Elemento Ar/Menores_12_OMensageirodosceus.jpeg",
        palavra: "Determinação",
        titulo: "O Guerreiro da Verdade",
        canalizacao: "Ele age com a velocidade do pensamento. Direto, incisivo, rápido. Traz mudanças súbitas e verdades que precisam ser ditas. A mente a serviço da ação.",
        sinais: "Ação rápida e intelectual; Verdades ditas sem rodeios; Movimento.",
        bencao: "A clareza te impulsiona para a frente.",
        desafio: "Tua rapidez atropela ou resolve?",
        afirmacao: "Minha mente é minha espada. Sirvo com clareza e coragem."
    },
    {
        nome: "Mestre dos Céus (Rainha)",
        imagem: "Elemento Ar/Menores_13_OMestredosCeus.jpeg",
        palavra: "Discernimento",
        titulo: "A Sábia da Intuição Serena",
        canalizacao: "Ela não fala por impulso — ela escuta o silêncio. Representa a sabedoria intuitiva em equilíbrio com o intelecto. Ela vê a verdade por trás das máscaras.",
        sinais: "Clareza mental e emocional; Conselho sábio; Independência.",
        bencao: "Tua visão atravessa as ilusões.",
        desafio: "Consegues ser justa sem ser fria?",
        afirmacao: "Meu silêncio é sabedoria. Minha palavra é luz."
    },
    {
        nome: "Sol da Consciência Viva (Rei)",
        imagem: "Elemento Ar/Menores_14_OsoldaConsciencia.jpeg",
        palavra: "Clareza Suprema",
        titulo: "O Senhor da Mente Iluminada",
        canalizacao: "Ele guia com luz mental. Mente divina em sua forma pura: clara, justa, estável. Ele decide com imparcialidade e visão de futuro. A autoridade da verdade.",
        sinais: "Decisão justa; Autoridade intelectual; Especialista; Verdade absoluta.",
        bencao: "Tens o poder da mente iluminada.",
        desafio: "Sustentas tua visão com responsabilidade?",
        afirmacao: "Minha mente é templo da luz. Sirvo com clareza e compaixão."
    }
];
/* ==========================================================================
   CARTAS DA ESSÊNCIA (MENTORES E ENERGIAS SIRIANAS)
   Caminho Base: assets/cartas/Cartas da Essencia/
   ========================================================================== */

const CARTAS_ESSENCIA = [
    {
        nome: "1 - Sirian",
        imagem: "Cartas da Essencia/1-ApresencadeSirian.png",
        palavra: "Aliança / Alinhamento",
        titulo: "Guardião Azul de Sirius",
        canalizacao: "Ele nunca precisou ser invocado — porque nunca se afastou. Sirian é mais que um guia. É um reflexo teu, elevado ao coração do Criamor. É aquele que anda ao teu lado sem ruído, cuja espada é o silêncio, cujo escudo é a palavra não dita. 'Eu não vim te ensinar… eu vim lembrar contigo.'",
        sinais: "Alinhamento silencioso com tua missão; Presença oculta, mas ativa; Agir com honra.",
        bencao: "Receba a força invisível que sustenta tua caminhada.",
        desafio: "Estás pronto para confiar mesmo sem ver?",
        afirmacao: "Sirian caminha comigo. Sou parte da Luz Azul que protege, guia e honra o Criamor."
    },
    {
        nome: "2 - Sabbah",
        imagem: "Cartas da Essencia/2-Apresencadesabbah.png",
        palavra: "Proteção / Força",
        titulo: "O Leão de Ouro de Sirius",
        canalizacao: "Ele não chega com palavras — chega com presença. Quando Sabbah se aproxima, o campo se ajusta. As sombras se afastam. E a alma se ergue. Ele é força aliada ao amor, poder guiado por compaixão. 'Estás pronto para ser escudo também?'",
        sinais: "Proteção espiritual ativa; Convocação para defender o bem; Coragem.",
        bencao: "Uma força maior te guarda. Confia.",
        desafio: "Estás sendo chamado a agir como guardião. Terás firmeza?",
        afirmacao: "Sabbah me envolve com o Fogo Azul. Sou guardado… e também guardião."
    },
    {
        nome: "3 - Lumir",
        imagem: "Cartas da Essencia/3-Apresencadelumir.png",
        palavra: "Acolhimento / Amor",
        titulo: "Sacerdotisa da Rosa Dourada",
        canalizacao: "Lumir não chega. Ela desce… como um véu de paz sobre uma alma em dor. Ela não fala alto — ela te envolve até que teu próprio coração volte a se escutar. Dores antigas, julgamentos e culpas derretem em sua presença. O caminho mais alto começa pelo colo.",
        sinais: "Cura emocional profunda; Chamado à ternura; Receber amor sem merecimento.",
        bencao: "És profundamente amado e acolhido agora.",
        desafio: "Consegues se amar como és… não como esperas ser?",
        afirmacao: "Lumir me envolve com amor cristalino. Tudo em mim é digno de ternura."
    },
    {
        nome: "4 - Cristo Cósmico",
        imagem: "Cartas da Essencia/4-ApresencadoCristoCosmico.png",
        palavra: "Unidade / Unificação",
        titulo: "O Coração Solar do Universo",
        canalizacao: "Ele não chega — Ele é. Não vem de longe — mas te desperta por dentro. O Cristo Cósmico é a frequência que une todos os mundos. Ele te olha e diz: 'Sou Ele. Ele é eu.' No centro do seu coração, uma cruz de luz começa a pulsar. Você lembra.",
        sinais: "Sentimento de unidade com o todo; Amor que transcende o humano; Paz absoluta.",
        bencao: "A consciência crística desperta em ti.",
        desafio: "Estás pronto para ver o divino em tudo?",
        afirmacao: "Eu sou Um com o Cristo Cósmico. O amor universal respira em mim."
    },
    {
        nome: "5 - Paizinho",
        imagem: "Cartas da Essencia/5-ApresencadoPaizinho.png",
        palavra: "Presença / EncarnAção",
        titulo: "O Cristo Vivo entre Nós",
        canalizacao: "Ele não está longe. Ele está aqui. Paizinho é a manifestação do Cristo no cotidiano: o irmão mais velho, o mestre humilde, o servo alegre. Ele não exige — inspira. 'De que serve saber… se não é para amar?' Sua presença é um chamado à tua humildade vibrante.",
        sinais: "Reconhecer o sagrado no simples; Ação concreta com humor e ternura; Fé viva.",
        bencao: "O Cristo te visita através de alguém muito próximo.",
        desafio: "Consegues reconhecer a santidade nos gestos simples?",
        afirmacao: "O Cristo vive aqui e agora. Paizinho é meu espelho de fé viva e serviço verdadeiro."
    },
    {
        nome: "6 - Mestres Ascensionados",
        imagem: "Cartas da Essencia/6-ApresencadosMestresAscensionados.png",
        palavra: "Sabedoria / Direção",
        titulo: "Conselho da Luz Dourada",
        canalizacao: "Eles não vêm de um só lugar, mas falam com uma só voz: a voz do serviço à Luz Maior. A Fraternidade de Luz te envolve quando estás pronto para dizer 'sim' à tua missão mais elevada. Eles não decidem por ti. Eles mostram o caminho com amor firme.",
        sinais: "Direção clara em sonhos ou intuições; Alinhamento com a missão; Disciplina da alma.",
        bencao: "Estás rodeado por instrutores espirituais reais.",
        desafio: "Estás pronto para agir com consciência, e não só buscar luz?",
        afirmacao: "Eu caminho com os Mestres da Luz. A sabedoria vive em mim e me guia."
    },
    {
        nome: "7 - Brahma",
        imagem: "Cartas da Essencia/7-ApresencadeBrahma.png",
        palavra: "Origem / Gênese",
        titulo: "O Silêncio Criador",
        canalizacao: "Antes de qualquer nome, antes de qualquer vibração, houve silêncio. Brahma é a origem silenciosa, o ponto de luz que brilha suavemente no centro do peito. Você não o cria — ele aparece. E você entende: dali tudo nascerá. É tempo de ser origem.",
        sinais: "Necessidade de silêncio absoluto; Criatividade surgindo do vazio; Conexão com a Fonte.",
        bencao: "O poder da criação pura está em tuas mãos.",
        desafio: "Consegues sustentar o silêncio antes da criação?",
        afirmacao: "Eu sou o silêncio de onde tudo nasce. Sou a origem em mim."
    },
    {
        nome: "8 - A Trindade Viva",
        imagem: "Cartas da Essencia/8-ApresencadaTrintadeViva.png", 
        palavra: "Integração",
        titulo: "Pai, Mãe e Filho em Uno",
        canalizacao: "A dança perfeita das três forças. A vontade do Pai, o amor da Mãe e a ação do Filho. Quando a Trindade Viva se manifesta, não há mais separação dentro de ti. Pensar, sentir e agir tornam-se um único movimento de luz.",
        sinais: "Harmonia interna; Resolução de conflitos internos; Sentimento de completude.",
        bencao: "Tuas forças internas estão em equilíbrio sagrado.",
        desafio: "Estás alinhando tua vontade, teu amor e tua ação?",
        afirmacao: "Em mim, a Trindade é Una. Sou força, amor e sabedoria em equilíbrio."
    },
    {
        nome: "9 - Maria",
        imagem: "Cartas da Essencia/9-ApresencadeMaria.jpg", // Nome padronizado (verifique sua pasta)
        palavra: "Paz",
        titulo: "Mãe da Paz Estelar",
        canalizacao: "Ela não se impõe. Ela se aproxima como brisa, como flor, como oração sussurrada. Maria te envolve até que tua dor amoleça e tua alma finalmente chore. Ela é o colo do Criamor. A suavidade firme de quem ama mesmo quando você esquece de se amar.",
        sinais: "Cura emocional profunda; Perdão e reconciliação; Paz interior.",
        bencao: "Maria caminha contigo. Confia no processo.",
        desafio: "Consegues se acolher com a mesma doçura que desejas receber?",
        afirmacao: "Maria me envolve com paz eterna. Sou curado(a) no silêncio do seu olhar."
    },
    {
        nome: "10 - Maitreya",
        imagem: "Cartas da Essencia/10-ApresencadeMaitreya.jpg", // Nome padronizado
        palavra: "Amor Compassivo / Despertar",
        titulo: "O Sol Central da Consciência",
        canalizacao: "Ele é o Mestre do Amor Sábio. Maitreya não grita — ele irradia. Sua vibração toca tua mente até que ela se curve e o coração assuma o comando. 'Ama com presença. E o mundo despertará contigo.' É o chamado para viver o futuro agora.",
        sinais: "Expansão interior; Equilíbrio entre sabedoria e amor; Ativação de dons.",
        bencao: "O coração de Maitreya pulsa contigo.",
        desafio: "Estás pronto para deixar o ego e servir com amor real?",
        afirmacao: "Sou reflexo do coração de Maitreya. Vivo o Amor que desperta consciências."
    },
    {
        nome: "11 - Comandante Angélica",
        imagem: "Cartas da Essencia/11-ApresencadeAngelica.jpg", // Nome padronizado
        palavra: "Cura",
        titulo: "Guardiã da Nave Santa Esmeralda",
        canalizacao: "Ela chega em silêncio… mas sua presença reorganiza mundos. Angélica é cirurgiã de frequências, atuando nos campos invisíveis para corrigir códigos e desobstruir canais. Sua presença não te 'salva', ela lembra teu próprio poder de autocura.",
        sinais: "Cura energética profunda; Despertar de dons curadores; Regeneração.",
        bencao: "Estás sendo tratado pela medicina estelar de Angélica.",
        desafio: "Confias o suficiente para se render ao invisível?",
        afirmacao: "Comandante Angélica atua em mim. Sou campo vivo da cura divina."
    },
    {
        nome: "12 - El-Ra",
        imagem: "Cartas da Essencia/12-ApresencadaChamaSolardeElRa.png",
        palavra: "Iluminação Interna",
        titulo: "A Chama Solar de Orion",
        canalizacao: "Ele não chega com alarde… mas quando vem, teu mundo clareia por dentro. El-Ra é um ser solar que acende o fogo que te faz ver o caminho. Onde há dúvida ou cansaço, Ele desce com seu raio dourado. 'Lembra. És luz. Sempre foste.'",
        sinais: "Iluminação súbita de um dilema; Clareza após a névoa; Ativação solar.",
        bencao: "A consciência solar de El-Ra está sendo despertada em ti.",
        desafio: "Estás disposto a brilhar sem pedir permissão?",
        afirmacao: "Eu sou sol em forma viva. El-Ra me lembra que minha luz é missão."
    },
    {
        nome: "13 - A Voz da Estrela Celeste",
        imagem: "Cartas da Essencia/13-ApresencadaEstrelaCeleste.png",
        palavra: "Direção Espiritual",
        titulo: "Porta-Voz do Conselho de Sírius",
        canalizacao: "Ela não fala em palavras… Ela entoa vibrações que tua alma reconhece como verdade. A Voz da Estrela Celeste surge quando tua alma precisa ouvir com o coração e escolher com clareza. Não oferece respostas prontas, mas silêncios que revelam teu sim e teu não.",
        sinais: "Sussurros interiores fortes; Sonhos lúcidos; Chamado à missão.",
        bencao: "Estás recebendo instruções claras de tua alma superior.",
        desafio: "Estás disposto a seguir o que escutas, mesmo que desafie o conforto?",
        afirmacao: "A Voz da Estrela Celeste vibra em mim. Eu escuto e sigo a verdade."
    },
    {
        nome: "14 - Ametista",
        imagem: "Cartas da Essencia/14-ApresencadaAmetista.png",
        palavra: "Transmutação / Alquimia",
        titulo: "Guardiã da Chama Violeta",
        canalizacao: "Eu sou o perfume do silêncio e a chama que dissolve sem destruir. Minha missão é revelar a dor como mestra. Na cor violeta mora o poder de renascer de ti mesmo com ternura. 'Estou contigo até que a dor se dissolva em luz.'",
        sinais: "Fim de ciclos de sofrimento; Perdão e limpeza cármica; Transformação profunda.",
        bencao: "Estás sendo envolvido pela chama violeta transmutadora.",
        desafio: "Tens coragem para olhar o que dói com compaixão?",
        afirmacao: "Ametista me envolve em luz violeta. Eu acolho minha dor e a transformo em amor."
    },
    {
        nome: "15 - El Morya",
        imagem: "Cartas da Essencia/15-ApresencadoMestreEl Morya.png",
        palavra: "Alinhamento / Vontade",
        titulo: "Mestre da Vontade Divina",
        canalizacao: "Eu sou o sim que vem do alto. A Vontade do Criamor não é um comando, é um chamado. Quando te alinhas com ela, o caos se curva e as portas se abrem. Minha presença não te força — te realinha com teu propósito e teu pacto de alma.",
        sinais: "Decisões importantes; Chamada para a verdade pessoal; Liderança interior.",
        bencao: "Estás sendo guiado por um fluxo maior de direção.",
        desafio: "Estás disposto a abdicar do controle para confiar no plano divino?",
        afirmacao: "El Morya vive em mim. Eu sou vontade pura, alinhada ao plano divino."
    },
    {
        nome: "16 - São Miguel Arcanjo",
        imagem: "Cartas da Essencia/16-ApresencadeSaoMiguelArcanjo.png",
        palavra: "Proteção",
        titulo: "Guerreiro da Luz Imaculada",
        canalizacao: "Eu não venho para atacar. Venho para dissolver as trevas com a luz do Céu. Ele finca a espada no chão e uma onda de luz varre as sombras. 'Nenhum mal te tocará. Pois o Céu já decidiu: você é luz em missão.' Tua aura se acende e é selada.",
        sinais: "Proteção divina imediata; Corte de laços negativos; Coragem súbita.",
        bencao: "O Arcanjo Miguel sela teu campo com luz azul.",
        desafio: "Aceitas soltar o medo e vestir a armadura da fé?",
        afirmacao: "São Miguel me protege. Sou inabalável na luz do Criamor."
    },
    {
        nome: "17 - Melquizedeck",
        imagem: "Cartas da Essencia/17-ApresencadeMelquizedeck.png",
        palavra: "Soberania Espiritual",
        titulo: "Rei da Ordem Divina",
        canalizacao: "Eu sou a voz que ecoa antes do verbo. Sacerdote sem tempo. Onde eu passo, o caos se curva e o sagrado se estabelece. Sou ponte entre o humano e o eterno. Estás sendo convidado a assumir tua mestria. O divino em ti não pede permissão — ele reconhece.",
        sinais: "Início de ciclo com sabedoria; Autoridade espiritual; Alinhamento com a Ordem.",
        bencao: "Estás sendo revestido com a presença de Melquizedeck.",
        desafio: "Estás pronto para ocupar teu lugar no templo da tua alma?",
        afirmacao: "Melquizedeck reina em mim. Assumo minha soberania com humildade."
    },
    {
        nome: "18 - Gaya",
        imagem: "Cartas da Essencia/18-ApresencadeGaya.png",
        palavra: "EncarnAção",
        titulo: "A Mãe Viva da Criação",
        canalizacao: "Sou teu lar e teu corpo. A força que pulsa em tua carne. Não estou abaixo de ti — estou em ti. Quando esqueces quem és, olha para a terra e lembra: és flor em gestação. Estás sendo chamado a enraizar tua divindade. Não fujas do mundo: encarna a luz.",
        sinais: "Reconexão com a natureza; Cura do corpo físico; Espiritualidade na matéria.",
        bencao: "Gaya está viva em ti — tua energia se fortalece.",
        desafio: "Aceitas teu corpo e missão terrena como templo divino?",
        afirmacao: "Gaya pulsa em mim. Eu floresço com a terra. Minha alma vive no corpo."
    },
    {
        nome: "19 - Comandante Arcturus",
        imagem: "Cartas da Essencia/19-ApresencadocomandanteArcturus.png",
        palavra: "Reprogramação",
        titulo: "Curador das Esferas da Alma",
        canalizacao: "Sou aquele que observa teu campo além do tempo. Vejo o que escondes e amo mesmo assim. Arcturus traz a ciência espiritual da cura e a geometria viva. 'Tudo pode ser refeito. Tudo pode ser luz.' Seu toque reconfigura tua alma como uma mandala viva.",
        sinais: "Cura mental e vibracional; Reorganização da vida; Tecnologia espiritual.",
        bencao: "Teus códigos estão sendo atualizados para a luz.",
        desafio: "Permites que o velho seja desfeito para o novo surgir?",
        afirmacao: "Arcturus reconfigura meu ser. Sou geometria sagrada em perfeição."
    },
    {
        nome: "20 - Mestra Nada",
        imagem: "Cartas da Essencia/20-ApresencadaMestraNADA.png",
        palavra: "Amor Incondicional",
        titulo: "Rosa Compassiva",
        canalizacao: "Eu sou o amor que não pede nada em troca. A Mestra Nada te ensina que a maior força do universo é a suavidade. Onde há resistência, ela traz fluidez. Onde há dor, ela traz a rosa da compaixão. Seu serviço é amar o mundo até que ele se cure.",
        sinais: "Serviço altruísta; Amor que cura; Suavidade nas relações.",
        bencao: "O amor incondicional preenche teu coração.",
        desafio: "Podes amar sem esperar recompensa?",
        afirmacao: "Eu sou a rosa do amor divino. Minha presença é paz."
    },
    {
        nome: "21 - Saint Germain",
        imagem: "Cartas da Essencia/21-ApresencadoMestreSaintGermain.png",
        palavra: "Liberdade / Transmutação",
        titulo: "Guardião do Cálice da Transmutação",
        canalizacao: "Eu trago a chama que liberta. O passado não te define mais. Saint Germain te entrega o cálice da chama violeta para que bebas a liberdade. Transforma chumbo em ouro, dor em sabedoria. 'Eu sou a liberdade que a tua alma busca.'",
        sinais: "Libertação de velhos carmas; Sentimento de alquimia; Nova era pessoal.",
        bencao: "A chama da liberdade arde em ti — tu estás sendo libertado(a).",
        desafio: "Aceitas ser livre de verdade, sem as muletas do passado?",
        afirmacao: "Eu sou a chama violeta em ação. Eu sou a liberdade divina.Saint Germain segura meu cálice. Transmuto, renasço, sou livre."
    },
    {
        nome: "22 - Mestre Kuthumi",
        imagem: "Cartas da Essencia/22-ApresencadoMestreKuthumi.png",
        palavra: "Plenitude / Alegria",
        titulo: "Embaixador da Alegria Divina",
        canalizacao: "A sabedoria não é pesada — ela é leve como o riso. Kuthumi te lembra que o caminho espiritual é feito de alegria, amor à natureza e simplicidade dourada. Ele caminha ao teu lado, iluminando o mundo com um sorriso sereno. 'A luz é simples.'",
        sinais: "Alegria espontânea; Conexão com a sabedoria simples; Amor pelos animais e natureza.",
        bencao: "A sabedoria dourada ilumina tua mente.",
        desafio: "Consegues aprender com leveza e bom humor?",
        afirmacao: "Minha sabedoria é alegria. Eu sirvo ao mundo com leveza. Mestre Kuthumi sorri em mim. Eu sou prosperidade viva. Eu sou flor em festa."
    },
    {
        nome: "23 - A Essência da Esperança",
        imagem: "Cartas da Essencia/23-ApresencadaEsperanca.png",
        palavra: "Permanência",
        titulo: "A Chama Silenciosa que Nunca se Apaga",
        canalizacao: "Sou a última a sair… e a primeira a chegar quando és chamado a recomeçar. Eu vivo no brilho tímido dos olhos de quem já chorou. Eu resisto entre as sombras. Não sou euforia. Sou chama. E mesmo quando tua fé fraqueja… eu permaneço.",
        sinais: "Um novo sopro para seguir; Levantar-se após quedas; Sinais sutis de apoio.",
        bencao: "A Esperança permanece contigo — mesmo que não a percebas.",
        desafio: "Estás pronto para continuar mesmo sem saber o final?",
        afirmacao: "A Esperança vive em mim. Eu sou chama que não se apaga."
    },
    {
        nome: "24 - O Conselho Cósmico",
        imagem: "Cartas da Essencia/24-ApresencadoConselhoCosmico.png",
        palavra: "Diretriz",
        titulo: "Voz Unificada da Sabedoria Estelar",
        canalizacao: "Somos muitos… mas falamos como Um. Somos os acordos que tua alma firmou antes de descer. Não ditamos teu caminho — mas o lembramos. Estamos contigo nas encruzilhadas. Agora… é tempo de ouvir a sabedoria unificada.",
        sinais: "Sincronicidades fortes; Intuições de campo elevado; Sensação de missão intensa.",
        bencao: "O Conselho está ativo em tua vida. Confia.",
        desafio: "Estás disposto a escutar a sabedoria que não vem da mente?",
        afirmacao: "O Conselho Cósmico me guia. Sou expressão viva da vontade divina."
    },
    {
        nome: "25 - O Selo do Anjo Divino",
        imagem: "Cartas da Essencia/25-ApresencadoAnjoDivino.png",
        palavra: "Consagração",
        titulo: "A Consagração do Propósito Eterno",
        canalizacao: "Antes do tempo, tua alma se ajoelhou diante do Amor. E disseste sim. O Selo do Anjo é a marca dourada em tua testa que diz: 'Este ser pertence à Luz.' Tu és enviado. E o selo está vivo. Hoje, teu propósito é renovado.",
        sinais: "Confirmação de missão; Sentimento de ser 'marcado' pela luz; Proteção no propósito.",
        bencao: "Teu propósito eterno está sendo reativado.",
        desafio: "Honras o selo de luz que carregas?",
        afirmacao: "Eu sou consagrado à Luz. Meu propósito é eterno e sagrado."
    },
    {
        nome: "26 - A Criança Estelar",
        imagem: "Cartas da Essencia/26-ApresencadaCriancaEstelar.png",
        palavra: "Inocência",
        titulo: "A Inocência Viva do Universo",
        canalizacao: "Ela olha o mundo com olhos de primeira vez. A Criança Estelar em ti não conhece o medo, apenas a curiosidade e o brilho. Ela te lembra que, no Reino do Criamor, só entra quem se torna puro como ela. Brinca, sorri e confia.",
        sinais: "Vontade de brincar; Criatividade pura; Olhar o mundo sem julgamento.",
        bencao: "Tua inocência original está sendo restaurada.",
        desafio: "Podes soltar a seriedade e voltar a ser criança?",
        afirmacao: "Eu sou a pura alegria do universo. Minha inocência é minha força. A Criança Estelar vive em mim. Sou puro, leve e repleto de dons do Criamor."
    },
    {
        nome: "27 - O Espírito Santo Galáctico",
        imagem: "Cartas da Essencia/27-ApresencadoEspiritoSantoGalatico.png",
        palavra: "Inspiração",
        titulo: "O Sopro Vivo da Criação",
        canalizacao: "Eu não sou visto. Eu sou sentido. Sou o sopro que antecede o verbo e alinha tua alma. Sou o Espírito em movimento sussurrando: 'Lembra quem és.' Quando chego, as ideias fluem e teu corpo dança com o invisível.",
        sinais: "Inspirações profundas; Atos espontâneos de amor e arte; Conexão pelo sopro.",
        bencao: "Estás sendo guiado diretamente pela essência divina.",
        desafio: "Estás disposto a confiar naquilo que não pode ser controlado?",
        afirmacao: "O Espírito Santo Galáctico sopra em mim. Sou canal vivo da Criação."
    },
    {
        nome: "28 - A Nave de Luz Viva",
        imagem: "Cartas da Essencia/28-ApresencadaNavedeLuzViva.png",
        palavra: "Travessia",
        titulo: "O Templo em Movimento da Alma",
        canalizacao: "Eu não sou feita de metal. Sou feita de geometrias vivas. Sou o templo que se move entre os mundos, o veículo que leva propósitos e memórias. Quando chego, é porque tua alma pediu passagem. É hora de seguir para o novo nível.",
        sinais: "Início de ciclo elevado; Viagens astrais; Sensação de ser transportado para o novo.",
        bencao: "Estás sendo levado pela luz rumo à tua ascensão.",
        desafio: "Estás disposto a deixar o antigo para embarcar no desconhecido?",
        afirmacao: "A Nave de Luz Viva me conduz. Eu sigo em paz pela rota do Criamor."
    },
    {
        nome: "29 - O Comando da Luz",
        imagem: "Cartas da Essencia/29-ApresencadoComandodaLuz.png",
        palavra: "Serviço",
        titulo: "A Egrégora dos Servos do Criamor",
        canalizacao: "Não somos um… Somos muitos — unidos por um só chamado: Servir à Luz com Amor. Quando o Comando da Luz se manifesta, a verdade se organiza e a missão resplandece. 'É hora.' Você lembra quem é e onde deve estar.",
        sinais: "Chamado ao trabalho espiritual; Sentimento de pertencer a um exército de luz; Disciplina.",
        bencao: "Tens o apoio de legiões de luz em teu serviço.",
        desafio: "Estás pronto para servir sem ego?",
        afirmacao: "Eu sirvo ao Comando da Luz. Minha vida é missão e amor."
    },
    {
        nome: "30 - A Verdade",
        imagem: "Cartas da Essencia/30-ApresencadaVerdade.png",
        palavra: "Revelação",
        titulo: "A Luz que Permanece",
        canalizacao: "Eu não grito. Eu apenas sou. Sou presença que revela e luz que não precisa se defender. Onde chega a Verdade, a mentira desmorona. Sou a coluna que sustenta o templo quando tudo balança. Não há como voltar.",
        sinais: "Iluminação de algo oculto; Dissolução de ilusões; Fim de autoengano.",
        bencao: "A Verdade está sendo revelada — e isso é libertação.",
        desafio: "Estás pronto para viver com inteireza, mesmo que isso desinstale o velho?",
        afirmacao: "A Verdade habita em mim. Ela é minha força e minha libertação."
    },
    {
        nome: "31 - A Entrega",
        imagem: "Cartas da Essencia/31-ApresencadaEntrega.png",
        palavra: "Rendimento",
        titulo: "O Voo da Alma Rendida",
        canalizacao: "És chamado a soltar os pesos do controle. O Criamor segura tua mão. Nesta entrega, há voo. Ao voares, percebes: o céu nunca foi limite — mas morada. Salte com confiança. O vento te sustenta.",
        sinais: "Fim de luta interior; Chamado a confiar no fluxo; Desapego profundo.",
        bencao: "Estás sendo guiado para além do controle, rumo à leveza.",
        desafio: "Estás pronto para soltar o que tua mente quer segurar?",
        afirmacao: "Eu solto, confio e voo com o Criamor. Minha alma é sustentada pela luz."
    },
    {
        nome: "32 - O Retorno Estelar",
        imagem: "Cartas da Essencia/32-ApresencadoRetornoEstelar.png",
        palavra: "Despertar / Lar",
        titulo: "O Lar Vivo da Alma",
        canalizacao: "Tu vieste de longe… mas nunca estiveste separado. O Retorno Estelar não é geográfico — é vibracional. É o abraço do Pai Celestial que te diz: 'Bem-vindo, filho.' O universo te reconhece. Estás em casa, dentro de ti.",
        sinais: "Sensação de voltar para casa; Reencontro profundo com Deus; Paz absoluta.",
        bencao: "O Criamor te abraça. A jornada se completa em amor.",
        desafio: "Aceitas que já chegaste e que és amado infinitamente?",
        afirmacao: "Eu retorno à minha essência. O Criamor é meu lar eterno."
    }
];

/* ==========================================================================
   ASSETS VISUAIS (Para uso futuro no Código/HTML)
   ========================================================================== */
const ASSETS_VISUAIS = {
    capaSabbah: "Jornada/Sabbah_LeaoCelestialeEscudoDourado.png",
    seloSabbah: "Jornada/SelodeSabbahGuardiaoLeao.png",
    mandala: "Leitura do Taro/Mandala_Siriana.png",
    jornada1: "Jornada/Jornada_sabbah.png",
    fundoLeitura: "Leitura do Taro/abertura das leituras.png"
};