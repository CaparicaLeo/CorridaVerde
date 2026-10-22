/**
 * Tema da 11ª Corrida Verde — ÚNICA fonte dos hexes de marca do projeto.
 *
 * Regra do projeto: nenhum hex de marca fora daqui. Os tokens abaixo são
 * emitidos como custom properties `--cv-*` no <html> (ver `themeCss`), e o
 * `@theme` de app/globals.css apenas aponta para elas. Trocar uma cor aqui
 * muda o site inteiro; o CSS não precisa ser editado.
 *
 * Direção visual: esportivo + editorial + natureza + sustentabilidade. A
 * névoa clara domina a página, o verde vivo marca e age (botão, marquee,
 * chapa invertida), e o verde mata faz os intervalos e fecha as pontas.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PALETA DA IDENTIDADE (outubro/2026)
 *
 * Quatro cores enviadas pela Thomé & Santos, sem medição nem arredondamento:
 *   lima ...... #84C927 → ação e destaque (botão, marquee, chapa de impacto)
 *   mata ...... #192822 → texto sobre o claro; hero, header e rodapé
 *   névoa ..... #F6F5F0 → FUNDO DOMINANTE da página; texto sobre o escuro
 *   broto ..... #DAEFBE → intervalo entre seções de névoa
 *
 * A página é névoa com intervalos de cor: entre duas seções de névoa entra
 * uma de broto ou a chapa de lima, para o olho sentir a troca de assunto. O
 * mata fica no hero (a foto pede escuro), no header e no rodapé, onde o
 * lockup e a palavra-marca brancos pedem fundo escuro. Cada seção declara o tom
 * (`tone-*` em app/globals.css) e os componentes herdam `surface`/`ink`/
 * `line`/`accent-ink` dele, sem saber onde estão.
 *
 * Duas cores DERIVADAS, não enviadas — misturas das quatro acima:
 *   limaTinta .. #497024 = 45% lima + 55% mata. O lima não serve de TEXTO
 *                sobre o claro: dá 1.86:1 na névoa e 1.65:1 no broto. A
 *                mistura dá 5.30:1 na névoa e 4.71:1 no broto (AA para texto
 *                pequeno) e continua lendo como verde. É o eyebrow, o número
 *                e o destaque de headline nas chapas claras.
 *   mataFunda .. #131E1A = mata escurecida 25%: o degrau abaixo do escuro,
 *                para bloco sobre bloco no header e no rodapé.
 *
 * Contraste WCAG medido com a fórmula padrão:
 *   mata sobre névoa 14.06:1 · mata sobre broto 12.48:1
 *   névoa sobre mata 14.06:1 · lima sobre mata 7.58:1
 *   mata sobre lima 7.58:1 (texto do botão e da chapa de impacto)
 *
 * Os PNGs da marca (badge, ícone) são arte oficial e guardam os hexes da arte
 * — não são recoloridos a partir daqui.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const theme = {
  colors: {
    /** Névoa: fundo dominante da página; texto sobre o escuro. */
    mist: "#F6F5F0",
    /** Broto: intervalo entre seções de névoa; degrau (destaque, hover). */
    sprout: "#DAEFBE",
    /** Mata: texto sobre o claro; hero, header e rodapé. */
    forest: "#192822",
    /** Derivada: o degrau abaixo da mata (ver cabeçalho). */
    forestDeep: "#131E1A",
    /** Ação e destaque — preenchimento, nunca texto sobre o claro. */
    lime: "#84C927",
    /** Derivada: o lima que pode ser texto sobre névoa e broto. */
    limeInk: "#497024",
    /**
     * Erro de formulário (lista de espera). Não é cor da identidade: é o
     * vermelho funcional, escuro o bastante para texto pequeno — 6.49:1 na
     * névoa e 5.76:1 no broto. Só aparece junto da mensagem escrita; a cor
     * nunca é o único sinal do erro.
     */
    danger: "#A8261F",
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
     * Display de alto contraste com ligaduras, caixa alta — o "cartaz" da
     * prova, em Ranima (a fonte da palavra-marca; ver app/fonts.ts). Corpo,
     * labels e títulos menores são Satoshi. As métricas abaixo foram medidas
     * NA RANIMA e só valem para ela.
     */
    display: "ranima-uppercase",
    eyebrow: {
      case: "uppercase",
      tracking: "wide",
      color: "accent",
    },
  },

  /**
   * Métricas de cartaz — calibradas por fonte. NÃO copie de outro projeto.
   *
   * Medidas na Ranima Regular (unitsPerEm 2048), no arquivo que o next/font
   * serve (app/fonts/Ranima-Regular.woff2):
   *   caixa alta ....... 0.7031em acima da baseline (yMax do H; o 0 vai a
   *                      0.7056em)
   *   acentos .......... NÃO EXISTEM no arquivo demo — a chamada é escrita
   *                      sem eles. Se o arquivo licenciado trouxer Á/Ã/Ç,
   *                      remeça: o acento passa a ser o que estoura a caixa.
   *   Q / vírgula ...... 0.1313em / 0.0366em abaixo da baseline
   *   hhea asc/desc .... +0.838 / −0.204 (macOS, Linux)
   *   win asc/desc ..... +0.977 / −0.293 (Windows: o arquivo não liga
   *                      USE_TYPO_METRICS, então o Chrome no Windows usa win)
   *
   * `headlineLeading` 1.0. A caixa alta é 0.703em; 1.0 dá a mesma proporção
   * entrelinha/caixa alta (~1.42) que a calibração anterior tinha — a pilha
   * continua lendo como cartaz, sem vão de buraco entre as linhas.
   *
   * Com entrelinha 1.0, a baseline fica a 0.5 + (asc − desc)/2 do topo da
   * caixa de linha: 0.817em (hhea) / 0.842em (win). Logo:
   *   acima da baseline ... 0.817em ≥ 0.7056em de tinta → nada estoura
   *   abaixo da baseline .. 0.158em (o pior caso, win) ≥ 0.1313em do Q
   *
   * `headlineMaskPadTop` / `headlineMaskPadBottom` 0.06em: com a tinta
   * cabendo na caixa de linha nos dois sistemas, a folga da máscara é só
   * margem de antialias e de arredondamento de subpixel. TETO documentado: o
   * reveal translada a linha 115% da própria altura (`revealLines` em
   * lib/animations/presets.ts), e a janela vaza quando
   * padBottom > 0.15 × entrelinha = 0.15em.
   */
  metrics: {
    headlineLeading: "1",
    headlineMaskPadTop: "0.06em",
    headlineMaskPadBottom: "0.06em",
    /** A Ranima já tem o espaçamento de cartaz no desenho: sem recuo. */
    headlineTracking: "0em",
    /** Eyebrow/label: caixa alta pede tracking positivo para respirar. */
    labelTracking: "0.16em",
    /**
     * Cantos. Nada de quina viva nem de pílula: o site é editorial, e a
     * pílula lia como app; a quina, como planilha. Dois degraus só —
     *   control (8px) .. botão, campo, selo, chip do hero: peças de 44–56px
     *                    de altura, em que 8px arredonda sem virar cápsula;
     *   card (14px) .... cartão, foto emoldurada, grade de cards, formulário.
     * Foto de fundo que sangra até a borda da tela (hero, SideMedia,
     * backdrop do trajeto) continua reta: o canto ali seria da viewport.
     */
    radiusControl: "0.5rem",
    radiusCard: "0.875rem",
  },
} as const;

