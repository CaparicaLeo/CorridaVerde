import type {
  RegulamentoChapter,
  RegulamentoDocument,
  RegulamentoItem,
} from "@/data/types";
import { regulamentoExportUrl } from "@/data/event";

/**
 * Parser + fetch do regulamento oficial.
 *
 * Este módulo é a ponte entre o Google Docs e a página /regulamento. A decisão
 * de projeto (registrada em data/event.ts) é: o site NÃO possui uma cópia do
 * texto — a cada visita ele busca o documento e renderiza o que ele disser
 * naquele momento. Quem edita é a Thomé & Santos, uma vez; o site acompanha.
 *
 * As duas funções são separadas de propósito: `parseRegulamento` é pura e
 * testável; `fetchRegulamentoText` é o único lugar que toca a rede, e todo o
 * tratamento de falha (quarentena do Google, timeout, HTML no lugar de texto)
 * devolve null — nunca uma exceção na página.
 */

/** Cabeçalho de capítulo: número, espaço, então o título em caixa alta. */
const chapterHeader = /^(\d{1,2})\s+([A-ZÀ-ÖØ-Þ0-9/&' .+,-]+)$/;

/** Item numerado do documento ("5.1", "8.10", ...) seguido do texto. */
const itemNumber = /^(\d+\.\d+)[.\s]*(.*)$/;

/** Assinatura de data ao final do documento ("Curitiba, 06 de abril de 2026."). */
const issuedAtPattern = /^[\p{L}\s]+,\s+\d{1,2}\s+de\s+\p{L}+\s+de\s+\d{4}\.?$/u;

/**
 * Transforma o export em texto plano do Google Docs na árvore de capítulos.
 *
 * Estratégia de leitura linha a linha:
 *  - cabeçalho de capítulo abre um capítulo novo;
 *  - linha numerada (`N.N …`) abre um item novo;
 *  - qualquer outra linha é continuação do item corrente — é assim que os
 *    sub-itens do 1.1, as listas de kit/valor e a tabela FEMININA/MASCULINA do
 *    capítulo 10 entram no bloco certo sem perder a disposição original (os
 *    espaços múltiplos sobrevivem ao `trim`, que só corta as pontas).
 *
 * Verdade legal, não estética: os espaços internos são preservados de propósito
 * porque são informação de coluna no original — o render usa `whitespace-pre-wrap`.
 */
export function parseRegulamento(text: string): RegulamentoDocument | null {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return null;

  const title = lines[0];
  // O Google, quando bloqueia, devolve uma página de aviso em vez do texto.
  // Sem o título de regulamento no topo, o que chegou não é o documento.
  if (!/REGULAMENTO/i.test(title)) return null;

  const chapters: RegulamentoChapter[] = [];
  let currentChapter: RegulamentoChapter | null = null;
  let currentItem: RegulamentoItem | null = null;
  let issuedAt: string | null = null;

  for (const line of lines.slice(1)) {
    if (issuedAtPattern.test(line)) {
      issuedAt = line;
      continue;
    }

    const header = chapterHeader.exec(line);
    if (header) {
      currentChapter = { number: header[1], title: header[2], items: [] };
      chapters.push(currentChapter);
      currentItem = null;
      continue;
    }

    // Nenhuma linha é de capítulo antes do "1 DO EVENTO"; segurança extra.
    if (!currentChapter) continue;

    const item = itemNumber.exec(line);
    if (item) {
      currentItem = {
        number: item[1],
        lines: item[2] ? [item[2]] : [],
      };
      currentChapter.items.push(currentItem);
      continue;
    }

    // Continuação: anexa ao item corrente (criando um bloco solto se ainda
    // não havia — caso das listas de premiação do cap. 9, que vêm sem número).
    if (!currentItem) {
      currentItem = { number: "", lines: [] };
      currentChapter.items.push(currentItem);
    }
    currentItem.lines.push(line);
  }

  if (chapters.length === 0) return null;

  return { title, issuedAt, chapters };
}

/**
 * Busca o documento atual no Google Docs.
 *
 * `cache: "no-store"` e a rota `force-dynamic` garantem o comportamento
 * combinado com a Thomé & Santos: a página reflete o estado atual do
 * documento a cada visita, sem cópia intermediária que possa envelhecer.
 * O timeout existe porque um serviço externo lento não pode segurar a página.
 */
export async function fetchRegulamentoText(): Promise<string | null> {
  // Sem documento publicado, não há o que buscar (PENDÊNCIA 6 de data/event.ts).
  // Sair antes do try evita uma chamada à rede com URL nula e, mais importante,
  // faz a página cair no estado vazio de forma explícita.
  if (!regulamentoExportUrl) return null;

  try {
    const response = await fetch(regulamentoExportUrl, {
      /* User-Agent de navegador: o endpoint de exportação usa o contexto do
         documento (público), mas um fetch sem agente pode cair em filtragem. */
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Corrida-Verde-Thome-Santos/1.0)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) return null;

    const body = await response.text();
    if (!body.trim()) return null;

    // Quarentena/aviso do Google chega como HTML, nunca como o texto do doc.
    if (/<\??(xml|!DOCTYPE|html)/i.test(body)) return null;

    return body;
  } catch {
    // Timeout, rede fora, DNS — qualquer falha vira estado vazio na página.
    return null;
  }
}

/** Busca + parse em uma chamada: o que a página /regulamento consome. */
export async function getRegulamento(): Promise<RegulamentoDocument | null> {
  const text = await fetchRegulamentoText();
  if (!text) return null;
  return parseRegulamento(text);
}