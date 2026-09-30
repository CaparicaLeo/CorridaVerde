"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary mínimo da medalha. Usado em dois lugares:
 *
 * - dentro do Canvas, em volta do .glb: arquivo ausente ou corrompido cai na
 *   medalha procedural;
 * - fora do Canvas, em volta da cena toda: sem WebGL (ou qualquer erro do
 *   three) a medalha some e o resto da página segue de pé. Sem ele, o R3F
 *   repassa o erro para cima e derruba a árvore React inteira.
 */
export class MedalErrorBoundary extends Component<
  { fallback: ReactNode; onError?: (error: unknown) => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
