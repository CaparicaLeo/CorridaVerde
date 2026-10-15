"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { formatNumber } from "@/lib/format";

export const EASE = "power3.out";

/**
 * O ritmo ÚNICO de entrada do site. Antes cada seção e cada bloco tinham o
 * seu (y de 18 a 32, duração de 0.7 a 1.1, gatilho de 72% a 92%), e a página
 * parecia montada por pessoas diferentes. Mexa aqui, não na chamada.
 */
export const MOTION = {
  /** Deslocamento da entrada, em px. */
  distance: 24,
  duration: 0.8,
  /** Intervalo entre elementos que entram juntos. */
  stagger: 0.08,
  /** Onde o TOPO do elemento precisa chegar para ele entrar. */
  start: "top 88%",
  /** Linhas de headline: um pouco mais lentas, porque sobem 115% da altura. */
  lineDuration: 0.95,
  lineStagger: 0.08,
} as const;

type Target = gsap.TweenTarget;

type BaseOptions = {
  /** Quando `true`, o preset não anima e o conteúdo permanece no estado final. */
  prefersReducedMotion: boolean;
  /**
   * Com `trigger`, a entrada acompanha o scroll — e cada alvo entra quando
   * ELE chega na tela, não quando a seção chega. Sem `trigger`, roda na hora.
   */
  trigger?: Element | null;
};

/**
 * Presets de animação compartilhados.
 *
 * Todos usam apenas `transform` e `opacity` — nada de animar layout (top,
 * height, margin), que força reflow e trava o scroll no mobile.
 *
 * O estado "escondido" nunca é declarado em CSS: ele é aplicado pelo GSAP em
 * useLayoutEffect, antes do paint. Assim, sem JS ou com movimento reduzido, o
 * conteúdo aparece normalmente.
 */

/**
 * Entrada padrão: fade + slide up.
 *
 * Com `trigger`, usa `ScrollTrigger.batch`: cada alvo tem o próprio gatilho, e
 * os que cruzam a linha no mesmo instante entram em sequência. O gatilho
 * único por seção fazia o rodapé de uma seção alta animar fora da tela — e o
 * leitor chegava lá com tudo parado.
 */
export function fadeUp(targets: Target, { prefersReducedMotion, trigger }: BaseOptions) {
  if (prefersReducedMotion) return;

  const elements = gsap.utils.toArray<Element>(targets);
  if (elements.length === 0) return;

  if (!trigger) {
    return gsap.from(elements, {
      opacity: 0,
      y: MOTION.distance,
      duration: MOTION.duration,
      stagger: MOTION.stagger,
      ease: EASE,
    });
  }

  gsap.set(elements, { opacity: 0, y: MOTION.distance });

  return ScrollTrigger.batch(elements, {
    start: MOTION.start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: MOTION.duration,
        stagger: MOTION.stagger,
        ease: EASE,
        overwrite: true,
      }),
  });
}

/**
 * Revela headlines linha a linha (cada linha sobe de dentro da máscara).
 *
 * As linhas são agrupadas pela headline que as contém, e cada headline
 * dispara quando ELA entra na tela — uma seção com duas headlines (propósito)
 * não revela a segunda antes de o leitor chegar nela.
 */
export function revealLines(lines: Target, { prefersReducedMotion, trigger }: BaseOptions) {
  if (prefersReducedMotion) return;

  const elements = gsap.utils.toArray<HTMLElement>(lines);
  if (elements.length === 0) return;

  const vars = {
    yPercent: 115,
    duration: MOTION.lineDuration,
    stagger: MOTION.lineStagger,
    ease: EASE,
  };

  if (!trigger) return gsap.from(elements, vars);

  const groups = new Map<Element, HTMLElement[]>();
  for (const line of elements) {
    const owner = line.closest(".headline") ?? line.parentElement ?? line;
    groups.set(owner, [...(groups.get(owner) ?? []), line]);
  }

  groups.forEach((group, owner) => {
    gsap.from(group, {
      ...vars,
      scrollTrigger: { trigger: owner, start: MOTION.start, once: true },
    });
  });
}

/**
 * Parallax leve. `yPercent` mantém a animação em transform puro e o `scrub`
 * amortecido evita jitter em telas de 60 Hz.
 */
