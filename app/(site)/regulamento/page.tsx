import type { Metadata } from "next";
import Link from "next/link";

import { CTAButton } from "@/components/ui/CTAButton";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RegulamentoDocument, RegulamentoItem } from "@/data/types";
import {
  regulamentoPage,
  regulamentoSource,
  registrationCta,
  siteUrl,
} from "@/data/event";
import { getRegulamento } from "@/lib/regulamento";

/**
 * Página do regulamento oficial. É uma página, e não mais uma seção da LP,
 * porque o texto legal é longo demais para dividir espaço com o cartaz.
 *
 * Fonte viva: o conteúdo vem do Google Docs a cada visita (ver
 * `regulamentoSource` em data/event.ts). Sem `"use client"`, sem GSAP — é
 * documento, e o leitor precisa de Ctrl+F, não de animação.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regulamento",
  description:
    "Regulamento oficial da 41ª Corrida Verde, na íntegra e direto do Google Docs — o documento que vale no dia da prova.",
  alternates: { canonical: `${siteUrl}/regulamento` },
};

export default async function RegulamentoPage() {
  const regulamento = await getRegulamento();

  const intro = regulamento ? regulamentoPage.intro : regulamentoPage.emptyState;

  return (
    <Section tone="darker" className="pt-28 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <h1 className="sr-only">{intro.title}</h1>

        <SectionHeader intro={intro} />

        {/*
          A fonte é parte da honestidade da página: o texto não é uma cópia
          nossa, e quem atualiza é a Thomé & Santos. Dizer isso aqui evita que
          o leitor trate o site como o autor do documento.
        */}
        <p className="label-condensed mt-5 text-[0.65rem] leading-relaxed text-ink-muted">
          {regulamentoPage.sourceNote}
        </p>

        {regulamento ? (
          <RegulamentoDocumento document={regulamento} />
        ) : (
          <RegulamentoIndisponivel />
        )}
      </div>
    </Section>
  );
}

/**
 * Render do documento. Cada capítulo é uma <section> com âncora própria, os
 * itens numerados abrem o parágrafo e as linhas de continuação (sub-itens do
 * 1.1, listas de kit e valor, tabela de categorias do cap. 10) vêm indentadas.
 *
 * As linhas da tabela FEMININA/MASCULINA chegam com vários espaços internos
 * — por isso `whitespace-pre-wrap`: preservar a coluna como está no original.
 */
function RegulamentoDocumento({ document }: { document: RegulamentoDocument }) {
  return (
    <div className="mt-14 flex flex-col gap-14">
      {document.chapters.map((chapter) => (
        <section
          key={chapter.number}
          id={`capitulo-${chapter.number}`}
          className="scroll-mt-24"
        >
          <h2 className="headline flex flex-wrap items-baseline gap-x-4 gap-y-1 text-3xl sm:text-4xl">
            <span className="text-accent">{chapter.number}</span>
            <span>{chapter.title}</span>
          </h2>

          <div className="mt-8 flex flex-col gap-7">
            {chapter.items.map((item, index) => (
              <RegulamentoItemView
                key={`${chapter.number}-${index}`}
                item={item}
              />
            ))}
          </div>
        </section>
      ))}

      {document.issuedAt ? (
        <p className="text-base leading-relaxed text-ink-muted">
          {document.issuedAt}
        </p>
      ) : null}
    </div>
  );
}

function RegulamentoItemView({ item }: { item: RegulamentoItem }) {
  const [lead, ...continuacao] = item.lines;

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-base leading-relaxed text-ink-muted sm:text-[1.05rem]">
        {item.number ? (
          <span className="label-condensed mr-3 text-[0.7rem] text-accent">
            {item.number}
          </span>
        ) : null}
        {lead}
      </p>

      {continuacao.map((line, index) => (
        <p
          key={index}
          className="whitespace-pre-wrap pl-5 text-base leading-relaxed text-ink-muted sm:pl-8 sm:text-[1.05rem]"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

/**
 * Estado vazio honesto (regra 1): o documento não foi publicado, ou o fetch
 * falhou. Nenhum texto é inventado. A fonte que existe passa a ser a página
 * oficial da prova, e o link para o Google Docs só aparece quando há documento
 * — apontar para `null` seria um link morto no lugar do estado vazio.
 */
function RegulamentoIndisponivel() {
  return (
    <div className="mt-12 flex flex-col items-start gap-6">
      <CTAButton href={registrationCta.href} animateIn={false}>
        {registrationCta.label}
      </CTAButton>

      {regulamentoSource.viewUrl ? (
        <Link
          href={regulamentoSource.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label-condensed text-[0.7rem] text-ink-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
        >
          Abrir o documento no Google Docs
        </Link>
      ) : null}
    </div>
  );
}