/**
 * Tema emitido como CSS. Injetado uma vez no <head> pelo layout raiz.
 *
 * Os nomes têm prefixo `--cv-` de propósito: os tokens do Tailwind
 * (`--color-*`, em globals.css) apontam para estes. Se as duas camadas
 * usassem o mesmo nome, uma sobrescreveria a outra. Aqui só mora a paleta
 * fixa; o que muda por seção (`surface`, `ink`…) é das classes `tone-*`.
 */
export const themeCss = `:root{
  --cv-mist:${theme.colors.mist};
  --cv-sprout:${theme.colors.sprout};
  --cv-forest:${theme.colors.forest};
  --cv-forest-deep:${theme.colors.forestDeep};
  --cv-lime:${theme.colors.lime};
  --cv-lime-ink:${theme.colors.limeInk};
  --cv-danger:${theme.colors.danger};
  --cv-headline-leading:${theme.metrics.headlineLeading};
  --cv-headline-mask-pad-top:${theme.metrics.headlineMaskPadTop};
  --cv-headline-mask-pad-bottom:${theme.metrics.headlineMaskPadBottom};
  --cv-headline-tracking:${theme.metrics.headlineTracking};
  --cv-label-tracking:${theme.metrics.labelTracking};
  --cv-radius-control:${theme.metrics.radiusControl};
  --cv-radius-card:${theme.metrics.radiusCard};
}`;
