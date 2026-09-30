"use client";

import { Icon } from "@/components/ui/Icon";
import { staggerIn } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { cn } from "@/lib/cn";
import type { IconItem } from "@/data/types";

/**
 * Icon-grid: ícone verde, rótulo em caixa alta e a grade desenhada pelo gap de
 * 1px sobre a chapa escura do container.
 *
 * São 3 colunas. A conta importa: com os 6 itens das ativações, 3 divide 6 sem
 * sobra — duas linhas completas em todos os breakpoints, nenhuma célula
 * pendurada. Uma grade de 4 deixaria duas células vazias na segunda linha, e
 * célula vazia aqui não é espaço em branco: é a chapa do container aparecendo,
 * um bloco cinza no fim da lista. Se a lista mudar de tamanho, refaça a conta.
 *
 * `detail` é a linha de apoio do item (uma activation por concept). Sem ela o
 * grid volta a ser só rótulo — que era o formato do KM1, onde o kit do atleta
 * se explicava pela imagem de produto ao lado, que aqui não existe.
 */
export function IconGridBlock({
  items,
  className,
}: {
  items: IconItem[];
  className?: string;
}) {
  const root = useGsapScroll<HTMLUListElement>(({ scope, prefersReducedMotion }) => {
    staggerIn(scope.querySelectorAll("[data-icon-item]"), {
      prefersReducedMotion,
      trigger: scope,
      start: "top 85%",
      y: 24,
      each: 0.07,
    });
  });

  return (
    <ul
      ref={root}
      className={cn(
        "grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          data-icon-item
          className="group flex flex-col gap-5 bg-surface p-7 transition-colors duration-300 hover:bg-surface-alt"
        >
          <Icon name={item.icon} className="size-8 text-accent" />
          <span className="label-condensed text-[0.75rem] leading-snug text-ink">
            {item.label}
          </span>

          {item.detail ? (
            <p className="text-sm leading-relaxed text-ink-muted">{item.detail}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}