import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteEnhancements from "./components/SiteEnhancements";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brasa do Vale Churrascaria | Experiência premium no ABC",
    template: "%s | Brasa do Vale Churrascaria",
  },
  description:
    "Rodízio premium, buffet completo, eventos e reservas na Brasa do Vale Churrascaria, em São Bernardo do Campo.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Brasa do Vale Churrascaria",
    description: "Tradição brasileira, cortes na brasa e hospitalidade no coração do ABC.",
    type: "website",
    locale: "pt_BR",
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
      </body>
    </html>
  );
}
