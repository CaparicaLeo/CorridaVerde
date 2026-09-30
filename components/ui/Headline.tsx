import type { ElementType, HTMLAttributes } from "react";

import { Highlight } from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";
import type { HeadlineLine } from "@/data/types";

/**
 * Headline de cartaz, renderizada a partir de dados.
 *
 * Cada linha vira uma máscara própria (`headline-mask`): é ela que esconde o
 * percurso do reveal, em que a linha entra deslizando de baixo. A quebra de
 * linha é decisão de composição e vem do conteúdo — o navegador nunca decide
 * onde a frase quebra.
 *
 * O elemento interno é marcado com `data-headline-line` para a seção pai
 * animá-lo sem conhecer esta estrutura.
 */
export function Headline({
  lines,
  as: Component = "p",
  className,
  tone = "light",
}: {
  lines: HeadlineLine[];
  /* Só tags HTML: o R3F acrescenta os elementos do three ao JSX global, e um
     ElementType solto passaria a incluir tags sem `children`. */
  as?: ElementType<HTMLAttributes<HTMLElement>>;
  className?: string;
  /** `dark` inverte o destaque para o slide de chapa amarela. */
  tone?: "light" | "dark";
}) {
  return (
    <Component className={cn("headline", className)}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="headline-mask">
          <span data-headline-line className="block will-change-transform">
            {line.map((segment, segmentIndex) =>
              segment.accent ? (
                <Highlight
                  key={segmentIndex}
                  /* Sobre a chapa amarela o amarelo sumiria: lá o destaque é
                     a chapa invertida, preta. */
                  className={tone === "dark" ? "text-surface/55" : undefined}
                >
                  {segment.text}
                </Highlight>
              ) : (
                <span key={segmentIndex}>{segment.text}</span>
              ),
            )}
          </span>
        </span>
      ))}
    </Component>
  );
}
