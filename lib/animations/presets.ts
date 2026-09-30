"use client";

import { gsap } from "@/lib/gsap";
import { formatNumber } from "@/lib/format";

export const EASE = "power3.out";

type Target = gsap.TweenTarget;

type BaseOptions = {
  /** Quando `true`, o preset não anima e o conteúdo permanece no estado final. */
  prefersReducedMotion: boolean;
  /** Elemento que dispara o ScrollTrigger. Sem ele, a animação roda na hora. */
  trigger?: Element | null;
  start?: string;
  delay?: number;
};

/**
 * Presets de animação compartilhados.
 *
 * Todos usam apenas `transform` e `opacity` — nada de animar layout (top,
 * height, margin), que força reflow e trava o scroll no mobile.
 *
 * O estado "escondido" nunca é declarado em CSS: os tweens `from` aplicam esse
 * estado em useLayoutEffect, antes do paint. Assim, sem JS ou com movimento
 * reduzido, o conteúdo aparece normalmente.
 */

/** Entrada padrão: fade + slide up. Aceita NodeList para stagger. */
export function fadeUp(
  targets: Target,
  {
    prefersReducedMotion,
    trigger,
    start = "top 85%",
    delay = 0,
    y = 28,
    duration = 0.9,
    stagger = 0,
  }: BaseOptions & { y?: number; duration?: number; stagger?: number },
) {
  if (prefersReducedMotion) return;

  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: EASE,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Entrada escalonada — usada nos cards de distância e no grid de estrutura. */
export function staggerIn(
  targets: Target,
  options: BaseOptions & { y?: number; each?: number },
) {
  const { each = 0.12, ...rest } = options;
  return fadeUp(targets, { ...rest, stagger: each, duration: 0.8 });
}

/** Revela uma headline em blocos (cada linha entra de baixo, com máscara). */
export function revealLines(
  lines: Target,
  { prefersReducedMotion, trigger, start = "top 80%", delay = 0 }: BaseOptions,
) {
  if (prefersReducedMotion) return;

  return gsap.from(lines, {
    yPercent: 115,
    duration: 1.1,
    delay,
    stagger: 0.09,
    ease: EASE,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
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
  }: Omit<BaseOptions, "start"> & { strength?: number },
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
    duration = 2,
    prefersReducedMotion,
    trigger,
    start = "top 85%",
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
    scrollTrigger: { trigger: trigger ?? element, start, once: true },
    onUpdate: () => {
      element.textContent = formatNumber(state.current, decimals);
    },
  });
}

/**
 * Linha que se desenha conforme o scroll (timeline do dia, barras de números).
 * `scaleY`/`scaleX` em vez de `height`/`width` para não disparar layout.
 */
export function drawLine(
  line: Target,
  {
    prefersReducedMotion,
    trigger,
    start = "top 75%",
    end = "bottom 65%",
    axis = "y",
  }: BaseOptions & { end?: string; axis?: "x" | "y" },
) {
  const prop = axis === "y" ? "scaleY" : "scaleX";
  const origin = axis === "y" ? "top center" : "left center";

  if (prefersReducedMotion || !trigger) {
    gsap.set(line, { [prop]: 1, transformOrigin: origin });
    return;
  }

  gsap.set(line, { [prop]: 0, transformOrigin: origin });

  return gsap.to(line, {
    [prop]: 1,
    ease: "none",
    scrollTrigger: { trigger, start, end, scrub: 0.4, invalidateOnRefresh: true },
  });
}
