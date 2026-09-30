"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { MedalErrorBoundary } from "@/components/medal/MedalErrorBoundary";
import { medalConfig } from "@/components/medal/config";
import { useSpinControls } from "@/components/medal/useSpinControls";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/*
 * three + R3F + drei são o grosso do peso da página: ficam num chunk à parte,
 * baixado só quando a seção se aproxima. `ssr: false` porque WebGL não existe
 * no servidor — o HTML estático sai com o skeleton no lugar.
 */
const MedalCanvas = dynamic(
  () => import("@/components/medal/MedalCanvas").then((mod) => mod.MedalCanvas),
  { ssr: false },
);

/** Quanto antes de a seção entrar na tela o chunk 3D (e o .glb) começam a baixar. */
const PRELOAD_MARGIN = "600px 0px";

/**
 * Palco da medalha 3D: carregamento preguiçoso, skeleton, gesto de giro e
 * rede de segurança.
 *
 * `usePlaceholder` é a chave única entre a medalha procedural e o .glb real —
 * por padrão lê `medalConfig.usePlaceholder` (ver components/medal/config.ts,
 * que registra por que o palco não está montado na landing). Com `false`, o
 * .glb é checado e pré-carregado junto com o chunk; ausente ou quebrado, a
 * cena cai na procedural.
 */
export function MedalStage({
  usePlaceholder = medalConfig.usePlaceholder,
  modelUrl = medalConfig.modelUrl,
  className,
}: {
  usePlaceholder?: boolean;
  modelUrl?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  /** Resultado do HEAD no .glb — só importa com `usePlaceholder` false. */
  const [modelStatus, setModelStatus] = useState<"checking" | "available" | "missing">(
    "checking",
  );
  const prefersReducedMotion = useReducedMotion();
  const { advance, handlers } = useSpinControls();

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        nearObserver.disconnect();
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    /* Fora da tela o loop de render para: nada de GPU girando uma medalha que
       ninguém vê. */
    const visibilityObserver = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );

    nearObserver.observe(element);
    visibilityObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  /*
   * Antes de pedir o .glb ao three, um HEAD confirma que ele existe. O caso
   * realista de falha é a flag trocada antes de o arquivo subir: sem essa
   * checagem, o useGLTF lança, o boundary pega e cai na procedural — mas o R3F
   * ainda reporta o erro como não tratado, e ele apareceria em vermelho no
   * console e em qualquer monitoramento. Roda em paralelo ao chunk 3D, então
   * não atrasa a cena. Arquivo presente mas corrompido segue pelo boundary.
   */
  useEffect(() => {
    if (!near || usePlaceholder) return;
    let cancelled = false;

    fetch(modelUrl, { method: "HEAD" })
      .then((response) => response.ok)
      .catch(() => false)
      .then((available) => {
        if (cancelled) return;
        setModelStatus(available ? "available" : "missing");
        if (available) {
          void import("@/components/medal/GltfMedal").then((mod) =>
            mod.preloadMedalModel(modelUrl),
          );
        } else {
          console.warn(`[medalha] ${modelUrl} não encontrado; mostrando a medalha procedural.`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [near, usePlaceholder, modelUrl]);

  const showModel = !usePlaceholder && modelStatus === "available";
  const probingModel = !usePlaceholder && modelStatus === "checking";

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback((error: unknown) => {
    console.warn("[medalha] Cena 3D indisponível; a seção segue sem a medalha.", error);
    setFailed(true);
  }, []);

  /* Sem WebGL (ou com erro no three), a coluna simplesmente não existe — o
     slide continua sendo só a frase, como era antes da medalha. */
  if (failed) return null;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        ref={root}
        role="img"
        aria-label={medalConfig.alt}
        tabIndex={0}
        {...handlers}
        className="relative aspect-[4/5] w-full max-w-sm lg:max-w-none cursor-grab touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-surface/50 active:cursor-grabbing"
      >
        {near && !probingModel ? (
          <MedalErrorBoundary fallback={null} onError={handleFailure}>
            <MedalCanvas
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                ready ? "opacity-100" : "opacity-0",
              )}
              usePlaceholder={!showModel}
              modelUrl={modelUrl}
              active={visible}
              autoSpin={!prefersReducedMotion}
              advanceSpin={advance}
              onReady={handleReady}
            />
          </MedalErrorBoundary>
        ) : null}

        {!ready ? <MedalSkeleton /> : null}
      </div>

      <p
        aria-hidden
        className={cn(
          "label-condensed mt-3 text-[0.65rem] text-surface/60 transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {medalConfig.hint}
      </p>
    </div>
  );
}

/**
 * Silhueta do disco + spinner enquanto o chunk 3D e o modelo carregam.
 *
 * Posição e tamanho saem do enquadramento (frame.ts): com a fita acima, o
 * centro do disco fica a ~67% da altura e o diâmetro ocupa ~57% da largura —
 * a medalha aparece exatamente onde o skeleton estava.
 */
function MedalSkeleton() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-[67%] grid aspect-square w-[57%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-surface/15 motion-safe:animate-pulse">
        <div className="size-6 rounded-full border-2 border-surface/15 border-t-surface/60 motion-safe:animate-spin" />
      </div>
    </div>
  );
}
