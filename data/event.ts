import { formatEventDate, formatEventDateShort } from "@/lib/format";

import type {
  BigNumber,
  CardItem,
  Cta,
  FaqItem,
  HeadlineLine,
  IconItem,
  Media,
  MenuExperience,
  MiniKpi,
  NavItem,
  Pillar,
  RouteStop,
  SectionIntro,
  Video,
} from "./types";

/**
 * ============================================================================
 * 11ª Corrida Verde — Desafio 10 Milhas · configuração única do site.
 * ============================================================================
 *
 * Tudo que é conteúdo mora neste arquivo. Componente não guarda copy, número
 * nem link.
 *
 * REGRA DE HONESTIDADE (vale para quem editar depois):
 * dado não confirmado pela Thomé & Santos fica `null` e o componente cai no
 * estado vazio. Não preencha com estimativa, com valor de outra prova nem com
 * placeholder que pareça real — a LP é a promessa que o atleta lê antes de
 * pagar.
 *
 * PENDÊNCIAS ABERTAS (setembro/2026):
 *
 * 1. DATA — em aberto. A 11ª edição acontece em FEVEREIRO DE 2027 e o dia
 *    ainda não foi divulgado. `date` fica null de propósito: zerar um único
 *    campo devolve a LP inteira ao estado sem data (hero, chip, rodapé, FAQ e
 *    JSON-LD deixam de exibir a data ao mesmo tempo) e a volta é uma linha.
 *    O que a apresentação garante e o site publica é o período — "fevereiro de
 *    2027" — e o dia fica por conta de quem sabe.
 *
 * 2. LINK DE INSCRIÇÃO — em aberto. Não existe página oficial de venda
 *    ainda: o catálogo do site institucional (`data/events.js`) não tem
 *    `registrationUrl` nem `externalUrl` para `corrida-verde`, e a própria
 *    página institucional cai no formulário de contato. Até a organização
 *    abrir a ticketeria, `registrationUrl` aponta para a FICHA PÚBLICA do
 *    evento no site institucional — que existe, é mantida pela Thomé & Santos
 *    e é onde a venda vai aparecer. Quando o link oficial chegar, é UMA linha.
 *
 * 3. VALOR DA INSCRIÇÃO — não publicado. A apresentação traz a vaga (2.000)
 *    mas não o preço, e o catálogo institucional diz "A definir". A seção de
 *    ativações não tenta preencher com valor de outra prova.
 *
 * 4. MAPA DO PERCURSO — em aberto. A seção de percursos tinha um CTA de mapa
 *    no site da etapa anterior (MapMyRun enviado pela organização). Aqui não
 *    há nenhum mapa confirmado, então `races.route` é null e a seção não
 *    desenha botão para o nada. Chegando o mapa por prova, vira um link em
 *    cada card.
 *
 * 5. IDENTIDADE VISUAL — resolvida. A arte oficial chegou e está em uso:
 *    `logo` (badge circular) no header, `wordmark` (palavra-marca branca)
 *    no rodapé e `ogImage` composta sobre a chapa do tema. Os três vieram
 *    dos PNGs enviados pela Thomé & Santos, cortados na margem transparente
 *    (derivados em `public/images/`, originais em `midias-originais/`). A
 *    paleta de app/theme.ts foi sincronizada com os verdes medidos do logo.
 *    PENDÊNCIA restante: confirmar se esta arte é a versão final.
 *
 * 5b. FOTOGRAFIA — três fotos no ar (`hero`, `photo` e `impact.media`),
 *    extraídas dos PSDs do deck comercial 2027. Os originais ficam em
 *    `midias-originais/` (fora do git e de `public/`); em `public/images/` vão
 *    só os derivados de web. PENDÊNCIA 8 resolvida para as três: o `alt` foi
 *    escrito olhando a foto. São de edição anterior (EXIF de 08/02/2026), e
 *    nada na página as apresenta como da 11ª.
 *
 * 6. REGULAMENTO — em aberto. Não há documento publicado para a 11ª. A rota
 *    /regulamento fica no ar em estado vazio, apontando para a ficha oficial,
 *    e a página entra no ar pronta: só falta o `docId`, que é uma linha em
 *    `regulamentoSource`.
 *
 * 7. IDADE MÍNIMA — publicada como 14 anos, vindo da apresentação. O
 *    regulamento oficial é a autoridade e ainda não foi conferido para esta
 *    edição; se ele divergir, é o regulamento que vale e o número sai daqui.
 */

/* ---------------------------------------------------------------------------
 * Evento
 * ------------------------------------------------------------------------- */

