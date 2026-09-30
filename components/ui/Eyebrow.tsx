import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type EyebrowProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /**
   * `inverse` para uso sobre a chapa amarela: lá o amarelo do eyebrow some, e
   * quem marca o texto é o preto do fundo invertido.
   */
  tone?: "accent" | "inverse";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "tone">;

/**
 * Eyebrow do deck: caixa alta, tracking largo, amarelo.
 *
 * Junto com <Highlight>, é um dos dois lugares autorizados a usar o amarelo em
 * texto. Se você está prestes a escrever `text-accent` num parágrafo, use um
 * destes dois — a regra da identidade é que o amarelo marque, não escreva.
 */
export function Eyebrow<T extends ElementType = "p">({
  as,
  children,
  className,
  tone = "accent",
  ...rest
}: EyebrowProps<T>) {
  /* Estreito para tags HTML: o R3F acrescenta os elementos do three ao JSX
     global, e um ElementType solto passaria a incluir tags sem `children`. */
  const Component = (as ?? "p") as ElementType<HTMLAttributes<HTMLElement>>;

  return (
    <Component
      className={cn(
        "label-condensed inline-flex items-center gap-2 text-[0.7rem] leading-none",
        tone === "accent" ? "text-accent" : "text-surface/70",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
