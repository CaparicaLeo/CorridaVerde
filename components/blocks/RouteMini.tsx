import { roleLabel } from "@/components/blocks/RouteDiagram";
import { trajeto } from "@/data/event";
import { cn } from "@/lib/cn";

/**
 * O trajeto em miniatura: as mesmas paradas de `trajeto.stops`, numa linha.
 * Serve onde o esquema grande não cabe mas o percurso precisa estar dito —
 * hoje, sob o título da lista de espera.
 *
 * Lê o mesmo dado do RouteDiagram de propósito: mudou uma parada, as duas
 * versões mudam juntas. Marcadores com a gramática de lá (cheio na largada,
 * anel no que se atravessa e na chegada); a primeira parada encosta à
 * esquerda, a última à direita, e a linha vai de um centro de ponto ao outro.
 */
export function RouteMini({ className }: { className?: string }) {
  const { stops } = trajeto;

  return (
    <div className={cn("relative max-w-md", className)}>
      {/* A linha liga o centro do primeiro ponto (6px) ao do último. */}
      <span aria-hidden className="absolute top-1.5 right-1.5 left-1.5 h-0.5 -translate-y-1/2 bg-accent" />

      <ol aria-label={trajeto.diagramLabel} className="relative flex justify-between gap-3">
        {stops.map((stop, i) => (
          <li
            key={stop.id}
            className={cn(
              "flex min-w-0 flex-col gap-2",
              i === 0 && "items-start text-left",
              i > 0 && i < stops.length - 1 && "items-center text-center",
              i === stops.length - 1 && "items-end text-right",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-3 shrink-0 rounded-full border-2 border-accent",
                stop.role === "start" ? "bg-accent" : "bg-surface",
              )}
            />
            <span className="label-condensed text-[0.55rem] text-ink-muted">
              {roleLabel[stop.role]}
            </span>
            <span className="title-sans -mt-1 text-sm text-ink">{stop.shortName}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