export const event = {
  /** Como o evento se chama na página oficial. */
  name: "11ª Corrida Verde — Desafio 10 Milhas",
  shortName: "Corrida Verde",
  /** Circuito/temporada — usado no rodapé e no header. */
  series: {
    slug: "corrida-verde",
    name: "Corrida Verde",
    /** "11ª edição" no rodapé e no cabeçalho do CTA final. */
    season: "11ª edição",
    /** "Fevereiro de 2027" — o período confirmado, sem dia. */
    period: "Fevereiro de 2027",
  },
  organizer: {
    name: "Thomé & Santos — Eventos Esportivos",
    url: "https://www.thomeesantos.com.br",
  },

  /**
   * ISO 8601 com o fuso de Brasília. Zerar para null devolve a LP ao estado
   * sem data (hero, rodapé, FAQ e JSON-LD deixam de exibi-la) — o caminho de
   * volta continua sendo uma linha.
   *
   * Fevereiro/2027 está confirmado; o DIA não. Nada de escolher o primeiro
   * sábado do mês só porque é o que a edição anterior fez.
   */
  date: null as string | null,
  /** Exibido no lugar da data: o que a organização de fato confirmou. */
  dateLabel: "Fevereiro de 2027 · data a definir",
  /** Horário de largada declarado na apresentação. */
  startTime: "06:00" as string | null,

  /**
   * Três parques, um trajeto: largada no Tanguá, passagem pelo Tingui, chegada no Barigui.
   *
   * O percurso é o conceito do evento, então ele NÃO é campo de endereço: não
   * há uma rua, um número e um CEP que sirvam para uma prova que atravessa a
   * cidade entre dois parques. O que o schema.org precisa e o que o atleta
   * precisa são os mesmos dados: o nome do lugar e a cidade.
   */
  location: {
    /** Arena de chegada — onde todo percurso termina e onde o evento acontece. */
    venue: "Parque Barigui",
    /** Largada das provas de 16 km e 10,8 km. */
    startVenue: "Parque Tanguá",
    city: "Curitiba",
    state: "PR",
    region: "Paraná",
    /**
     * Etiqueta curta: cabe num chip do hero e numa linha de marquee. Sem o
     * "Parque" de cada nome: com três parques, a versão longa quebrava o
     * chip em duas linhas no celular.
     */
    label: "Tanguá → Tingui → Barigui",
    /** Linha única para hero, rodapé e ficha do JSON-LD. */
    full: "Parques Tanguá, Tingui e Barigui · Curitiba - PR",
  },

  /**
   * Link oficial de inscrição. É o destino de TODO CTA da página — não existe
   * checkout nem formulário próprio aqui.
   *
   * PENDÊNCIA 2: enquanto a organização não abrir a ticketeria, este link
   * aponta para a ficha pública do evento no site institucional — que existe,
   * é mantida por eles e é onde o link de venda vai aparecer. Não é um
   * checkout: a ficha não cobra nada, o que é preferível a um botão que
   * promete venda onde não há venda.
   *
   * Trocar pela página oficial de inscrição (TicketSports ou o que for) é UMA
   * linha, e é o único lugar do projeto onde um link de venda mora.
   */
  registrationUrl: "https://www.thomeesantos.com.br/event/corrida-verde",

  /**
   * Marca da prova no header: o lockup HORIZONTAL para fundo escuro —
   * símbolo (árvore em círculo, lima com contorno branco) e a palavra-marca
   * empilhada "Corrida / VERDE" em branco. Vetor oficial do kit enviado pela
   * Thomé & Santos em 15/10/2026 (`cv-horizontal-reverse.svg`), já na paleta
   * de app/theme.ts. SVG vai como veio: o next/image serve .svg sem passar
   * pelo otimizador, e o vetor fica nítido em qualquer densidade.
   *
   * Só vale em fundo escuro (o header é `tone-dark`). Para fundo claro o kit
   * tem `cv-horizontal.svg`; os originais ficam em
   * `midias-originais/logos-20261015/`, fora do git.
   *
   * O `alt` é vazio de propósito: a imagem mora dentro do link do header,
   * que já declara `aria-label={event.name}` — a imagem é decorativa ali,
   * e anunciar o nome duas vezes piora a leitura em tela de leitor.
   */
  logo: {
    src: "/images/cv-horizontal-reverse.svg",
    alt: "",
    width: 817,
    height: 271,
  } as Media,

  /**
   * Palavra-marca branca, empilhada, para o rodapé — `cv-wordmark-branco.svg`
   * do mesmo kit. Branca: só entra em fundo escuro.
   *
   * Enquanto for null, o rodapé escreve `event.name` em texto.
   */
  wordmark: {
    src: "/images/cv-wordmark-branco.svg",
    alt: "Corrida Verde",
    width: 519,
    height: 232,
  } as Media,

  /**
   * Foto de abertura do hero — a mesma da tela "Escala" do deck comercial
   * 2027: atleta sorrindo de braços abertos na trilha, com a camisa da prova,
   * e outras duas corredoras atrás. Original `DSC01135.jpg` (Sony A7C,
   * 08/02/2026 07h08 — o dia da edição de 2026), extraído do PSD do deck
   * (objeto inteligente embutido) para `midias-originais/psd/fotos/`;
   * derivado de web 1600×2127, q78.
   *
   * O layout é o do deck: texto à esquerda, foto na coluna direita, e a cor
   * do fundo dissolvendo sobre ela (ver HeroSection). A atleta está no terço
   * central-esquerdo da foto, que é o que fica em quadro no recorte da
   * coluna.
   */
  hero: {
    src: "/images/hero-atleta-trilha.jpg",
    alt: "Atleta da Corrida Verde sorrindo de braços abertos numa trilha arborizada, com outras corredoras atrás",
    width: 1600,
    height: 2127,
  } as Media,

  /**
   * Fotografia da prova para a seção de história ("Sempre em fevereiro").
   *
   * Pelotão de camisa verde da prova correndo no asfalto, com o pórtico ao
   * fundo — a comunidade que volta edição após edição, que é o assunto da
   * seção. Original `7S7A1987.jpg`, extraído do PSD da tela "Live Marketing"
   * do deck comercial 2027 (`midias-originais/psd/fotos/`); derivado de web
   * 1600×2363, q78. Entra no layout do deck: foto à direita com a cor da
   * seção dissolvendo sobre ela (SideMedia).
   *
   * A foto é de uma edição anterior, e nada na interface a apresenta como da
   * 11ª: se a organização quiser o crédito da edição, ele vai em `historia`.
   */
  photo: {
    src: "/images/historia-pelotao.jpg",
    alt: "Pelotão da Corrida Verde correndo no asfalto, com camisas verdes da prova e o pórtico ao fundo",
    width: 1600,
    height: 2363,
  } as Media,

  /**
   * Imagem de compartilhamento (Open Graph). PENDÊNCIA 5 resolvida.
   *
   * Composta a partir da identidade oficial: o lockup horizontal para fundo
   * escuro (`cv-horizontal-reverse.svg`, 760 px de largura) centralizado
   * sobre a chapa `theme.colors.forest`, 1200×630 (a
   * proporção do card grande). A arte original tem fundo transparente e
   * PNG transparente não serve de miniatura — o feed pinta de branco ou
   * de preto por baixo, sem pedido nosso. Se a paleta mudar em theme.ts,
   * recompor o PNG: o hex da chapa mora no arquivo, não no código.
   */
  ogImage: {
    src: "/images/corrida-verde-og.png",
    alt: "Logotipo da Corrida Verde",
    width: 1200,
    height: 630,
  } as Media | null,
} as const;

/* ---------------------------------------------------------------------------
 * Datas derivadas
 * ------------------------------------------------------------------------- */

/**
 * Rótulos de data, derivados de `event.date` num lugar só.
 *
 * Com `event.date` null, `short` é null e `label` cai no período confirmado
 * ("Fevereiro de 2027 · data a definir") — é isso que mantém a LP inteira
 * coerente quando o dia sair do ar, sem condicional espalhada por componente.
 */
export const eventDate = {
  /** Versão curta para a base do rodapé. `null` enquanto não há dia. */
  short: event.date ? formatEventDateShort(event.date) : null,
  /** Versão para chips e rodapé: a data completa com o horário, ou o período. */
  label: event.date
    ? `${formatEventDate(event.date)}${event.startTime ? ` · largada ${event.startTime}` : ""}`
    : event.dateLabel,
};

/** Domínio de produção, usado quando o ambiente não declara um. */
const fallbackSiteUrl = "https://www.corridaverde.com.br";

/**
 * Normaliza o que vier de NEXT_PUBLIC_SITE_URL.
 *
 * O `??` sozinho não dava conta: variável declarada na Vercel sem valor chega
 * como string VAZIA, e "" não é null nem undefined — o build de produção morria
 * em `new URL("")` (`ERR_INVALID_URL`) ao coletar /_not-found, enquanto local,
 * sem a variável, passava. Daí a checagem por conteúdo, e não por existência.
 *
 * Também aceita host sem protocolo (é a forma como `$VERCEL_URL` chega) e tira
 * a barra final, para canonical, sitemap e OG não divergirem por um "/".
 *
 * Valor irrecuperável cai no domínio de produção em vez de derrubar o build:
 * um canonical errado se conserta com rebuild, um deploy que não sobe, não.
 */
