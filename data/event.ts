import { formatEventDate, formatEventDateShort } from "@/lib/format";

import type {
  BigNumber,
  CardItem,
  Cta,
  FaqItem,
  HeadlineLine,
  IconItem,
  Media,
  MiniKpi,
  NavItem,
  Pillar,
  RouteStop,
  SectionIntro,
} from "./types";

/**
 * ============================================================================
 * 41ª Corrida Verde — Desafio 10 Milhas · configuração única do site.
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
 * 1. DATA — em aberto. A 41ª edição acontece em FEVEREIRO DE 2027 e o dia
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
 * 5b. FOTOGRAFIA — quatro fotos da prova chegaram e DUAS estão no ar
 *    (`hero` e `photo`). Os originais (74 MB) ficam em `midias-originais/`,
 *    fora do git e fora de `public/`; em `public/images/` vão só os derivados
 *    de web, redimensionados. As outras duas fotos continuam em
 *    `midias-originais/` esperando lugar na página.
 *    PENDÊNCIA 8: os `alt` não foram conferidos — as imagens não puderam ser
 *    inspecionadas visualmente na integração, e as fotos são de 8 de fevereiro
 *    de 2026 (edição anterior, pelo EXIF), então nada as identifica como tal.
 *
 * 6. REGULAMENTO — em aberto. Não há documento publicado para a 41ª. A rota
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
  name: "41ª Corrida Verde — Desafio 10 Milhas",
  shortName: "Corrida Verde",
  /** Circuito/temporada — usado no rodapé e no header. */
  series: {
    slug: "corrida-verde",
    name: "Corrida Verde",
    /** "41ª edição" no rodapé e no cabeçalho do CTA final. */
    season: "41ª edição",
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
   * Dois parques, uma cidade no meio.
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
    /** Etiqueta curta: cabe num chip do hero e numa linha de marquee. */
    label: "Parque Tanguá → Parque Barigui",
    /** Linha única para hero, rodapé e ficha do JSON-LD. */
    full: "Parque Tanguá e Parque Barigui · Curitiba - PR",
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
   * Marca da prova — o badge circular (verde escuro sobre lima), arte
   * oficial enviada pela Thomé & Santos. PENDÊNCIA 5 resolvida: o header
   * deixou de usar o lockup tipográfico e renderiza este PNG.
   *
   * O arquivo é o derivado de web: o original chegou num canvas 1920×1080
   * e foi cortado na margem transparente, para os 1080×1035 do desenho —
   * em `public/images/` só entra o que a página serve. O original fica em
   * `midias-originais/`, fora do git.
   *
   * O `alt` é vazio de propósito: a imagem mora dentro do link do header,
   * que já declara `aria-label={event.name}` — a imagem é decorativa ali,
   * e anunciar o nome duas vezes piora a leitura em tela de leitor.
   */
  logo: {
    src: "/images/corrida-verde-logo.png",
    alt: "",
    width: 1080,
    height: 1035,
  } as Media,

  /**
   * Palavra-marca escrita (logotipo branco). Mesmo derivado: cortado na
   * altura real do texto, 1920×233, do canvas 1920×1080 original.
   *
   * Enquanto for null, o rodapé escreve `event.name` em texto (o estado
   * vazio do header, agora invertido de lugar). Como o branco da arte não
   * sobrevive a chapa clara, ela só entra em fundo escuro.
   */
  wordmark: {
    src: "/images/corrida-verde-escrita.png",
    alt: "Corrida Verde",
    width: 1920,
    height: 233,
  } as Media,

  /**
   * Foto de abertura do hero.
   *
   * Vertical 2:3 (2200×3300), a mais forte das quatro fotos recebidas: a ação
   * está na faixa 30–65% da altura, que é exatamente a faixa que o hero mostra
   * (ver `imageClassName` em HeroSection — a camada é 116% da tela e o cover
   * corta a largura, então o enquadramento útil é uma faixa central). O topo
   * quase preto e o rodapé escuro da foto também fazem o trabalho de fundo: a
   * headline branca do hero assenta no escuro da própria imagem, sem depender
   * só do gradiente.
   *
   * PENDÊNCIA 8: o `alt` NÃO foi conferido — as imagens não puderam ser
   * inspecionadas visualmente na hora da integração, e alt inventado é pior
   * que alt genérico. Confirmar o que a foto mostra e reescrever.
   */
  hero: {
    src: "/images/hero-corrida-verde.jpg",
    alt: "Atletas da Corrida Verde",
    width: 2200,
    height: 3300,
  } as Media,

  /**
   * Fotografia da prova para a seção de história.
   *
   * A seção fala de tradição e de 2.000 vagas, então a foto entra como
   * registro da prova — não como foto da 41ª edição. PENDÊNCIA 8: as fotos
   * recebidas são de 8 de fevereiro de 2026 (data da edição anterior, lida no
   * EXIF), e nada na interface as identifica como tal: se a organização quiser
   * o crédito da edição, ele vai em `historia`, como texto.
   */
  photo: {
    src: "/images/corrida-verde-pelotao.jpg",
    alt: "Atletas da Corrida Verde",
    width: 1200,
    height: 1722,
  } as Media,

  /**
   * Imagem de compartilhamento (Open Graph). PENDÊNCIA 5 resolvida.
   *
   * Composta a partir da identidade oficial: a palavra-marca branca
   * centralizada sobre a chapa `theme.colors.background`, 1200×630 (a
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
const fallbackSiteUrl = "https://corridaverde.thomeesantos.com.br";

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
export const seoDescription =
  "Corrida Verde · Desafio 10 Milhas: 16 km, 10,8 km e 5,8 km entre o Parque Tanguá e o Parque Barigui, em Curitiba. 41ª edição, fevereiro de 2027.";

/**
 * CTA de inscrição.
 *
 * O rótulo não promete o que não se pode garantir daqui: manda para a página
 * da organização, que é quem diz se o lote está aberto, em espera ou
 * esgotado. PENDÊNCIA 2 — quando a Thomé & Santos confirmar que as inscrições
 * estão abertas, este rótulo pode virar "Inscreva-se" e o `href` apontar para
 * a ticketeria. São as duas únicas linhas do projeto que mudam.
 */
export const registrationCta = {
  label: "Ver onde se inscrever",
  href: event.registrationUrl,
  note: "Você será levado à página oficial da Corrida Verde, da Thomé & Santos, onde as inscrições são vendidas.",
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
 * PENDÊNCIA 6: não existe documento publicado para a 41ª edição, então os três
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
    title: "Documento ainda não publicado",
    description:
      "A organização ainda não publicou o regulamento da 41ª edição. Quando publicar, o documento aparece aqui na íntegra — sem cópia intermediária. Até lá, a página oficial do evento é a fonte que vale.",
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
    "A corrida que atravessa a cidade mais verde do Brasil: largada no Parque Tanguá, chegada no Parque Barigui e uma arena no coração de Curitiba.",
  scrollHint: "Role para ver o trajeto",
  marquee: [
    "DE PARQUE A PARQUE",
    "16 KM",
    "10,8 KM",
    "5,8 KM",
    "2.000 VAGAS",
    "CURITIBA",
  ],
};

/* ---------------------------------------------------------------------------
 * Trajeto — Parque Tanguá → Curitiba → Parque Barigui
 * ------------------------------------------------------------------------- */

export const trajeto = {
  intro: {
    eyebrow: "O trajeto",
    title: "De parque a parque",
    description:
      "A marca não ocupa um ponto. Ocupa um trajeto: dois parques e a cidade inteira no meio.",
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
      role: "start",
      icon: "flag",
      caption: "Largada das provas de 16 km e 10,8 km, às 06h00",
    },
    {
      id: "curitiba",
      name: "Curitiba",
      role: "through",
      icon: "city",
      caption: "A cidade mais verde do Brasil no meio do percurso",
    },
    {
      id: "barigui",
      name: "Parque Barigui",
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
    "Esquema do trajeto: largada no Parque Tanguá, percurso pela cidade de Curitiba e chegada no Parque Barigui.",
};

/* ---------------------------------------------------------------------------
 * Percursos (card-list)
 * ------------------------------------------------------------------------- */

export const races = {
  intro: {
    eyebrow: "Os percursos",
    title: "Três distâncias, uma chegada",
    description:
      "Largada às 06h00 em todos os percursos. O percurso curto também aceita caminhada.",
  } satisfies SectionIntro,
  /**
   * `from`/`to` são a informação que diferencia esta prova das outras: os
   * 16 km e os 10,8 km saem de um parque e chegam em outro, e o 5,8 km sai e
   * termina no mesmo. A distância sozinha não conta a história do trajeto.
   */
  items: [
    {
      id: "desafio-10-milhas",
      eyebrow: "Desafio 10 milhas",
      icon: "run",
      title: "Desafio 10 Milhas",
      badge: "16 KM",
      description:
        "A prova que dá nome ao desafio: 16 km atravessando a cidade do Parque Tanguá ao Parque Barigui.",
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
      badge: "10,8 KM",
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
      badge: "5,8 KM",
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
    [{ text: "Verde não" }, { text: " é a cor.", accent: true }],
    [{ text: "É o discurso.", accent: true }],
  ] satisfies HeadlineLine[],
  support:
    "O percurso atravessa dois parques e a cidade entre eles, cada inscrição vira uma muda plantada em Curitiba e a medalha é feita de material sustentável. Verde é o assunto da prova, não a decoração da página.",
};

/* ---------------------------------------------------------------------------
 * Propósito (chapa clara)
 * ------------------------------------------------------------------------- */

export const proposito = {
  intro: {
    eyebrow: "Por que a prova",
    title: "Verde não é só o nome",
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
      [{ text: "A marca não ocupa" }],
      [{ text: "um ponto.", accent: true }],
    ] satisfies HeadlineLine[],
    support:
      "Ocupa um trajeto — do Parque Tanguá ao Parque Barigui, atravessando a cidade.",
  },
};

/* ---------------------------------------------------------------------------
 * História e escala (big-number)
 * ------------------------------------------------------------------------- */

export const historia = {
  intro: {
    eyebrow: "A tradição",
    title: "41ª edição, sempre em fevereiro",
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
    caption: "vagas na 41ª edição",
    note: "Todo atleta que concluir o percurso dentro do tempo recebe medalha. A premiação contempla 1º, 2º e 3º lugares.",
    emptyState: "",
  } satisfies BigNumber,
  kpis: [
    { id: "edicao", icon: "medal", label: "41ª edição" },
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
      question: "Qual é a data da 41ª edição?",
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
    "As inscrições da 41ª Corrida Verde são vendidas na página oficial do evento, da Thomé & Santos. Lotes e valores estão lá — e o regulamento completo, publicado na íntegra aqui no site, é o que vale no dia da prova.",
};

/* ---------------------------------------------------------------------------
 * Navegação
 * ------------------------------------------------------------------------- */

export const mainNav: NavItem[] = [
  { label: "O trajeto", href: "#trajeto" },
  { label: "Os percursos", href: "#percursos" },
  { label: "Ativações", href: "#ativacoes" },
  { label: "A tradição", href: "#historia" },
  { label: "Dúvidas", href: "#faq" },
  { label: "Regulamento", href: "/regulamento" },
];