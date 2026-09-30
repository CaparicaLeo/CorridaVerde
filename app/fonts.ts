import { Archivo, Archivo_Narrow, Saira_Condensed } from "next/font/google";

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
 * Headlines em estilo cartaz. A Saira Condensed é estática no peso 800 (não é
 * variável), então o que o build baixa é exatamente o arquivo medido em
 * app/theme.ts — sem eixo `opsz` ou `wght` capaz de mudar a altura do acento
 * por baixo dos panos.
 */
export const displayFont = Saira_Condensed({
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
