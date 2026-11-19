import type { Metadata } from "next";
import { Fragment } from "react";

import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { event, siteUrl } from "@/data/event";
import { type PolicyBlock, privacyPolicy } from "@/data/privacidade";

const title = "Política de Privacidade";
const description =
  "Como a Thomé & Santos coleta, usa, guarda e protege os dados de quem visita o site da Corrida Verde ou entra na lista de espera, de acordo com a LGPD.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/politica-de-privacidade` },
  // O `openGraph` da página substitui o da raiz inteiro: a imagem é repetida.
  openGraph: {
    url: `${siteUrl}/politica-de-privacidade`,
    title: `${title} · Corrida Verde Curitiba`,
    description,
    ...(event.ogImage ? { images: [{ url: event.ogImage.src, width: event.ogImage.width, height: event.ogImage.height, alt: event.ogImage.alt }] } : {}),
  },
  twitter: { title: `${title} · Corrida Verde Curitiba`, description },
};

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/g;

/** Texto corrido com os e-mails virando link `mailto:`. */
function WithEmailLinks({ text }: { text: string }) {
  return text.split(EMAIL).map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={`mailto:${part}`}
        className="font-semibold text-accent-ink underline underline-offset-2"
      >
        {part}
      </a>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

const text = "text-base leading-relaxed text-ink-muted sm:text-[1.05rem]";

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === "h") {
      return (
        <h3 key={index} className="label-condensed pt-2 text-[0.75rem] text-ink">
          {block.text}
        </h3>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={index} className="flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 ${text}`}>
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-ink" />
              <span>
                <WithEmailLinks text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "address") {
      return (
        <address key={index} className={`flex flex-col gap-1 not-italic ${text}`}>
          {block.lines.map((line, i) => (
            <span key={i}>
              <WithEmailLinks text={line} />
            </span>
          ))}
        </address>
      );
    }
    return (
      <p key={index} className={text}>
        <WithEmailLinks text={block.text} />
      </p>
    );
  });
}

/**
 * Política de privacidade. O texto vive em data/privacidade.ts; aqui só a
 * diagramação, no mesmo desenho do /regulamento.
 */
export default function PoliticaDePrivacidadePage() {
  return (
    <Section tone="mist" className="pt-28 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <SectionHeader intro={privacyPolicy.intro} as="h1" />

        <p className="label-condensed mt-5 text-[0.65rem] text-ink-muted">
          Última atualização: {privacyPolicy.lastUpdated}
        </p>

        <p className={`mt-10 ${text}`}>{privacyPolicy.lead}</p>

        <div className="mt-14 flex flex-col gap-14">
          {privacyPolicy.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="title-sans flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl sm:text-3xl">
                <span className="text-accent-ink">{index + 1}</span>
                <span>{section.title}</span>
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                <Blocks blocks={section.blocks} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
