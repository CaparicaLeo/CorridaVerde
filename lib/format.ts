const LOCALE = "pt-BR";
/** O evento é no Paraná; a data não pode variar com o fuso de quem acessa. */
const TIME_ZONE = "America/Sao_Paulo";

/** Formata números no padrão brasileiro (10.000, 43,5). */
export function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Data por extenso.
 *
 * Só entra em cena quando `event.date` deixar de ser null — hoje a data
 * oficial ainda está em conferência com a Thomé & Santos e a LP não exibe
 * nenhuma (ver data/event.ts).
 */
export function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** Data curta (01/11/2026) — eyebrow do hero, rodapé e faixas. */
export function formatEventDateShort(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}
