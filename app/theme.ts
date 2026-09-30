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
 * PENDÊNCIA 1 — PALETA PROVISÓRIA (setembro/2026)
 *
 * Os hexes abaixo NÃO vieram da apresentação oficial: a direção foi descrita
 * em palavras ("verde muito escuro / quase preto", "verde vivo", "branco",
 * "cinza claro", "preto") e foi convertido em valores de trabalho. Estão
 * marcados como PROVISÓRIO para troca em bloco quando a Thomé & Santos enviar
 * a identidade final.
 *
 * O verde vivo foi escolhido com dois requisitos medidos, porque ele trabalha
 * em dois papéis opostos ao mesmo tempo:
 *   1. texto de apoio (eyebrow, número, legenda) sobre o fundo quase preto —
 *      exige contraste alto;
 *   2. chapa cheia de fundo com texto no quase preto por cima (o slide de
 *      impacto e as faixas de marquee) — exige o MESMO número, ao contrário.
 * `#63BE3F` dá 8.1:1 contra `#08140D` nos dois usos. Um verde mais vivo e
 * mais claro (#B6FF3C, por exemplo) reprova por completo no segundo uso: o
 * quase preto vira ilegível sobre ele. Se o verde da identidade for mais
 * claro que isto, ele NÃO pode virar chapa — tem que ser acento sobre fundo
 * escuro, e a inversão da seção precisa de um tom próprio.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const theme = {
  colors: {
    /** Fundo dominante da página: verde quase preto. */
    background: "#08140D",
    /** Um degrau abaixo, para separar blocos sem desenhar borda. */
    backgroundAlt: "#050B07",
    /**
     * Verde vivo — cor de destaque e de ação. Ver a medição de contraste no
     * cabeçalho deste arquivo antes de trocar o valor.
     */
    accent: "#63BE3F",
    text: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.7)",

    /**
     * Slide de impacto: fundo 100% accent, texto no background. São os mesmos
     * dois valores acima invertidos — ficam explícitos porque na identidade a
     * inversão é um padrão de layout, não um acaso.
     */
    inverseBackground: "#63BE3F",
    inverseText: "#08140D",

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
     * Display condensada, pesada, caixa alta — o "cartaz" da prova.
     * A família é escolhida em app/fonts.ts (Saira Condensed 800); as métricas
     * abaixo foram medidas NESSE arquivo de fonte e só valem para ele.
     */
    display: "condensed-bold-uppercase",
    eyebrow: {
      case: "uppercase",
      tracking: "wide",
      color: "accent",
    },
  },

  /**
   * Métricas de cartaz — calibradas por fonte. NÃO copie de outro projeto.
   *
   * Medidas na Saira Condensed 800 (unitsPerEm 1000, lidas do próprio TTF):
   *   caixa alta ....... 0.696em acima da baseline
   *   Á/É/Í/Ó/Ú/Ã ...... 0.898em (é o acento que estoura a caixa de linha)
   *   Ç/Q .............. até 0.189em abaixo da baseline
   *   hhea asc/desc .... +1.135 / -0.439 (iguais a typo e win: o cálculo
   *                      abaixo vale igual em Chrome, Firefox e Safari)
   *
   * `headlineLeading` 1.04: a distância entre baselines precisa ser maior que
   * o acento da linha de baixo (0.898) para ele não encostar na base da linha
   * de cima. Sobra 0.142em — o suficiente para "DE PARQUE" sobre "A PARQUE"
   * ler como duas linhas. Abaixo de 1.0 o acento encosta; acima de 1.1 a pilha
   * perde o aspecto de cartaz (a caixa alta é baixa, 0.696em, e o vão vira
   * buraco).
   *
   * `headlineMaskPadTop` 0.10em: dentro da máscara de reveal (overflow hidden)
   * a tinta do acento fica 0.03em acima do topo da caixa de linha e seria
   * decepada — "JOSÉ" viraria "JOSE". 0.10em é ~3x o necessário, para
   * absorver arredondamento de subpixel. A margem negativa de mesmo valor
   * devolve o espaço ao fluxo.
   *
   * `headlineMaskPadBottom` 0.08em: a cauda do Ç desce 0.189em e a caixa de
   * linha termina 0.172em abaixo da baseline — sem essa folga, "COMEÇA" perde
   * a cedilha na máscara.
   */
  metrics: {
    headlineLeading: "1.04",
    headlineMaskPadTop: "0.10em",
    headlineMaskPadBottom: "0.08em",
    /** A Saira Condensed já é estreita; tracking negativo forte fecha demais. */
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