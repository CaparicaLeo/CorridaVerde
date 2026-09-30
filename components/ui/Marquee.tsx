"use client";

import { useEffect, useState } from "react";

import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { cn } from "@/lib/cn";

/**
 * Faixa de texto em rolagem contínua — a "tarja de cartaz" da identidade.
 *
 * Cópias idênticas do conteúdo lado a lado, todas deslocadas em `xPercent`
 * até -100 (a largura de UMA cópia): quando a primeira sai, a seguinte já
 * ocupou o lugar, então o loop é imperceptível e custa um único transform.
 *
 * Quantas cópias? Ao fim do ciclo tudo andou a largura de uma cópia, então o
 * conteúdo só cobre a faixa inteira se `total >= container + uma cópia`. Com
 * duas cópias fixas isso valia apenas enquanto uma cópia fosse mais larga
 * que o container — no desktop ela não era (a do fecho media 933px numa
 * faixa de 1440px) e sobrava um vão à direita no fim de cada volta. Daí a
 * medição: o número de cópias sai da razão entre as duas larguras e é
 * refeito no resize.
 *
 * Com movimento reduzido, a faixa fica parada (e legível) em vez de sumir.
 */
export function Marquee({
  items,
  className,
  speed = 26,
  reverse = false,
}: {
  items: string[];
  className?: string;
  /** Segundos para uma volta completa. Maior = mais lento. */
  speed?: number;
  reverse?: boolean;
}) {
  const [copies, setCopies] = useState(2);

  const root = useGsapScroll<HTMLDivElement>(
    ({ scope, prefersReducedMotion, gsap: g }) => {
      if (prefersReducedMotion) return;

      g.fromTo(
        scope.querySelectorAll("[data-marquee-track]"),
        { xPercent: reverse ? -100 : 0 },
        { xPercent: reverse ? 0 : -100, duration: speed, ease: "none", repeat: -1 },
      );
    },
    // `copies` entra nas dependências para o tween ser recriado sobre o novo
    // conjunto de faixas quando a medição muda a contagem.
    [speed, reverse, copies],
  );

  useEffect(() => {
    const container = root.current;
    const track = container?.querySelector<HTMLElement>("[data-marquee-track]");
    if (!container || !track) return;

    const measure = () => {
      const trackWidth = track.offsetWidth;
      if (!trackWidth) return;
      // +1 cópia para cobrir o deslocamento de uma volta inteira; mínimo de
      // 2 para o loop existir mesmo quando uma cópia já preenche a faixa.
      const needed = Math.max(2, Math.ceil(container.offsetWidth / trackWidth) + 1);
      setCopies((current) => (current === needed ? current : needed));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(track);
    return () => observer.disconnect();
    // `root` é ref estável; `items` altera a largura de uma cópia.
  }, [root, items]);

  return (
    <div
      ref={root}
      className={cn("flex w-full overflow-hidden py-3", className)}
      role="presentation"
    >
      {Array.from({ length: copies }, (_, copy) => (
        <div
          key={copy}
          data-marquee-track
          className="flex shrink-0 items-center gap-8 pr-8 will-change-transform"
          aria-hidden
        >
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              <span className="label-condensed text-sm whitespace-nowrap sm:text-base">
                {item}
              </span>
              <span className="size-1.5 shrink-0 rounded-full bg-current opacity-60" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
