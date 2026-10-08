"use client";

import { CTAButton } from "@/components/ui/CTAButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Icon } from "@/components/ui/Icon";
import { Marquee } from "@/components/ui/Marquee";
import { Media } from "@/components/ui/Media";
import { event, eventDate, hero, registrationCta } from "@/data/event";
import { parallax } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";

export function HeroSection() {
  const root = useGsapScroll<HTMLElement>(({ scope, prefersReducedMotion, gsap }) => {
    // Parallax da foto de fundo. Só transform — o scroll segue liso no mobile.
    // Sem foto (`event.hero` null) o alvo não existe e o preset sai fora: nada
    // de alinhar um gatilho num elemento inexistente.
    parallax(scope.querySelector("[data-hero-media]"), {
      prefersReducedMotion,
      trigger: scope,
      strength: 14,
    });

    if (prefersReducedMotion) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from("[data-hero-eyebrow]", { opacity: 0, y: 12, duration: 0.6 })
      .from("[data-headline-line]", { yPercent: 115, duration: 1.1, stagger: 0.08 }, "-=0.3")
      .from("[data-hero-fade]", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=0.65")
      .from("[data-hero-scroll]", { opacity: 0, duration: 0.6 }, "-=0.4");

    // Respiro contínuo da dica de scroll.
    gsap.to("[data-hero-scroll-arrow]", {
      y: 8,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <section
      ref={root}
      id="hero"
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24 pb-0"
    >
      {/*
        A foto é quadrada e o hero é largo: o `object-cover` mostra só a faixa
        central. `object-position` no topo da faixa inferior mantém o assunto em
        quadro em vez de cortar no meio. `sizes` declara mais que 100vw porque a
        camada tem 116% da altura e o cover amplia a imagem além da largura do
        viewport.

        Sem foto, o próprio Media entra no estado vazio e desenha a atmosfera
        da identidade — verde quase preto com dois focos de verde vivo
        diluídos, mais o grão da página. Fica mais escuro à esquerda, que
        é onde a headline se apoia. Nada de retângulo cinza nem blur genérico.
      */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <div data-hero-media className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Media
            media={event.hero}
            preload
            sizes="(min-width: 1024px) 170vw, 130vw"
            className="h-full w-full bg-transparent"
            imageClassName="opacity-70 object-[center_38%]"
          />
        </div>
      </div>

      {/*
        Gradiente de apoio, não de assinatura: a foto é escura nas pontas e
        clara no meio (ver `event.hero`), então o topo recebe 70% e não 85% —
        a 85% a faixa clara da fotografia virava um borrão escuro e a imagem
        sumia justamente onde ela tem o que mostrar. O pé vai a 100% porque é
        onde a headline e os CTAs sentam, e ali a foto já é escura: o preto
        entra como reforço, não como véu.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-surface/70 via-surface/45 to-surface"
      />

      <div className="container-page flex flex-1 flex-col justify-end pb-10">
        <Eyebrow data-hero-eyebrow className="w-fit">
          {hero.eyebrow}
        </Eyebrow>

        {/*
          A frase de campanha é <p>, não <h1>: ela não diz o que a página é.
          O <h1> logo abaixo é o nome do evento.

          O teto do clamp é 6rem, e não o tamanho que a largura permitiria: com
          duas linhas e o par data/local e os CTAs abaixo, uma display maior
          empurra o botão de inscrição para fora da primeira tela — a headline
          aparecia sozinha e o botão só depois do scroll.
        */}
        <Headline
          lines={hero.headlineLines}
          className="mt-6 max-w-5xl text-[clamp(2.75rem,8vw,6rem)]"
        />

        <h1
          data-hero-fade
          className="label-condensed mt-7 text-sm text-accent"
        >
          {hero.headline}
        </h1>

        <p
          data-hero-fade
          className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted"
        >
          {hero.subheadline}
        </p>

        {/* Data, horário e local: as três primeiras perguntas de quem chega.
            Ficam lado a lado no desktop e empilham no mobile — a folga do hero
            comporta a segunda linha. */}
        <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
          <p className="flex items-center gap-3 border border-white/20 px-5 py-3">
            <Icon name="calendar" className="size-5 shrink-0 text-accent" />
            <span className="label-condensed text-sm text-ink">
              {eventDate.label}
            </span>
          </p>

          <p className="flex items-center gap-3 border border-white/20 px-5 py-3">
            <Icon name="clock" className="size-5 shrink-0 text-accent" />
            <span className="label-condensed text-sm text-ink">
              {event.startTime
                ? `Largada às ${event.startTime}`
                : event.dateLabel}
            </span>
          </p>

          <p className="flex items-center gap-3 border border-white/20 px-5 py-3">
            <Icon name="route" className="size-5 shrink-0 text-accent" />
            <span className="label-condensed text-sm text-ink">
              {event.location.label}
            </span>
          </p>
        </div>

        <div
          data-hero-fade
          className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <CTAButton href={registrationCta.href} pulse animateIn={false}>
            {registrationCta.label}
          </CTAButton>

          <CTAButton href="#percursos" variant="outline" animateIn={false}>
            Ver os percursos
          </CTAButton>
        </div>

        <div data-hero-scroll className="mt-10 flex items-center gap-3 text-ink-muted">
          <span data-hero-scroll-arrow aria-hidden className="text-lg leading-none">
            ↓
          </span>
          <span className="label-condensed text-[0.65rem]">{hero.scrollHint}</span>
        </div>
      </div>

      <Marquee items={hero.marquee} className="bg-accent text-surface" />
    </section>
  );
}