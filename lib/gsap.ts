"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Ponto ÚNICO de registro do GSAP no projeto.
 *
 * O registro roda como efeito de import (e não dentro de um useEffect) de
 * propósito: efeitos de filhos rodam antes dos efeitos do provider, então
 * registrar no <AnimationProvider> deixaria o primeiro componente animado sem
 * o ScrollTrigger disponível. Como todo hook de animação importa este módulo,
 * o registro está garantido antes de qualquer tween.
 *
 * Nenhum componente deve chamar `gsap.registerPlugin` por conta própria.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(useGSAP, ScrollTrigger);

  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  // Evita recálculo de ScrollTrigger quando a barra de endereço do mobile
  // aparece/some — principal causa de "pulos" de scroll em iOS/Android.
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger, useGSAP };
