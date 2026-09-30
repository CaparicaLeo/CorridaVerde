"use client";

import type { ReactNode } from "react";

import { Headline } from "@/components/ui/Headline";
import { Section } from "@/components/ui/Section";
import { fadeUp, revealLines } from "@/lib/animations/presets";
import { cn } from "@/lib/cn";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import type { HeadlineLine } from "@/data/types";

/**
 * Slide de impacto do deck: chapa verde viva com texto quase preto e uma frase
 * curta de transição de seção.
 *
 * É a chapa de maior contraste da página, e o lugar dela é este: entre as
 * ativações (escuro) e a seção clara de propósito. Uma chapa clara de
 *Highlighted logo depois dela, e o verde deixa de ser destaque e vira fundo —
 * que é exatamente o oposto do que a marca precisa ser.
 *
 * `aside` ocupa uma coluna à direita no desktop (abaixo da frase no celular) e
 * entra com o mesmo fade da seção. Hoje fica vazio: o slot existia para a
 * medalha 3D do KM1, e o motor dela continua no repositório
 * (components/medal/) à espera do `.glb` oficial — que é o que entra aqui
 * quando chegar. A estrutura de duas colunas já está pronta para isso.
 */
export function ImpactSlide({
  id,
  lines,
  support,
  aside,
}: {
  id?: string;
  lines: HeadlineLine[];
  support?: string;
  aside?: ReactNode;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    revealLines(scope.querySelectorAll("[data-headline-line]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 78%",
    });

    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.12,
      delay: 0.2,
    });
  });

  return (
    <Section id={id} tone="accent">
      <div
        ref={root}
        className={cn(
          aside &&
            "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16",
        )}
      >
        <div>
          <Headline
            lines={lines}
            tone="dark"
            className={cn(
              "max-w-4xl text-[clamp(2.5rem,9vw,6.5rem)]",
              /* Dividindo a linha com o objeto da coluna direita, o 9vw estouraria
                 a coluna entre 1024 e ~1300px. */
              aside && "lg:text-[clamp(3rem,6.2vw,6.5rem)]",
            )}
          />

          {support ? (
            <p
              data-reveal
              className="mt-8 max-w-xl text-base leading-relaxed text-surface/80 sm:text-lg"
            >
              {support}
            </p>
          ) : null}
        </div>

        {aside ? <div data-reveal>{aside}</div> : null}
      </div>
    </Section>
  );
}
