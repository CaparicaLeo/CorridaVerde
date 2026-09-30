import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge precisa conhecer os tokens customizados para resolver
 * conflitos (ex.: `bg-surface` sobrescrito por `bg-accent` via prop
 * `className`). Sempre que um token novo entrar em app/globals.css,
 * registre aqui.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "surface",
        "surface-alt",
        "accent",
        "ink",
        "ink-muted",
        "light",
        "light-alt",
      ],
      font: ["display", "condensed"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
