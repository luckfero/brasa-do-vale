import type { Metadata } from "next";
import DemoForm from "../components/DemoForm";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { alternates: { canonical: "/contato" }, title: "Contato e localização", description: "Fale com a Brasa do Vale e planeje sua visita em São Bernardo do Campo." };

export default function ContactPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Contato e localização" title="A conversa começa antes de chegar à mesa." description="Escolha o assunto, compartilhe o que precisa e encontre o caminho certo para planejar sua visita." image="contact" />
      <section className="section section-cream" id="canais"><div className="container contact-grid">
        <div>
          <p className="eyebrow">Como podemos ajudar</p>
          <h2>Um caminho simples para cada conversa.</h2>
          <div className="contact-cards">
            <article>
              <span>Reservas</span>
              <strong>Planeje sua próxima mesa</strong>
              <p>Informe data, horário e quantidade de pessoas para solicitar disponibilidade.</p>
            </article>
            <article>
              <span>Eventos</span>
              <strong>Reúna seu grupo na casa</strong>
              <p>Conte o formato do encontro e receba uma proposta pensada para a ocasião.</p>
            </article>
            <article>
              <span>Dúvidas</span>
              <strong>Converse sobre sua visita</strong>
              <p>Use o formulário abaixo para compartilhar dúvidas, necessidades de acesso ou cuidados alimentares.</p>
            </article>
          </div>
        </div>
        <aside className="location-card" aria-labelledby="location-card-title">
          <div className="location-card-top">
            <span className="location-pin" aria-hidden="true">
              <svg viewBox="0 0 32 32"><path d="M16 28s8-8.1 8-15a8 8 0 1 0-16 0c0 6.9 8 15 8 15Z"/><circle cx="16" cy="13" r="2.8"/></svg>
            </span>
            <div><p className="eyebrow">Onde estamos</p><h2 id="location-card-title">São Bernardo do Campo, SP</h2></div>
          </div>
          <p>Uma casa preparada para receber moradores e empresas do ABC Paulista, visitantes da Grande São Paulo e quem chega à região.</p>
          <a className="button button-outline" href="#mapa">Ver localização demonstrativa</a>
        </aside>
      </div></section>
      <section className="section map-section" id="mapa" aria-labelledby="map-title"><div className="container"><div className="map-heading"><div><p className="eyebrow">Localização demonstrativa</p><h2 id="map-title">Parque da Juventude, São Bernardo do Campo</h2></div><p>O mapa abaixo demonstra como a localização exata de um estabelecimento pode ser integrada ao site. O endereço comercial definitivo da churrascaria ainda deve ser confirmado.</p></div><div className="map-frame"><iframe title="Mapa do Parque da Juventude em São Bernardo do Campo" src="https://www.google.com/maps?q=Parque%20da%20Juventude%2C%20S%C3%A3o%20Bernardo%20do%20Campo%2C%20SP&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></div></section>
      <section className="section form-section" id="mensagem"><div className="container narrow-container"><DemoForm variant="contact" /></div></section>
    </main>
  );
}
