"use client";

import { CTAButton } from "@/components/ui/CTAButton";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { conceito } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * "Refletida numa gota" — o símbolo, na home.
 *
 * Primeira seção depois do hero: a marca se apresenta antes do trajeto.
 * Broto, e não névoa, porque a seguinte (trajeto) é névoa — duas vizinhas no
 * mesmo tom leem como uma só. O fundo do vídeo foi encodado no broto, então
 * o logo aparece direto na chapa, sem caixa (ver `conceito.loop`).
 *
 * Aqui vai só o recorte da revelação do logo, em loop, e o primeiro parágrafo
 * do conceito. O vídeo inteiro e o texto completo moram em /conceito.
 */
export function ConceitoSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <Section id="marca" tone="sprout">
      <div
        ref={root}
        className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] lg:gap-16"
      >
        {/* No celular o logo vem antes do texto — é a primeira coisa depois
            do hero — e sangra até a borda (o -mx desfaz o padding do
            `container-page`). No desktop, `order-last` o leva para a direita. */}
        <div data-reveal className="order-first -mx-5 sm:mx-auto sm:w-full sm:max-w-md lg:order-last lg:max-w-none">
          <LoopVideo video={conceito.loop} />
        </div>

        <div>
          <SectionHeader intro={conceito.intro} />

          <p
            data-reveal
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            {conceito.shape.text}
          </p>

          <CTAButton
            href={conceito.sectionCta.href}
            variant="outline"
            className="mt-10"
          >
            {conceito.sectionCta.label}
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
