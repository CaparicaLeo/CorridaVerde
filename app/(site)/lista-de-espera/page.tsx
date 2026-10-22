import type { Metadata } from "next";

import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { CTAButton } from "@/components/ui/CTAButton";
import { Section } from "@/components/ui/Section";
import { event, siteUrl, waitlist } from "@/data/event";

/**
 * Página da lista de espera: a mesma seção da home com `h1`, para virar o
 * destino de anúncio e de link em bio sem a pessoa cair no meio da LP.
 *
 * Fecha numa chapa de broto com a volta para a home — névoa e broto
 * alternados, como no /cardapio. Sem o CTA de inscrição: enquanto a venda não
 * abre, ele aponta para cá mesmo (ver `registrationCta`).
 */
const title = "Lista de espera";

export const metadata: Metadata = {
  title,
  description: waitlist.page.description,
  alternates: { canonical: `${siteUrl}/lista-de-espera` },
  // O `openGraph` da página substitui o da raiz inteiro (o Next não mescla),
  // por isso a imagem é repetida aqui — mesmo motivo do /regulamento.
  openGraph: {
    url: `${siteUrl}/lista-de-espera`,
    title: `${title} · Corrida Verde Curitiba`,
    description: waitlist.page.description,
    ...(event.ogImage ? { images: [{ url: event.ogImage.src, width: event.ogImage.width, height: event.ogImage.height, alt: event.ogImage.alt }] } : {}),
  },
  twitter: { title: `${title} · Corrida Verde Curitiba`, description: waitlist.page.description },
};

export default function ListaDeEsperaPage() {
  return (
    <>
      <WaitlistSection as="h1" className="pt-28 sm:pt-32 lg:pt-40" />

      <Section tone="sprout" className="py-14 sm:py-16 lg:py-20">
        <CTAButton
          href={waitlist.page.backCta.href}
          variant="outline"
          animateIn={false}
        >
          {waitlist.page.backCta.label}
        </CTAButton>
      </Section>
    </>
  );
}
