import { cn } from "@/lib/cn";

/**
 * O símbolo da marca como marca d'água de fundo — o recurso da tela "Sua
 * marca dentro da prova" do deck comercial 2027.
 *
 * É o símbolo NEGATIVO (só as folhas, sem o tronco: `cv-simbolo-negativo.svg`
 * do kit), gigante e cortado pelas bordas da seção, na cor do texto do tom a
 * 14% — no deck ele aparece a #D7D8D2 sobre a névoa, que é exatamente o mata
 * a 14%. O SVG entra como MÁSCARA, não como imagem: a cor vem do token
 * (`bg-ink`), então a marca d'água acompanha o tom da seção e nenhum hex sai
 * do tema.
 *
 * A seção que o recebe precisa de `isolate overflow-hidden`: a marca d'água é
 * `-z-10` (fica sobre o fundo da seção e sob o conteúdo) e é maior que ela.
 */
export function BrandWatermark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10 aspect-[303/322] bg-ink/14",
        "mask-[url(/images/cv-simbolo-negativo.svg)] mask-contain mask-center mask-no-repeat",
        className,
      )}
    />
  );
}