function resolveSiteUrl(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) return fallbackSiteUrl;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    // `pathname` preservado (permite o site num subcaminho), sem a barra final;
    // query e hash não fazem sentido num domínio base e ficam de fora.
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return fallbackSiteUrl;
  }
}

/**
 * Domínio público do site. Alimenta metadataBase, Open Graph, canonical,
 * sitemap e robots — um valor errado aqui propaga para todos de uma vez. Em
 * preview, defina NEXT_PUBLIC_SITE_URL (ver .env.example).
 */
export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/**
 * Descrição canônica: alimenta metadata, Open Graph e JSON-LD. Sem data, pelo
 * motivo do topo do arquivo. Abaixo de 155 caracteres para não ser truncada.
 */
export const seoTitle = "Corrida Verde 2027 · Curitiba — Desafio 10 Milhas";

/**
 * Nomes com que o evento pode ser buscado. Há outras "Corrida Verde" no país
 * (um circuito em Santa Catarina, uma prova em Brasília): para buscador e IA,
 * o nome sozinho é ambíguo, e é a cidade + o desafio que o separam delas.
 * Vai em `alternateName` no JSON-LD; o título da página (`seoTitle`) leva
 * cidade e ano pelo mesmo motivo.
 */
export const seoAlternateNames = [
  "Corrida Verde Curitiba",
  "Corrida Verde 2027",
  "Desafio 10 Milhas Curitiba",
  "Corrida Verde Desafio 10 Milhas",
];

export const seoDescription =
  "Corrida Verde · Desafio 10 Milhas: 16 km, 10,8 km e 5,8 km entre os parques Tanguá, Tingui e Barigui, em Curitiba. 11ª edição, fevereiro de 2027.";

/**
 * CTA de inscrição.
 *
 * POR ENQUANTO aponta para a lista de espera: a venda ainda não abriu, e o
 * botão de inscrição recolhe o contato de quem quer o aviso em vez de levar
 * a uma página sem venda. PENDÊNCIA 2 — quando a Thomé & Santos abrir as
 * inscrições, o `href` volta para `event.registrationUrl` (ou a ticketeria),
 * o rótulo vira "Inscreva-se" e a nota volta a dizer onde se compra. São as
 * únicas linhas do projeto que mudam.
 *
 * "Quero ser avisado" é o mesmo verbo do envio do formulário, e cabe numa
 * linha em 320px (17 caracteres contra os 21 do rótulo anterior).
 */
export const registrationCta = {
  label: "Quero ser avisado",
  href: "/lista-de-espera",
  note: "As inscrições ainda não abriram. Entre na lista de espera e receba o aviso de abertura por e-mail e WhatsApp.",
} satisfies Cta;

/* ---------------------------------------------------------------------------
 * Regulamento oficial (fonte viva, sem transcrição)
 * ------------------------------------------------------------------------- */

/**
 * Documento público do regulamento no Google Docs, enviado pela Thomé &
 * Santos. O site NÃO transcreve o texto: a página /regulamento busca o
 * documento a cada visita e renderiza o que ele disser naquele momento.
 * Quem edita é a organização, uma vez; o site acompanha.
 *
 * PENDÊNCIA 6: não existe documento publicado para a 11ª edição, então os três
 * campos são null e a página entra em estado vazio. Ela já está pronta para o
 * documento — preencher `docId` (e derivar as duas URLs) é o que liga a fonte.
 */
export const regulamentoSource = {
  docId: null as string | null,
  /** Export em texto plano — o documento é público, funciona sem login. */
  exportUrl: null as string | null,
  /** Abre o documento para leitura no próprio Google Docs. */
  viewUrl: null as string | null,
} as const;

/**
 * Derivado das URLs de fonte, para `lib/regulamento.ts` não montar a URL do
 * Google Docs em dois lugares.
 */
export const regulamentoExportUrl = regulamentoSource.docId
  ? `https://docs.google.com/document/d/${regulamentoSource.docId}/export?format=txt`
  : null;

/** Conteúdo da página /regulamento (copy em data, nunca no JSX). */
export const regulamentoPage = {
  intro: {
    eyebrow: "Regulamento oficial",
    title: "O documento da prova",
    description:
      "O texto abaixo é o regulamento oficial da Corrida Verde, carregado direto do Google Docs. Qualquer ajuste feito pela organização no documento aparece aqui — sem cópia intermediária.",
  } satisfies SectionIntro,
  sourceNote:
    "Fonte: documento oficial no Google Docs, editável pela organização.",
  emptyState: {
    eyebrow: "Regulamento oficial",
    title: "Regulamento a publicar",
    description:
      "A organização ainda não publicou o regulamento da 11ª edição. Quando publicar, o documento aparece aqui na íntegra — sem cópia intermediária. Até lá, a página oficial do evento é a fonte que vale.",
  } satisfies SectionIntro,
} as const;

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------- */

export const hero = {
  eyebrow: `${event.location.city} · ${event.location.state} · ${event.series.period}`,
  /**
   * Headline como segmentos: o verde é aplicado por dado, e ajustar a quebra de
   * linha (que é decisão de cartaz, não do navegador) é mexer só aqui.
   *
   * São duas linhas de propósito. "DE PARQUE A PARQUE" é o conceito do
   * evento e cabe na primeira tela com a tipo no teto do clamp, sem empurrar
   * o CTA para fora dela. Se a copy crescer e o navegador quebrar dentro da
   * máscara, as linhas passam a subir juntas no reveal e o efeito de cartaz se
   * perde — daí a conta: ~20 caracteres por linha, com o teto em 6rem.
   */
  headlineLines: [
    [{ text: "De parque" }],
    [{ text: "a parque", accent: true }, { text: "." }],
  ] satisfies HeadlineLine[],
  /** Versão em uma linha — vira o <h1> e alimenta o SEO. */
  headline: event.name,
  subheadline:
    "A corrida que atravessa a cidade mais verde do Brasil: largada no Parque Tanguá, passagem pelo Parque Tingui, chegada no Parque Barigui e uma arena no coração de Curitiba.",
  scrollHint: "Role para ver o trajeto",
  marquee: [
    "DE PARQUE A PARQUE",
    "10 MI",
    "6,7 MI",
    "3,6 MI",
    "2.000 VAGAS",
    "CURITIBA",
  ],
};

/* ---------------------------------------------------------------------------
 * Trajeto — Parque Tanguá → Parque Tingui → Parque Barigui
 * ------------------------------------------------------------------------- */

