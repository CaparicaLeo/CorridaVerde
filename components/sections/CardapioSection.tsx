"use client";

import { MenuEyebrow, MenuIncluded } from "@/components/blocks/MenuExperience";
import { CTAButton } from "@/components/ui/CTAButton";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cardapio } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * Cardápio pós-corrida, na home: as duas experiências com as fotos dos
 * pratos e só o nome de cada um. A descrição inteira mora em /cardapio.
 *
 * Fica logo depois das ativações porque é a mesma conversa — o que o atleta
 * encontra na chegada. Broto, entre a névoa das ativações e a chapa de lima
 * do impacto.
 */
export function CardapioSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <Section id="cardapio" tone="sprout">
      <div ref={root}>
        <SectionHeader intro={cardapio.intro} />

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          {cardapio.experiences.map((experience) => (
            <article key={experience.id} data-reveal>
              {/* Duas fotos por experiência, lado a lado também no celular:
                  é o par de pratos que define a escolha. */}
              <div className="grid grid-cols-2 gap-3">
                {experience.dishes.map((dish) => (
                  <Media
                    key={dish.id}
                    media={dish.media}
                    stretch
                    className="aspect-[4/5]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                ))}
              </div>

              <MenuEyebrow number={experience.number} className="mt-7" />
              <h3 className="headline mt-4 text-3xl sm:text-4xl">
                {experience.title}
              </h3>
              <p className="mt-3 text-base text-ink-muted sm:text-lg">
                {experience.tagline}
              </p>

              <ul className="mt-6 border-t border-line">
                {experience.dishes.map((dish) => (
                  <li
                    key={dish.id}
                    className="title-sans border-b border-line py-3.5 text-sm sm:text-base"
                  >
                    {dish.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-14 lg:mt-16">
          <MenuIncluded
            label={cardapio.included.label}
            items={cardapio.included.items}
          />
        </div>

        <CTAButton
          href={cardapio.sectionCta.href}
          variant="outline"
          className="mt-10"
        >
          {cardapio.sectionCta.label}
        </CTAButton>
      </div>
    </Section>
  );
}
