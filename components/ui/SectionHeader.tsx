import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import type { SectionIntro } from "@/data/types";

/**
 * Cabeçalho padrão de seção (eyebrow de destaque + título + descrição).
 *
 * Marca os próprios elementos com `data-reveal` para a seção pai animá-los em
 * stagger sem precisar conhecer a estrutura interna.
 */
export function SectionHeader({
  intro,
  align = "left",
  className,
  titleClassName,
  inverted = false,
  onLight = false,
  children,
}: {
  intro: SectionIntro;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  /** `true` sobre a chapa de destaque: o destaque do texto é o quase preto. */
  inverted?: boolean;
  /**
   * `true` sobre a chapa clara. O texto segue na cor da superfície (quase
   * preto), mas o eyebrow volta a ser verde: ele precisa contrastar com o
   * branco, e o quase preto a 70% sobre branco é um cinza sem destaque.
   */
  onLight?: boolean;
  children?: ReactNode;
}) {
  // `inverted` e `onLight` compartilham a cor do texto e só divergem no
  // eyebrow — daí a soma em vez de dois ramos inteiros de classe.
  const onPlate = inverted || onLight;

  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {intro.eyebrow ? (
        <Eyebrow
          className="w-fit"
          tone={inverted ? "inverse" : "accent"}
          data-reveal
        >
          {intro.eyebrow}
        </Eyebrow>
      ) : null}

      <h2
        data-reveal
        className={cn(
          "headline text-4xl sm:text-5xl lg:text-6xl",
          onPlate && "text-surface",
          titleClassName,
        )}
      >
        {intro.title}
      </h2>

      {intro.description ? (
        <p
          data-reveal
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            onPlate ? "text-surface/75" : "text-ink-muted",
          )}
        >
          {intro.description}
        </p>
      ) : null}

      {children}
    </header>
  );
}