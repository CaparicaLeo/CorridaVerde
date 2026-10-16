import type { MetadataRoute } from "next";

import { siteUrl } from "@/data/event";
import { getRegulamento } from "@/lib/regulamento";

/** Refeito de hora em hora: o regulamento pode ser publicado sem deploy. */
export const revalidate = 3600;

/** Rotas: a LP, o conceito da marca e, quando houver documento, o regulamento. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const regulamento = await getRegulamento();

  return [
    /*
      Sem `lastModified`: `new Date()` marcava "mudou agora" a cada build, e o
      Google passa a ignorar um lastmod que sempre diz isso. O /regulamento
      só entra quando há documento (enquanto vazio, a página é noindex).
    */
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/conceito`, changeFrequency: "monthly", priority: 0.5 },
    ...(regulamento
      ? [{ url: `${siteUrl}/regulamento`, changeFrequency: "weekly" as const, priority: 0.7 }]
      : []),
  ];
}
