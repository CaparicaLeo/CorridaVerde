"use client";

import { IconGridBlock } from "@/components/blocks/IconGridBlock";
import { BrandWatermark } from "@/components/ui/BrandWatermark";
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
    });
  });

  return (
    <Section id="ativacoes" tone="mist" className="isolate overflow-hidden">
      {/* O símbolo gigante do deck: o vão do tronco cai a ~60% da largura,
          como na tela "Sua marca dentro da prova", e as folhas saem pelas
          bordas. No celular ele é maior que a tela, para continuar lendo como
          forma e não como logo pequeno no canto. */}
      <BrandWatermark className="-top-24 -left-[80%] w-[260%] sm:top-1/2 sm:-left-[30%] sm:w-[170%] sm:-translate-y-1/2 lg:-left-[13%] lg:w-[140%]" />

      <div ref={root}>
        <SectionHeader intro={ativacoes.intro} />

        <IconGridBlock items={ativacoes.items} className="mt-14 lg:mt-20" />
      </div>
    </Section>
  );
}