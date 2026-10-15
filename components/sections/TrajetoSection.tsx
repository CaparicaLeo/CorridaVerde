"use client";

import { RouteDiagram } from "@/components/blocks/RouteDiagram";
import { Media } from "@/components/ui/Media";
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
    });
  });

  return (
    <Section id="trajeto" tone="mist" className="isolate overflow-hidden">
      {/*
        Fundo da tela "Seis ideias para esta prova" do deck, refeito com os
        números do PSD: sobre a névoa, a foto aérea da mata a 45% (opacidade
        115/255 da camada) com uma máscara que a apaga no meio — a "névoa"
        onde o conteúdo senta. Medida na máscara: ~0.9 no topo, ~0.05 no
        centro, ~0.5 no pé e um pouco mais forte nas laterais. Aqui a mesma
        forma vira um degradê vertical somado a um radial.
      */}
      {trajeto.backdrop ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-45 [mask-image:linear-gradient(to_bottom,black,rgb(0_0_0/0.35)_22%,rgb(0_0_0/0.04)_50%,rgb(0_0_0/0.12)_75%,rgb(0_0_0/0.55)),radial-gradient(ellipse_70%_60%_at_50%_52%,transparent_55%,rgb(0_0_0/0.3))] [mask-composite:add]"
        >
          <Media
            media={trajeto.backdrop}
            sizes="100vw"
            className="h-full w-full bg-transparent"
            imageClassName="object-[50%_60%]"
            stretch
          />
        </div>
      ) : null}

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