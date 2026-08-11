import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import SiteEnhancements from "./components/SiteEnhancements";
import "./globals.css";

/* Sem isto o `og:image` sai como caminho relativo, e o WhatsApp — que
   busca a imagem de fora do site — não consegue resolvê-lo. */
/* Domínio próprio desde 2026-08-10. O endereço do worker carregava o nome
   pessoal na URL e ainda ia parar no `og:image`, que é o que monta o cartão
   de pré-visualização quando o link é colado no WhatsApp. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brasa.varandaestudioweb.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brasa do Vale Churrascaria",
    template: "%s | Brasa do Vale Churrascaria",
  },
  description:
    "Rodízio premium, buffet completo, eventos e reservas na Brasa do Vale Churrascaria, em São Bernardo do Campo.",
  /* A home não tem `metadata` própria, então o canonical dela vive aqui.
     Cada página interna sobrescreve com o próprio caminho. Sem isso, uma
     mesma página alcançada por endereços diferentes — com barra no fim, com
     parâmetro de campanha, pelo endereço do worker — conta como várias. */
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  /* Sem `og:image` o link compartilhado no WhatsApp chegava sem prévia —
     um retângulo de texto. Restaurante circula por mensageiro, então a
     foto é o que decide o clique. 1200×630 é o formato que WhatsApp,
     Instagram, Facebook e X esperam. */
  openGraph: {
    title: "Brasa do Vale Churrascaria",
    description: "Tradição brasileira, cortes na brasa e hospitalidade no coração do ABC.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-brasa-do-vale.jpg",
        width: 1200,
        height: 630,
        alt: "Cortes na brasa servidos na Brasa do Vale Churrascaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasa do Vale Churrascaria",
    description: "Tradição brasileira, cortes na brasa e hospitalidade no coração do ABC.",
    images: ["/og-brasa-do-vale.jpg"],
  },
  icons: {
    /* v3 = espeto com três cortes, 2026-08-11. Antes era v2.
       **Trocar o desenho do favicon sem subir este número não chega em
       ninguém que já visitou o site:** o navegador guarda favicon num índice
       próprio, fora do cache HTTP, e ignora `must-revalidate`. */
    icon: [{ url: "/favicon.svg?v=3", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <Footer />
        <SiteEnhancements />
        <Reveal />
      </body>
    </html>
  );
}
