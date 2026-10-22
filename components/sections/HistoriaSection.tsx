"use client";

import { BigNumberBlock } from "@/components/blocks/BigNumberBlock";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideMedia } from "@/components/ui/SideMedia";
import { event, historia } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * História e escala — 11ª edição, 2.000 vagas.
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
    });
  });

  return (
    <Section id="historia" tone="sprout">
      <div ref={root}>
        {/* Layout do deck: texto e número à esquerda, foto à direita com a
            cor da seção dissolvendo sobre ela. Sem caixa: o número fica solto
            na chapa, como no slide "Escala". */}
        <SideMedia media={event.photo} objectPosition="object-[50%_40%]" />

        <div className="relative lg:w-[46%]">
          <SectionHeader intro={historia.intro} />

          <BigNumberBlock
            number={historia.number}
            kpis={historia.kpis}
            className="mt-12 bg-transparent p-0 lg:mt-16 lg:p-0"
          />
        </div>
      </div>
    </Section>
  );
}