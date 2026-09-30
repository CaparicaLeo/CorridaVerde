/**
 * Tipos da camada de dados.
 *
 * Este projeto é da Corrida Verde e só dela: os tipos existem para dar
 * autocomplete e travar estados vazios, não para ser compatível com nenhum
 * outro site.
 */

/** Imagem com proporção declarada — o espaço é reservado, sem layout shift. */
export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Um pedaço de headline. `accent: true` pinta o trecho de verde — é o
 * destaque de palavra-chave do deck.
 */
export type HeadlineSegment = { text: string; accent?: boolean };

/**
 * Headline como dado, nunca escrita direto no JSX: cada linha é uma máscara
 * de reveal, e ajustar a copy (ou a quebra de linha) é editar este arquivo.
 */
export type HeadlineLine = HeadlineSegment[];

export type Cta = {
  label: string;
  href: string;
  /** Texto auxiliar exibido abaixo do botão. */
  note?: string;
};

export type SectionIntro = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/** Item do icon-grid (ativações, propósito). */
export type IconItem = {
  id: string;
  /** Chave resolvida em components/ui/Icon.tsx */
  icon: string;
  label: string;
  /** Linha de apoio sob o rótulo. Opcional porque nem todo item tem. */
  detail?: string;
};

/**
 * Card do card-list: eyebrow + ícone + título + linhas de apoio.
 *
 * `from`/`to` descrevem o trajeto da prova (de onde sai, onde chega). São os
 * dois campos que fazem a seção de percursos do evento de dois parques: sem
 * eles o card só diria o quanto, e não onde.
 */
export type CardItem = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  /** Linha de destaque à direita do título (ex.: "10,8 KM"). */
  badge?: string;
  description?: string;
  /** Par Largada → Chegada. Vazio esconde a linha. */
  from?: string;
  to?: string;
  meta?: string[];
  featured?: boolean;
};

/** Mini-KPI da fileira abaixo do número grande. */
export type MiniKpi = {
  id: string;
  icon: string;
  label: string;
};

/**
 * Estatística de cartaz.
 *
 * `value: null` NÃO é um bug e nem vira "0" ou "—" na tela: é o estado vazio.
 * O bloco troca o número por uma frase de "a confirmar" e por um link para a
 * fonte oficial. Nenhum número que a Thomé & Santos ainda não confirmou pode
 * aparecer aqui com cara de definitivo.
 */
export type BigNumber = {
  value: number | null;
  prefix?: string;
  suffix?: string;
  caption: string;
  note?: string;
  /** Texto exibido quando `value` é null. */
  emptyState: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type NavItem = { label: string; href: string };

/**
 * Uma parada do trajeto — o esquema "de parque a parque".
 *
 * O percurso é o conceito do evento ("a marca não ocupa um ponto, ocupa um
 * trajeto"), então ele é dado e não geometria: mudar a ordem ou o nome é
 * editar `data/event.ts`, e o desenho acompanha.
 */
export type RouteStop = {
  id: string;
  /** Nome do lugar, como o atleta o conhece. */
  name: string;
  /** Papel na prova: onde entra, onde sai, o que atravessa. */
  role: "start" | "through" | "finish";
  /** O que acontece ali. Uma linha, sem número. */
  caption?: string;
  /** Chave de ícone em components/ui/Icon.tsx. */
  icon: string;
};

/**
 * Pilar de posicionamento — o que a prova é, em uma palavra de capa.
 *
 * Não são métricas e não viram número em nenhum lugar: são os eixos do discurso
 * (esporte, natureza, cidade, sustentabilidade, saúde, propósito).
 */
export type Pillar = {
  id: string;
  label: string;
  detail: string;
};

/**
 * Regulamento oficial: estrutura devolvida pelo parser de lib/regulamento.ts.
 *
 * O texto NÃO é transcrito em data/event.ts — a fonte viva vive no Google Docs
 * (ver `regulamentoSource`). Este tipo só descreve a árvore que a página
 * /regulamento renderiza, então conteúdo e marca não podem divergir: se o
 * documento mudar, muda a árvore, muda a página.
 */
export type RegulamentoItem = {
  /** Número do item no documento (ex.: "5.1"); vazio para blocos sem número. */
  number: string;
  /** Linhas do item na ordem do documento, com os espaços internos preservados
   *  (a tabela de categorias do cap. 10 depende disso para não perder as colunas). */
  lines: string[];
};

export type RegulamentoChapter = {
  /** Número do capítulo no documento (ex.: "5"). */
  number: string;
  /** Título do capítulo, em caixa alta como no original (ex.: "COMPOSIÇÃO DO KIT"). */
  title: string;
  items: RegulamentoItem[];
};

export type RegulamentoDocument = {
  /** Primeira linha do documento (o nome completo do regulamento). */
  title: string;
  /** Assinatura de data ao final ("Curitiba, 06 de abril de 2026."), se houver. */
  issuedAt: string | null;
  chapters: RegulamentoChapter[];
};