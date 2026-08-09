import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { alternates: { canonical: "/rodizio" }, title: "Rodízio premium", description: "Conheça o rodízio premium da Brasa do Vale e sua seleção de cortes preparados no carvão." };

export default function RodizioPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="A experiência da brasa" title="Carvão, tempo e o ponto que você prefere." description="O rodízio premium é o coração da Brasa do Vale, com 18 cortes selecionados e um serviço atento ao ritmo da mesa." image="rodizio" action={{href:"/contato?assunto=Reserva#mensagem", label:"Solicitar reserva"}} />
      <section className="section section-cream"><div className="container">
        <div className="section-heading split-heading"><div><p className="eyebrow">Como a experiência acontece</p><h2>Da brasa à mesa, sem pressa.</h2></div><p>Cada passagem combina o tempo do fogo, a preferência de ponto e a atenção de quem serve.</p></div>
        <div className="journey-grid">
          <article><span>01</span><h3>Preparo no carvão</h3><p>O fogo conduz a identidade da casa e o preparo das carnes nobres.</p></article>
          <article><span>02</span><h3>Seu ponto preferido</h3><p>O serviço considera a preferência de ponto de cada pessoa à mesa.</p></article>
          <article><span>03</span><h3>Variedade contínua</h3><p>A seleção reúne 18 cortes e o apoio de um buffet completo durante a refeição.</p></article>
        </div>
      </div></section>
      <section className="section before-visit-section" id="antes-de-vir"><div className="container two-column-copy"><div><p className="eyebrow">Antes de vir</p><h2>Informação clara também faz parte do serviço.</h2></div><div className="stack-list"><p><strong>Destaque:</strong> jantar e finais de semana.</p><p><strong>Funcionamento:</strong> terça a domingo.</p><p><strong>Valores:</strong> consulte as condições vigentes da casa.</p><p><strong>Reserva:</strong> toda solicitação depende da confirmação da equipe.</p><a className="button button-wine" href="/contato?assunto=Reserva#mensagem">Solicitar reserva</a></div></div></section>
    </main>
  );
}
