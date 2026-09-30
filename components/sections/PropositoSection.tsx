"use client";

import { PillarList } from "@/components/blocks/PillarList";
import { Headline } from "@/components/ui/Headline";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { proposito } from "@/data/event";
import { fadeUp, revealLines } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * "Verde não é só o nome" — a chapa clara da página.
 *
 * ÚNICA seção clara do site, e o lugar dela é este: a identidade da prova é
 * "verde escuro com luz", não verde por toda parte. Uma seção branca no meio
 * da navegação é o que impede a página de virar um tema só, e é aqui que ela
 * funciona — depois do slide de impacto e antes da história, ou seja, entre
 * duas-sequências escuras.
 *
 * `SectionHeader onLight` resolve a cor do texto (quase preto) e mantém o
 * eyebrow no verde, que é o que precisa contrastar com o branco.
 */
export function PropositoSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    revealLines(scope.querySelectorAll("[data-headline-line]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 84%",
    });

    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.12,
    });
  });

  return (
    <Section id="proposito" tone="light">
      <div ref={root} className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <SectionHeader intro={proposito.intro} onLight />

          {/* O fecho fica na coluna de texto, colado no cabeçalho: é a frase
              que resume a seção, e ela não deve ler como seção nova. */}
          <div className="mt-14 border-t border-line-on-light pt-12">
            <Headline
              lines={proposito.closing.lines}
              className="max-w-xl text-[clamp(2rem,4.4vw,3.5rem)]"
            />

            <p
              data-reveal
              className="mt-6 max-w-md text-base leading-relaxed text-surface/70"
            >
              {proposito.closing.support}
            </p>
          </div>
        </div>

        <PillarList pillars={proposito.pillars} className="lg:pt-3" />
      </div>
    </Section>
  );
}