"use client";

import { Icon } from "@/components/ui/Icon";
import { drawLine } from "@/lib/animations/presets";
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
 * A linha é desenhada no scroll com o preset `drawLine` (scale + scrub), o
 * que mantém tudo em transform e não dispara layout a cada quadro, e cada
 * parada acende quando o preenchimento passa por ela. E como o percurso vem de `data/event.ts`, mudar a
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
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion, gsap }) => {
    // A linha do percurso cresce com o scroll e acende cada parada quando
    // chega nela: é o trajeto sendo percorrido. No celular as paradas
    // empilham e a linha desce; a partir do `sm` elas ficam lado a lado e a
    // linha corre na horizontal. O matchMedia refaz a medição na troca.
    const media = gsap.matchMedia();
    const run = (axis: "x" | "y") => () => {
      drawLine(scope.querySelector("[data-route-line]"), {
        prefersReducedMotion,
        trigger: scope,
        end: "bottom 70%",
        axis,
        rail: scope.querySelector<HTMLElement>("[data-route-rail]"),
        points: scope.querySelectorAll("[data-route-stop]"),
      });
    };
    media.add("(min-width: 40rem)", run("x"));
    media.add("(max-width: 39.99rem)", run("y"));

    return () => media.revert();
  });

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* Trilho e linha vão do centro da largada ao centro da chegada — a
          geometria é medida em `drawLine`, porque é onde os marcadores caem
          depois da quebra de texto. Antes da medição, os dois ficam com zero
          de tamanho: nada de linha solta onde não há ponto. */}
      <div data-route-rail aria-hidden className="absolute size-0 bg-line" />
      <div data-route-line aria-hidden className="absolute size-0 bg-accent" />

      <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
        {stops.map((stop) => (
          <li
            key={stop.id}
            data-route-stop
            data-point
            /* No celular a linha desce pela coluna do marcador, então o texto
               vai na coluna ao lado (grid de 2) — senão a linha cortaria o
               rótulo e o nome. A partir do `sm` volta a empilhar sob o ponto. */
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 sm:flex sm:flex-col sm:items-center sm:gap-4 sm:text-center lg:items-start lg:text-left"
          >
            {/* O marcador é o que dá o papel da parada: ponto cheio na largada,
                anel na chegada, traço no que se atravessa. */}
            <span
              aria-hidden
              data-point-dot
              className={cn(
                "relative mt-0.5 size-5 shrink-0 rounded-full border-2 bg-surface",
                stop.role === "start" && "border-accent bg-accent",
                stop.role === "through" && "border-accent bg-surface",
                stop.role === "finish" && "border-accent",
              )}
            />

            <span
              className={cn(
                "label-condensed col-start-2 self-center text-[0.6rem] sm:self-auto",
                stop.role === "start" || stop.role === "finish"
                  ? "text-accent-ink"
                  : "text-ink-muted",
              )}
            >
              {roleLabel[stop.role]}
            </span>

            <span className="col-start-2 flex flex-col gap-2.5 sm:items-center lg:items-start">
              <Icon name={stop.icon} className="size-7 text-accent-ink" />

              <span className="title-sans text-xl text-ink sm:text-2xl lg:text-3xl">
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