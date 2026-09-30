"use client";

import { Icon } from "@/components/ui/Icon";
import { drawLine, fadeUp } from "@/lib/animations/presets";
import { cn } from "@/lib/cn";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import type { RouteStop } from "@/data/types";

/**
 * Esquema do trajeto: Parque Tanguá → Curitiba → Parque Barigui.
 *
 * É o conceito do evento desenhado — "a marca não ocupa um ponto, ocupa um
 * trajeto" — então ele é um ESQUEMA, não um mapa. Um mapa exigiria o traçado
 * real do percurso, que a organização ainda não entregou; e um mapa inventado
 * seria pior que nenhum. Aqui a afirmação é apenas a que é verdade: começa
 * num parque, atravessa a cidade, termina em outro parque.
 *
 * Por que SVG e não mapa de imagem: a linha é desenhada no scroll com o preset
 * `drawLine` (scaleX + scrub), o que mantém tudo em transform e não dispara
 * layout a cada quadro. E como o percurso vem de `data/event.ts`, mudar a
 * ordem ou o nome das paradas não é redesenhar nada — o esquema acompanha.
 *
 * O desenho é `aria-hidden`: a informação já está na lista semântica ao lado,
 * em texto, e duplicá-la em SVG só faria o leitor de tela ler duas vezes.
 */
export function RouteDiagram({
  stops,
  label,
  className,
}: {
  stops: RouteStop[];
  /** Resumo do percurso para quem não enxerga o desenho. */
  label: string;
  className?: string;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    // A linha do percurso cresce com o scroll: é o trajeto sendo percorrido.
    drawLine(scope.querySelector("[data-route-line]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 72%",
      end: "bottom 70%",
      axis: "x",
    });

    // As paradas entram depois que a linha passou por elas, na ordem.
    fadeUp(scope.querySelectorAll("[data-route-stop]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 78%",
      y: 18,
      stagger: 0.16,
    });
  });

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* Rail da linha: a linha desenhada corre por cima dele e some nas
          pontas, para o percurso não ter começo nem fim visível — ele sai da
          prova e entra na prova. */}
      <div
        aria-hidden
        className="absolute top-[0.55rem] right-[8%] bottom-[0.55rem] left-[8%] border-t border-white/10 sm:right-[6%] sm:left-[6%] lg:right-[4%] lg:left-[4%]"
      />
      <div
        data-route-line
        aria-hidden
        className="absolute top-[0.55rem] right-[8%] bottom-[0.55rem] left-[8%] border-t border-accent sm:right-[6%] sm:left-[6%] lg:right-[4%] lg:left-[4%]"
      />

      <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
        {stops.map((stop) => (
          <li
            key={stop.id}
            data-route-stop
            className="flex flex-col items-start gap-4 sm:items-center sm:text-center lg:items-start lg:text-left"
          >
            {/* O marcador é o que dá o papel da parada: ponto cheio na largada,
                anel na chegada, traço no que se atravessa. */}
            <span
              aria-hidden
              className={cn(
                "mt-0.5 size-5 shrink-0 rounded-full border-2 bg-surface",
                stop.role === "start" && "border-accent bg-accent",
                stop.role === "through" && "border-accent bg-surface",
                stop.role === "finish" && "border-accent",
              )}
            />

            <span
              className={cn(
                "label-condensed text-[0.6rem]",
                stop.role === "start" || stop.role === "finish"
                  ? "text-accent"
                  : "text-ink-muted",
              )}
            >
              {roleLabel[stop.role]}
            </span>

            <span className="flex flex-col gap-2.5">
              <Icon name={stop.icon} className="size-7 text-accent" />

              <span className="headline text-2xl text-ink sm:text-3xl lg:text-4xl">
                {stop.name}
              </span>

              {stop.caption ? (
                <span className="max-w-xs text-sm leading-relaxed text-ink-muted">
                  {stop.caption}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>

      {/* A descrição vai para o leitor de tela uma vez só, no lugar certo: o
          `aria-label` do <ol> entra depois do rótulo da lista, então o texto
          longo em sr-only é o que se ouve de fato. */}
      <p className="sr-only">{label}</p>
    </div>
  );
}

/**
 * Rótulo do papel de cada parada. É a informação que distingue largada, o que
 * se atravessa e chegada — e o que faz o esquema ser um percurso e não três
 * lugares enfileirados.
 */
const roleLabel: Record<RouteStop["role"], string> = {
  start: "Largada",
  through: "Através de",
  finish: "Chegada",
};