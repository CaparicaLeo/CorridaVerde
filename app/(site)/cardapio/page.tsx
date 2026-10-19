import type { Metadata } from "next";

import { MenuExperience, MenuIncluded } from "@/components/blocks/MenuExperience";
import { CTAButton } from "@/components/ui/CTAButton";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cardapio, event, registrationCta, siteUrl } from "@/data/event";

/**
 * Página do cardápio pós-corrida: o PDF da organização em HTML, com o texto
 * inteiro de cada prato.
 *
 * Três chapas, como no /conceito: névoa (abertura e experiência 01), broto
 * (experiência 02) e névoa de novo (o que acompanha e a saída). A abertura e
 * a primeira experiência dividem a chapa, separadas por régua, como na
 * primeira página do PDF.
 */
const title = "Cardápio pós-corrida";

export const metadata: Metadata = {
  title,
  description: cardapio.page.description,
  alternates: { canonical: `${siteUrl}/cardapio` },
  // O `openGraph` da página substitui o da raiz inteiro (o Next não mescla),
  // por isso a imagem é repetida aqui — mesmo motivo do /regulamento.
  openGraph: {
    url: `${siteUrl}/cardapio`,
    title: `${title} · Corrida Verde Curitiba`,
    description: cardapio.page.description,
    ...(event.ogImage ? { images: [{ url: event.ogImage.src, width: event.ogImage.width, height: event.ogImage.height, alt: event.ogImage.alt }] } : {}),
  },
  twitter: { title: `${title} · Corrida Verde Curitiba`, description: cardapio.page.description },
};

export default function CardapioPage() {
  const [first, ...rest] = cardapio.experiences;

  return (
    <>
      <Section tone="mist" className="pt-28 sm:pt-32 lg:pt-40">
        <SectionHeader intro={cardapio.intro} as="h1">
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted">
            {cardapio.lead}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted">
            {cardapio.closing}
          </p>
        </SectionHeader>

        <MenuExperience
          experience={first}
          className="mt-14 border-t border-line pt-14 lg:mt-20 lg:pt-20"
        />
      </Section>

      {rest.map((experience) => (
        <Section key={experience.id} tone="sprout">
          <MenuExperience experience={experience} />
        </Section>
      ))}

      <Section tone="mist">
        <MenuIncluded
          label={cardapio.included.label}
          items={cardapio.included.items}
        />

        <div className="mt-12 flex flex-wrap gap-4">
          <CTAButton href={registrationCta.href} animateIn={false}>
            {registrationCta.label}
          </CTAButton>
          <CTAButton
            href={cardapio.page.backCta.href}
            variant="outline"
            animateIn={false}
          >
            {cardapio.page.backCta.label}
          </CTAButton>
        </div>
      </Section>
    </>
  );
}
