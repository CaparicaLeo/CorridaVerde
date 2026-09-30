"use client";

import { Center, Text3D } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import {
  CanvasTexture,
  DoubleSide,
  Matrix4,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from "three";

import { theme } from "@/app/theme";
import { km1Glyphs } from "@/components/medal/km1Glyphs";

/* Medidas em unidades de cena, disco de raio ~1. A caixa resultante (fita
   incluída) é a MEDAL_BOUNDS de frame.ts — mexeu aqui, confira lá. */
const DISC_RADIUS = 0.94;
const DISC_THICKNESS = 0.14;
const FACE_Z = DISC_THICKNESS / 2;
/** O tubo da borda é mais grosso que o disco: ela sobra dos dois lados e vira relevo. */
const RIM_RADIUS = 0.97;
const RIM_TUBE = 0.08;
const INNER_RING_RADIUS = 0.8;
const BAIL_RADIUS = 0.1;
const BAIL_Y = RIM_RADIUS + RIM_TUBE + BAIL_RADIUS - 0.01;
const RIBBON = { width: 0.46, length: 1.5, tilt: 0.28, bow: 0.12 };
const TEXT_SIZE = 0.66;

const TOP =
  BAIL_Y + Math.cos(RIBBON.tilt) * RIBBON.length + (Math.sin(RIBBON.tilt) * RIBBON.width) / 2;
const BOTTOM = -(RIM_RADIUS + RIM_TUBE);
/** Centraliza a peça inteira na origem: é em volta dela que a medalha gira. */
const CENTER_OFFSET_Y = -(TOP + BOTTOM) / 2;

/**
 * Itálico de ~10°, aplicado como cisalhamento: o logo do KM1 é inclinado e a
 * Saira não tem itálico. x' = x + 0.18·y.
 */
const ITALIC = new Matrix4().set(1, 0.18, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

const TEXT_PROPS = {
  font: km1Glyphs,
  size: TEXT_SIZE,
  height: 0.05,
  curveSegments: 10,
  bevelEnabled: true,
  bevelThickness: 0.012,
  bevelSize: 0.008,
  bevelSegments: 3,
};

/**
 * Medalha procedural — placeholder enquanto o .glb real não chega.
 *
 * Só geometria do three, sem arquivo externo: disco, borda em relevo (torus),
 * argola, fita em V e "KM1" em relevo nas duas faces. O "premium" vem do
 * contraste de acabamento, não de detalhe: relevo polido (roughness baixo)
 * contra campo acetinado e um tom mais escuro — é o que faz o KM1 saltar do
 * disco quando o reflexo passa.
 */
export function ProceduralMedal() {
  const ribbonGeometry = useMemo(() => createRibbonGeometry(), []);
  const materials = useMemo(
    () => ({
      polished: new MeshStandardMaterial({
        color: theme.medal.polished,
        metalness: 1,
        roughness: 0.2,
      }),
      field: new MeshStandardMaterial({
        color: theme.medal.field,
        metalness: 1,
        roughness: 0.42,
      }),
      ribbon: new MeshStandardMaterial({
        map: createRibbonTexture(),
        metalness: 0,
        roughness: 0.55,
        side: DoubleSide,
      }),
    }),
    [],
  );

  /* Geometria e material criados à mão não são descartados pelo R3F. */
  useEffect(
    () => () => {
      ribbonGeometry.dispose();
      materials.ribbon.map?.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
    [ribbonGeometry, materials],
  );

  return (
    <group position-y={CENTER_OFFSET_Y}>
      {/* Disco: o cilindro nasce em pé no eixo Y; deitado, as faces olham ±Z. */}
      <mesh rotation-x={Math.PI / 2} material={materials.field}>
        <cylinderGeometry args={[DISC_RADIUS, DISC_RADIUS, DISC_THICKNESS, 96]} />
      </mesh>

      <mesh material={materials.polished}>
        <torusGeometry args={[RIM_RADIUS, RIM_TUBE, 32, 128]} />
      </mesh>

      {[FACE_Z, -FACE_Z].map((z) => (
        <mesh key={z} position-z={z} material={materials.polished}>
          <torusGeometry args={[INNER_RING_RADIUS, 0.018, 16, 128]} />
        </mesh>
      ))}

      {/* Frente e verso: o verso é o mesmo relevo girado, para a volta
          completa nunca mostrar uma face lisa. */}
      {[0, Math.PI].map((rotation) => (
        <group key={rotation} rotation-y={rotation}>
          <group position-z={FACE_Z - 0.004}>
            <group matrixAutoUpdate={false} matrix={ITALIC}>
              <Center disableZ>
                <Text3D {...TEXT_PROPS} material={materials.polished}>
                  KM1
                </Text3D>
              </Center>
            </group>
          </group>
        </group>
      ))}

      {/* Argola perpendicular ao disco: a fita passa por dentro dela. */}
      <mesh position-y={BAIL_Y} rotation-y={Math.PI / 2} material={materials.polished}>
        <torusGeometry args={[BAIL_RADIUS, 0.03, 16, 48]} />
      </mesh>

      {/* Fita em V: duas tiras saindo da argola, a esquerda por cima. */}
      {[1, -1].map((side) => (
        <mesh
          key={side}
          geometry={ribbonGeometry}
          material={materials.ribbon}
          position={[side * -0.06, BAIL_Y, side * 0.012]}
          rotation-z={side * RIBBON.tilt}
        />
      ))}
    </group>
  );
}

/**
 * Tira de fita com pivô na base (junto da argola) e um arco para trás ao
 * longo do comprimento — fita reta parece papelão.
 */
function createRibbonGeometry() {
  const geometry = new PlaneGeometry(RIBBON.width, RIBBON.length, 1, 32);
  const position = geometry.attributes.position;

  for (let index = 0; index < position.count; index++) {
    const t = position.getY(index) / RIBBON.length + 0.5;
    position.setZ(index, -RIBBON.bow * Math.sin(Math.PI * t));
  }

  geometry.translate(0, RIBBON.length / 2, 0);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Listras da fita, desenhadas em canvas (sem arquivo de imagem).
 *
 * O corpo é o accent da marca, mas a fita fica sobre a chapa amarela da seção:
 * sozinha, ela sumiria no fundo. As bordas e os filetes pretos são o que
 * desenha a silhueta — a mesma lógica dos cards pretos da seção de produtos.
 */
function createRibbonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 4;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = theme.colors.accent;
    context.fillRect(0, 0, 256, 4);
    context.fillStyle = theme.colors.inverseText;
    context.fillRect(0, 0, 30, 4);
    context.fillRect(226, 0, 30, 4);
    context.fillRect(44, 0, 8, 4);
    context.fillRect(204, 0, 8, 4);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
