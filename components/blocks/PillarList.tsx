"use client";

import { drawLine, fadeUp } from "@/lib/animations/presets";
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
 * A régua vertical desenha no scroll junto com a lista, pelo mesmo preset da
 * linha do trajeto — é o que amarra visualmente as duas seções de conceito.
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
      drawLine(scope.querySelector("[data-pillar-rule]"), {
        prefersReducedMotion,
        trigger: scope,
        start: "top 80%",
        end: "bottom 75%",
        axis: "y",
      });

      fadeUp(scope.querySelectorAll("[data-pillar]"), {
        prefersReducedMotion,
        trigger: scope,
        start: "top 82%",
        y: 16,
        stagger: 0.1,
      });
    },
    [pillars.length],
  );

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* A régua é do bloco, não do item: é ela que segura a coluna no lugar
          enquanto os itens entram em stagger. */}
      <div
        aria-hidden
        data-pillar-rule
        className="absolute top-2 bottom-2 left-[0.1875rem] w-px origin-top bg-line-on-light"
      />

      <ol className="relative flex flex-col gap-8">
        {pillars.map((pillar, index) => (
          <li
            key={pillar.id}
            data-pillar
            className="flex items-start gap-6 pl-8"
          >
            {/* Marcador: o mesmo anel do trajeto, na cor de destaque da marca
                sobre a chapa clara. */}
            <span
              aria-hidden
              className="mt-2 size-[0.625rem] shrink-0 rounded-full border-2 border-accent bg-light"
            />

            <span className="flex flex-col gap-2">
              <span className="flex items-baseline gap-3">
                <span className="label-condensed text-[0.65rem] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="headline text-2xl text-surface sm:text-3xl">
                  {pillar.label}
                </span>
              </span>

              <span className="max-w-xl text-base leading-relaxed text-surface/70">
                {pillar.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}