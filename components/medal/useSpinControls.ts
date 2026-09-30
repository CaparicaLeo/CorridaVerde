"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Estado do giro, numa ref: o gesto dispara a 60+ eventos por segundo e nada
 * disso precisa re-renderizar React.
 */
type SpinState = {
  /** Ângulo em Y, em radianos, acumulado (não é normalizado). */
  angle: number;
  /** Velocidade angular em rad/s — é ela que dá a inércia ao soltar. */
  velocity: number;
  /** Sentido do giro ocioso: segue o último arremesso. */
  direction: 1 | -1;
  dragging: boolean;
  lastX: number;
  lastTime: number;
};

/** Meia volta a cada ~300px de arrasto: rápido o bastante sem ficar nervoso. */
const RADIANS_PER_PX = Math.PI / 300;
/** Soltou parado depois de segurar? Sem inércia. */
const RELEASE_STILL_MS = 80;
const KEY_IMPULSE = 4;
/** Giro ocioso: uma volta a cada ~18s, presença sem virar distração ao lado da frase. */
const IDLE_SPEED = 0.35;
/** Quão rápido a inércia do arremesso volta ao giro ocioso (maior = freia antes). */
const SPIN_DAMPING = 2.2;
const MAX_SPEED = 14;

/*
 * clamp e damp locais, de propósito: este hook é importado estaticamente pela
 * MedalStage, que está no bundle inicial. Um `import { MathUtils } from
 * "three"` aqui puxava o three inteiro (~100 KB gz) para a primeira carga da
 * página, anulando o chunk preguiçoso da cena.
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Aproximação exponencial independente de fps (mesma fórmula do MathUtils.damp). */
function damp(from: number, to: number, lambda: number, deltaSeconds: number) {
  return from + (to - from) * (1 - Math.exp(-lambda * deltaSeconds));
}

/**
 * Giro da medalha só no eixo Y, por arrasto horizontal ou setas do teclado.
 *
 * Os handlers vão no wrapper DOM, não em eventos do R3F: assim o gesto vale na
 * caixa inteira (não só sobre a peça) e o `touch-action: pan-y` do wrapper
 * deixa o navegador cuidar do scroll vertical no celular — só o arrasto
 * horizontal chega aqui (o vertical vira `pointercancel`).
 *
 * A física também mora aqui: a cena só chama `advance` a cada quadro e aplica
 * o ângulo devolvido. Gesto e inércia ficam no mesmo arquivo, e o estado nunca
 * é mexido de fora do hook.
 */
export function useSpinControls() {
  const spin = useRef<SpinState>({
    /* Começa em 3/4: de frente, a medalha parece um disco chapado — e com
       reduced motion ela não gira sozinha para mostrar a espessura. */
    angle: -0.4,
    velocity: 0,
    direction: 1,
    dragging: false,
    lastX: 0,
    lastTime: 0,
  });

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const state = spin.current;
    state.dragging = true;
    state.velocity = 0;
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const state = spin.current;
    if (!state.dragging) return;

    const deltaAngle = (event.clientX - state.lastX) * RADIANS_PER_PX;
    const deltaSeconds = Math.max(event.timeStamp - state.lastTime, 1) / 1000;

    state.angle += deltaAngle;
    state.velocity = deltaAngle / deltaSeconds;
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
  }

  function onPointerEnd(event: PointerEvent<HTMLElement>) {
    const state = spin.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (event.timeStamp - state.lastTime > RELEASE_STILL_MS) state.velocity = 0;
    if (state.velocity !== 0) state.direction = state.velocity > 0 ? 1 : -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const sign = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!sign) return;
    event.preventDefault();
    spin.current.velocity += sign * KEY_IMPULSE;
    spin.current.direction = sign;
  }

  /** Avança um quadro (inércia + giro ocioso) e devolve o ângulo em Y. */
  function advance(deltaSeconds: number, autoSpin: boolean) {
    const state = spin.current;

    if (!state.dragging) {
      const idle = autoSpin ? IDLE_SPEED * state.direction : 0;
      const velocity = clamp(state.velocity, -MAX_SPEED, MAX_SPEED);
      state.velocity = damp(velocity, idle, SPIN_DAMPING, deltaSeconds);
      state.angle += state.velocity * deltaSeconds;
    }

    return state.angle;
  }

  return {
    advance,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onKeyDown,
    },
  };
}
