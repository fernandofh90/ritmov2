import { Lesson, UserConfig } from './types';

export const LESSONS: Lesson[] = [
  // PILAR 1 — Constância
  { id: 1, pillar: 'Constância', title: 'Constância vence intensidade', content: 'Vendas não respondem a picos de esforço. Respondem a repetição previsível.' },
  { id: 2, pillar: 'Constância', title: 'Ritmo baixo hoje afeta o fechamento depois', content: 'Quando a prospecção cai, o impacto aparece dias ou semanas depois.' },
  { id: 3, pillar: 'Constância', title: 'Bons dias não compensam semanas vazias', content: 'Um dia produtivo não sustenta um mês inteiro.' },
  { id: 4, pillar: 'Constância', title: 'O sistema percebe antes da frustração', content: 'O ritmo cai antes da desmotivação aparecer.' },
  { id: 5, pillar: 'Constância', title: 'Vendas são estatística aplicada', content: 'Quanto mais vezes você entra no jogo, maior a chance de resultado.' },
  // PILAR 2 — Prospecção
  { id: 6, pillar: 'Prospecção', title: 'Prospecção é o verdadeiro trabalho', content: 'Fechamento é consequência. Prospecção é a base.' },
  { id: 7, pillar: 'Prospecção', title: 'Quem não chama, espera', content: 'A falta de contato hoje cria silêncio amanhã.' },
  { id: 8, pillar: 'Prospecção', title: 'Conversa precede reunião', content: 'Reuniões só acontecem quando conversas suficientes foram iniciadas.' },
  { id: 9, pillar: 'Prospecção', title: 'Volume reduz pressão', content: 'Quanto mais oportunidades abertas, menos ansiedade em cada conversa.' },
  { id: 10, pillar: 'Prospecção', title: 'Prospecção não é rejeição', content: 'É apenas a etapa inicial do processo.' },
  // PILAR 3 — Reuniões
  { id: 11, pillar: 'Reuniões', title: 'Reuniões refletem o ritmo anterior', content: 'Poucas reuniões geralmente indicam pouca prospecção antes.' },
  { id: 12, pillar: 'Reuniões', title: 'Reunião sem continuidade se perde', content: 'Sem próximos passos claros, a conversa esfria.' },
  { id: 13, pillar: 'Reuniões', title: 'Frequência sustenta confiança', content: 'Quanto mais encontros acontecem, mais natural o avanço.' },
  { id: 14, pillar: 'Reuniões', title: 'Reuniões não fecham sozinhas', content: 'Elas precisam ser alimentadas por acompanhamento.' },
  // PILAR 4 — Conversão
  { id: 15, pillar: 'Conversão', title: 'Conversão não é força', content: 'Forçar fechamento reduz confiança.' },
  { id: 16, pillar: 'Conversão', title: 'Fechamento vem quando o volume sustenta', content: 'A venda acontece quando o número de tentativas permite.' },
  { id: 17, pillar: 'Conversão', title: 'Pressa costuma travar decisões', content: 'O cliente sente quando o ritmo não sustenta o processo.' },
  { id: 18, pillar: 'Conversão', title: 'Quem acompanha avança', content: 'A maioria das vendas acontece após retomadas simples.' },
  // PILAR 5 — Comportamento Comercial
  { id: 19, pillar: 'Comportamento', title: 'Ritmo protege o emocional', content: 'Constância reduz altos e baixos emocionais.' },
  { id: 20, pillar: 'Comportamento', title: 'Vendas cansam quando são improvisadas', content: 'Sistemas aliviam o peso da decisão diária.' },
  { id: 21, pillar: 'Comportamento', title: 'O sistema não julga', content: 'Ele apenas mostra padrões de ação.' },
  { id: 22, pillar: 'Comportamento', title: 'Quando o ritmo é claro, o foco aparece', content: 'Menos dúvidas, mais execução.' },
  { id: 23, pillar: 'Comportamento', title: 'Resultados seguem padrões', content: 'Bons meses raramente são aleatórios.' },
  // LIÇÕES TRANSVERSAIS
  { id: 24, pillar: 'Recuperação', title: 'Parar é mais perigoso que errar', content: 'Ajustes são possíveis. Paradas prolongadas quebram o fluxo.' },
  { id: 25, pillar: 'Recuperação', title: 'Pequenas ações repetidas sustentam o processo', content: 'O importante é continuar entrando em contato.' },
  { id: 26, pillar: 'Recuperação', title: 'Vendas não respondem à motivação', content: 'Respondem à repetição organizada.' },
  { id: 27, pillar: 'Recuperação', title: 'Quando o ritmo volta, a confiança retorna', content: 'A clareza vem junto com o movimento.' },
  { id: 28, pillar: 'Recuperação', title: 'O sistema existe para sustentar você', content: 'Não para cobrar, comparar ou pressionar.' },
];

export const INITIAL_CONFIG: UserConfig = {
  daysPerWeek: 5,
  dailyTargets: {
    contacts: 10,
    conversations: 5,
    meetings: 2,
    sales: 1,
  },
  focus: 'prospecting',
  isOnboarded: false,
  socialPreference: 'SOCIAL',
  peakProductivity: 'MORNING',
  sleepGoal: 7,
};
