"use client";

import { useId, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { fadeUp } from "@/lib/animations/presets";
import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/data/types";

/**
 * Accordion acessível do FAQ.
 *
 * Acessibilidade: cada item é um <button> com `aria-expanded` apontando para
 * o painel via `aria-controls`; o painel fica com `hidden` quando fechado, de
 * modo que leitores de tela e a busca do navegador não leiam conteúdo oculto.
 *
 * A altura é animada uma vez por abertura (não a cada frame de scroll), então
 * animar `height` aqui é aceitável — é o único jeito de transicionar de/para
 * `auto` sem hardcodar altura.
 */
export function Accordion({
  items,
  className,
  /** Índice aberto por padrão. `null` deixa tudo fechado. */
  defaultOpen = null,
  /** Se `true`, abrir um item fecha os outros. */
  single = true,
}: {
  items: FaqItem[];
  className?: string;
  defaultOpen?: number | null;
  single?: boolean;
}) {
  const baseId = useId();
  const prefersReducedMotion = useReducedMotion();
  const initialOpen =
    defaultOpen !== null && items[defaultOpen] ? [items[defaultOpen].id] : [];

  const [openIds, setOpenIds] = useState<string[]>(initialOpen);
  /**
   * Painéis presentes na árvore acessível. Inclui os que estão fechando: sem
   * isso o `hidden` entraria no mesmo commit do clique e a animação de saída
   * nunca apareceria.
   */
  const [visibleIds, setVisibleIds] = useState<string[]>(initialOpen);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const root = useGsapScroll<HTMLDivElement>(({ scope, prefersReducedMotion: reduced }) => {
    fadeUp(scope.querySelectorAll("[data-accordion-item]"), {
      prefersReducedMotion: reduced,
      trigger: scope,
      stagger: 0.07,
      y: 18,
    });
  });

  function toggle(id: string) {
    const isOpen = openIds.includes(id);
    const next = isOpen
      ? openIds.filter((openId) => openId !== id)
      : single
        ? [id]
        : [...openIds, id];

    const closing = openIds.filter((openId) => !next.includes(openId));

    setOpenIds(next);

    if (prefersReducedMotion) {
      setVisibleIds(next);
      return;
    }

    closing.forEach((closingId) => {
      const panel = panelRefs.current[closingId];
      if (!panel) {
        setVisibleIds((current) => current.filter((cid) => cid !== closingId));
        return;
      }

      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () =>
          setVisibleIds((current) => current.filter((cid) => cid !== closingId)),
      });
    });

    if (isOpen) return;

    setVisibleIds((current) => [...current, id]);

    // O painel só sai do `hidden` no próximo commit; medimos depois dele.
    requestAnimationFrame(() => {
      const panel = panelRefs.current[id];
      if (!panel) return;

      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          clearProps: "height",
        },
      );
    });
  }

  return (
    <div ref={root} className={cn("divide-y divide-white/10 border-y border-white/10", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div key={item.id} data-accordion-item>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    "text-lg font-semibold transition-colors sm:text-xl",
                    isOpen ? "text-ink" : "text-ink/85 group-hover:text-ink",
                  )}
                >
                  {item.question}
                </span>

                <span
                  aria-hidden
                  className={cn(
                    "mt-1 grid size-7 shrink-0 place-items-center border transition-colors duration-300",
                    isOpen
                      ? "border-accent bg-accent text-surface"
                      : "border-white/25 text-ink-muted group-hover:border-accent",
                  )}
                >
                  <span
                    className={cn(
                      "block text-base leading-none transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!visibleIds.includes(item.id)}
              ref={(node) => {
                panelRefs.current[item.id] = node;
              }}
              className="overflow-hidden"
            >
              <p className="max-w-3xl pb-7 text-base leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
