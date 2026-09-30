"use client";

import { CTAButton } from "@/components/ui/CTAButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { finalCta, hero, registrationCta } from "@/data/event";
import { fadeUp, revealLines } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

export function FinalCtaSection() {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    revealLines(scope.querySelectorAll("[data-headline-line]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 80%",
    });

    fadeUp(scope.querySelectorAll("[data-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.12,
    });
  });

  return (
        /* `pb-0` precisa vir nos três breakpoints: o padding da <Section> é
       `py-20 sm:py-28 lg:py-36`, e o tailwind-merge só resolve conflito dentro
       do mesmo modificador — um `pb-0` sozinho não cancelava o `lg:py-36`, e
       sobrava um vão de 144px entre a faixa amarela e o rodapé no desktop. */
    <Section
      id="inscricao"
      className="grain overflow-hidden pb-0 sm:pb-0 lg:pb-0"
    >
      <div ref={root} className="relative flex flex-col items-center text-center">
        <Eyebrow data-reveal>{finalCta.eyebrow}</Eyebrow>

        <Headline
          lines={finalCta.lines}
          as="h2"
          className="mt-8 max-w-4xl text-[clamp(2.5rem,10vw,7rem)]"
        />

        <p
          data-reveal
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          {finalCta.description}
        </p>

        <div data-reveal className="mt-10">
          <CTAButton href={registrationCta.href} pulse animateIn={false}>
            {registrationCta.label}
          </CTAButton>
        </div>

        <p data-reveal className="mt-6 max-w-md text-xs leading-relaxed text-ink-muted">
          {registrationCta.note}
        </p>
      </div>

      {/* `mx-[calc(50%-50vw)]` sangra até a borda da viewport: cancelar só o
          padding do container deixaria a faixa parar antes da borda a partir de
          82rem, diferente da faixa do hero, que é full-bleed. */}
      <div className="relative mt-20 mx-[calc(50%-50vw)]">
        {/*
          Fecha com a mesma lista do hero, ao contrário: as distâncias e a frase
          de conceito já estão escritas em `hero.marquee`, e repetir a lista
          aqui criaria um segundo lugar onde elas precisam ser corrigidas.
        */}
        <Marquee
          items={hero.marquee}
          className="bg-accent text-surface"
          reverse
        />
      </div>
    </Section>
  );
}