export function parallax(
  target: Target | null,
  {
    prefersReducedMotion,
    trigger,
    strength = 18,
  }: BaseOptions & { strength?: number },
) {
  if (prefersReducedMotion || !trigger || !target) return;

  return gsap.to(target, {
    yPercent: strength,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * Contador animado.
 *
 * O valor final já vem renderizado no HTML (bom para SEO e para quem está sem
 * JS). Só zeramos o texto quando de fato vamos animar.
 */
export function countUp(
  element: HTMLElement,
  {
    value,
    decimals = 0,
    duration = 1.6,
    prefersReducedMotion,
    trigger,
  }: BaseOptions & { value: number; decimals?: number; duration?: number },
) {
  if (prefersReducedMotion) {
    element.textContent = formatNumber(value, decimals);
    return;
  }

  const state = { current: 0 };
  element.textContent = formatNumber(0, decimals);

  return gsap.to(state, {
    current: value,
    duration,
    ease: "power2.out",
    scrollTrigger: { trigger: trigger ?? element, start: MOTION.start, once: true },
    onUpdate: () => {
      element.textContent = formatNumber(state.current, decimals);
    },
  });
}

/**
 * Linha que se desenha conforme o scroll e ACENDE os pontos por onde passa.
 *
 * `line` é o preenchimento (cresce em `scaleX`/`scaleY`, sem disparar
 * layout); `rail` é o trilho parado por baixo dele. Com `points`, os dois são
 * posicionados do centro do primeiro ponto ao centro do último — a linha
 * passa exatamente pelos marcadores — e cada ponto ganha `data-lit` no quadro
 * em que o preenchimento chega nele. O progresso lido é o do TWEEN, não o do
 * scroll: com o `scrub` amortecido, é o que está desenhado na tela.
 *
 * O marcador de cada ponto é o filho `[data-point-dot]` (ou o próprio ponto).
 * O visual de aceso/apagado é CSS (app/globals.css, `data-line-armed`): o
 * trigger só ganha `data-line-armed` quando a animação existe, então sem JS
 * ou com movimento reduzido nada fica apagado.
 */
export function drawLine(
  line: Element | null,
  {
    prefersReducedMotion,
    trigger,
    end = "bottom 65%",
    axis = "y",
    rail,
    points,
  }: BaseOptions & {
    end?: string;
    axis?: "x" | "y";
    rail?: HTMLElement | null;
    points?: Target;
  },
) {
  if (!line) return;

  const prop = axis === "y" ? "scaleY" : "scaleX";
  const origin = axis === "y" ? "top center" : "left center";
  const pointEls = points ? gsap.utils.toArray<HTMLElement>(points) : [];
  const tracks = [line as HTMLElement, ...(rail ? [rail] : [])];

  const dotOf = (point: HTMLElement) =>
    point.querySelector<HTMLElement>("[data-point-dot]") ?? point;

  /** Frações (0–1) de cada ponto ao longo da linha. */
  let stops: number[] = [];

  /**
   * Leva trilho e linha do centro do primeiro ponto ao do último, no
   * referencial do pai posicionado deles. Medido no refresh, porque quebra de
   * linha e fonte carregando mudam onde os pontos caem.
   */
  const fit = () => {
    if (pointEls.length < 2) return;
    const parent = (line as HTMLElement).offsetParent ?? document.body;
    const origin_ = parent.getBoundingClientRect();
    const centers = pointEls.map((point) => {
      const box = dotOf(point).getBoundingClientRect();
      return {
        x: box.left + box.width / 2 - origin_.left,
        y: box.top + box.height / 2 - origin_.top,
      };
    });
    const first = centers[0];
    const last = centers[centers.length - 1];

    gsap.set(
      tracks,
      axis === "y"
        ? { left: first.x - 1, top: first.y, width: 2, height: Math.max(0, last.y - first.y), right: "auto", bottom: "auto" }
        : { left: first.x, top: first.y - 1, width: Math.max(0, last.x - first.x), height: 2, right: "auto", bottom: "auto" },
    );

    const length = axis === "y" ? last.y - first.y : last.x - first.x;
    stops = centers.map((center) =>
      length <= 0 ? 0 : gsap.utils.clamp(0, 1, ((axis === "y" ? center.y - first.y : center.x - first.x) / length)),
    );
  };

  const light = (progress: number) => {
    pointEls.forEach((point, index) => {
      point.toggleAttribute("data-lit", progress >= (stops[index] ?? 0) - 0.002);
    });
  };

  if (prefersReducedMotion || !trigger) {
    fit();
    gsap.set(line, { [prop]: 1, transformOrigin: origin });
    light(1);
    return;
  }

  fit();
  gsap.set(trigger, { attr: { "data-line-armed": "" } });
  gsap.set(line, { [prop]: 0, transformOrigin: origin });
  light(0);

  return gsap.to(line, {
    [prop]: 1,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: MOTION.start,
      end,
      scrub: 0.4,
      invalidateOnRefresh: true,
      onRefresh: () => fit(),
    },
    onUpdate() {
      light(this.progress());
    },
  });
}
