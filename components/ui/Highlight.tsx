import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type HighlightVariant = "text" | "mark";

const variantClasses: Record<HighlightVariant, string> = {
  /** Palavra ou número em amarelo — destaque pontual, nunca frase inteira. */
  text: "text-accent",
  /** Chapa amarela atrás do texto, com o preto do fundo por cima. */
  mark: "bg-accent text-surface px-2 -mx-1",
};

export function Highlight({
  children,
  variant = "text",
  className,
}: {
  children: ReactNode;
  variant?: HighlightVariant;
  className?: string;
}) {
  return (
    <span className={cn(variantClasses[variant], className)}>{children}</span>
  );
}
