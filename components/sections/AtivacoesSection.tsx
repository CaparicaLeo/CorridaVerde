"use client";

import { IconGridBlock } from "@/components/blocks/IconGridBlock";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ativacoes } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * Ativações — o que o atleta encontra no Parque Barigui.
 *
 * Substitui a antiga seção de "Kit do atleta", que descrevia produto (camiseta,
 * camiseta, número de peito) que não existe para esta prova: aqui não há nada
 * a prometer além do que a arena de chegada realmente tem.
 */
export function AtivacoesSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.1,
    });
  });

  return (
    <Section id="ativacoes" tone="darker">
      <div ref={root}>
        <SectionHeader intro={ativacoes.intro} />

        <IconGridBlock items={ativacoes.items} className="mt-14 lg:mt-20" />
      </div>
    </Section>
  );
}