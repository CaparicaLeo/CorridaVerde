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
    });

    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <Section id="proposito" tone="mist">
      <div ref={root} className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <SectionHeader intro={proposito.intro} onLight />

          {/* O fecho fica na coluna de texto, colado no cabeçalho: é a frase
              que resume a seção, e ela não deve ler como seção nova. */}
          <div className="mt-14 border-t border-line pt-12">
            {/* A coluna 0.9fr do grid tem ~382px no lg (1024) e ~511px no
                máximo; abaixo do lg o limite é o viewport (320px − padding =
                280px). Com a Ranima, "A MARCA OCUPA" cabe nos dois tetos —
                conferido no navegador em 320, 390, 768, 1024 e 1440px. */}
            <Headline
              lines={proposito.closing.lines}
              className="max-w-2xl text-[clamp(1.5rem,7vw,3.5rem)] lg:text-[clamp(2rem,3.1vw,2.75rem)]"
            />

            <p
              data-reveal
              className="mt-6 max-w-md text-base leading-relaxed text-forest/70"
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