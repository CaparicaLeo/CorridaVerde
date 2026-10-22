import { event, faq, races, seoAlternateNames, seoDescription, siteUrl } from "@/data/event";

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
 * Parque Barigui, passando pelo Tingui, e não cabe em `streetAddress`. O que o schema descreve é a
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
    alternateName: seoAlternateNames,
    description: seoDescription,
    url: siteUrl,
    // A ficha oficial do evento no site da organizadora: é a mesma prova, e
    // ligar as duas páginas ajuda buscador e IA a não confundi-la com outras
    // "Corrida Verde" do país.
    sameAs: [event.registrationUrl],
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
      // @thomeesantos é o perfil impresso no rodapé do deck comercial 2027.
      sameAs: ["https://www.instagram.com/thomeesantos/"],
    },
    subEvent: races.items.map((race) => ({
      "@type": "SportsEvent",
      // Nome da prova + distância oficial em km ("Desafio 10 Milhas (16 km)"):
      // o badge em milhas sozinho ("10 MI") não diz nada fora do card.
      name: `${event.shortName} · ${race.title}${race.badgeNote ? ` (${race.badgeNote})` : ""}`,
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
/**
 * As perguntas do FAQ como `FAQPage`: é o conteúdo que buscador ("as pessoas
 * também perguntam") e IA mais citam, e as respostas já estão no HTML — o
 * acordeão só as esconde com `hidden`. Mesma fonte do FAQ visível
 * (`faq.items`), então o que o robô lê é o que a pessoa lê.
 */
export function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
