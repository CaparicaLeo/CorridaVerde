/**
 * Tema da 41ª Corrida Verde — ÚNICA fonte dos hexes de marca do projeto.
 *
 * Regra do projeto: nenhum hex de marca fora daqui. Os tokens abaixo são
 * emitidos como custom properties `--cv-*` no <html> (ver `themeCss`), e o
 * `@theme` de app/globals.css apenas aponta para elas. Trocar uma cor aqui
 * muda o site inteiro; o CSS não precisa ser editado.
 *
 * Direção visual: esportivo + editorial + natureza + sustentabilidade. Verde
 * quase preto domina a página como atmosfera, o verde vivo marca e age
 * (eyebrow, número, botão, chapa invertida), e a identidade aparece também
 * como LUZ Clara — a navegação da prova alterna seções escuras e claras.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PALETA SINCRONIZADA COM A IDENTIDADE (outubro/2026)
 *
 * Os dois verdes vêm do logo oficial, medidos no próprio PNG enviado pela
 * Thomé & Santos (histograma de corrida-verde-logo.png):
 *   verde quase preto .... #0F2D26 (376.010 px) → `background`
 *   verde lima ............ #91C43E (485.680 px) → `accent`
 * `backgroundAlt` não está no logo: é o degrau abaixo do fundo, derivado
 * com a MESMA razão por canal do par anterior (#050B07 sobre #08140D:
 * 0.625 / 0.55 / 0.538) → #091914. Continua sendo derivado, não medido.
 *
 * O verde lima trabalha em dois papéis opostos, e o par é o mesmo nos dois
 * sentidos — contraste WCAG de 7.14:1, medido com a fórmula padrão:
 *   1. texto de apoio (eyebrow, número, legenda) sobre o fundo quase preto;
 *   2. chapa cheia de lima com texto quase preto por cima (slide de
 *      impacto, marquee, botão) — o `text-surface` de sempre.
 * 7.14 passa AA e AAA para texto grande; para texto pequeno é AA.
 *
 * REGISTRO HONESTO: sobre a chapa branca (seção de propósito) o eyebrow
 * verde dá 2.07:1 — já dava 2.34:1 com o verde anterior, ou seja, a
 * decisão de manter o eyebrow verde sobre o branco é anterior a esta
 * troca e continua fora da faixa de contraste de texto. Se um dia isso
 * virar correção, o lugar é este bloco, não um hex solto no componente.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const theme = {
  colors: {
    /** Fundo dominante da página: verde quase preto (medido no logo). */
    background: "#0F2D26",
    /** Um degrau abaixo, para separar blocos sem desenhar borda. */
    backgroundAlt: "#091914",
    /**
     * Verde lima — cor de destaque e de ação, medida no logo oficial.
     * Ver a medição de contraste (7.14:1 nos dois usos) no cabeçalho.
     */
    accent: "#91C43E",
    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.7)",

    /**
     * Slide de impacto: fundo 100% accent, texto no background. São os mesmos
     * dois valores acima invertidos — ficam explícitos porque na identidade a
     * inversão é um padrão de layout, não um acaso.
     */
    inverseBackground: "#91C43E",
    inverseText: "#0F2D26",

    /**
     * Chapa clara. É a única parte da página que não é verde escuro: existe
     * para a navegação da prova respirar e para o verde vivo aparecer com o
     * contraste mais alto do site. A identidade é "verde escuro com luz", não
     * "verde por toda parte" — por isso são só duas, e uma delas é o branco.
     */
    light: "#FFFFFF",
    /** Um degrau acima da chapa, para regra e cartão sobre ela. */
    lightAlt: "#EEF1EC",
    /**
     * Linha e vão de grade sobre a chapa clara. Sobre o fundo escuro o papel é
     * de `white/10` (utilitário do Tailwind); aqui um preto de 10% é o
     * equivalente — branco sobre branco não desenha nada.
     */
    lineOnLight: "rgba(0,0,0,0.12)",
  },

  /**
   * Metal da medalha 3D procedural (components/medal/ProceduralMedal.tsx).
   *
   * Não é cor de identidade: é albedo PBR, lido pela luz e pelos reflexos do
   * Environment, então o tom que chega à tela depende do ângulo. Fica aqui
   * pela regra de "nenhum hex fora do tema".
   *
   * Prata, e não dourado: a direção da identidade fala em medalha produzida
   * com material sustentável, e a peça aparece sobre a chapa verde viva — um
   * ouro claro ali sumiria, um dourado escuro competiria com o verde. Os dois
   * tons ficam abaixo da prata pura de propósito: o relevo polido precisa
   * destacar do campo acetinado, que é o que faz a arte saltar.
   *
   * PROVISÓRIO: se a organização enviar o .glb, estas cores deixam de valer —
   * o material passa a vir do arquivo.
   */
  medal: {
    /** Relevo polido: borda, argola e o número da edição. */
    polished: "#C7CBC8",
    /** Campo do disco, acetinado e um tom abaixo, para o relevo destacar. */
    field: "#8E938F",
  },

  typography: {
    /**
     * Display didone, pesada, caixa alta — o "cartaz" da prova.
     * A família é escolhida em app/fonts.ts (Bodoni Moda 800); as métricas
     * abaixo foram medidas NESSE arquivo de fonte e só valem para ele.
     */
    display: "didone-bold-uppercase",
    eyebrow: {
      case: "uppercase",
      tracking: "wide",
      color: "accent",
    },
  },

  /**
   * Métricas de cartaz — calibradas por fonte. NÃO copie de outro projeto.
   *
   * Medidas na Bodoni Moda 800 (unitsPerEm 2000, lidas do próprio WOFF2 que o
   * next/font serve — instância estática, sem eixo `fvar`, baixada no build):
   *   caixa alta ....... 0.750em acima da baseline (OS/2 sCapHeight; o A tem
   *                      overshoot de tinta até 0.7645em)
   *   Á/É/Í/Ó/Ú/Ã ...... 1.0195em (yMax do glifo — é o acento que estoura a
   *                      caixa de linha; Â 1.0045, Ã 1.0065)
   *   Ç/Q .............. 0.2555em / 0.2500em abaixo da baseline
   *   hhea asc/desc .... +1.125 / -0.400 (iguais a typo e win: o cálculo
   *                      abaixo vale igual em Chrome, Firefox e Safari)
   *   dígitos .......... tnum disponível (o `tabular-nums` do poster-number
   *                      é ativo de verdade, não um no-op)
   *
   * `headlineLeading` 1.08: a distância entre baselines precisa ser maior que
   * o acento da linha de baixo (1.0195) para ele não cruzar a base da linha
   * de cima. Sobra 0.06em. Abaixo de 1.02 o acento encosta; acima de ~1.1 a
   * pilha perde o aspecto de cartaz (a caixa alta é baixa, 0.75em, e o vão
   * vira buraco).
   *
   * Com entrelinha 1.08 e conteúdo de linha 1.525em (asc + desc), o meio-
   * entrelinha é negativo (−0.2225em) e a caixa de linha sobra:
   *   acima da baseline ... 0.9025em → o acento (1.0195) estoura 0.117em
   *   abaixo da baseline .. 0.1775em → o Ç/Q (0.2555) estoura 0.078em
   *
   * `headlineMaskPadTop` 0.20em: dentro da máscara de reveal (overflow hidden
   * corta na padding box) a tinta do acento precisa de 0.117em para não ser
   * decepada — "JOSÉ" viraria "JOSE". 0.20em dá 0.083em de folga. A margem
   * negativa de mesmo valor devolve o espaço ao fluxo.
   *
   * `headlineMaskPadBottom` 0.10em: a cedilha do Ç desce 0.2555em e a caixa
   * de linha só dá 0.1775em — 0.078em de estouro, cobertos com folga. TETO
   * documentado: o reveal esconde a linha transladando-a em 115% da própria
   * altura (`revealLines` em lib/animations/presets.ts), então a janela vaza
   * (um pedaço do topo da linha aparece antes do tempo) quando
   * padBottom > 0.15 × entrelinha = 0.162em. 0.10em fecha a conta dos dois
   * lados.
   */
  metrics: {
    headlineLeading: "1.08",
    headlineMaskPadTop: "0.20em",
    headlineMaskPadBottom: "0.10em",
    /**
     * Bodoni Moda não é condensada (H avança 0.83em), mas o −0.01em é um
     * recuo leve, bom para caixa alta de cartaz — mantido da calibração
     * anterior e conferido no visual.
     */
    headlineTracking: "-0.01em",
    /** Eyebrow/label: caixa alta pede tracking positivo para respirar. */
    labelTracking: "0.16em",
  },
} as const;

