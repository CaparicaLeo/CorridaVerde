import { Bodoni_Moda } from "next/font/google";

/**
 * Tipografia da Corrida Verde, auto-hospedada por next/font (sem request para
 * o Google em runtime e sem layout shift).
 *
 * Bodoni Moda — a didone oficial da identidade — é a ÚNICA família da página:
 * serve o corpo (400), os labels/eyebrows (600) e os títulos de cartaz (800).
 * Não há mais família sans: os tokens `--font-sans` e `--font-condensed` de
 * globals.css apontam para esta mesma variável.
 *
 * A variável usa o prefixo `--ff-*` de propósito: os tokens de fonte do
 * Tailwind (`--font-display`, `--font-sans`, `--font-condensed`, em
 * globals.css) apontam para ela. Se as duas camadas usassem o mesmo nome, a
 * declaração do next/font sobrescreveria o token do tema no <html>.
 *
 * Trocar a família exige recalibrar `theme.metrics`: entrelinha e folga de
 * máscara saem das métricas do arquivo de fonte, não do gosto.
 */

/**
 * Cartaz, corpo e labels em Bodoni Moda. A família é variável no Google: o
 * next/font serve o arquivo com eixo `wght` (a tabela `fvar` está lá) e o
 * @font-face declara os três pesos usados — 400 (corpo), 600 (labels) e 800
 * (cartaz). A lista restringe o CSS aos pesos que a página de fato usa.
 *
 * O `theme.metrics` foi medido no eixo wght=800 deste mesmo arquivo servido,
 * e o 800 do eixo reproduz os números da instância antes calibrada. Trocar a
 * calibração do eixo (alguém acrescentar `opsz`) exige remedir.
 */
export const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--ff-display",
  display: "swap",
});

export const fontVariables = displayFont.variable;