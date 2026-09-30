/**
 * Configuração do palco da medalha 3D.
 *
 * Fica dentro de `components/medal/` e NÃO em `data/event.ts` de propósito: o
 * motor 3D é infraestrutura, não conteúdo do evento. Enquanto ele dependesse do
 * dado editorial, qualquer mudança de copy da prova quebraria a build do módulo
 * que não tem nada a ver com copy — e a recíproca também.
 *
 * Estado atual: a medalha 3D NÃO é montada na landing (ver
 * `app/(site)/page.tsx`). O slot `aside` do `ImpactSlide` está pronto para
 * recebê-la. Motivo: a arte oficial do `.glb` não foi entregue, e o que existe
 * hoje é a medalha procedural com os glifos do KM1 — exibir a medalha de outra
 * etapa como se fosse desta seria pior que não exibir nenhuma.
 *
 * Para ligar quando o `.glb` chegar:
 *  1. pôr o arquivo em `public/models/` e atualizar `modelUrl`;
 *  2. `usePlaceholder: false` — o palco faz um HEAD no arquivo e cai na
 *     procedural se ele faltar, então subir o modelo depois não quebra a
 *     página;
 *  3. montar `<MedalStage />` no `aside` do `ImpactSlide`.
 */
export const medalConfig = {
  /**
   * `true` desenha a medalha procedural e nem checa o `.glb`. É o padrão
   * enquanto a arte oficial não existe.
   */
  usePlaceholder: true,

  /** Caminho do modelo. Só é lido com `usePlaceholder: false`. */
  modelUrl: "/models/medal-corrida-verde.glb",

  /** O palco é `role="img"`: o texto alternativo é obrigatório. */
  alt: "Medalha da Corrida Verde em três dimensões. Arraste para girar.",

  /** Dica de gesto. Fica `aria-hidden` — a instrução é visual. */
  hint: "Arraste para girar",
} as const;
