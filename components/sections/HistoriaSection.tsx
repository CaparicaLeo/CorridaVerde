"use client";

import { BigNumberBlock } from "@/components/blocks/BigNumberBlock";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { event, historia } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * História e escala — 41ª edição, 2.000 vagas.
 *
 * Substitui a antiga seção de "números da etapa", que contava dados de
 * operação do KM1. Aqui o número é o da própria prova e a foto (quando chegar)
 * é do pelotão: a seção documenta a tradição, não a operação.
 */
export function HistoriaSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.1,
    });
  });

  return (
    <Section id="historia">
      <div ref={root}>
        <SectionHeader intro={historia.intro} />

        <div className="mt-14 grid gap-px border border-white/10 bg-white/10 lg:mt-20 lg:grid-cols-[1.35fr_1fr]">
          {/* A borda da grade é o próprio gap de 1px: por isso o bloco entra
              sem borda própria, senão a linha fica com 2px em um lado só. */}
          <BigNumberBlock
            number={historia.number}
            kpis={historia.kpis}
            className="border-0"
          />

          {/* Sem foto, o slot não some: ele ocupa a mesma altura da coluna, com
              a atmosfera da marca no lugar (PENDÊNCIA 5). */}
          <Media
            media={event.photo}
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="min-h-[20rem] lg:h-full"
            imageClassName="object-[center_35%]"
            stretch
          />
        </div>
      </div>
    </Section>
  );
}