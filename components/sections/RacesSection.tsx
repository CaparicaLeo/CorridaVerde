"use client";

import { CardListBlock } from "@/components/blocks/CardListBlock";
import { CTAButton } from "@/components/ui/CTAButton";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { races } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

export function RacesSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.1,
    });
  });

  return (
    <Section id="percursos">
      <div ref={root}>
        <SectionHeader intro={races.intro} />

        <CardListBlock items={races.items} className="mt-14 lg:mt-20" />

        {/*
          Onde a prova acontece. Fica logo abaixo dos cards porque a pergunta
          "largada onde, chegada onde?" é respondida pelo `de → até` de cada um,
          e essa linha fecha com a cidade.
        */}
        <p
          data-reveal
          className="mt-8 flex max-w-2xl items-start gap-3 text-sm leading-relaxed text-ink-muted"
        >
          <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-accent" />
          {races.venueNote}
        </p>

        {/*
          PENDÊNCIA 4: o botão de mapa só entra com o traçado confirmado. Não há
          fallback para mapa genérico nem para o Google Maps apontando "Curitiba"
          — um mapa que não é o percurso do evento é pior do que nenhum mapa. O
          caminho do botão está pronto em `races.route`; o de baixo substitui
          ele quando o traçado chegar.
        */}
        {races.route ? (
          <div data-reveal className="mt-14 flex justify-center">
            <CTAButton
              href={races.route.href}
              size="xl"
              className="w-full sm:w-auto"
              animateIn={false}
              ariaLabel={races.route.ariaLabel}
            >
              {races.route.label}
            </CTAButton>
          </div>
        ) : (
          <div
            data-reveal
            className="mt-14 flex flex-col items-center gap-4 text-center"
          >
            {/*
              Sem mapa, o que se oferece é a fonte que existe: o regulamento
              oficial, que é o documento que descreve o percurso. Secondary e
              discreto — o próximo passo da pessoa é se inscrever, não abrir
              mapa.
            */}
            <p className="max-w-md text-sm leading-relaxed text-ink-muted">
              O traçado do percurso ainda não foi publicado. O regulamento
              oficial é a fonte que descreve cada percurso.
            </p>

            <CTAButton
              href="/regulamento"
              variant="outline"
              size="lg"
              animateIn={false}
              ariaLabel="Ler o regulamento oficial da Corrida Verde"
            >
              Ver o regulamento
            </CTAButton>
          </div>
        )}
      </div>
    </Section>
  );
}