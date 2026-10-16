"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import type { Video } from "@/data/types";

/**
 * Vídeo como animação: mudo, em loop, sem controles e sem caixa. Não é um
 * player — a peça tem de parecer desenhada na página, em tempo real.
 *
 * Sem caixa porque o fundo do próprio arquivo é a cor da seção: na encodagem,
 * a névoa do original é trocada pelo tom onde o vídeo mora (ver `conceito`
 * em data/event.ts). A máscara nas bordas é só seguro contra a diferença de
 * um ou dois níveis que a compressão (yuv420) deixa entre o fundo do vídeo e
 * o CSS.
 *
 * Só toca enquanto está na tela; fora dela pausa, para não gastar bateria nem
 * banda de quem rolou adiante. Com movimento reduzido não toca: fica o pôster
 * parado — o conteúdo do vídeo também está em texto na página.
 */
export function LoopVideo({
  video,
  className,
}: {
  video: Video;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejeita quando o navegador barra autoplay (modo economia
          // no iOS, por exemplo). Não é erro: o pôster fica no lugar.
          element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      element.pause();
    };
  }, [prefersReducedMotion]);

  return (
    <video
      ref={ref}
      aria-label={video.label}
      poster={video.poster}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      disablePictureInPicture
      // Nada desce antes de entrar na tela: o play() do observer é que puxa
      // o arquivo.
      preload="none"
      className={cn(
        "pointer-events-none block h-auto w-full select-none",
        "[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent),linear-gradient(to_bottom,transparent,black_4%,black_96%,transparent)] [mask-composite:intersect]",
        className,
      )}
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      {video.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
