# 41ª Corrida Verde — Desafio 10 Milhas

Landing page da 41ª edição da **Corrida Verde**, organizada pela
**Thomé & Santos — Eventos Esportivos**.

O percurso é o conceito do evento: largada no **Parque Tanguá**, chegada no
**Parque Barigui**, e a cidade de Curitiba no meio — *"de parque a parque"*.

Projeto próprio e independente: Next.js 16 (App Router), React 19, TypeScript,
Tailwind CSS v4 e GSAP. Não compartilha código nem deploy com nenhuma outra
etapa.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

## Verificar antes de entregar

```bash
npx tsc --noEmit && npm run lint && npm run build
```

## Estrutura

```
app/
  theme.ts          # ÚNICA fonte dos hexes de marca + métricas de cartaz
  fonts.ts          # Bodoni Moda (display), Archivo, Archivo Narrow
  globals.css       # tokens do Tailwind apontando para o tema; utilities
  icon.png          # ícone: a arte oficial da marca (exceção: arquivo
                    #   estático, não lê custom property)
  (site)/page.tsx   # a home é a composição das seções, nesta ordem:
                    #   hero → trajeto → percursos → ativações → conceito →
                    #   propósito → história → FAQ → inscrição
data/event.ts       # TODO o conteúdo: copy, números, links, fotos, FAQ
components/
  blocks/           # os padrões do deck: big-number, icon-grid, card-list,
                    #   impact, rota (RouteDiagram) e pilares (PillarList)
  sections/         # as seções da home, só compondo blocos
  medal/            # motor 3D da medalha, aguardando o .glb oficial
  ui/               # primitivas (Section, Headline, CTAButton, Accordion…)
lib/                # gsap, presets de animação, formatação
public/images/      # fotosDerivadas de web (originais em midias-originais/)
docs/medalha-3d.md  # como ligar a medalha 3D quando a arte chegar
```

## Seções

| # | Seção | Papel |
| --- | --- | --- |
| 1 | Hero | A frase de conceito, data/período, horário e os CTAs |
| 2 | O trajeto | Esquema Parque Tanguá → Curitiba → Parque Barigui |
| 3 | Os percursos | 16 km, 10,8 km e 5,8 km com largada e chegada |
| 4 | Ativações | O que o atleta encontra na chegada |
| 5 | Conceito | Chapa verde: "Verde não é a cor. É o discurso." |
| 6 | Propósito | Chapa clara: os eixos do posicionamento |
| 7 | História | 41ª edição e 2.000 vagas |
| 8 | FAQ | As dez dúvidas que antecedem a inscrição |
| 9 | Inscrição | CTA final e link para a página oficial |

A seção 6 é a **única** chapa clara da página. A identidade é "verde escuro com
luz": uma chapa clara quebra a sequência e dá ao verde o maior contraste do
site. Uma segunda transformaria o destaque em fundo.

## Pendências de conteúdo

Estão documentadas no topo de `data/event.ts`. Resumo:

| # | Pendência | Estado na LP |
| --- | --- | --- |
| 1 | **Data** | Só fevereiro de 2027. `event.date` é `null`; a LP diz "data a definir" e o JSON-LD omite `startDate`. |
| 2 | **Link de inscrição** | Aponta para a ficha pública do evento no site da Thomé & Santos. Não é checkout. |
| 3 | **Hexes da marca** | Sincronizados com o logo oficial (`#0F2D26` / `#91C43E`); conta de contraste comentada em `app/theme.ts`. |
| 4 | **Mapa do percurso** | `races.route` é `null`: sem botão de mapa. Um mapa que não é o percurso é pior que nenhum. |
| 5 | **Logo e imagem social** | Resolvida: `event.logo` (badge) no header, `event.wordmark` no rodapé e `event.ogImage` (1200×630) para compartilhamento. |
| 6 | **Regulamento** | `regulamentoSource.docId` é `null`; `/regulamento` entra em estado vazio. |
| 7 | **Preço** | Nenhum valor publicado. Sem bloco `offers` no JSON-LD. |
| 8 | **`alt` das fotos** | Não conferidos: as imagens não puderam ser inspecionadas na integração. As fotos são de 08/02/2026. |

Regra que atravessa todas elas: **nada de placeholder com cara de real**.
Número, data ou foto que a organização não confirmou não entra na página.

## Fotografia

Os originais ficam em `midias-originais/` — fora do git e fora de `public/`,
porque `public/` é servido publicamente e sobe inteiro no deploy. Em
`public/images/` vão só os derivados de web.

| Uso | Arquivo | Origem | Derivado |
| --- | --- | --- | --- |
| Hero | `public/images/hero-corrida-verde.jpg` | `DSC09167.jpg` (4672×7008) | 2200×3300, q72, 388 KB |
| História | `public/images/corrida-verde-pelotao.jpg` | `DSC08905.jpg` (3981×5711) | 1200×1722, q78, 492 KB |
| Badge (header) | `public/images/corrida-verde-logo.png` | `corrida-verde-logo-1920x1080.png` | 1080×1035, corte do canvas, 101 KB |
| Palavra-marca (rodapé) | `public/images/corrida-verde-escrita.png` | `corrida-verde-escrita-1920x1080.png` | 1920×233, corte do canvas, 33 KB |
| Imagem social | `public/images/corrida-verde-og.png` | composta da palavra-marca | 1200×630 sobre `theme.colors.background`, 42 KB |

O favicon (`app/icon.png`) é o badge reduzido a 512 px — mesma regra: o
arquivo estático não lê custom property, e por isso a arte oficial entrou no
lugar do SVG provisório. A ogImage foi composta com o hex do tema no momento
da composição: trocou a paleta em `app/theme.ts`, recompor o PNG.

A escolha do hero é técnica: a camada é 116% da tela e o `cover` corta a
largura, então só uma faixa central da foto aparece. `DSC09167` tem a ação na
faixa 30–65% da altura, que é a que fica visível, e o rodapé escuro da foto é
justamente onde a headline branca senta. As outras duas fotos
(`DSC08870.jpg`, `MAN_3868.jpg`) continuam só em `midias-originais/`.


## Deploy

Defina `NEXT_PUBLIC_SITE_URL` no ambiente (ver `.env.example`) antes de publicar
em domínio próprio ou preview.