export const trajeto = {
  /**
   * Fundo da seção: a vista aérea de drone da mata, sob névoa — a tela "Seis
   * ideias para esta prova" do deck comercial 2027. Original
   * `DJI_20260208065238_0010_D.jpg` (08/02/2026 06h52), extraído do PSD
   * (`midias-originais/psd/fotos/`); derivado 1280×2045, q62 — entra a 45% e
   * quase some no meio, então o detalhe fino não aparece.
   *
   * `alt` vazio: é textura de fundo, o conteúdo da seção é o esquema.
   */
  backdrop: {
    src: "/images/trajeto-mata-drone.jpg",
    alt: "",
    width: 1280,
    height: 2045,
  } as Media,
  intro: {
    eyebrow: "O trajeto",
    title: "De parque a parque",
    description:
      "A marca não ocupa um ponto. Ocupa um trajeto: três parques e a cidade entre eles.",
  } satisfies SectionIntro,
  /**
   * O percurso é dado, não geometria: a ordem das paradas e o papel de cada uma
   * moram aqui, e o desenho do esquema (components/blocks/RouteDiagram.tsx)
   * acompanha.
   *
   * `role` não é decoração — é o que distingue as três coisas que o evento
   * faz: de onde o percurso sai, o que ele atravessa, e onde ele chega. Por
   * isso a terceira parada é a arena, e não um lugar qualquer.
   */
  stops: [
    {
      id: "tanguea",
      name: "Parque Tanguá",
      shortName: "Tanguá",
      role: "start",
      icon: "flag",
      caption: "Largada das provas de 16 km e 10,8 km, às 06h00",
    },
    {
      id: "tingui",
      name: "Parque Tingui",
      shortName: "Tingui",
      role: "through",
      icon: "tree",
      caption: "Passagem no meio do percurso, entre a largada e a chegada",
    },
    {
      id: "barigui",
      name: "Parque Barigui",
      shortName: "Barigui",
      role: "finish",
      icon: "finish",
      caption: "Chegada, arena, ativações e medalha",
    },
  ] satisfies RouteStop[],
  /** Fecho da seção: a informação que decide onde a pessoa fica. */
  arrivalNote:
    "Os três percursos terminam na mesma arena, no Parque Barigui. O percurso curto sai de lá e volta para lá.",
  /** Legenda do desenho, para quem não enxerga o esquema. */
  diagramLabel:
    "Esquema do trajeto: largada no Parque Tanguá, passagem pelo Parque Tingui e chegada no Parque Barigui.",
};

/* ---------------------------------------------------------------------------
 * Percursos (card-list)
 * ------------------------------------------------------------------------- */

export const races = {
  intro: {
    eyebrow: "Os percursos",
    title: "Todo percurso chega no Barigui",
    description:
      "Largada às 06h00 em todos os percursos. O percurso curto também aceita caminhada.",
  } satisfies SectionIntro,
  /**
   * `from`/`to` são a informação que diferencia esta prova das outras: os
   * 16 km e os 10,8 km saem de um parque e chegam em outro, e o 5,8 km sai e
   * termina no mesmo. A distância sozinha não conta a história do trajeto.
   *
   * A metragem principal é em MILHAS (é o "Desafio 10 Milhas"), com o km
   * pequeno embaixo. Conversão por 1 mi = 1,609344 km, uma casa decimal:
   * 10,8 km = 6,71 mi → "6,7 MI"; 5,8 km = 3,60 mi → "3,6 MI". O desafio é
   * "10 MI" pelo nome da prova: 10 mi = 16,09 km, e 16 km é o arredondamento
   * oficial — 9,9 mi seria contradizer o próprio nome do evento.
   */
  items: [
    {
      id: "desafio-10-milhas",
      eyebrow: "Desafio 10 milhas",
      icon: "run",
      title: "Desafio 10 Milhas",
      badge: "10 MI",
      badgeNote: "16 km",
      description:
        "A prova que dá nome ao desafio: 16 km do Parque Tanguá ao Parque Barigui, passando pelo Parque Tingui.",
      from: "Parque Tanguá",
      to: "Parque Barigui",
      meta: ["Corrida", "Largada e chegada em parques diferentes"],
      featured: true,
    },
    {
      id: "intermediario",
      eyebrow: "Percurso intermediário",
      icon: "run",
      title: "Intermediário",
      badge: "6,7 MI",
      badgeNote: "10,8 km",
      description:
        "O mesmo trajeto em versão curta: da largada no Parque Tanguá à chegada no Parque Barigui.",
      from: "Parque Tanguá",
      to: "Parque Barigui",
      meta: ["Corrida", "Mesma largada e chegada do desafio"],
    },
    {
      id: "curto",
      eyebrow: "Percurso curto",
      icon: "run",
      title: "Curto",
      badge: "3,6 MI",
      badgeNote: "5,8 km",
      description:
        "Para correr ou para caminhar: sai do Parque Barigui e volta para a mesma arena de chegada.",
      from: "Parque Barigui",
      to: "Parque Barigui",
      meta: ["Corrida e caminhada", "Largada e chegada no mesmo parque"],
    },
  ] satisfies CardItem[],
  /** Repetido embaixo dos cards: onde a pessoa precisa estar. */
  venueNote: event.location.full,
  /** PENDÊNCIA 4: sem mapa confirmado, sem botão de mapa. */
  route: null as { label: string; href: string; ariaLabel: string } | null,
};

/* ---------------------------------------------------------------------------
 * Ativações (icon-grid)
 * ------------------------------------------------------------------------- */

export const ativacoes = {
  intro: {
    eyebrow: "A experiência",
    title: "O que acontece na chegada",
    description:
      "As ativações que acompanham o atleta no Parque Barigui — e uma muda plantada para cada inscrição.",
  } satisfies SectionIntro,
  /**
   * São seis itens porque são seis os conceitos que a apresentação nomeia.
   * A conta do IconGridBlock importa aqui: 6 divide 3 colunas sem sobra, nas
   * duas linhas completas, em nenhum breakpoint. Item a mais ou a menos e a
   * grade deixa uma célula pendurada.
   */
  items: [
    {
      id: "muda",
      icon: "seedling",
      label: "Uma muda por atleta",
      detail: "Cada inscrição gera uma muda plantada em Curitiba, com certificado nominal",
    },
    {
      id: "km-do-parque",
      icon: "pen",
      label: "KM do Parque",
      detail: "Trecho do percurso assinado por uma marca",
    },
    {
      id: "hidratacao",
      icon: "cup",
      label: "Ponto de hidratação",
      detail: "Abastecimento com copo reutilizável",
    },
    {
      id: "mirante",
      icon: "camera",
      label: "Mirante da Foto",
      detail: "Ponto fotográfico com a moldura da marca",
    },
    {
      id: "recuperacao",
      icon: "recovery",
      label: "Espaço Recuperação",
      detail: "Alongamento e bem-estar na chegada",
    },
    {
      id: "medalha",
      icon: "medal",
      label: "Medalha com propósito",
      detail: "Medalha produzida com material sustentável",
    },
  ] satisfies IconItem[],
};

