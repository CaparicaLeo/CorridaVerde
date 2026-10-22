import { ImpactSlide } from "@/components/blocks/ImpactSlide";
import { AtivacoesSection } from "@/components/sections/AtivacoesSection";
import { CardapioSection } from "@/components/sections/CardapioSection";
import { ConceitoSection } from "@/components/sections/ConceitoSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HistoriaSection } from "@/components/sections/HistoriaSection";
import { PropositoSection } from "@/components/sections/PropositoSection";
import { RacesSection } from "@/components/sections/RacesSection";
import { TrajetoSection } from "@/components/sections/TrajetoSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { EventJsonLd, FaqJsonLd } from "@/components/seo/EventJsonLd";
import { impact } from "@/data/event";

/**
 * Landing page da 41ª Corrida Verde.
 *
 * A ordem conta a história do conceito antes de falar de produto: o hero já
 * diz "de parque a parque", logo abaixo o símbolo se apresenta (a araucária
 * refletida numa gota — a marca antes da prova), a seção do trajeto mostra o que isso significa
 * (dois parques, a cidade no meio), e só depois vêm as provas, a chegada (as
 * ativações e o cardápio pós-corrida), a lista de espera — o pedido de
 * contato depois de a pessoa já saber o que vai encontrar —, a
 * sustentabilidade e o posicionamento. Provas antes de propósito porque o
 * percurso é a informação que decide inscrição; propósito antes da história
 * porque a tradição é argumento, não oferta.
 *
 * Cada seção lê o próprio conteúdo de data/event.ts — reordenar é mover uma
 * linha.
 */
export default function HomePage() {
  return (
    <>
      {/* Dados estruturados só aqui: descrevem o evento, não cada rota. */}
      <EventJsonLd />
      <FaqJsonLd />

      <HeroSection />
      <ConceitoSection />
      <TrajetoSection />
      <RacesSection />
      <AtivacoesSection />
      <CardapioSection />
      <WaitlistSection />
      <ImpactSlide
        id="conceito"
        lines={impact.lines}
        support={impact.support}
        media={impact.media}
      />
      <PropositoSection />
      <HistoriaSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}