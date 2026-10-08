"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CTAButton } from "@/components/ui/CTAButton";
import { event, mainNav, registrationCta } from "@/data/event";
import { cn } from "@/lib/cn";

/**
 * Âncora de seção (#trajeto, #percursos...) vira caminho absoluto
 * (/#trajeto): na home o navegador rola na mesma página, e fora dela o link
 * leva de volta à seção da landing. O "Regulamento" já entra com caminho
 * próprio (/regulamento) e passa intacto.
 */
const navHref = (href: string) => (href.startsWith("/") ? href : `/${href}`);

/**
 * Header do site. Fica transparente sobre o hero e ganha chapa ao sair dele.
 */
export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled || isMenuOpen
          ? "border-b border-white/10 bg-surface/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="flex items-center gap-3 leading-none"
          aria-label={event.name}
        >
          {/*
            A arte oficial da marca (badge circular) mora em `event.logo`.
            O `alt` vem vazio do dado de propósito: este link já declara
            `aria-label={event.name}`, e a imagem dentro dele é decorativa —
            o nome não precisa ser anunciado duas vezes.
          */}
          {event.logo ? (
            <Image
              src={event.logo.src}
              alt={event.logo.alt}
              width={event.logo.width}
              height={event.logo.height}
              sizes="88px"
              loading="eager"
              className="h-auto w-[72px] sm:w-[88px]"
            />
          ) : (
            <span className="headline text-xl text-ink sm:text-2xl">
              {event.series.name}
            </span>
          )}

          <span className="label-condensed hidden text-[0.6rem] text-ink-muted sm:block">
            {event.series.season} · {event.location.city}
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  className="label-condensed text-[0.7rem] text-ink-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <CTAButton
            href={registrationCta.href}
            size="md"
            animateIn={false}
            className="hidden sm:inline-flex"
          >
            Inscrição
          </CTAButton>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            className="label-condensed cursor-pointer border border-white/20 px-4 py-2.5 text-[0.7rem] lg:hidden"
          >
            {isMenuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!isMenuOpen}
        className="border-t border-white/10 bg-surface lg:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-page py-6">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                  className="headline block py-3 text-2xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <CTAButton
            href={registrationCta.href}
            className="mt-5 w-full sm:hidden"
            animateIn={false}
          >
            {registrationCta.label}
          </CTAButton>
        </nav>
      </div>
    </header>
  );
}
