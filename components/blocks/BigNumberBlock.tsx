"use client";

import type { ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";
import { countUp, fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { BigNumber, MiniKpi } from "@/data/types";

/**
 * Big-number block do deck: estatística enorme, legenda em caixa alta e uma
 * fileira de mini-KPIs com ícone.
 *
 * Dois estados, e o segundo é o que importa:
 *
 *  - com `number.value`, o valor final já vai no HTML (correto para busca,
 *    leitor de tela e movimento reduzido) e o GSAP conta a partir do zero;
 *  - com `number.value` null, NÃO existe número na tela. Nada de "0", "—" ou
 *    "R$ --,--": entra a frase de `emptyState`, porque um placeholder com cara
 *    de preço é pior do que a ausência dele.
 */
export function BigNumberBlock({
  number,
  kpis,
  action,
  className,
}: {
  number: BigNumber;
  kpis?: MiniKpi[];
  /** CTA opcional exibido no estado vazio (ou ao lado do número). */
  action?: ReactNode;
  className?: string;
}) {
  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    // Marcador próprio, e não o `data-reveal` das seções: este bloco vive
    // DENTRO de seções que também animam `[data-reveal]`, e os dois seletores
    // pegariam os mesmos elementos. Com dois `gsap.from` sobre o mesmo alvo, o
    // segundo reaplica o estado inicial (opacity 0) depois de o primeiro ter
    // terminado — o bloco de valor da inscrição chegou a ficar invisível, uma
    // moldura vazia, quando a página era aberta já rolada até ele.
    fadeUp(scope.querySelectorAll("[data-number-reveal]"), {
      prefersReducedMotion,
      trigger: scope,
      stagger: 0.1,
    });

    const element = scope.querySelector<HTMLElement>("[data-count]");
    if (!element) return;

    const value = Number(element.dataset.count);
    if (Number.isNaN(value)) return;

    countUp(element, { value, prefersReducedMotion, trigger: scope });
  });

  const hasValue = number.value !== null;

  return (
    /* A chapa é do bloco, e não do container: quando ele entra numa grade
       desenhada por gap de 1px, sem `bg-surface` o cinza do container aparece
       atrás do conteúdo e o cartão fica com um tom que não é da paleta. */
    <div ref={root} className={cn("flex flex-col justify-center bg-surface p-8 lg:p-12", className)}>
      {hasValue ? (
        <p
          data-number-reveal
          className="poster-number flex items-baseline text-[clamp(3.5rem,14vw,9rem)] text-ink"
        >
          {number.prefix ? (
            /* O respiro entre prefixo e número é margem, não caractere: o span
               é flex item e o espaço no fim da string seria colapsado. */
            <span className="mr-3 text-[0.35em] text-accent">{number.prefix}</span>
          ) : null}
          <span data-count={number.value} suppressHydrationWarning>
            {formatNumber(number.value ?? 0)}
          </span>
          {number.suffix ? (
            <span className="text-accent">{number.suffix}</span>
          ) : null}
        </p>
      ) : null}

      <p
        data-number-reveal
        className={cn(
          "label-condensed text-sm",
          hasValue ? "mt-5 text-ink" : "text-accent",
        )}
      >
        {number.caption}
      </p>

      {hasValue ? (
        number.note ? (
          <p data-number-reveal className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {number.note}
          </p>
        ) : null
      ) : (
        <p
          data-number-reveal
          className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted"
        >
          {number.emptyState}
        </p>
      )}

      {action ? (
        <div data-number-reveal className="mt-8">
          {action}
        </div>
      ) : null}

      {kpis && kpis.length > 0 ? (
        <ul
          data-number-reveal
          className="mt-10 grid gap-x-8 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-2"
        >
          {kpis.map((kpi) => (
            <li key={kpi.id} className="flex items-start gap-3">
              <Icon name={kpi.icon} className="mt-px size-5 shrink-0 text-accent" />
              <span className="label-condensed text-[0.7rem] leading-snug text-ink">
                {kpi.label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
