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
 * Header do site: a faixa de mata da página, sempre com chapa — o hero é
 * claro e o menu e o lockup são brancos. Ao rolar, a chapa vira vidro.
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
        "tone-dark fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-300",
        "border-b border-line",
        isScrolled && !isMenuOpen ? "bg-surface/90 backdrop-blur-md" : "bg-surface",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 leading-none"
          aria-label={event.name}
        >
          {/*
            O lockup horizontal (símbolo + palavra-marca) mora em
            `event.logo`, numa peça só: cabe na altura da barra sem estourar
            o topo. O `alt` vem vazio do dado de propósito: este link já
            declara `aria-label={event.name}`, e a imagem dentro dele é
            decorativa — o nome não precisa ser anunciado duas vezes.
          */}
          {event.logo ? (
            <Image
              src={event.logo.src}
              alt={event.logo.alt}
              width={event.logo.width}
              height={event.logo.height}
              loading="eager"
              className="h-10 w-auto lg:h-12"
            />
          ) : (
            <span className="headline text-xl text-ink sm:text-2xl">
              {event.series.name}
            </span>
          )}
        </Link>

        {/* Menu horizontal só a partir do xl: com sete itens, em 1024px os
            rótulos quebravam em duas linhas e, sem quebra, o CTA saía da
            tela (medido: 63px além da borda). Abaixo do xl vale o botão
            "Menu". Rótulo sem quebra e logo que não cede espaço. Com o
            oitavo item (Cardápio), o gap cai para 16px. Medido em 1280px:
            logo 145 + menu 818 + CTA 173 + 2×24 = 1184px numa faixa de
            1200px. Com gap-5 dava 1212px e o CTA comia a margem do
            container; o container trava em 1232px, então não há tela larga
            em que um gap maior volte a caber com folga. */}
        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-4">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  className="label-condensed text-[0.7rem] whitespace-nowrap text-ink-muted transition-colors hover:text-accent-ink"
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
            className="label-condensed min-h-11 cursor-pointer rounded-full border border-line-strong px-5 py-2.5 text-[0.7rem] xl:hidden"
          >
            {isMenuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!isMenuOpen}
        className="border-t border-line bg-surface xl:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-page py-6">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={navHref(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                  className="title-sans block py-3 text-xl text-ink"
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
