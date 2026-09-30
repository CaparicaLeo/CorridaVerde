"use client";

import { useRef, type RefObject } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export type GsapScopeContext<T extends HTMLElement> = {
  /** Elemento raiz da seção — todos os seletores são escopados nele. */
  scope: T;
  /** `true` quando o usuário pediu menos movimento: não anime. */
  prefersReducedMotion: boolean;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /**
   * Envolve handlers criados fora do escopo do useGSAP (ex.: listeners de
   * hover) para que sejam revertidos junto com o resto.
   */
  contextSafe: (fn: (...args: never[]) => unknown) => (...args: never[]) => unknown;
};

/**
 * Hook padrão de animação de seção.
 *
 * Devolve uma ref para o elemento raiz e executa `setup` dentro de um
 * `gsap.context` — o que significa cleanup automático de tweens e
 * ScrollTriggers na desmontagem e em cada re-execução (importante com
 * React Strict Mode e navegação de rota).
 *
 * ```tsx
 * const root = useGsapScroll<HTMLElement>(({ scope, prefersReducedMotion }) => {
 *   fadeUp(scope.querySelectorAll("[data-reveal]"), { trigger: scope, prefersReducedMotion });
 * });
 * return <section ref={root}>…</section>;
 * ```
 */
export function useGsapScroll<T extends HTMLElement = HTMLDivElement>(
  setup: (context: GsapScopeContext<T>) => void | (() => void),
  dependencies: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const element = scope.current;
      if (!element) return;

      // O retorno opcional de `setup` é o cleanup (listeners de hover, por
      // exemplo). Tweens e ScrollTriggers já são revertidos pelo contexto.
      return setup({
        scope: element,
        prefersReducedMotion,
        gsap,
        ScrollTrigger,
        contextSafe: contextSafe as GsapScopeContext<T>["contextSafe"],
      });
    },
    {
      scope: scope as RefObject<HTMLElement>,
      dependencies: [prefersReducedMotion, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return scope;
}
