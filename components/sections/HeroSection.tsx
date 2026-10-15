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
      className="tone-dark grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-surface pt-[min(92vw,26rem)] pb-0 text-ink lg:pt-24"
    >
      {/*
        Layout do deck comercial (tela "Escala"): texto à esquerda, foto à
        direita, e a cor do fundo DISSOLVENDO sobre a foto — sem borda seca
        entre as duas. No desktop a foto ocupa os 62% da direita; no celular
        ela é o topo do hero e o texto senta abaixo, no escuro: o `pt` do
        celular empurra o texto para a faixa onde a cor já cobriu a foto
        (≈76% da altura dela), e o rosto da atleta fica livre.

        A dissolução são duas camadas sobre a borda da foto que encosta no
        texto: um desfoque progressivo (backdrop-blur com máscara em degradê,
        o "blur da cor") e o verde mata indo de cheio a transparente. A
        parallax mexe só na foto, então as camadas de cor ficam paradas e a
        imagem desliza por baixo delas.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-20 h-[min(125vw,34rem)] overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[62%]"
      >
        <div data-hero-media className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Media
            media={event.hero}
            preload
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="h-full w-full bg-transparent"
            imageClassName="object-[42%_30%]"
            stretch
          />
        </div>

        {/* Desfoque progressivo: cheio na borda do texto, some no meio da foto. */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_25%,transparent)] lg:inset-y-0 lg:right-auto lg:left-0 lg:h-auto lg:w-1/2 lg:[mask-image:linear-gradient(to_right,black_25%,transparent)]" />

        {/* A cor do fundo dissolvendo sobre a foto. */}
        <div className="absolute inset-0 bg-linear-to-t from-surface from-5% via-surface/55 via-35% to-transparent to-65% lg:bg-linear-to-r lg:from-surface lg:from-0% lg:via-surface/60 lg:via-25% lg:to-transparent lg:to-60%" />

        {/* Topo e pé da coluna: o header e o marquee encostam sem degrau. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-surface/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-linear-to-t from-surface/80 to-transparent lg:block" />
      </div>

      {/* Coluna de texto: no desktop fica à esquerda da foto (até ~45% da
          largura); no celular desce para baixo dela. */}
      <div className="container-page flex flex-1 flex-col justify-end pb-10 lg:[&>*]:max-w-[min(100%,40rem)]">
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
          className="label-condensed mt-7 text-sm text-accent-ink"
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
          <p className="flex items-center gap-3 border border-line-strong px-5 py-3">
            <Icon name="calendar" className="size-5 shrink-0 text-accent-ink" />
            <span className="label-condensed text-sm text-ink">
              {eventDate.label}
            </span>
          </p>

          <p className="flex items-center gap-3 border border-line-strong px-5 py-3">
            <Icon name="clock" className="size-5 shrink-0 text-accent-ink" />
            <span className="label-condensed text-sm text-ink">
              {event.startTime
                ? `Largada às ${event.startTime}`
                : event.dateLabel}
            </span>
          </p>

          <p className="flex items-center gap-3 border border-line-strong px-5 py-3">
            <Icon name="route" className="size-5 shrink-0 text-accent-ink" />
            <span className="label-condensed text-sm text-ink">
              {event.location.label}
            </span>
          </p>
        </div>

        <div
          data-hero-fade
          className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center"
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

      <Marquee items={hero.marquee} className="bg-accent text-forest" />
    </section>
  );
}