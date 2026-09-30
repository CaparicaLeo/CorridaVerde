import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionTone = "dark" | "darker" | "accent" | "light";

const toneClasses: Record<SectionTone, string> = {
  dark: "bg-surface text-ink",
  /** Um degrau abaixo do fundo, para separar blocos sem desenhar borda. */
  darker: "bg-surface-alt text-ink",
  /** Slide de impacto: chapa de destaque, texto na cor do fundo da página. */
  accent: "bg-accent text-surface",
  /**
   * Chapa clara. `text-surface` continua sendo a cor de texto padrão — a
   * regra do projeto é "texto na cor da superfície", e sobre branco isso é o
   * verde quase preto, que é o que a identidade pede.
   *
   * Uma chapa clara por página, no máximo: duas já trocam o balanço, e a
   * página inteira clara deixa de ser uma prova noturna.
   */
  light: "bg-light text-surface",
};

/**
 * Wrapper de seção: âncora, tom de fundo, ritmo vertical e container.
 * Toda seção passa por aqui, para o espaçamento do site ficar num lugar só.
 */
export function Section({
  id,
  tone = "dark",
  children,
  className,
  containerClassName,
  as: Component = "section",
  bleed = false,
}: {
  id?: string;
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div" | "footer";
  /** `true` remove o container (faixas de largura total). */
  bleed?: boolean;
}) {
  return (
    <Component
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28 lg:py-36",
        toneClasses[tone],
        className,
      )}
    >
      {bleed ? (
        children
      ) : (
        <div className={cn("container-page", containerClassName)}>{children}</div>
      )}
    </Component>
  );
}