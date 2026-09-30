"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useGsapScroll } from "@/lib/hooks/useGsapScroll";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline";
type Size = "md" | "lg" | "xl";

const variantClasses: Record<Variant, string> = {
  /** Único lugar em que o amarelo vira área sólida grande. */
  primary: "bg-accent text-surface",
  outline: "border border-white/25 text-ink",
};

const sizeClasses: Record<Size, string> = {
  md: "px-6 py-3.5 text-xs",
  lg: "px-8 py-4.5 text-sm",
  /**
   * Botão-destino de uma seção inteira (ex.: mapa do percurso). No celular
   * volta ao corpo do `lg`: em 390px, text-base com o tracking do label
   * quebrava "VER O PERCURSO NO MAPA" em duas linhas.
   */
  xl: "px-8 py-5 text-sm sm:px-12 sm:py-6 sm:text-base",
};

export type CTAButtonProps = {
  children: ReactNode;
  /** Destino. Externo (a página de inscrição) abre em nova aba. */
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Pulso sutil de urgência — reserve para o CTA principal da seção. */
  pulse?: boolean;
  /** Entrada animada ao entrar no viewport. */
  animateIn?: boolean;
  ariaLabel?: string;
};

/**
 * CTA do projeto. Todos apontam para a página oficial de inscrição
 * (data/event.ts) — não há fluxo próprio de checkout aqui.
 *
 * O hover usa `gsap.quickTo`, que reaproveita o mesmo tween a cada evento em
 * vez de criar um novo: é o que mantém a interação fluida com vários CTAs na
 * página. Tudo em `transform`/`opacity`, nada que force reflow.
 */
export function CTAButton({
  children,
  href,
  variant = "primary",
  size = "lg",
  className,
  pulse = false,
  animateIn = true,
  ariaLabel,
}: CTAButtonProps) {
  const root = useGsapScroll<HTMLDivElement>(
    ({ scope, prefersReducedMotion, gsap: g }) => {
      const target = scope.querySelector("[data-cta-target]");
      const glow = scope.querySelector("[data-cta-glow]");
      if (!target || prefersReducedMotion) return;

      if (animateIn) {
        g.from(scope, {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start: "top 92%", once: true },
        });
      }

      // Pulso de urgência: escala mínima e contínua, só no halo — nunca no
      // texto, para não causar reflow nem cansar a leitura.
      if (pulse && glow) {
        g.to(glow, {
          opacity: 0.5,
          scale: 1.12,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      const moveY = g.quickTo(target, "y", { duration: 0.35, ease: "power3.out" });
      const scaleTo = g.quickTo(target, "scale", { duration: 0.35, ease: "power3.out" });
      const glowTo = glow
        ? g.quickTo(glow, "opacity", { duration: 0.4, ease: "power2.out" })
        : null;

      const enter = () => {
        moveY(-3);
        scaleTo(1.02);
        glowTo?.(0.7);
      };
      const leave = () => {
        moveY(0);
        scaleTo(1);
        glowTo?.(pulse ? 0.32 : 0);
      };
      const press = () => scaleTo(0.97);

      scope.addEventListener("pointerenter", enter);
      scope.addEventListener("pointerleave", leave);
      scope.addEventListener("pointerdown", press);
      scope.addEventListener("pointerup", enter);
      scope.addEventListener("focusin", enter);
      scope.addEventListener("focusout", leave);

      return () => {
        scope.removeEventListener("pointerenter", enter);
        scope.removeEventListener("pointerleave", leave);
        scope.removeEventListener("pointerdown", press);
        scope.removeEventListener("pointerup", enter);
        scope.removeEventListener("focusin", enter);
        scope.removeEventListener("focusout", leave);
      };
    },
    [animateIn, pulse],
  );

  /* A inscrição mora fora do site (TicketSports): abrir em nova aba mantém a
     página do evento aberta atrás no desktop e não descarta o site no celular.
     Âncora interna navega na mesma aba, como qualquer link. */
  const isExternal = /^https?:\/\//.test(href);

  return (
    <div
      ref={root}
      className={cn("relative isolate inline-flex w-fit select-none", className)}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="relative inline-flex w-full focus-visible:outline-offset-4"
      >
        {variant === "primary" ? (
          <span
            aria-hidden
            data-cta-glow
            className="pointer-events-none absolute -inset-3 -z-10 bg-accent/40 opacity-0 blur-2xl"
            style={{ opacity: pulse ? 0.32 : 0 }}
          />
        ) : null}

        <span
          data-cta-target
          className={cn(
            "label-condensed relative inline-flex w-full items-center justify-center gap-3 will-change-transform",
            sizeClasses[size],
            variantClasses[variant],
            variant === "outline" && "transition-colors hover:border-accent",
          )}
        >
          {children}
          <span aria-hidden className="text-base leading-none">
            →
          </span>
        </span>
      </Link>
    </div>
  );
}
