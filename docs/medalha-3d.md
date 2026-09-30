# Medalha 3D — especificação do arquivo `.glb`

Documento para quem vai modelar a medalha da 41ª Corrida Verde.
O site já está pronto para receber o arquivo: seguindo esta especificação, a
medalha entra no lugar do placeholder sem mexer em código.

> **Estado atual: a medalha 3D não está montada na landing.** A direção
> combinada é esperar o `.glb` oficial. O que existe hoje em
> `components/medal/` é o motor (palco, carregamento, gesto de giro, rede de
> segurança) e a medalha *procedural*, cujos glifos ainda são os do KM1 —
> mostrá-la nesta prova seria exibir a marca de outra etapa. Os passos para
> ligar estão no fim do documento e em `components/medal/config.ts`.

## Resumo rápido

| Item | Exigência |
| --- | --- |
| Formato | glTF 2.0 binário (`.glb`), arquivo único, texturas embutidas |
| Nome e local | `medal-corrida-verde.glb` (vai para `public/models/medal-corrida-verde.glb`) |
| Unidade | metro (1 unidade do Blender = 1 m), escala real da peça |
| Frente da medalha | olhando para **+Z** no glTF (= **−Y** no Blender, vista *Front*) |
| Para cima | **+Y** no glTF (= **+Z** no Blender) — argola e fita para cima |
| Origem (pivot) | centro do disco: meio da face e meio da espessura |
| Triângulos | alvo **até 30 mil**; teto de 60 mil |
| Texturas | PBR metal/rugosidade; até **2048 px** no disco, 1024 px na fita |
| Compressão | **Meshopt** + texturas **WebP**. **Não usar Draco nem KTX2** |
| Tamanho final | alvo **até 1,5 MB**; teto de 3 MB |
| Não incluir | luzes, câmeras, animações, chão, fundo ou HDR |

## 1. Dimensões e escala

- **Unidade em metro, escala real.** Uma medalha de 70 mm de diâmetro tem
  0,07 m no arquivo. Use o tamanho de fábrica da peça real. Se ainda não houver,
  modele com **70 mm de diâmetro e 5 mm de espessura**.
- O site escala e centraliza o modelo automaticamente numa caixa fixa de cena.
  Um arquivo em milímetro não quebra a página, mas a unidade certa evita
  surpresa em qualquer outra ferramenta.
- **Proporção da caixa total (largura : altura) ≈ 1 : 1,8.** É a caixa em que
  a medalha é enquadrada. O modelo é escalado até encostar no primeiro limite,
  largura ou altura:
  - Só o disco, sem fita: o disco ocupa a largura inteira. Funciona bem.
  - Disco com uma fita curta em "V" (**até ~0,8× o diâmetro acima da
    argola**): o disco fica do mesmo tamanho do placeholder atual. Esse é o
    ideal.
  - Fita longa, de pescoço inteiro: a altura vira o limite e o disco
    **encolhe** na tela. Evite. Se a fita longa for importante, avise antes.

## 2. Orientação e pivot

- A **frente** (face com a arte principal) olha para **+Z** no glTF. No
  Blender, a frente fica voltada para **−Y**: na vista *Front* (numpad 1) você
  deve ver a frente da medalha. O exportador converte, com **+Y Up** marcado.
- **Para cima = +Y** no glTF (+Z no Blender): argola e fita para cima.
- **Origem no centro do disco**: no meio da face (X e altura) e no meio da
  espessura.
- A medalha gira **só no eixo vertical**, passando pelo centro da caixa do
  modelo. Por isso, **mantenha a peça simétrica na largura**: uma fita torta
  para um lado desloca o eixo e a medalha "bamboleia" ao girar.
- O verso aparece quando a pessoa gira a peça. **Modele o verso** (arte do
  verso ou acabamento liso bem resolvido) e não deixe faces abertas.

## 3. Geometria

- **Alvo: até 30 mil triângulos no total. Teto: 60 mil.**
- A borda precisa ser redonda de verdade: **96 a 128 segmentos** na
  circunferência. É ali que o reflexo corre e a facetagem aparece.
- Relevo grande (logo, "41", número da edição, borda) em **geometria**. Detalhe
  fino (textura de fundo, jateado, gravação rasa) em **normal map**, não em
  polígono.
- Fita: plano com as duas faces visíveis ou sólido fino (≤ 0,3 mm). Nada de
  subdivisão pesada: 20 a 40 segmentos ao longo do comprimento bastam para a
  curva.
- Antes de exportar: **aplicar todas as transformações** (Ctrl+A → *All
  Transforms*), escala 1,0 em tudo. Sem escala negativa, sem pai com escala
  não uniforme. Normais apontando para fora (*Recalculate Outside*) e sem
  vértices duplicados (*Merge by Distance*).

## 4. Materiais e texturas

- Material **PBR metal/rugosidade** (*Principled BSDF* no Blender). Nada de
  shader customizado, nó procedural sem bake, emissão ou transmissão.
- Mapas aceitos:
  - **baseColor** (sRGB): cor do metal e do esmalte, e a arte da fita.
  - **metallicRoughness** (linear, empacotado: **G = rugosidade,
    B = metálico**). Pode vir como ORM, com oclusão no canal R.
  - **normal** (tangent space, padrão OpenGL, +Y), para o detalhe fino.
  - **occlusion** opcional, de preferência no R do ORM.