/* ---------------------------------------------------------------------------
 * Slide de impacto (chapa verde, texto quase preto)
 * ------------------------------------------------------------------------- */

export const impact = {
  lines: [
    /* Três linhas de mesmo peso: a frase é a repetição, e nenhuma das três
       pode ler como nota de rodapé da outra. */
    [{ text: "Verde no nome." }],
    [{ text: "Verde no percurso." }],
    [{ text: "Verde no discurso." }],
  ] satisfies HeadlineLine[],
  support:
    "O percurso liga três parques — Tanguá, Tingui e Barigui —, cada inscrição vira uma muda plantada em Curitiba e a medalha é feita de material sustentável. Verde é o assunto da prova, não a decoração da página.",
  /**
   * Corredor sozinho numa trilha de mata fechada — a tela "Onde a marca
   * aparece" do deck comercial 2027. Original `7S7A2308-Editar.jpg`
   * (`midias-originais/psd/fotos/`); derivado de web 1600×2343, q78.
   */
  media: {
    src: "/images/conceito-corredor-mata.jpg",
    alt: "Corredor com a camisa da Corrida Verde numa trilha de mata fechada",
    width: 1600,
    height: 2343,
  } as Media,
};

/* ---------------------------------------------------------------------------
 * Conceito da marca — seção da home e página /conceito
 * ------------------------------------------------------------------------- */

/**
 * O símbolo explicado pelo próprio designer.
 *
 * Fonte única: o vídeo `Logo_main_v3.mp4` (59 s, 1920×1080, sem áudio),
 * enviado pela Thomé & Santos em 16/10/2026 e assinado por Davis von Randow.
 * O texto abaixo é o que aparece na tela do vídeo, sem acréscimo — só a
 * quebra em título e lista é nossa. O original fica em `midias-originais/`;
 * em `public/videos/` vão os derivados de web (ver `film` e `loop`).
 *
 * TÍTULO SEM ACENTO de propósito: a Ranima (fonte da chamada) é o arquivo
 * demo e não tem Á/Ã/Ç (ver theme.metrics). "A araucária refletida numa gota"
 * vira eyebrow "A araucária" (Satoshi, que tem acento) + título "Refletida
 * numa gota" — a frase do vídeo, lida em dois tempos.
 */
export const conceito = {
  intro: {
    eyebrow: "A araucária",
    title: "Refletida numa gota",
    description:
      "O símbolo é o reflexo de uma araucária na superfície de uma gota d'água. Por isso o contorno não é um círculo.",
  } satisfies SectionIntro,
  /** O segundo parágrafo do vídeo: por que o círculo é torto. */
  shape: {
    title: "Um círculo falseforme",
    text: "A tensão superficial da gota deforma a geometria perfeita, e a árvore aparece de ponta-cabeça, como todo reflexo.",
  },
  /**
   * "Conceito + forma": a frase-guia e os cinco traços do desenho, na ordem
   * do vídeo. `label` é a coisa que o traço representa (o que vem entre
   * parênteses no original); `detail`, o traço em si.
   */
  form: {
    title: "Conceito + forma",
    lead: "Natureza vista com cuidado: organicidade contida por geometria quase perfeita.",
    traits: [
      { id: "gota", label: "A gota", detail: "Contorno circular irregular." },
      { id: "tronco", label: "O tronco", detail: "Eixo vertical dominante." },
      { id: "araucaria", label: "A araucária", detail: "Ramos assimétricos em espinha." },
      { id: "luz", label: "A luz", detail: "Ilhas de luz entre os ramos." },
      { id: "traco", label: "O traço", detail: "Traço de tinta, não de régua." },
    ] satisfies Pillar[],
  },
  principle:
    "Tudo que a marca produz obedece ao mesmo princípio: natureza sem rusticidade, precisão sem frieza.",
  /** A assinatura que fecha o vídeo. */
  credit: "Identidade visual por Davis von Randow",

  /**
   * O vídeo inteiro, para a página /conceito: a gota que vira símbolo, o
   * painel com o texto acima e a revelação do logo completo. Entra como
   * animação (LoopVideo), sem player e sem caixa: começa e termina na tela
   * vazia, então o loop fecha sem emenda. 1920×1080 para o texto do painel
   * continuar legível; sem legenda porque não há áudio — e o que está
   * escrito na tela está, em texto, na própria página.
   *
   * SEM CAIXA = FUNDO NA COR DA SEÇÃO. O fundo do original é #F1F2ED com
   * grão; na encodagem o grão sai (hqdn3d) e esse fundo é trocado por
   * `theme.colors.mist` (colorkey 0.07/0.10 sobre uma chapa da cor). Como os
   * PNGs de public/images/, é arquivo estático e não lê custom property:
   * se a névoa mudar em app/theme.ts, reencode. Comando, a partir da raiz:
   *
   *   ffmpeg -i midias-originais/Logo_main_v3.mp4 \
   *     -f lavfi -i "color=c=0x<MIST>:s=1920x1080:r=25" -an -filter_complex \
   *     "[0:v]hqdn3d=6:4:8:6,format=yuva444p,colorkey=0xF1F2ED:0.07:0.10[k];[1:v][k]overlay=shortest=1,format=yuv420p" \
   *     -c:v libx264 -preset slow -crf 26 -maxrate 1200k -bufsize 2400k \
   *     -movflags +faststart public/videos/conceito-simbolo.mp4
   *
   * Só MP4 (H.264): com a redução de ruído e teto de 1,2 Mbps deu 1,7 MB; o
   * VP9 na mesma qualidade deu 2,7 MB — o WebM saiu por ser maior, não
   * menor. Original de 119 MB → derivado de web 1,7 MB.
   */
  film: {
    sources: [
      { src: "/videos/conceito-simbolo.mp4", type: "video/mp4" },
    ],
    poster: "/videos/conceito-simbolo-poster.jpg",
    width: 1920,
    height: 1080,
    label:
      "Vídeo de apresentação do símbolo da Corrida Verde: uma gota cai, vira a araucária dentro do círculo, o conceito é explicado em texto e o logotipo completo aparece.",
  } as Video,

  /**
   * O `film` para celular (abaixo do `sm`). Em 16:9 numa tela de 390px o
   * painel de texto do vídeo vira miniatura ilegível — e esse texto já está
   * na página, em HTML. Aqui fica só o símbolo: recorte 580×580 em
   * (670, 220), ampliado a 720×720, o vídeo inteiro sem corte (o símbolo
   * pulsa e desfoca ao longo dos 59 s, não há trecho parado para tirar).
   * Medido: o texto do painel termina em x=662 à esquerda e começa em
   * x=1268 à direita, e o lockup final ocupa (720, 240)–(1200, 776) — tudo
   * dentro do quadro, nada do texto entra. Mesmo processo do `film`, com
   * `crop=580:580:670:220,scale=720:720:flags=lanczos` antes do hqdn3d,
   * chapa 720x720 e `-maxrate 700k`.
   */
  filmMobile: {
    sources: [
      { src: "/videos/conceito-simbolo-mobile.mp4", type: "video/mp4" },
    ],
    poster: "/videos/conceito-simbolo-mobile-poster.jpg",
    width: 720,
    height: 720,
    label:
      "Animação do símbolo da Corrida Verde: uma gota cai e vira a araucária dentro do círculo, que depois ganha a palavra-marca.",
  } as Video,

  /**
   * Recorte para a seção da home: a revelação do logo, de 38 s ao fim do
   * original (inclui o desfoque de saída — cortar em 52,6 s fazia o loop
   * saltar do logo inteiro para a tela vazia). O painel de texto não cabe
   * numa coluna e já está ao lado, em HTML.
   *
   * Recorte 720×720 em (600, 148), sem escala: o logo ocupa 480×536 px
   * centrado em (960, 508) do original — medido quadro a quadro — e fica com
   * ~70% da largura do quadro. Fundo trocado por `theme.colors.sprout`, o
   * tom da seção, pelo mesmo processo do `film` (mesmo filtro, com
   * `-ss 38`, `crop=720:720:600:148` antes do hqdn3d, chapa 720x720 e
   * `-maxrate 700k`). Trocou o broto ou o tom da seção, reencode.
   */
  loop: {
    sources: [
      { src: "/videos/conceito-logo-loop.mp4", type: "video/mp4" },
    ],
    poster: "/videos/conceito-logo-poster.jpg",
    width: 720,
    height: 720,
    label: "Animação do logotipo da Corrida Verde: o símbolo da araucária na gota e a palavra-marca aparecem e se desfazem.",
  } as Video,

  sectionCta: { label: "Conhecer o conceito", href: "/conceito" } satisfies Cta,

  page: {
    eyebrow: "Identidade visual · A araucária",
    /** <meta description> da rota; abaixo de 155 caracteres. */
    description:
      "O conceito do símbolo da Corrida Verde: uma araucária refletida numa gota d'água. Natureza sem rusticidade, precisão sem frieza.",
    backCta: { label: "Voltar para a prova", href: "/" } satisfies Cta,
  },
};

