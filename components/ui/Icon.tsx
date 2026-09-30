import type { ReactElement, SVGProps } from "react";

/**
 * Set de ícones inline (traço, 1.5px, grade 24×24).
 *
 * Inline em vez de sprite ou biblioteca: são poucos, entram no HTML sem
 * request extra e o `currentColor` deixa o verde vir da classe. As chaves
 * batem com o campo `icon` de data/event.ts.
 *
 * O mesmo traço e o mesmo peso em todos: é a grade que faz o conjunto ler
 * como uma família, e não o desenho de cada um.
 */
const paths: Record<string, ReactElement> = {
  /** Alfinete de mapa — cards de prova, arena de chegada e KPIs de local. */
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v4M16 3.5v4" />
      <path d="M7.5 13.5h3v3h-3z" />
    </>
  ),
  run: (
    <>
      <circle cx="16" cy="5" r="2" />
      <path d="M5 20.5 8.5 15l3-2.2L10 8.5 6 10.8" />
      <path d="m11.5 12.8 3.2 2.2 1.3 5.5" />
      <path d="m10 8.5 4.2-1.1L17.6 11H21" />
    </>
  ),

  /* ------------------------------------------------------------------------
   * Território da marca: largada, cidade e chegada. Os três rótulos do
   * percurso — Parque Tanguá, Curitiba e Parque Barigui — compartilham a
   * mesma silhueta de parque; muda o que está dentro dela.
   * ------------------------------------------------------------------------ */

  /** Parque: copas de árvore sobre o tronco, o marco da largada e da chegada. */
  tree: (
    <>
      <path d="M12 21v-6.5" />
      <path d="M12 14.5 9.8 12M12 14.5 14.2 12" />
      <path d="M12 4.5 7.5 9.5h9L12 4.5Z" />
      <path d="M12 8 6.8 13.5h10.4L12 8Z" />
      <path d="M3 20.5h18" />
    </>
  ),
  /** Trajeto: linha que liga dois pontos, com um marcador no meio. */
  route: (
    <>
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="5.5" r="2.5" />
      <path d="M8 18.5h3.5a3 3 0 0 0 3-3v-7a3 3 0 0 1 3-3" />
    </>
  ),
  /** A cidade que o percurso atravessa: skyline baixa e retangular. */
  city: (
    <>
      <path d="M2.5 20.5h19" />
      <path d="M4.5 20.5v-7h4v7" />
      <path d="M10 20.5V6h4.5v14.5" />
      <path d="M16.5 20.5v-4.5h3v4.5" />
      <path d="M12 9.5h1M12 13h1M18 18h1" />
    </>
  ),

  /* ------------------------------------------------------------------------
   * Prova: largada, chegada, cronometragem e chegada compartida.
   * ------------------------------------------------------------------------ */

  /** Bandeira de largada. */
  flag: (
    <>
      <path d="M6 21V3.5" />
      <path d="M6 4.5h11l-2.2 4L17 12.5H6" />
      <path d="M4 21h4" />
    </>
  ),
  /** Chegada / chegada: alvo ou portal. */
  finish: (
    <>
      <path d="M4 21V4.5M20 21V4.5" />
      <path d="M4 6.5h16" />
      <path d="M7 6.5v3.5h2V6.5M11 6.5v3.5h2V6.5M15 6.5v3.5h2V6.5" />
      <path d="M4 21 9.5 12M20 21 14.5 12" />
    </>
  ),
  /** Medalha de chegada. */
  medal: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="m8.5 10.5-3-7h4l2.2 5M15.5 10.5l3-7h-4l-1.1 2.5" />
      <path d="m12 13 .8 1.7 1.8.2-1.4 1.3.4 1.8-1.6-.9-1.6.9.4-1.8-1.4-1.3 1.8-.2Z" />
    </>
  ),
  /** Cronometragem: relógio de corda. */
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4l2.5 2" />
      <path d="M9.5 2.5h5" />
    </>
  ),
  /** Largada às 06h00. */
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  /** Pódio de 1º, 2º e 3º lugar. */
  podium: (
    <>
      <path d="M3 21h18" />
      <path d="M4.5 21v-6.5h4V21" />
      <path d="M10 21V9.5h4V21" />
      <path d="M15.5 21v-4.5h4V21" />
    </>
  ),

  /* ------------------------------------------------------------------------
   * Ativações e propósito.
   * ------------------------------------------------------------------------ */

  /** Uma árvore por atleta: muda do com o pé para a muda com a terra. */
  seedling: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15c0-3.3-2.5-6-6-6 0 3.3 2.5 6 6 6Z" />
      <path d="M12 15c0-3.9 2.9-7 7-7 0 3.9-2.9 7-7 7Z" />
      <path d="M7.5 21h9" />
    </>
  ),
  /** KM do Parque: trecho assinado por uma marca. */
  pen: (
    <>
      <path d="m4 20 .8-3.4L15 6.4l2.6 2.6L7.4 19.2 4 20Z" />
      <path d="m13.2 8.2 2.6 2.6" />
      <path d="M15.6 5.8 18 3.4l2.6 2.6-2.4 2.4" />
    </>
  ),
  /** Ponto de hidratação: copo reutilizável. */
  cup: (
    <>
      <path d="M6.5 6.5h11l-1 13.5h-9l-1-13.5Z" />
      <path d="M6.5 6.5 12 3l5.5 3.5" />
      <path d="M7.8 11.5h8.4" />
    </>
  ),
  /** Mirante da Foto: moldura da marca. */
  camera: (
    <>
      <path d="M3.5 7.5h4l1.5-2.5h6l1.5 2.5h4v12h-17v-12Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  /** Espaço Recuperação: alongamento e bem-estar na chegada. */
  recovery: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.5v6" />
      <path d="m12 9.5-4.5-2M12 9.5l4.5-2" />
      <path d="m6.5 20 3.5-6.5M17.5 20 14 13.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  /** Água / hidratação em percurso. */
  water: (
    <>
      <path d="M12 3s5.5 6 5.5 9.7A5.5 5.5 0 0 1 12 18.2a5.5 5.5 0 0 1-5.5-5.5C6.5 9 12 3 12 3Z" />
      <path d="M9.3 13.2a2.7 2.7 0 0 0 2.7 2.7" />
    </>
  ),

  /* ------------------------------------------------------------------------
   * Estrutura e segurança.
   * ------------------------------------------------------------------------ */

  bib: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <path d="M8 9.5h8M8 13h5" />
      <path d="M4 8 2.5 6.5M20 8l1.5-1.5M4 16l-1.5 1.5M20 16l1.5 1.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v6c0 4.3-3 7.6-7 9.5-4-1.9-7-5.2-7-9.5v-6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  medical: (
    <>
      <rect x="3" y="6.5" width="18" height="13" rx="1.5" />
      <path d="M9 6.5V4.5h6v2" />
      <path d="M12 10v6M9 13h6" />
    </>
  ),
  structure: (
    <>
      <path d="M3 20.5h18" />
      <path d="M5 20.5V9l7-4.5L19 9v11.5" />
      <path d="M9.5 20.5v-5h5v5" />
    </>
  ),
  /**
   * Folha: o sustentável é o discurso do evento, e a folha é o único símbolo que
   * não virou clichê de "corrida ecologically correct" — ela está aqui para
   * marcar propósito, não para ilustrar o percurso.
   */
  leaf: (
    <>
      <path d="M20 4c0 9-5.5 14-11 14a5 5 0 0 1 0-10C14.5 8 20 8 20 4Z" />
      <path d="M4.5 20.5 12 13" />
      <path d="M13 12.5c0-2.5 1.5-4.5 4-5.5" />
    </>
  ),
};

export function Icon({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) {
  const path = paths[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {path}
    </svg>
  );
}