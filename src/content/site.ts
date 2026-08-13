/**
 * Conteúdo institucional do site.
 *
 * Isto é TEXTO, não dado — por isso mora no código e não no banco. O que veio
 * do antigo `src/mock-db` e NÃO está aqui foi removido de propósito: eram
 * números de prova social inventados ("+1.200 famílias", "+35 mil homenagens",
 * "+420 mil visitas") que não vinham de lugar nenhum.
 *
 * Métrica de verdade só aparece se sair de uma query no Supabase.
 */

export const brand = {
  name: "Preservando as Memórias",
  tagline: "Porque uma história merece viver para sempre.",
};

export const about = {
  mission:
    "Ajudar famílias a transformar lembranças em legados digitais duradouros, acessíveis de qualquer lugar.",
  story:
    "O Preservando as Memórias nasceu da necessidade de unir afeto, tecnologia e respeito num espaço seguro para homenagear quem partiu.",
  values: [
    "Respeito e sensibilidade",
    "Confiança e privacidade",
    "Memória afetiva com tecnologia",
    "Acessível para todas as idades",
  ],
};

export const faq = [
  {
    question: "Como funciona o QR Code do memorial?",
    answer:
      "Ao criar o memorial, geramos um QR Code exclusivo. Ele é gravado numa placa resistente ao tempo, fixada no local de descanso. Quem escaneia com o celular abre a página do memorial na hora, sem precisar instalar nada.",
  },
  {
    question: "Preciso criar conta antes de montar o memorial?",
    answer:
      "Não. Você preenche os dados do seu ente querido primeiro e só depois finaliza o pagamento. A conta é criada no caminho, para que você possa voltar e acompanhar a entrega da placa.",
  },
  {
    question: "O que aparece na página do memorial?",
    answer:
      "Nome, datas, cidade, foto, uma frase de despedida, a biografia, galeria de fotos, linha do tempo da vida, áudio e vídeo, se você quiser incluir. Visitantes podem acender velas, deixar flores e escrever homenagens.",
  },
  {
    question: "Posso editar o memorial depois de publicado?",
    answer:
      "Sim. O memorial continua seu e pode ser atualizado quando quiser.",
  },
  {
    question: "Minha funerária pode cuidar disso para mim?",
    answer:
      "Pode. Funerárias parceiras incluem o memorial digital no plano funerário: elas preenchem os dados, imprimem o QR Code e entregam à família junto com o serviço.",
  },
  {
    question: "Meus dados e minhas fotos estão seguros?",
    answer:
      "Sim. As mídias ficam em armazenamento com redundância e backup, e o acesso ao painel é protegido por senha.",
  },
];

/**
 * TODO(dono): trocar pelos canais reais de atendimento antes de publicar.
 * Os valores abaixo vieram do arquivo de mock antigo e são fictícios.
 */
export const contact = {
  channels: [
    { label: "E-mail", value: "suporte@preservandoamemoria.com" },
    { label: "WhatsApp", value: "+55 11 97777-0000" },
    { label: "Horário", value: "Seg a Sex, 9h às 18h" },
  ],
};
