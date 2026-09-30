"use client";

import { RouteDiagram } from "@/components/blocks/RouteDiagram";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { trajeto } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * "De parque a parque" — a seção que dá nome ao conceito do evento.
 *
 * Vem logo depois do hero de propósito: a headline de abertura já é o conceito
 * e esta seção é o passo seguinte dele. Quem chegou pela capa entende aqui o
 * que a prova é.
 */
export function TrajetoSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.12,
    });
  });

  return (
    <Section id="trajeto" tone="darker">
      <div ref={root}>
        <SectionHeader intro={trajeto.intro} className="max-w-4xl" />

        <div className="mt-16 lg:mt-24">
          <RouteDiagram stops={trajeto.stops} label={trajeto.diagramLabel} />
        </div>

        {/* A nota de chegada fica abaixo do esquema, e não dentro dele: é a
            resposta prática de "onde eu fico", que o desenho não resolve
            sozinho. */}
        <p
          data-reveal
          className="mt-14 max-w-2xl border-l-2 border-accent pl-6 text-base leading-relaxed text-ink-muted"
        >
          {trajeto.arrivalNote}
        </p>
      </div>
    </Section>
  );
}