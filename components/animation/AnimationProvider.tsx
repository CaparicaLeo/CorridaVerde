"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";

import { ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type AnimationContextValue = {
  prefersReducedMotion: boolean;
};

const AnimationContext = createContext<AnimationContextValue>({
  prefersReducedMotion: false,
});

export function useAnimationPreferences() {
  return useContext(AnimationContext);
}

/**
 * Provider global de animação.
 *
 * O registro dos plugins acontece no import de `@/lib/gsap` (ver comentário
 * lá). O que fica aqui é a manutenção global:
 *
 * - recalcular posições de ScrollTrigger quando as webfonts terminam de
 *   carregar (a headline em fonte de cartaz muda de altura e desloca todos
 *   os gatilhos abaixo dela);
 * - recalcular a cada troca de rota, já que as próximas páginas do site vão
 *   compartilhar este mesmo provider;
 * - expor a preferência de movimento reduzido para componentes que precisem
 *   dela fora de um `useGsapScroll`.
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <AnimationContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
}