/**
 * Tema emitido como CSS. Injetado uma vez no <head> pelo layout raiz.
 *
 * Os nomes têm prefixo `--cv-` de propósito: os tokens do Tailwind
 * (`--color-*`, em globals.css) apontam para estes. Se as duas camadas
 * usassem o mesmo nome, uma sobrescreveria a outra.
 */
export const themeCss = `:root{
  --cv-background:${theme.colors.background};
  --cv-background-alt:${theme.colors.backgroundAlt};
  --cv-accent:${theme.colors.accent};
  --cv-text:${theme.colors.text};
  --cv-text-muted:${theme.colors.textMuted};
  --cv-inverse-background:${theme.colors.inverseBackground};
  --cv-inverse-text:${theme.colors.inverseText};
  --cv-light:${theme.colors.light};
  --cv-light-alt:${theme.colors.lightAlt};
  --cv-line-on-light:${theme.colors.lineOnLight};
  --cv-headline-leading:${theme.metrics.headlineLeading};
  --cv-headline-mask-pad-top:${theme.metrics.headlineMaskPadTop};
  --cv-headline-mask-pad-bottom:${theme.metrics.headlineMaskPadBottom};
  --cv-headline-tracking:${theme.metrics.headlineTracking};
  --cv-label-tracking:${theme.metrics.labelTracking};
}`;