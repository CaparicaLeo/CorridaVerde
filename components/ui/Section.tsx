import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionTone = "mist" | "sprout" | "dark" | "accent";

/**
 * Cada tom liga a classe `tone-*` (app/globals.css), que redefine os tokens
 * de cor para tudo o que está dentro, e pinta o fundo com o `surface` dela.
 *
 * A página é névoa com intervalos: entre duas seções de névoa entra uma de
 * broto (`sprout`) ou a chapa de lima (`accent`). Duas vizinhas no mesmo tom
 * leem como uma seção só — alterne. O mata (`dark`) fica para o header e o
 * rodapé.
 */
const toneClasses: Record<SectionTone, string> = {
  /** Névoa: o tom da página. */
  mist: "tone-mist bg-surface text-ink",
  /** Broto: o intervalo entre seções de névoa. */
  sprout: "tone-sprout bg-surface text-ink",
  /** Mata: header e rodapé; fica disponível para bloco escuro pontual. */
  dark: "tone-dark bg-surface text-ink",
  /** Slide de impacto: chapa lima, texto mata. */
  accent: "tone-lime bg-surface text-ink",
};

/**
 * Wrapper de seção: âncora, tom de fundo, ritmo vertical e container.
 * Toda seção passa por aqui, para o espaçamento do site ficar num lugar só.
 */
export function Section({
  id,
  tone = "mist",
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