/* ---------------------------------------------------------------------------
 * Cardápio pós-corrida — seção da home e página /cardapio
 * ------------------------------------------------------------------------- */

/**
 * O brunch da chegada, transcrito do PDF `Cardapio-Corrida-Verde_final.pdf`
 * enviado pela Thomé & Santos em 19/10/2026 (em `midias-originais/`). O texto
 * é o do PDF, sem acréscimo; só a quebra em campos é nossa.
 *
 * O QUE O PDF NÃO DIZ, e por isso o site também não diz: se o brunch está
 * incluso na inscrição ou é vendido à parte, quanto custa, onde e em que
 * horário é servido e como o atleta escolhe a experiência. Nenhuma linha
 * abaixo insinua nada disso. Chegando a informação, entra em `intro` ou numa
 * nota própria — não em texto solto no componente.
 *
 * FOTOS: as quatro do zip `IMAGEM-20261019T162250Z-1-001.zip` (mesma pasta),
 * as mesmas do PDF. Derivados de web em `public/images/cardapio-*.jpg`, no
 * tamanho original e q78 (~250 KB cada, contra ~2,5 MB do PNG):
 *
 *   convert <original>.png -strip -interlace JPEG -sampling-factor 4:2:0 \
 *     -quality 78 public/images/cardapio-<prato>.jpg
 *
 * TÍTULOS: o título da seção e os das experiências não têm acento e vão na
 * Ranima; o nome dos pratos vai em Satoshi (`title-sans`), porque "Duas
 * versões de Avocado Toast" tem õ e a Ranima disponível não (ver
 * theme.metrics).
 */
export const cardapio = {
  intro: {
    eyebrow: "Cardápio pós-corrida",
    title: "O sabor de uma boa conquista.",
    description: "Depois de cada quilômetro, uma experiência para saborear.",
  } satisfies SectionIntro,
  lead: "A Corrida Verde preparou duas opções de cardápio que combinam ingredientes frescos, sabores marcantes e preparações artesanais. Uma experiência pensada para transformar o pós-corrida em mais um momento especial do seu dia.",
  closing: "Escolha o seu favorito. O próximo sabor da sua conquista começa aqui.",

  /**
   * Duas experiências, dois pratos cada. A home mostra a primeira foto de
   * cada uma; a página mostra todas.
   */
  experiences: [
    {
      id: "roast-beef-chocolate",
      number: "01",
      title: "Roast Beef & Chocolate",
      tagline: "Intenso, artesanal e irresistível.",
      dishes: [
        {
          id: "ciabatta",
          name: "Ciabatta de Roast Beef",
          tagline: "A combinação perfeita entre textura, frescor e sabor.",
          description:
            "Ciabatta artesanal de casca delicadamente crocante e interior macio, recheada com suculentas fatias de roast beef, queijo muçarela, alface americana fresca e um irresistível aioli artesanal. Cada mordida reúne intensidade, cremosidade e equilíbrio.",
          media: {
            src: "/images/cardapio-ciabatta-roast-beef.jpg",
            alt: "Dois sanduíches de ciabatta recheados com fatias de roast beef, alface e aioli, sobre uma bandeja dourada",
            width: 1122,
            height: 1402,
          },
        },
        {
          id: "cookie",
          name: "Cookie de Chocolate 70%",
          tagline: "Para finalizar, um toque de indulgência.",
          description:
            "Cookie amanteigado, levemente crocante por fora, macio por dentro e recheado com generosos pedaços de chocolate 70% cacau. A intensidade do chocolate na medida certa.",
          media: {
            src: "/images/cardapio-cookie-chocolate.jpg",
            alt: "Cookies com pedaços grandes de chocolate amargo sobre uma bandeja dourada",
            width: 1122,
            height: 1402,
          },
        },
      ],
    },
    {
      id: "avocado-cinnamon",
      number: "02",
      title: "Avocado & Cinnamon",
      tagline: "Frescor, criatividade e um toque de doçura.",
      dishes: [
        {
          id: "avocado-toast",
          name: "Duas versões de Avocado Toast",
          tagline:
            "O frescor do avocado encontra combinações surpreendentes, equilibrando texturas, aromas e ingredientes cuidadosamente selecionados.",
          variations: [
            {
              id: "ovo-hot-honey",
              name: "Ovo, hot honey & laranja",
              text: "Uma combinação surpreendente de sabores. Toast com pasta cremosa de avocado, creme de ricota com cream cheese, delicadas lascas de ovo ralado, gomos de laranja fresca e brotos selecionados. O toque final fica por conta do hot honey, um mel suavemente apimentado que cria um contraste irresistível entre o doce, o cítrico e o picante.",
            },
            {
              id: "tomates-balsamico",
              name: "Tomates assados & balsâmico",
              text: "Uma combinação leve, aromática e cheia de personalidade. Toast com avocado cremoso, creme de ricota com cream cheese, tomates-cereja lentamente assados, redução de balsâmico e microverdes frescos. Uma experiência que harmoniza o dulçor natural dos tomates com a acidez delicada do balsâmico.",
            },
          ],
          media: {
            src: "/images/cardapio-avocado-toast.jpg",
            alt: "Duas torradas de pão rústico com pasta de avocado e creme de ricota: uma com tomates-cereja assados, outra com ovo ralado, gomos de laranja e brotos",
            width: 1167,
            height: 1347,
          },
        },
        {
          id: "cinnamon-roll",
          name: "Cinnamon Roll",
          subtitle: "Creme de laranja",
          tagline: "Uma doce surpresa para completar a experiência.",
          description:
            "Pão de canela de massa delicadamente macia e aromática, coberto com um aveludado creme de laranja. Finalizado com raspas cítricas e um toque de laranja fresca, unindo aconchego, doçura e frescor em perfeita harmonia.",
          media: {
            src: "/images/cardapio-cinnamon-roll.jpg",
            alt: "Pães de canela cobertos com creme de laranja, raspas cítricas e um gomo de laranja, numa bandeja dourada",
            width: 1086,
            height: 1448,
          },
        },
      ],
    },
  ] satisfies MenuExperience[],

  /**
   * No PDF, as duas páginas fecham com a mesma faixa "A experiência
   * acompanha". Aqui ela aparece uma vez, depois das duas — por isso o rótulo
   * diz "as duas", que é o que o PDF mostra.
   */
  included: {
    label: "As duas experiências acompanham",
    items: ["Café coado", "Suco de laranja", "Salada de frutas frescas"],
  },

  sectionCta: { label: "Ver o cardápio completo", href: "/cardapio" } satisfies Cta,

  page: {
    /** <meta description> da rota; abaixo de 155 caracteres. */
    description:
      "O cardápio pós-corrida da Corrida Verde: duas experiências, Roast Beef & Chocolate e Avocado & Cinnamon, com café coado, suco e frutas.",
    backCta: { label: "Voltar para a prova", href: "/" } satisfies Cta,
  },
};

