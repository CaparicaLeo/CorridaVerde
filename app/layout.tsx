import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { AnimationProvider } from "@/components/animation/AnimationProvider";
import { event, seoDescription, siteUrl } from "@/data/event";

import { fontVariables } from "./fonts";
import { theme, themeCss } from "./theme";
import "./globals.css";

const title = event.name;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${event.shortName}`,
  },
  description: seoDescription,
  /** Canonical explícito da home — a LP tem uma rota só. */
  alternates: { canonical: siteUrl },
  applicationName: event.shortName,
  keywords: [
    "Corrida Verde",
    "corrida de rua",
    "Curitiba",
    "Desafio 10 Milhas",
    "16 km",
    "10,8 km",
    "5,8 km",
    "Parque Tanguá",
    "Parque Barigui",
    "Thomé & Santos",
    "corrida Paraná",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: event.shortName,
    title,
    description: seoDescription,
    /*
      Condicional porque `ogImage` pode voltar a null (dado não confirmado) e
      o site já sabe viver sem: sem `images`, o link é compartilhado sem
      miniatura — melhor que uma arte de outra edição fingindo ser esta. O
      objeto já está montado; é o `event.ogImage` que o faz sair sozinho.
    */
    ...(event.ogImage
      ? {
          images: [
            {
              url: event.ogImage.src,
              width: event.ogImage.width,
              height: event.ogImage.height,
              alt: event.ogImage.alt,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: event.ogImage ? "summary_large_image" : "summary",
    title,
    description: seoDescription,
    ...(event.ogImage ? { images: [event.ogImage.src] } : {}),
  },
};

export const viewport: Viewport = {
  /* Vem do tema, como todo hex de marca do projeto. */
  themeColor: theme.colors.background,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <head>
        {/*
          O tema é injetado como custom properties `--cv-*` e os tokens do
          Tailwind apontam para elas (ver app/globals.css). É isso que mantém
          todo hex de marca dentro de app/theme.ts.

          No <head> e antes da folha do Tailwind: as duas camadas usam nomes
          diferentes, então não há disputa de cascata — a ordem aqui é só para
          a primeira pintura já ter as cores.
        */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* Provider global de animação: centraliza a manutenção do ScrollTrigger. */}
        <AnimationProvider>{children}</AnimationProvider>
        {/* Vercel Web Analytics: só envia eventos em produção na Vercel; em dev fica em modo debug no console. */}
        <Analytics />
      </body>
    </html>
  );
}
