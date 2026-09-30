/**
 * Enquadramento compartilhado da medalha: a procedural é desenhada nesta
 * caixa e o .glb real é escalado para caber nela. É isso que deixa trocar um
 * pelo outro sem reajustar câmera, sombra ou layout.
 *
 * Unidades de cena, com o disco de raio ~1. A caixa é a da medalha procedural
 * inteira — disco, borda, argola e fita — centrada na origem.
 */
export const MEDAL_BOUNDS = { width: 2.1, height: 3.75 } as const;

/** Câmera: fov fechado achata pouco a perspectiva e deixa a peça "de catálogo". */
export const MEDAL_CAMERA = { position: [0, 0, 8.6] as [number, number, number], fov: 30 };
