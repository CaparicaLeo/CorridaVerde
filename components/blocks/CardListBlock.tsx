"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { cn } from "@/lib/cn";
import type { CardItem } from "@/data/types";

/**
 * Card-list: borda fina, eyebrow de destaque, ícone, nome em caixa alta e a
 * linha de trajeto da prova.
 *
 * A linha `de → até` no meio do card é o que separa esta prova das outras duas
 * de rua: duas delas atravessam a cidade entre parques diferentes, e uma sai e
 * volta para a mesma arena. Sem ela, o card só diria o quanto.
 */
export function CardListBlock({
  items,
  className,
  columns = 3,
}: {
  items: CardItem[];
  className?: string;
  /**
   * Colunas no desktop. O padrão é 3 porque a prova tem três percursos: com
   * duas, o terceiro card fica órfão na linha de baixo sozinho. Uma seção com
   * outra quantidade de itens passe o número.
   */
  columns?: 2 | 3;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    fadeUp(scope.querySelectorAll("[data-card]"), {
      prefersReducedMotion,
      trigger: scope,
    });
  });

  return (
    <div
      ref={root}
      className={cn(
        "grid gap-px border border-line bg-line",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <article
          key={item.id}
          data-card
          className={cn(
            "flex flex-col gap-6 p-8 lg:p-10",
            /* O card em destaque troca a chapa, não a borda: borda de destaque
               em grade de 1px vira moldura e desalinha visualmente a grade. */
            item.featured ? "bg-surface-alt" : "bg-surface",
          )}
        >
          {/* Número empilhado sob o eyebrow, e não ao lado: lado a lado, "6,7 MI"
              estourava a coluna em 320px e no lg de 1024px (terço de 943px). */}
          <div className="flex flex-col gap-4">
            <Eyebrow>{item.eyebrow}</Eyebrow>
            {item.badge ? (
              <div>
                <p className="poster-number text-5xl text-accent-ink sm:text-6xl">
                  {item.badge}
                </p>
                {item.badgeNote ? (
                  <p className="label-condensed mt-2 text-xs text-ink-muted">
                    {item.badgeNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-start gap-3">
            <Icon name={item.icon} className="mt-1 size-5 shrink-0 text-accent-ink" />
            <h3 className="title-sans text-xl text-ink sm:text-2xl">{item.title}</h3>
          </div>

          {/* Trajeto. `whitespace-nowrap` no nome do lugar porque "Parque Tanguá"
              quebrando ao meio com a seta no fim da linha lê como duas etapas
              diferentes — e a seta é a informação inteira. */}
          {item.from || item.to ? (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink">
              <span className="label-condensed text-ink">{item.from}</span>
              <span aria-hidden className="text-accent-ink">
                →
              </span>
              <span className="label-condensed text-ink">{item.to}</span>
            </p>
          ) : null}

          {item.description ? (
            <p className="text-base leading-relaxed text-ink-muted">
              {item.description}
            </p>
          ) : null}

          {item.meta && item.meta.length > 0 ? (
            <ul className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
              {item.meta.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink/85">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-accent" />
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}