- **Resolução máxima: 2048 px** para o disco e **1024 px** para a fita.
  Sempre potência de 2. Se 1024 der conta do disco, melhor.
- **Formato: WebP** (ou JPEG no baseColor). PNG só se houver transparência
  real. **Não usar KTX2/Basis**: o site não carrega o transcodificador.
- **Acabamento que funciona melhor:** contraste entre relevo **polido**
  (rugosidade ~0,15–0,25) e campo **acetinado** (~0,4–0,5). É isso que faz a
  arte saltar quando o reflexo passa.
- **Cuidado com a cor.** A medalha aparece sobre um fundo **amarelo chapado
  (#F5D700)**. Ouro claro e fita amarela somem nesse fundo. Prefira ouro mais
  escuro ou alaranjado, e contorno escuro na fita (bordas ou listras pretas),
  como no placeholder.
- A fita precisa aparecer dos dois lados: no material dela, **desmarque
  *Backface Culling*** (o exportador marca `doubleSided`).
- Não use materiais sem textura com cor em vertex color. Cor sai do material
  ou do baseColor.

## 5. Nomes

O site **não depende de nomes** hoje: carrega a cena inteira como veio. Para
facilitar ajustes futuros (trocar só a fita, por exemplo), use:

| Objeto / material | Nome |
| --- | --- |
| Disco | `Medalha_Disco` |
| Borda | `Medalha_Borda` |
| Relevos (logo, texto) | `Medalha_Relevo` |
| Argola | `Medalha_Argola` |
| Fita | `Fita` |
| Material polido | `Metal_Polido` |
| Material acetinado | `Metal_Acetinado` |
| Material da fita | `Fita_Tecido` |

Sem acento e sem espaço. Uma cena só, com um objeto raiz (vazio) chamado
`Medalha` segurando tudo.

## 6. Exportação no Blender (4.x)

*File → Export → glTF 2.0*:

- **Format:** glTF Binary (`.glb`)
- **Include:** *Selected Objects* (só a medalha). Desmarque *Cameras*,
  *Punctual Lights* e *Custom Properties*.
- **Transform:** **+Y Up** marcado.
- **Data → Mesh:** *Apply Modifiers* ✓, *UVs* ✓, *Normals* ✓. *Tangents* só se
  houver normal map bakeado com tangentes do Blender. *Vertex Colors* ✗.
- **Data → Material:** *Export*. **Images:** *WebP* (ou *Automatic*).
- **Data → Compression:** pode deixar desligado (a otimização abaixo cuida
  disso). **Nunca Draco.**
- **Animation:** tudo desmarcado.

O exportador triangula sozinho. Se houver **normal map bakeado**, triangule a
malha **antes do bake** (modificador *Triangulate* aplicado) para o tangent
space do bake bater com o do site.

## 7. Otimização e tamanho final

Rode no arquivo exportado (ou envie o `.glb` cru que a gente roda):

```bash
npx @gltf-transform/cli optimize medalha-export.glb medalha.glb \
  --compress meshopt \
  --texture-compress webp \
  --texture-size 2048
```

- **Alvo: até 1,5 MB. Teto: 3 MB.** A medalha divide a banda com o motor 3D
  (three.js), que já é o maior peso da página. Ela começa a baixar pouco antes
  de a seção aparecer, e no 4G cada MB a mais é tempo de skeleton na tela.
- Se passar do alvo, corte primeiro a resolução das texturas (2048 → 1024),
  depois os triângulos.

## 8. Checklist de entrega

- [ ] Abre sem erro no validador do Khronos
      (<https://github.khronos.org/glTF-Validator/>).
- [ ] Aparece certo em <https://gltf-viewer.donmccurdy.com/>: frente olhando
      para a câmera, fita para cima, verso resolvido.
- [ ] Unidade em metro, transformações aplicadas, origem no centro do disco.
- [ ] Até 30 mil triângulos, texturas ≤ 2048 px em WebP, Meshopt aplicado.
- [ ] Sem luzes, câmeras, animações, chão ou HDR.
- [ ] Arquivo final com até 1,5 MB.
- [ ] Envie também o `.blend` fonte e as texturas em alta, para ajustes
      futuros.

## Para quem for publicar

1. Copie o arquivo para `public/models/medal-corrida-verde.glb`.
2. Em `components/medal/config.ts`, aponte `modelUrl` para o caminho acima e
   mude `usePlaceholder` para `false`.
3. Em `app/(site)/page.tsx`, monte a medalha no slot que já existe:
   ```tsx
   import { MedalStage } from "@/components/medal/MedalStage";
   …
   <ImpactSlide
     id="conceito"
     lines={impact.lines}
     support={impact.support}
     aside={<MedalStage />}
   />
   ```
4. Rode `npm run dev` e confira a seção "Verde não é a cor".

Se o arquivo faltar ou vier corrompido, a página não quebra: o palco faz um
HEAD no `.glb` antes de montá-lo e volta para a medalha procedural, registrando
um aviso `[medalha]` no console. Dá para subir o modelo depois de publicar sem
redeploy.
