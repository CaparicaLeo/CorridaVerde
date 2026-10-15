import localFont from "next/font/local";

/**
 * Tipografia da Corrida Verde, auto-hospedada por next/font (sem request para
 * fora em runtime e sem layout shift).
 *
 * Duas famílias, dois papéis:
 *   - CHAMADA (headline de seção, chapa de impacto e número de cartaz):
 *     Ranima Regular, a fonte da palavra-marca. O arquivo é a versão DEMO
 *     ("Demo for Personal Use", ifonts.xyz) e tem 155 glifos: NENHUM acento
 *     nem cedilha. Por isso as chamadas foram escritas sem acento (ver
 *     data/event.ts) e títulos com nome próprio acentuado ("Parque Tanguá",
 *     "Intermediário") usam `title-sans`, na Satoshi. Antes de publicar, a
 *     licença comercial de webfont precisa ser comprada (Creative Market,
 *     AnnofaType); se o arquivo licenciado trouxer acentos, as chamadas
 *     podem voltar a ter.
 *   - TEXTO CORRIDO, labels e títulos menores: Satoshi (Fontshare, ITF Free
 *     Font License — uso comercial e auto-hospedagem permitidos, ver a
 *     cláusula 01 da licença). Arquivo variável, eixo wght 300–900.
 *
 * As variáveis usam o prefixo `--ff-*` de propósito: os tokens de fonte do
 * Tailwind (`--font-display`, `--font-sans`, `--font-condensed`, em
 * globals.css) apontam para elas. Se as duas camadas usassem o mesmo nome, a
 * declaração do next/font sobrescreveria o token do tema no <html>.
 *
 * Trocar a família de CHAMADA exige recalibrar `theme.metrics`: entrelinha e
 * folga de máscara saem das métricas do arquivo de fonte, não do gosto.
 */

/**
 * Chamada em Ranima. Um peso só (400): `.headline` e `.poster-number` pedem
 * 400 e desligam `font-synthesis`, senão o navegador engrossaria o desenho
 * artificialmente. `theme.metrics` foi medido neste arquivo.
 */
export const displayFont = localFont({
  src: "./fonts/Ranima-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--ff-display",
  display: "swap",
});

/**
 * Corpo e labels em Satoshi. A Satoshi não tem ª/º: o "41ª" cai no fallback
 * sans da pilha em globals.css, que é o mais próximo do desenho dela.
 */
export const bodyFont = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--ff-body",
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
