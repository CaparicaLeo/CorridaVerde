/**
 * Política de Privacidade da Corrida Verde.
 *
 * Base: a política da Meia de Curitiba (PDF da organização, 18/11/2026),
 * ajustada ao que este site faz, conferido no código:
 * - um formulário, a lista de espera (components/blocks/WaitlistForm.tsx),
 *   que grava no CRM e manda uma cópia opcional à automação (n8n);
 * - a primeira origem e a data do primeiro acesso ficam no localStorage
 *   (cv27_primeira_origem, cv27_criado_em) para atribuir o cadastro;
 * - medição só com Vercel Analytics (sem cookie). Sem pixel, sem GA.
 *
 * Antes de ligar uma ferramenta ou formulário novo, atualize esta lista e a
 * data — a página precisa descrever o que o site faz.
 */

export const privacyEmail = "contato@thomeesantos.com.br";

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "address"; lines: string[] };

export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] };

export const privacyPolicy = {
  intro: {
    eyebrow: "LGPD",
    title: "Política de privacidade",
    description:
      "Como a Thomé & Santos coleta, usa, guarda e protege os dados de quem visita o site da Corrida Verde ou entra na lista de espera.",
  },
  lastUpdated: "18 de novembro de 2026",
  lead: "Esta política explica como a Thomé & Santos Eventos Esportivos coleta, usa, guarda e protege os dados pessoais de quem visita o site da Corrida Verde, entra na lista de espera ou se inscreve na prova, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).",
  sections: [
    {
      id: "responsavel",
      title: "Quem é o responsável pelos seus dados",
      blocks: [
        {
          type: "address",
          lines: [
            "THOME SANTOS LTDA (Thomé & Santos Eventos Esportivos)",
            "CNPJ 07.472.793/0001-90",
            "Rua Imaculada Conceição, 785, Prado Velho, Curitiba, PR, CEP 80215-182",
            `Contato para privacidade: ${privacyEmail}`,
          ],
        },
      ],
    },
    {
      id: "dados",
      title: "Quais dados coletamos",
      blocks: [
        { type: "h", text: "Dados que você nos informa" },
        {
          type: "list",
          items: [
            "Lista de espera: nome, e-mail, WhatsApp, cidade, a distância que pretende correr e as suas escolhas sobre receber o aviso de abertura e ofertas de parceiros.",
            "Inscrição na prova: quando as inscrições abrirem, elas são feitas em plataforma de inscrição parceira, que coleta os dados necessários (nome, documento, data de nascimento, contato, endereço, modalidade, tamanho de camiseta e respostas do questionário) e os compartilha conosco para a organização do evento.",
          ],
        },
        { type: "h", text: "Dados coletados automaticamente" },
        {
          type: "list",
          items: [
            "Junto com o cadastro na lista de espera: os parâmetros de campanha da visita (utm), a origem da primeira visita, o site de onde você veio, o tipo de aparelho (celular ou computador) e a data do cadastro. A origem e a data da primeira visita ficam guardadas no seu navegador (armazenamento local) até o envio.",
            "Medição sem identificação (Vercel Analytics): página visitada, de onde o acesso veio, país e cidade aproximados, tipo de aparelho e navegador. Não usa cookies e não guarda o seu endereço IP.",
          ],
        },
      ],
    },
    {
      id: "finalidades",
      title: "Para que usamos seus dados",
      blocks: [
        {
          type: "list",
          items: [
            "Avisar você por e-mail e WhatsApp quando as inscrições abrirem e mandar novidades da Corrida Verde e de outras provas da Thomé & Santos.",
            "Enviar ofertas de parceiros da prova, só se você marcar essa opção.",
            "Organizar a prova: inscrição, retirada de kit, cronometragem, resultados, comunicação sobre o evento e atendimento.",
            "Saber quais campanhas trazem cadastros e quantas pessoas visitam o site, para melhorar os dois.",
            "Cumprir obrigações legais e regulatórias e nos defender em processos.",
          ],
        },
      ],
    },
    {
      id: "bases-legais",
      title: "Bases legais (art. 7º da LGPD)",
      blocks: [
        {
          type: "list",
          items: [
            "Consentimento: aviso de abertura, novidades e ofertas de parceiros, pedidos nas caixas de seleção da lista de espera.",
            "Execução de contrato: dados da inscrição e da participação na prova.",
            "Legítimo interesse: medição sem identificação, atribuição de campanhas, segurança do site e prevenção de fraudes, sempre respeitando seus direitos.",
            "Cumprimento de obrigação legal: guarda de registros exigida por lei.",
          ],
        },
      ],
    },
    {
      id: "compartilhamento",
      title: "Com quem compartilhamos",
      blocks: [
        { type: "p", text: "Não vendemos seus dados. Compartilhamos apenas o necessário com:" },
        {
          type: "list",
          items: [
            "A plataforma de inscrição e pagamento da prova, quando as inscrições abrirem.",
            "Empresas de tecnologia que nos ajudam a operar: hospedagem do site (Vercel), hospedagem do nosso sistema de gestão de contatos (Hostinger), automação e planilhas (n8n e Google), envio de e-mails (Brevo) e WhatsApp.",
            "Patrocinadores e parceiros oficiais, somente quando você autorizar expressamente.",
            "Autoridades públicas, quando a lei exigir.",
          ],
        },
        {
          type: "p",
          text: "Alguns desses fornecedores guardam dados fora do Brasil. Nesses casos exigimos que sigam padrões de proteção compatíveis com a LGPD.",
        },
      ],
    },
    {
      id: "retencao",
      title: "Por quanto tempo guardamos",
      blocks: [
        {
          type: "list",
          items: [
            "Lista de espera: até 24 meses depois do cadastro, ou até você pedir a exclusão ou retirar o consentimento.",
            "Dados de inscrição: pelo prazo necessário para a prova e pelos prazos legais de guarda.",
            "Origem da primeira visita, no seu navegador: até você limpar os dados do site.",
            "Medição sem identificação: o código temporário de cada acesso é descartado em 24 horas; ficam apenas os números somados.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies e armazenamento no navegador",
      blocks: [
        {
          type: "p",
          text: "Este site não usa cookies, pixels de redes sociais, Google Analytics nem anúncios. O único armazenamento no seu navegador é a origem e a data da primeira visita, descritas no item 2, usadas apenas para atribuir o cadastro da lista de espera. Você pode apagá-las a qualquer momento limpando os dados do site nas configurações do navegador.",
        },
      ],
    },
    {
      id: "direitos",
      title: "Seus direitos",
      blocks: [
        { type: "p", text: "Pela LGPD você pode, a qualquer momento:" },
        {
          type: "list",
          items: [
            "Confirmar se tratamos seus dados e ter acesso a eles.",
            "Corrigir dados incompletos ou desatualizados.",
            "Pedir anonimização, bloqueio ou exclusão de dados desnecessários.",
            "Pedir a portabilidade dos dados.",
            "Saber com quem compartilhamos seus dados.",
            "Retirar o consentimento e pedir a exclusão dos dados tratados com base nele, inclusive sair da lista de espera.",
            "Se opor a tratamentos feitos com base no legítimo interesse.",
          ],
        },
        {
          type: "p",
          text: `Para exercer seus direitos, escreva para ${privacyEmail}. Respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
        },
      ],
    },
    {
      id: "seguranca",
      title: "Segurança",
      blocks: [
        {
          type: "p",
          text: "Usamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, perda ou vazamento, como conexão segura (HTTPS), acesso restrito por senha e fornecedores com padrões de segurança reconhecidos.",
        },
      ],
    },
    {
      id: "menores",
      title: "Menores de idade",
      blocks: [
        {
          type: "p",
          text: "Inscrições de menores de 18 anos só são aceitas com autorização do responsável legal, conforme o regulamento da prova.",
        },
      ],
    },
    {
      id: "imagem",
      title: "Imagem",
      blocks: [
        {
          type: "p",
          text: "Fotos e vídeos feitos durante o evento podem ser usados na divulgação da prova, nos termos do regulamento aceito na inscrição.",
        },
      ],
    },
    {
      id: "mudancas",
      title: "Mudanças nesta política",
      blocks: [
        {
          type: "p",
          text: "Podemos atualizar esta política. A data da última atualização fica sempre no topo desta página.",
        },
      ],
    },
  ] satisfies PolicySection[],
};
