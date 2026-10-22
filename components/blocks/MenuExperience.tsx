import { Eyebrow } from "@/components/ui/Eyebrow";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/cn";
import type { MenuDish, MenuExperience as MenuExperienceType } from "@/data/types";

/**
 * Uma experiência do cardápio, no desenho do PDF: eyebrow numerado, título de
 * cartaz, a frase de chamada e os pratos lado a lado, cada um com a foto em
 * cima e o texto embaixo.
 *
 * As fotos têm proporções um pouco diferentes (0,75 a 0,87); com a proporção
 * de cada uma, os textos de duas colunas vizinhas começavam em alturas
 * diferentes. Por isso o quadro é fixo em 4:5 e a foto recorta (`stretch`).
 */
export function MenuExperience({
  experience,
  className,
}: {
  experience: MenuExperienceType;
  className?: string;
}) {
  return (
    <article className={className}>
      <header className="flex max-w-3xl flex-col gap-4">
        <MenuEyebrow number={experience.number} />
        <h2 className="headline text-4xl sm:text-5xl lg:text-6xl">
          {experience.title}
        </h2>
        <p className="text-base text-ink-muted sm:text-lg">{experience.tagline}</p>
      </header>

      <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-14 lg:gap-x-12">
        {experience.dishes.map((dish) => (
          <Dish key={dish.id} dish={dish} />
        ))}
      </div>
    </article>
  );
}

/** "• EXPERIÊNCIA 01" — o ponto de lima do PDF, que aqui é preenchimento. */
export function MenuEyebrow({
  number,
  className,
  ...rest
}: {
  number: string;
  className?: string;
  "data-reveal"?: boolean;
}) {
  return (
    <Eyebrow className={cn("w-fit text-ink", className)} {...rest}>
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      Experiência {number}
    </Eyebrow>
  );
}

function Dish({ dish }: { dish: MenuDish }) {
  return (
    <div className="flex flex-col">
      <Media
        media={dish.media}
        stretch
        className="aspect-[4/5] rounded-card"
        sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
      />

      <h3 className="title-sans mt-6 text-xl sm:text-2xl">{dish.name}</h3>
      {dish.subtitle ? (
        <p className="label-condensed mt-3 text-[0.7rem] text-ink-muted">
          {dish.subtitle}
        </p>
      ) : null}

      <p className="mt-3 text-base leading-relaxed text-ink">{dish.tagline}</p>
      {dish.description ? (
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          {dish.description}
        </p>
      ) : null}

      {dish.variations?.map((variation) => (
        <div key={variation.id} className="mt-6 border-t border-line pt-5">
          <h4 className="label-condensed text-[0.7rem] text-ink">{variation.name}</h4>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {variation.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * A faixa "acompanha" do rodapé do PDF: rótulo e os três itens em linha. Em
 * chapa de degrau (`surface-alt`) — na névoa ela sai broto, como no PDF.
 */
export function MenuIncluded({
  label,
  items,
  className,
}: {
  label: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-card bg-surface-alt px-6 py-6 sm:px-8", className)}>
      <p className="label-condensed text-[0.7rem] text-ink-muted">{label}</p>
      <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-base text-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-ink" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
