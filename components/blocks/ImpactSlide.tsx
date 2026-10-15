"use client";

import type { ReactNode } from "react";

import { Headline } from "@/components/ui/Headline";
import { Section } from "@/components/ui/Section";
import { SideMedia } from "@/components/ui/SideMedia";
import { fadeUp, revealLines } from "@/lib/animations/presets";
import { cn } from "@/lib/cn";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import type { HeadlineLine, Media } from "@/data/types";

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
  media,
}: {
  id?: string;
  lines: HeadlineLine[];
  support?: string;
  aside?: ReactNode;
  /** Foto à direita, com o lima da chapa dissolvendo sobre ela (SideMedia). */
  media?: Media | null;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    revealLines(scope.querySelectorAll("[data-headline-line]"), {
      prefersReducedMotion,
      trigger: scope,
    });

    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <Section id={id} tone="accent">
      {media ? <SideMedia media={media} objectPosition="object-[50%_45%]" /> : null}

      <div
        ref={root}
        className={cn(
          "relative",
          aside &&
            "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16",
        )}
      >
        {/* Com foto, a frase fica à esquerda (layout do deck) e para antes da
            coluna da foto; sem foto e sem `aside`, vai no centro da chapa. */}
        <div
          className={cn(
            media ? "lg:w-[46%]" : !aside && "flex flex-col items-center text-center",
          )}
        >
          <Headline
            lines={lines}
            tone="dark"
            className={cn(
              media
                ? /* "VERDE NO PERCURSO." avança ~11.3em na Ranima e as três
                     linhas da repetição têm de caber inteiras, no mesmo
                     corpo. Celular: 7.4vw cabe em 320px (280px úteis).
                     Desktop: a coluna é 46% do container (~415px no lg,
                     ~567px no teto de 82rem), então 3.2vw até 3rem. */
                  "text-[clamp(1.5rem,7.4vw,5rem)] lg:text-[clamp(2rem,3.2vw,3rem)]"
                : "max-w-5xl text-[clamp(2.25rem,8vw,6.5rem)]",
              /* Dividindo a linha com o objeto da coluna direita, o 9vw estouraria
                 a coluna entre 1024 e ~1300px. */
              aside && "lg:text-[clamp(3rem,6.2vw,6.5rem)]",
            )}
          />

          {support ? (
            <p
              data-reveal
              className="mt-10 max-w-xl text-base leading-relaxed text-forest/80 sm:text-lg"
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
