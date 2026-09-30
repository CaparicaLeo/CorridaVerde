import type { FontData } from "@react-three/drei";

/**
 * Glifos "K", "M" e "1" da Saira Condensed 800 no formato typeface do three.js,
 * para o Text3D da medalha procedural.
 *
 * Só os três glifos, embutidos no bundle: o Text3D precisa da fonte como
 * contornos (não como TTF), e um typeface.json completo seria um arquivo a
 * mais para baixar só para escrever "KM1". Mesma família das headlines, então
 * o relevo conversa com o cartaz.
 *
 * Gerado do SairaCondensed-ExtraBold.ttf (google/fonts, licença OFL) com
 * opentype.js: unidades cruas do arquivo (resolution = unitsPerEm = 1000),
 * comandos m/l/q/b com o ponto final antes dos de controle, como o
 * FontLoader lê. Para outro texto, gere os glifos que faltarem do mesmo jeito.
 */
export const km1Glyphs = {
  "glyphs": {
    "1": {
      "ha": 319,
      "x_min": 12,
      "x_max": 272,
      "o": "m 272 0 l 112 0 l 112 513 l 12 473 l 12 614 l 154 688 l 272 688 l 272 0"
    },
    "K": {
      "ha": 500,
      "x_min": 46,
      "x_max": 496,
      "o": "m 496 0 l 325 0 l 230 279 l 206 279 l 206 0 l 46 0 l 46 688 l 206 688 l 206 419 l 230 419 l 328 688 l 494 688 l 356 359 l 496 0"
    },
    "M": {
      "ha": 714,
      "x_min": 45,
      "x_max": 668,
      "o": "m 668 0 l 515 0 l 515 487 l 507 487 l 426 0 l 284 0 l 204 487 l 196 487 l 196 0 l 45 0 l 45 688 l 285 688 l 355 242 l 363 242 l 433 688 l 668 688 l 668 0"
    }
  },
  "familyName": "Saira Condensed ExtraBold",
  "resolution": 1000,
  "boundingBox": {
    "yMin": -410,
    "xMin": -474,
    "yMax": 1116,
    "xMax": 914
  },
  "underlineThickness": 50,
  "ascender": 1135,
  "descender": -439
} as unknown as FontData;
