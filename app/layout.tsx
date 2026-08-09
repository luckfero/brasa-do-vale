import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import SiteEnhancements from "./components/SiteEnhancements";
import "./globals.css";

/* Sem isto o `og:image` sai como caminho relativo, e o WhatsApp — que
   busca a imagem de fora do site — não consegue resolvê-lo. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brasa-do-vale.luccaoliveira123.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brasa do Vale Churrascaria | Experiência premium no ABC",
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
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=2",
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