/* ---------------------------------------------------------------------------
 * Lista de espera
 * ------------------------------------------------------------------------- */

/**
 * Cadastro de quem quer o aviso de abertura das inscrições. NÃO é inscrição:
 * a venda continua só na página oficial (`registrationCta`). O formulário
 * posta em /api/lista-de-espera, que grava na lista do evento no CRM da
 * Thomé & Santos (URL, token e slug nas envs `CRM_*`, nunca no bundle).
 *
 * Copy vinda da LP de lista de espera da organização. A promessa de aviso
 * "antes da divulgação geral" é dela; o número de vagas é o mesmo 2.000 do
 * deck que o resto do site usa.
 */
export const waitlist = {
  intro: {
    eyebrow: "Lista de espera",
    title: "Saiba primeiro quando a venda abrir",
    description:
      "A 11ª edição tem 2.000 vagas. Quem está na lista recebe o aviso de abertura antes da divulgação geral.",
  } satisfies SectionIntro,
  benefits: [
    "Aviso por e-mail e WhatsApp no dia da abertura",
    "Novidades sobre percurso, kit e programação",
    "Cadastro gratuito, sem compromisso de inscrição",
  ],
  /**
   * As opções saem de `races.items`: milhas e km já estão conferidos lá (a
   * LP da organização dizia "3,7 milhas" para os 5,8 km — são 3,6). O
   * `value` é o texto que chega na planilha.
   */
  distances: races.items.map((race) => {
    const miles = (race.badge ?? "").replace(/\s*MI$/, " milhas");
    return {
      id: race.id,
      miles,
      km: race.badgeNote ?? "",
      detail: race.meta?.[0] ?? "",
      value: `${miles} (${race.badgeNote})`,
    };
  }),
  fields: {
    name: "Nome completo",
    email: "E-mail",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "(41) 99999-9999",
    city: "Cidade",
    distance: "Qual distância você pretende fazer?",
  },
  /** Sugestões do campo de cidade: Curitiba e a região metropolitana primeiro. */
  cities: [
    "Curitiba",
    "São José dos Pinhais",
    "Colombo",
    "Pinhais",
    "Araucária",
    "Campo Largo",
    "Almirante Tamandaré",
    "Fazenda Rio Grande",
    "Ponta Grossa",
    "Paranaguá",
  ],
  consent: {
    notice:
      "Quero receber o aviso de abertura e novidades da Thomé & Santos por e-mail e WhatsApp.",
    partners: "Aceito receber ofertas de parceiros da prova. Opcional.",
  },
  privacy: {
    text: "Usamos seus dados só para avisar sobre a Corrida Verde e, se você autorizar, para ofertas de parceiros. Veja a",
    linkLabel: "política de cookies e privacidade",
    href: "https://www.thomeesantos.com.br/politica-de-cookies",
  },
  errors: {
    name: "Escreva nome e sobrenome.",
    email: "Confira o e-mail. Ele precisa ter @ e um domínio, como nome@email.com.",
    whatsapp: "Informe o WhatsApp com DDD, por exemplo (41) 99999-9999.",
    city: "Informe sua cidade.",
    distance: "Escolha uma distância.",
    notice: "Marque esta opção para receber o aviso de abertura.",
    submit: "Não conseguimos registrar seu cadastro agora. Confira sua conexão e tente de novo.",
  },
  submitLabel: "Quero ser avisado",
  sendingLabel: "Enviando…",
  success: {
    title: "Você está na lista.",
    text: "Vamos avisar por e-mail e WhatsApp assim que as inscrições da Corrida Verde abrirem. Confira sua caixa de entrada e salve nosso contato.",
  },
  page: {
    /** <meta description> da rota; abaixo de 155 caracteres. */
    description:
      "Entre na lista de espera da 11ª Corrida Verde e receba por e-mail e WhatsApp o aviso de abertura das inscrições. São 2.000 vagas.",
    backCta: { label: "Voltar para a prova", href: "/" } satisfies Cta,
  },
};

/* ---------------------------------------------------------------------------
 * Propósito (chapa clara)
 * ------------------------------------------------------------------------- */

