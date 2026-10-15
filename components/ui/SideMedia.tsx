import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/cn";
import type { Media as MediaType } from "@/data/types";

/**
 * Foto lateral com a cor da seção dissolvendo sobre ela — o layout das telas
 * do deck comercial 2027 (texto à esquerda, foto à direita, sem borda seca
 * entre os dois).
 *
 * No desktop (lg) a foto é absoluta na direita da <Section>, da borda de cima
 * à de baixo; no celular ela vira um bloco de largura total no topo da seção
 * e a cor sobe por baixo dela até o texto. Por isso o componente desfaz o
 * padding da <Section> e do container no celular (margens negativas com os
 * mesmos valores de `py-*` e `container-page`) — se um dos dois mudar, mude
 * aqui também.
 *
 * A dissolução são duas camadas: desfoque progressivo (backdrop-blur com
 * máscara em degradê) e a `surface` do tom indo de cheia a transparente. Como
 * usa `bg-surface`, funciona em qualquer tom — lima, broto, névoa ou mata.
 *
 * O texto que vem depois precisa de `relative` (ou `z-*`): no desktop a foto é
 * posicionada e pintaria por cima de conteúdo estático.
 */
export function SideMedia({
  media,
  objectPosition = "object-center",
  className,
}: {
  media: MediaType | null;
  /** Classe `object-[x_y]` do enquadramento: onde está o assunto da foto. */
  objectPosition?: string;
  className?: string;
}) {
  if (!media) return null;

  return (
    <div
      className={cn(
        "relative -mx-5 -mt-20 mb-10 h-80 overflow-hidden sm:-mt-28 sm:h-[26rem] md:-mx-10",
        "lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:h-auto lg:w-[52%]",
        className,
      )}
    >
      <Media
        media={media}
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="h-full w-full bg-transparent"
        imageClassName={objectPosition}
        stretch
      />

      {/* Desfoque progressivo: cheio na borda do texto, some no meio da foto. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_25%,transparent)] lg:inset-y-0 lg:right-auto lg:left-0 lg:h-auto lg:w-1/2 lg:[mask-image:linear-gradient(to_right,black_25%,transparent)]"
      />

      {/* A cor da seção dissolvendo sobre a foto. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-surface from-5% via-surface/55 via-35% to-transparent to-65% lg:bg-linear-to-r lg:from-surface lg:from-0% lg:via-surface/60 lg:via-25% lg:to-transparent lg:to-60%"
      />
    </div>
  );
}
