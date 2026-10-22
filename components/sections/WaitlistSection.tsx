"use client";

import { RouteMini } from "@/components/blocks/RouteMini";
import { WaitlistForm } from "@/components/blocks/WaitlistForm";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { waitlist } from "@/data/event";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

/**
 * Lista de espera: argumento à esquerda, formulário à direita (empilha no
 * celular). A mesma seção serve a home e a página /lista-de-espera — lá ela
 * entra com `h1` e o respiro do header fixo.
 *
 * Na home fica entre o cardápio (broto) e a chapa de lima do impacto, em
 * névoa: é a única vaga da sequência em que uma seção nova não encosta em
 * outra do mesmo tom.
 */
export function WaitlistSection({
  as = "h2",
  className,
}: {
  as?: "h1" | "h2";
  className?: string;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <Section id="lista-de-espera" tone="mist" className={className}>
      <div
        ref={root}
        className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
      >
        <SectionHeader intro={waitlist.intro} as={as}>
          {/* O trajeto logo sob a promessa: quem entra na lista sabe para
              qual prova está entrando. */}
          <div data-reveal>
            <RouteMini className="mt-2" />
          </div>

          <ul data-reveal className="mt-2 flex flex-col gap-3.5 border-t border-line pt-6">
            {waitlist.benefits.map((benefit) => (
              <li key={benefit} className="flex items-baseline gap-3 text-base">
                <span aria-hidden className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent-ink" />
                {benefit}
              </li>
            ))}
          </ul>
        </SectionHeader>

        {/* O formulário não leva `data-reveal`: começar invisível e depender
            do ScrollTrigger para aparecer é arriscar um campo sem foco
            possível para quem chega pela âncora. */}
        <WaitlistForm />
      </div>
    </Section>
  );
}
