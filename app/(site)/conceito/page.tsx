import type { Metadata } from "next";

import { PillarList } from "@/components/blocks/PillarList";
import { CTAButton } from "@/components/ui/CTAButton";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { conceito, event, registrationCta, siteUrl } from "@/data/event";

/**
 * Página do conceito da marca: o vídeo do designer na íntegra e, em texto, o
 * que ele diz na tela. O texto não é legenda nem resumo — é o mesmo conteúdo,
 * para quem não assiste, para leitor de tela e para buscador.
 *
 * O vídeo entra como animação contínua, sem player e sem caixa: o fundo
 * dele foi encodado na névoa, então a peça parece desenhada na página.
 *
 * Três chapas: névoa (título e vídeo), broto (a explicação) e névoa de novo (o princípio e
 * a saída). O vídeo fica em cima porque é a peça; o texto vem depois para
 * quem quer ler devagar.
 */
const title = "O conceito da marca";

export const metadata: Metadata = {
  title,
  description: conceito.page.description,
  alternates: { canonical: `${siteUrl}/conceito` },
  // O `openGraph` da página substitui o da raiz inteiro (o Next não mescla),
  // por isso a imagem é repetida aqui — mesmo motivo do /regulamento.
  openGraph: {
    url: `${siteUrl}/conceito`,
    title: `${title} · Corrida Verde Curitiba`,
    description: conceito.page.description,
    ...(event.ogImage ? { images: [{ url: event.ogImage.src, width: event.ogImage.width, height: event.ogImage.height, alt: event.ogImage.alt }] } : {}),
  },
  twitter: { title: `${title} · Corrida Verde Curitiba`, description: conceito.page.description },
};

export default function ConceitoPage() {
  return (
    <>
      <Section tone="mist" className="pt-28 sm:pt-32 lg:pt-40">
        <SectionHeader
          intro={{ ...conceito.intro, eyebrow: conceito.page.eyebrow }}
          as="h1"
        />

        {/* Sem legenda de crédito: ele fica no fecho da página, sob o
            princípio, e o próprio vídeo já termina assinado.

            Dois arquivos, um por tela: no celular o recorte quadrado só do
            símbolo (o painel 16:9 ficava ilegível em 390px — ver
            `conceito.filmMobile`), a partir do `sm` o vídeo inteiro. O que
            está escondido com `hidden` nunca entra no viewport, então o
            LoopVideo dele não chega a baixar o arquivo. */}
        <LoopVideo
          video={conceito.filmMobile}
          className="mx-auto mt-6 max-w-md sm:hidden"
        />
        <LoopVideo
          video={conceito.film}
          className="mt-10 hidden sm:block lg:mt-12"
        />
      </Section>

      <Section tone="sprout">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="flex flex-col gap-12">
            <div>
              {/* Satoshi (`title-sans`), não a Ranima: "círculo" tem acento,
                  e o arquivo da Ranima não (ver o topo de `conceito`). */}
              <h2 className="title-sans text-2xl sm:text-3xl">
                {conceito.shape.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {conceito.shape.text}
              </p>
            </div>

            <div className="border-t border-line pt-12">
              <h2 className="title-sans text-2xl sm:text-3xl">
                {conceito.form.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {conceito.form.lead}
              </p>
            </div>
          </div>

          <PillarList pillars={conceito.form.traits} className="lg:pt-3" />
        </div>
      </Section>

      <Section tone="mist">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-10">
          <blockquote className="title-sans text-2xl leading-snug sm:text-3xl lg:text-4xl">
            {conceito.principle}
          </blockquote>

          <p className="label-condensed text-[0.7rem] text-accent-ink">
            {conceito.credit}
          </p>

          <div className="flex flex-wrap gap-4">
            <CTAButton href={registrationCta.href} animateIn={false}>
              {registrationCta.label}
            </CTAButton>
            <CTAButton
              href={conceito.page.backCta.href}
              variant="outline"
              animateIn={false}
            >
              {conceito.page.backCta.label}
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
