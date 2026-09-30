import Image from "next/image";

import { cn } from "@/lib/cn";
import type { Media as MediaType } from "@/data/types";

/**
 * Wrapper de next/image.
 *
 * A proporção sempre vem do dado (`media.width`/`media.height`), nunca do
 * componente: trocar a arte por outra de proporção diferente é editar
 * data/event.ts, sem layout shift e sem mexer aqui.
 *
 * `media` aceita null porque a arte ainda não chegou (PENDÊNCIA 5 de
 * data/event.ts). Nesse caso o slot não some e não volta no layout: ele
 * ocupa a mesma área, com a atmosfera da identidade no lugar da foto, e
 * `next/image` nem é montado. Enquanto o dado for null, a página já sai com a
 * altura certa — e trocar por foto não é reflow, é preenchimento.
 */
export function Media({
  media,
  className,
  imageClassName,
  sizes = "100vw",
  preload = false,
  stretch = false,
  /** Atmosfera de fallback quando `media` é null. */
  fallbackClassName,
}: {
  media: MediaType | null;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  /** Só para o elemento LCP — hoje, a foto de fundo do hero. */
  preload?: boolean;
  /**
   * `true` quando a altura vem do container, não do dado — coluna de grade,
   * por exemplo. Com a proporção declarada, uma foto em retrato (900×1600)
   * numa coluna de 525px pedia 933px de altura e esticava a linha inteira da
   * grade, deixando meia tela vazia ao lado do texto.
   */
  stretch?: boolean;
  /**
   * Classes do placeholder quando não há foto. O padrão é a mesma atmosfera do
   * hero — dois focos de verde diluídos sobre o fundo da marca, mais o grão da
   * página — para que a seção pareça escolhida, e não quebrada.
   */
  fallbackClassName?: string;
}) {
  const { atmosphere } = atmosphereClass;

  return (
    <div
      className={cn("relative overflow-hidden bg-surface-alt", className)}
      style={
        media && !stretch
          ? { aspectRatio: `${media.width} / ${media.height}` }
          : undefined
      }
    >
      {media ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div aria-hidden className={cn("absolute inset-0", atmosphere, fallbackClassName)} />
      )}
    </div>
  );
}

/**
 * Atmosfera da identidade para slots sem foto.
 *
 * Fica aqui, e não repetida em cada seção, porque o hero e a foto de história
 * precisam exatamente do mesmo desenho: se divergirem, a página passa a ter
 * dois "modos" de sem-foto e o olho pega a diferença entre blocos vizinhos.
 */
const atmosphereClass = {
  atmosphere:
    "bg-[radial-gradient(115%_85%_at_72%_22%,rgba(99,190,63,0.20),transparent_58%),radial-gradient(85%_70%_at_20%_82%,rgba(99,190,63,0.12),transparent_62%)]",
} as const;
