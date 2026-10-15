"use client";

import { drawLine } from "@/lib/animations/presets";
import { cn } from "@/lib/cn";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import type { Pillar } from "@/data/types";

/**
 * Pilares do posicionamento, em lista com régua vertical.
 *
 * Não é icon-grid: aqui a leitura é editorial — número de ordem, palavra de
 * capa e uma linha de apoio, com muito ar e uma regra fina separando. É a
 * diferença entre "o que o atleta recebe" (grade densa, ícone) e "por que a
 * prova existe" (lista, respiro, espaço negativo).
 *
 * A régua vertical desenha no scroll e acende cada pilar ao passar, pelo
 * mesmo preset da linha do trajeto — é o que amarra visualmente as duas
 * seções de conceito.
 */
export function PillarList({
  pillars,
  className,
}: {
  pillars: Pillar[];
  className?: string;
}) {
  const root = useGsapScroll<HTMLDivElement>(
    ({ scope, prefersReducedMotion }) => {
      // A régua desce com o scroll e acende cada pilar quando passa pelo
      // marcador dele — o mesmo gesto do esquema do trajeto.
      drawLine(scope.querySelector("[data-pillar-line]"), {
        prefersReducedMotion,
        trigger: scope,
        end: "bottom 75%",
        axis: "y",
        rail: scope.querySelector<HTMLElement>("[data-pillar-rail]"),
        points: scope.querySelectorAll("[data-pillar]"),
      });
    },
    [pillars.length],
  );

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* A régua é do bloco, não do item: vai do primeiro marcador ao último
          (geometria medida em `drawLine`) e segura a coluna no lugar. */}
      <div data-pillar-rail aria-hidden className="absolute size-0 bg-line" />
      <div data-pillar-line aria-hidden className="absolute size-0 bg-accent" />

      <ol className="relative flex flex-col gap-8">
        {pillars.map((pillar, index) => (
          <li
            key={pillar.id}
            data-pillar
            data-point
            className="relative flex items-start gap-6"
          >
            {/* Marcador: o mesmo anel do trajeto, na cor de destaque da marca
                sobre a chapa clara. */}
            <span
              aria-hidden
              data-point-dot
              className="relative mt-2 size-[0.625rem] shrink-0 rounded-full border-2 border-accent bg-accent"
            />

            <span className="flex flex-col gap-2">
              <span className="flex items-baseline gap-3">
                <span className="label-condensed text-[0.65rem] text-accent-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="title-sans text-xl text-ink sm:text-2xl">
                  {pillar.label}
                </span>
              </span>

              <span className="max-w-xl text-base leading-relaxed text-forest/70">
                {pillar.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}