"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** No servidor assumimos movimento permitido; o cliente corrige na hidratação. */
function getServerSnapshot() {
  return false;
}

/**
 * Preferência de movimento reduzido do sistema, reativa.
 *
 * Regra do projeto: nenhum conteúdo é escondido por CSS. Os estados iniciais
 * das animações são aplicados pelo GSAP em useLayoutEffect (antes do paint),
 * então quando esta flag é `true` basta não animar — o conteúdo já está no
 * estado final.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
