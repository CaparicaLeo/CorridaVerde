"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Vector3, type Object3D } from "three";

import { MEDAL_BOUNDS } from "@/components/medal/frame";

/**
 * Decoders do .glb. Meshopt vem empacotado no bundle (three-stdlib), então
 * não depende de rede. O Draco do drei baixaria o decoder da gstatic.com em
 * runtime: fica desligado, e a especificação pede Meshopt (docs/medalha-3d.md).
 */
const USE_DRACO = false;
const USE_MESHOPT = true;

/** Começa o download do .glb antes de a cena montar (chamado pela MedalStage). */
export function preloadMedalModel(url: string) {
  useGLTF.preload(url, USE_DRACO, USE_MESHOPT);
}

/**
 * Medalha real, carregada do .glb.
 *
 * Suspende enquanto baixa (o Suspense da cena segura o spinner) e lança se o
 * arquivo não existir — quem decide o que fazer é o MedalErrorBoundary em
 * volta, que cai na medalha procedural.
 */
export function GltfMedal({ url }: { url: string }) {
  const { scene } = useGLTF(url, USE_DRACO, USE_MESHOPT);

  /* Clone para não mutar o objeto em cache do useGLTF (ele é compartilhado
     entre montagens, e o Strict Mode monta duas vezes em dev). */
  const model = useMemo(() => fitToBounds(scene.clone(true)), [scene]);

  return <primitive object={model} />;
}

/**
 * Escala e centraliza o modelo na caixa da medalha procedural.
 *
 * É a rede de segurança para um arquivo exportado em outra unidade (mm em vez
 * de metro) ou com a origem fora do centro: sem isso, a peça entraria gigante
 * ou girando em volta de um ponto fora dela. Um arquivo dentro da
 * especificação quase não é mexido aqui.
 */
function fitToBounds(object: Object3D) {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());

  const scale = Math.min(MEDAL_BOUNDS.width / size.x, MEDAL_BOUNDS.height / size.y);

  object.scale.setScalar(scale);
  object.position.copy(center).multiplyScalar(-scale);

  return object;
}
