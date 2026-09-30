import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/**
 * Layout do site público. O route group existe para que um fluxo futuro sem
 * cabeçalho possa viver em outro grupo sem duplicar o layout raiz.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#conteudo"
        className="label-condensed sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-accent focus:px-5 focus:py-3 focus:text-xs focus:text-surface"
      >
        Pular para o conteúdo
      </a>

      <SiteHeader />
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </>
  );
}
