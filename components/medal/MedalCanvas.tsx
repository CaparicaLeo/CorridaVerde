"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { NeutralToneMapping, type Group } from "three";

import { theme } from "@/app/theme";
import { MEDAL_BOUNDS, MEDAL_CAMERA } from "@/components/medal/frame";
import { GltfMedal } from "@/components/medal/GltfMedal";
import { MedalErrorBoundary } from "@/components/medal/MedalErrorBoundary";
import { ProceduralMedal } from "@/components/medal/ProceduralMedal";

/** Avança o giro um quadro e devolve o ângulo em Y (ver useSpinControls). */
type AdvanceSpin = (deltaSeconds: number, autoSpin: boolean) => number;

/**
 * Cena da medalha. Chunk à parte (ver MedalStage): tudo que importa three mora
 * daqui para baixo.
 */
export function MedalCanvas({
  className,
  usePlaceholder,
  modelUrl,
  active,
  autoSpin,
  advanceSpin,
  onReady,
}: {
  className?: string;
  usePlaceholder: boolean;
  modelUrl: string;
  /** `false` fora da tela: o loop de render para. */
  active: boolean;
  /** `false` com prefers-reduced-motion: a peça só gira quando a pessoa arrasta. */
  autoSpin: boolean;
  advanceSpin: AdvanceSpin;
  onReady: () => void;
}) {
  return (
    <div className={className}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={MEDAL_CAMERA}
        gl={{ antialias: true, alpha: true }}
        /* O R3F liga ACES por padrão, que dessatura o amarelo: a fita sairia
           num tom diferente da chapa logo atrás dela. O Neutral preserva a cor
           de marca. Só vale na criação — o R3F não reaplica depois. */
        onCreated={({ gl }) => {
          gl.toneMapping = NeutralToneMapping;
        }}
      >
        <StudioLighting />

        <Suspense fallback={null}>
          <SpinRig advanceSpin={advanceSpin} autoSpin={autoSpin}>
            {usePlaceholder ? (
              <ProceduralMedal />
            ) : (
              <MedalErrorBoundary fallback={<ProceduralMedal />} onError={warnModelFailure}>
                <GltfMedal url={modelUrl} />
              </MedalErrorBoundary>
            )}
          </SpinRig>

          {/* Só monta quando tudo acima resolveu (modelo baixado, fonte
              parseada): é o sinal para a MedalStage trocar o skeleton pela cena. */}
          <ReadySignal onReady={onReady} />
        </Suspense>

        <ContactShadows
          position-y={-MEDAL_BOUNDS.height / 2 - 0.25}
          scale={3.5}
          blur={2}
          far={4}
          opacity={0.55}
          resolution={256}
          color={theme.colors.background}
        />
      </Canvas>
    </div>
  );
}

/**
 * Estúdio feito de Lightformers, sem HDR: os presets do drei baixam o .hdr de
 * um CDN em runtime, e aqui nada da cena depende de rede.
 *
 * Metal quase não tem cor própria — ele é o que reflete. Fundo escuro com
 * faixas fortes dá o contraste de ouro polido (sem isso ele fica chapado,
 * "plástico amarelo"), e o rebatimento de baixo usa o accent: é a luz que a
 * chapa amarela da seção jogaria de volta numa peça real.
 */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={[theme.colors.background]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 1]} scale={[10, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} scale={[2, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} position={[5, 1, 2]} scale={[2, 8, 1]} target={[0, 0, 0]} />
        {/* Softbox frontal: de frente, o disco espelha o que está atrás da
            câmera. Sem ele, campo e "KM1" refletiam o preto e a face virava
            marrom — só o verso, pegando as faixas laterais, parecia ouro. */}
        <Lightformer form="rect" intensity={1.5} position={[0, -0.5, 7]} scale={[10, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} position={[2, 2, 6]} scale={2} target={[0, 0, 0]} />
        <Lightformer
          form="rect"
          color={theme.colors.accent}
          intensity={1.2}
          position={[0, -5, 0]}
          scale={[10, 10, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}

/** Aplica o giro (gesto + inércia + ocioso) só no eixo Y, e a flutuação leve. */
function SpinRig({
  advanceSpin,
  autoSpin,
  children,
}: {
  advanceSpin: AdvanceSpin;
  autoSpin: boolean;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);

  useFrame((state, rawDelta) => {
    if (!group.current) return;
    /* Aba em segundo plano devolve um delta de segundos: sem o teto, a
       medalha daria meia volta num salto ao voltar. */
    group.current.rotation.y = advanceSpin(Math.min(rawDelta, 0.1), autoSpin);
    group.current.position.y = autoSpin ? Math.sin(state.clock.elapsedTime * 1.1) * 0.05 : 0;
  });

  return <group ref={group}>{children}</group>;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

function warnModelFailure(error: unknown) {
  console.warn("[medalha] Não foi possível carregar o .glb; mostrando a medalha procedural.", error);
}
