import { event, races, seoDescription, siteUrl } from "@/data/event";

/**
 * Dados estruturados do evento (schema.org/SportsEvent).
 *
 * `startDate` é condicional de propósito: só o período de fevereiro de 2027
 * está confirmado, e schema.org não aceita data vazia nem "fevereiro de 2027"
 * como `@type: Date`. Preencher com palpite marcaria uma data errada para o
 * buscador, que é pior do que não ter o campo. Quando `event.date` receber o
 * ISO, o campo passa a sair sozinho e o resultado fica elegível a rich result
 * de evento.
 *
 * O local também não é endereço: a prova ocupa um trajeto do Parque Tanguá ao
 * Parque Barigui, e não cabe em `streetAddress`. O que o schema descreve é a
 * arena de chegada (`venue`), que é onde o evento acontece — e a largada entra
 * como `eventAttendanceMode` do percurso, não como endereço. Um CEP de parque
 * aqui seria um dado inventado.
 *
 * Sem bloco `offers`: ele exige preço, e o valor da inscrição não está
 * confirmado. O link para a página oficial já vive nos CTAs.
 */
export function EventJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: seoDescription,
    url: siteUrl,
    // Absoluta: o JSON-LD é lido fora do contexto da página, então caminho
    // relativo não resolve. Condicional porque a imagem de compartilhamento
    // ainda não chegou — `image` com URL quebrada derruba a validação inteira.
    ...(event.ogImage ? { image: [`${siteUrl}${event.ogImage.src}`] } : {}),
    sport: "Corrida de rua",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.date ? { startDate: event.date } : {}),
    location: {
      "@type": "Place",
      name: event.location.venue,
      address: {
        "@type": "PostalAddress",
        // `streetAddress` fica de fora de propósito (ver comentário acima).
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        addressCountry: "BR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer.name,
      url: event.organizer.url,
    },
    subEvent: races.items.map((race) => ({
      "@type": "SportsEvent",
      name: `${event.name} · ${race.badge}`,
      description: race.description,
      sport: "Corrida de rua",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // O conteúdo é nosso, não entrada de usuário, mas escapar "<" impede
        // que um texto futuro com "</script>" encerre a tag antes da hora.
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}