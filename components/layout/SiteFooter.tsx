import Link from "next/link";

import { event, eventDate, mainNav } from "@/data/event";

/**
 * Âncora de seção (#trajeto, #percursos...) vira caminho absoluto
 * (/#trajeto): o índice funciona tanto na home quanto partindo de
 * /regulamento, onde uma âncora solta não teria para onde rolar.
 */
const navHref = (href: string) => (href.startsWith("/") ? href : `/${href}`);

/**
 * Rodapé no padrão do deck: nome do evento à esquerda, edição e cidade ao
 * centro, índice das seções à direita.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-surface-alt">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-3 lg:py-16">
        <div>
          <p className="headline text-2xl text-ink">{event.name}</p>
          <p className="label-condensed mt-4 text-[0.7rem] text-accent">
            {eventDate.label}
          </p>
          {/* O local não é endereço: a prova ocupa um trajeto entre dois
              parques, e é isso que a linha diz. */}
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            {event.location.full}
          </p>
          <p className="label-condensed mt-4 text-[0.65rem] text-ink-muted">
            {event.organizer.name}
          </p>
        </div>

        <p className="label-condensed self-center text-[0.7rem] text-accent lg:text-center">
          {event.series.name} · {event.series.season}
        </p>

        <nav aria-label="Índice" className="lg:justify-self-end">
          <ul className="flex flex-col gap-3 lg:text-right">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  className="text-sm text-ink/85 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          {/* Ano corrente, não o do evento: o aviso de copyright vale para a
              data de publicação. Congela no build — rebuild anual resolve. */}
          <p>
            © {new Date().getFullYear()} {event.organizer.name}. Todos os
            direitos reservados.
          </p>
          <p className="label-condensed text-[0.65rem]">
            {eventDate.short ?? event.dateLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