export const proposito = {
  intro: {
    eyebrow: "Por que a prova",
    title: "Mais que um nome",
    description:
      "Curitiba não é o palco da corrida: é a distância entre a largada e a chegada, e o que se atravessa no meio.",
  } satisfies SectionIntro,
  /**
   * São os eixos do posicionamento — esporte, natureza, cidade,
   * sustentabilidade, saúde e propósito. Deliberadamente NÃO são números: a
   * apresentação descreve o público (40+, classes A e B), mas isso é
   * caracterização de público, não métrica do evento, e virar número aqui
   * seria publicar um dado que a organização não confirmou.
   */
  pillars: [
    {
      id: "esporte",
      label: "Esporte",
      detail: "Corrida de rua de verdade, com percurso de cidade.",
    },
    {
      id: "natureza",
      label: "Natureza",
      detail: "Dois parques, mata e água: o trajeto é feito de paisagem.",
    },
    {
      id: "cidade",
      label: "Cidade",
      detail: "Curitiba é o que se atravessa entre um parque e outro.",
    },
    {
      id: "sustentabilidade",
      label: "Sustentabilidade",
      detail: "Uma muda por atleta e uma medalha produzida com material sustentável.",
    },
    {
      id: "saude",
      label: "Saúde",
      detail: "Corrida e caminhada na mesma prova, no percurso mais curto.",
    },
    {
      id: "proposito",
      label: "Propósito",
      detail: "Corrida com resultado que fica no chão: muda plantada e medalha sustentável.",
    },
  ] satisfies Pillar[],
  /** Fecho: a frase que resume o posicionamento, no lugar de um número. */
  closing: {
    lines: [
      [{ text: "A marca ocupa" }],
      [{ text: "um trajeto.", accent: true }],
    ] satisfies HeadlineLine[],
    support:
      "Do Parque Tanguá ao Parque Barigui, passando pelo Parque Tingui.",
  },
};

/* ---------------------------------------------------------------------------
 * História e escala (big-number)
 * ------------------------------------------------------------------------- */

export const historia = {
  intro: {
    eyebrow: "A tradição · 11ª edição",
    title: "Sempre em fevereiro",
    description:
      "Prova tradicionalmente realizada em fevereiro, com uma comunidade que comparece edição após edição.",
  } satisfies SectionIntro,
  /**
   * 2.000 vagas: é o número que a apresentação dá, e é o único dado de escala
   * publicado aqui. Não é meta, não é projeção e não é contagem de
   * participantes — a `caption` diz exatamente o que é, para o número não ser
   * lido como realizado.
   */
  number: {
    value: 2000,
    caption: "vagas na 11ª edição",
    note: "Todo atleta que concluir o percurso dentro do tempo recebe medalha. A premiação contempla 1º, 2º e 3º lugares.",
    emptyState: "",
  } satisfies BigNumber,
  kpis: [
    { id: "edicao", icon: "medal", label: "11ª edição" },
    { id: "largada", icon: "clock", label: "Largada às 06h00" },
    { id: "arena", icon: "finish", label: "Arena no Parque Barigui" },
    { id: "idade", icon: "shield", label: "A partir de 14 anos" },
  ] satisfies MiniKpi[],
};

/* ---------------------------------------------------------------------------
 * FAQ
 * ------------------------------------------------------------------------- */

export const faq = {
  intro: {
    eyebrow: "Dúvidas",
    title: "Antes de se inscrever",
  } satisfies SectionIntro,
  items: [
    {
      id: "data",
      question: "Qual é a data da 11ª edição?",
      answer:
        "A Corrida Verde acontece em fevereiro de 2027, e o dia exato ainda não foi divulgado. Assim que a organização confirmar, a data aparece aqui e na página oficial do evento — é de lá que sai a informação que vale.",
    },
    {
      id: "horario",
      question: "Qual é o horário de largada?",
      answer:
        "O horário de largada é 06h00. A programação completa — retirada de kit e largada de cada percurso — sai com o regulamento oficial, publicado na íntegra aqui no site.",
    },
    {
      id: "percursos",
      question: "Quais são as distâncias?",
      answer:
        "São três percursos: o Desafio 10 Milhas, de 16 km; o percurso intermediário, de 10,8 km; e o percurso curto, de 5,8 km.",
    },
    {
      id: "trajeto",
      question: "Onde começa e onde termina?",
      answer:
        "O Desafio 10 Milhas e o percurso intermediário saem do Parque Tanguá e chegam ao Parque Barigui. O percurso curto sai do Parque Barigui e termina nele. Os três convergem na mesma arena de chegada, onde ficam a medalha e as ativações.",
    },
    {
      id: "caminhada",
      question: "Dá para participar caminhando?",
      answer:
        "Dá no percurso curto, de 5,8 km: ele é aberto à caminhada. Os percursos de 10,8 km e 16 km são de corrida.",
    },
    {
      id: "idade",
      question: "Qual é a idade mínima?",
      answer:
        "A idade mínima de participação é 14 anos. A confirmação por percurso vem no regulamento oficial, que é o documento que vale no dia da prova.",
    },
    {
      id: "medalha",
      question: "Todo mundo recebe medalha?",
      answer:
        "Sim: todo atleta que concluir o percurso dentro do tempo recebe a medalha, produzida com material sustentável. A premiação contempla 1º, 2º e 3º lugares.",
    },
    {
      id: "chegada",
      question: "O que tem na chegada?",
      answer:
        "No Parque Barigui: Espaço Recuperação para alongamento e bem-estar, o Mirante da Foto, os pontos de hidratação com copo reutilizável e a entrega da medalha.",
    },
    {
      id: "sustentabilidade",
      question: "O que a prova faz de sustentável?",
      answer:
        "Cada inscrição gera uma muda plantada em Curitiba, com certificado nominal. A medalha é produzida com material sustentável e um trecho do percurso, o KM do Parque, é assinado por uma marca.",
    },
    {
      id: "inscricao",
      question: "Onde faço a inscrição?",
      answer:
        "As inscrições são vendidas pela Thomé & Santos na página oficial da Corrida Verde, para onde vão todos os botões de inscrição desta página. O link de venda aparece aqui assim que a organização abrir os lotes.",
    },
  ] satisfies FaqItem[],
};

/* ---------------------------------------------------------------------------
 * CTA final
 * ------------------------------------------------------------------------- */

export const finalCta = {
  eyebrow: `${event.series.season} · ${event.location.city}`,
  lines: [
    [{ text: "De parque" }],
    [{ text: "a parque", accent: true }, { text: "." }],
  ] satisfies HeadlineLine[],
  description:
    "As inscrições da 11ª Corrida Verde são vendidas na página oficial do evento, da Thomé & Santos. Lotes e valores estão lá — e o regulamento completo, publicado na íntegra aqui no site, é o que vale no dia da prova.",
};

/* ---------------------------------------------------------------------------
 * Navegação
 * ------------------------------------------------------------------------- */

export const mainNav: NavItem[] = [
  { label: "O trajeto", href: "#trajeto" },
  { label: "Os percursos", href: "#percursos" },
  { label: "Ativações", href: "#ativacoes" },
  { label: "O conceito", href: "/conceito" },
  { label: "Cardápio", href: "/cardapio" },
  { label: "A tradição", href: "#historia" },
  { label: "Dúvidas", href: "#faq" },
  { label: "Regulamento", href: "/regulamento" },
];