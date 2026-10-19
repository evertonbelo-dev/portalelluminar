// js/terapeutas-exemplo.js — Dados de exemplo do diretório (Fase F1)
//
// IMPORTANTE: estes perfis são ILUSTRATIVOS. Enquanto a tabela `therapists`
// não existe (F2), a vitrine lê esta lista. Na F2, `terapeutas.html` passa a
// carregar do Supabase e este arquivo deixa de ser importado — o formato dos
// campos já é o mesmo do banco, para a troca ser de uma linha.
//
// Campos espelham public.therapists + therapist_services:
//   slug (URL do perfil), nome, titulo, especialidades[], cidade,
//   modalidade ('online' | 'presencial' | 'ambos'), anos, bio, destaque,
//   servicos[{ nome, duracao_min, preco }]

export const TERAPEUTAS_EXEMPLO = [
    {
        slug: 'ana-solar',
        nome: 'Ana Solar',
        titulo: 'Taróloga Terapêutica Siriana',
        especialidades: ['Tarô', 'Essência Siriana'],
        cidade: 'São Paulo · SP',
        modalidade: 'ambos',
        anos: 12,
        destaque: true,
        bio: 'Trabalho com o Tarô Divino Siriano há doze anos, unindo a leitura arquetípica à canalização da Essência. Cada atendimento é um espaço de escuta: a carta não diz o que você deve fazer, ela devolve a você a memória de quem você é.',
        servicos: [
            { nome: 'Tiragem Tríade + Essência', duracao_min: 60, preco: 'R$ 180' },
            { nome: 'Cruz Cósmica (aprofundada)', duracao_min: 90, preco: 'R$ 260' }
        ]
    },
    {
        slug: 'joao-do-sol',
        nome: 'João do Sol',
        titulo: 'Terapeuta Radiônico e Numerólogo',
        especialidades: ['Radiônica', 'Numerologia'],
        cidade: 'Belo Horizonte · MG',
        modalidade: 'online',
        anos: 8,
        destaque: false,
        bio: 'Atendo com mesas radiônicas e numerologia estelar. Meu foco é limpeza de campos sutis e compreensão da missão de alma pelo mapa numerológico — sem promessas mágicas, com método e presença.',
        servicos: [
            { nome: 'Mesa Radiônica', duracao_min: 60, preco: 'R$ 200' },
            { nome: 'Mapa Numerológico Completo', duracao_min: 75, preco: 'R$ 240' }
        ]
    },
    {
        slug: 'maria-da-chama',
        nome: 'Maria da Chama',
        titulo: 'Leitura Energética e Bovis',
        especialidades: ['Energia', 'Bovis'],
        cidade: 'Curitiba · PR',
        modalidade: 'ambos',
        anos: 15,
        destaque: true,
        bio: 'Quinze anos medindo e harmonizando campos energéticos. Utilizo o Biômetro de Bovis como bússola e a leitura energética como mapa, para que você entenda onde sua vitalidade está sendo drenada e como recuperá-la no dia a dia.',
        servicos: [
            { nome: 'Leitura Energética + Bovis', duracao_min: 50, preco: 'R$ 150' },
            { nome: 'Harmonização de Ambiente', duracao_min: 90, preco: 'R$ 280' }
        ]
    },
    {
        slug: 'rafael-estelar',
        nome: 'Rafael Estelar',
        titulo: 'Facilitador de DNA Solar',
        especialidades: ['DNA Solar', 'Meditação'],
        cidade: 'Atendimento online',
        modalidade: 'online',
        anos: 6,
        destaque: false,
        bio: 'Conduzo processos de ativação do DNA Solar em encontros individuais e em grupo. Trabalho com respiração, som e meditação guiada para ancorar as frequências que a leitura do oráculo revela.',
        servicos: [
            { nome: 'Ativação DNA Solar (individual)', duracao_min: 60, preco: 'R$ 190' },
            { nome: 'Círculo de Ativação (grupo)', duracao_min: 120, preco: 'R$ 90' }
        ]
    },
    {
        slug: 'clara-da-lua',
        nome: 'Clara da Lua',
        titulo: 'Consteladora e Taróloga',
        especialidades: ['Tarô', 'Constelação'],
        cidade: 'Florianópolis · SC',
        modalidade: 'presencial',
        anos: 9,
        destaque: false,
        bio: 'Atendo presencialmente em Florianópolis, unindo as cartas à constelação familiar. O tarô abre a pergunta; a constelação mostra de onde ela vem. Um trabalho de raiz, para quem quer olhar o sistema inteiro.',
        servicos: [
            { nome: 'Sessão Integrada (Tarô + Constelação)', duracao_min: 120, preco: 'R$ 320' }
        ]
    },
    {
        slug: 'thiago-siriano',
        nome: 'Thiago Siriano',
        titulo: 'Tarólogo e Professor',
        especialidades: ['Tarô', 'Cursos'],
        cidade: 'Recife · PE',
        modalidade: 'ambos',
        anos: 10,
        destaque: false,
        bio: 'Além dos atendimentos, formo novos tarólogos. Acredito que o oráculo é ofício: estudo, prática e supervisão. Atendo online e presencial, com material de apoio e acompanhamento entre as sessões.',
        servicos: [
            { nome: 'Consulta de Tarô', duracao_min: 60, preco: 'R$ 170' },
            { nome: 'Mentoria para Tarólogos', duracao_min: 60, preco: 'R$ 220' }
        ]
    }
];
