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
  fonts.ts          # chamada: Ranima (demo, sem acentos — ver fonts.ts)
                    #   · corpo, labels e títulos menores: Satoshi
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

A página é clara: a **névoa** (`#F6F5F0`) é o fundo dominante, e entre duas
seções de névoa entra um **intervalo** de cor — o **broto** (`#DAEFBE`) ou a
chapa de **lima** (`#84C927`). O verde **mata** (`#192822`) fica só no header
e no rodapé — e no hero, onde a foto pede fundo escuro.

| Tom | Seções |
| --- | --- |
| névoa | Trajeto, Ativações, Propósito, FAQ, `/regulamento` |
| broto (intervalo) | Percursos, História, Inscrição |
| lima (intervalo) | Conceito |
| mata | Hero, header e rodapé |

## Pendências de conteúdo

Estão documentadas no topo de `data/event.ts`. Resumo:

| # | Pendência | Estado na LP |
| --- | --- | --- |
| 1 | **Data** | Só fevereiro de 2027. `event.date` é `null`; a LP diz "data a definir" e o JSON-LD omite `startDate`. |
| 2 | **Link de inscrição** | Aponta para a ficha pública do evento no site da Thomé & Santos. Não é checkout. |
| 3 | **Hexes da marca** | Paleta de quatro cores enviada pela organização (`#84C927` / `#192822` / `#F6F5F0` / `#DAEFBE`); conta de contraste e as duas derivadas comentadas em `app/theme.ts`. |
| 4 | **Mapa do percurso** | `races.route` é `null`: sem botão de mapa. Um mapa que não é o percurso é pior que nenhum. |
| 5 | **Logo e imagem social** | Resolvida: `event.logo` (badge) no header, `event.wordmark` no rodapé e `event.ogImage` (1200×630) para compartilhamento. |
| 6 | **Regulamento** | `regulamentoSource.docId` é `null`; `/regulamento` entra em estado vazio. |
| 7 | **Preço** | Nenhum valor publicado. Sem bloco `offers` no JSON-LD. |
| 8 | **`alt` das fotos** | Resolvida: escritos olhando cada foto. As fotos são de edição anterior (08/02/2026). |

Regra que atravessa todas elas: **nada de placeholder com cara de real**.
Número, data ou foto que a organização não confirmou não entra na página.

## Fotografia

Os originais ficam em `midias-originais/` — fora do git e fora de `public/`,
porque `public/` é servido publicamente e sobe inteiro no deploy. Em
`public/images/` vão só os derivados de web.

| Uso | Arquivo | Origem | Derivado |
| --- | --- | --- | --- |
| Hero | `public/images/hero-atleta-trilha.jpg` | `DSC01135.jpg` (2624×3488), do PSD do deck | 1600×2127, q78, 430 KB |
| Conceito | `public/images/conceito-corredor-mata.jpg` | `7S7A2308-Editar.jpg` (4051×5933), do PSD do deck | 1600×2343, q78, 553 KB |
| História | `public/images/historia-pelotao.jpg` | `7S7A1987.jpg` (3906×5769), do PSD do deck | 1600×2363, q78, 491 KB |
| Logo (header) | `public/images/cv-horizontal-reverse.svg` | kit de marca, vetor | SVG como veio |
| Palavra-marca (rodapé) | `public/images/cv-wordmark-branco.svg` | kit de marca, vetor | SVG como veio |
| Imagem social | `public/images/corrida-verde-og.png` | composta do lockup horizontal | 1200×630 sobre `theme.colors.forest`, 63 KB |

As fotos vieram embutidas (objeto inteligente) nos PSDs do deck comercial
2027 e foram extraídas para `midias-originais/psd/fotos/` com um
`inventario.json` de qual tela usa cada uma. As do hero, do conceito e da
história usam o layout do deck: texto à esquerda, foto à direita e a cor da
seção dissolvendo sobre ela (`components/ui/SideMedia.tsx`; o hero tem a
versão própria, com parallax). Trocou a foto, troque também o NOME do
arquivo: o otimizador de imagem e a CDN guardam o derivado pela URL.

O favicon (`app/icon.png`) é o símbolo (`cv-simbolo.svg`) rasterizado a 512
px — o arquivo estático não lê custom property. A ogImage foi composta com o
hex do tema no momento da composição: trocou a paleta em `app/theme.ts`,
recompor o PNG.


## Deploy

Defina `NEXT_PUBLIC_SITE_URL` no ambiente (ver `.env.example`) antes de publicar
em domínio próprio ou preview.
