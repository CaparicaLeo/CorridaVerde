import { Archivo, Archivo_Narrow, Bodoni_Moda } from "next/font/google";

/**
 * Tipografia da Corrida Verde, auto-hospedada por next/font (sem request para
 * o Google em runtime e sem layout shift).
 *
 * As variáveis usam o prefixo `--ff-*` de propósito: os tokens de fonte do
 * Tailwind (`--font-display`, `--font-sans`, `--font-condensed`, em
 * globals.css) apontam para elas. Se as duas camadas usassem o mesmo nome, a
 * declaração do next/font sobrescreveria o token do tema no <html>.
 *
 * Trocar a display exige recalibrar `theme.metrics`: entrelinha e folga de
 * máscara saem das métricas do arquivo de fonte, não do gosto.
 */

/**
 * Headlines em estilo cartaz: Bodoni Moda, a didone oficial da identidade,
 * no peso 800 — mesma ancoragem de peso da Saira Condensed anterior, para o
 * utilitário `.headline` (que declara font-weight 800) continuar no peso
 * certo sem mexer em CSS.
 *
 * Peso único, sem eixo declarado: o que o build baixa é um arquivo só,
 * medido em app/theme.ts — sem eixo `opsz` ou `wght` capaz de mudar a
 * altura do acento por baixo dos panos.
 */
export const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  weight: "800",
  variable: "--ff-display",
  display: "swap",
});

/** Corpo de texto. */
export const bodyFont = Archivo({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

/** Eyebrows, labels de card, números pequenos e rodapé. */
export const condensedFont = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--ff-condensed",
  display: "swap",
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  condensedFont.variable,
].join(" ");
