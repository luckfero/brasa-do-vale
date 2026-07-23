import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Conheça o rodízio, o buffet, o almoço executivo, as bebidas e as sobremesas da Brasa do Vale.",
};

const sections = [
  { number: "01", title: "Rodízio premium", text: "Uma seleção de 18 cortes preparados no carvão e servidos de acordo com a preferência de ponto de cada pessoa.", note: "Destaque da casa no jantar e aos finais de semana." },
  { number: "02", title: "Buffet completo", text: "Saladas, pratos quentes e acompanhamentos renovam a mesa e equilibram cada passagem da brasa.", note: "A seleção pode variar conforme o dia e a disponibilidade." },
  { number: "03", title: "Almoço executivo", text: "Uma opção prática e bem servida para os dias úteis, pensada para quem vive ou trabalha na região.", note: "Consulte os dias, horários e pratos disponíveis." },
  { number: "04", title: "Bebidas e sobremesas", text: "Vinhos, bebidas e sobremesas completam a experiência do primeiro brinde ao último sabor.", note: "Peça à equipe uma recomendação para acompanhar sua escolha." },
];

export default function MenuPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Cardápio" title="Variedade que acompanha cada momento da mesa." description="Da seleção de cortes ao buffet, cada escolha foi pensada para compor uma refeição completa, acolhedora e cheia de sabor." image="buffet" action={{href:"/contato?assunto=Reserva#mensagem", label:"Solicitar reserva"}} />
      <section className="section section-cream">
        <div className="container">
          <div className="content-intro">
            <div><p className="eyebrow">Da brasa ao buffet</p><h2>Quatro caminhos para compor a experiência</h2></div>
            <div className="demo-disclosure"><strong>Uma mesa completa</strong><p>A variedade acompanha o ritmo da casa. Cortes, acompanhamentos e opções do dia podem mudar conforme a disponibilidade.</p></div>
          </div>
          <div className="menu-sections">
            {sections.map((item) => (
              <article key={item.title}>
                <span>{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p><small>{item.note}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="image-text-section">
        <div className="image-panel image-panel-buffet" role="img" aria-label="Buffet com saladas, acompanhamentos, arroz e feijão" />
        <div className="image-text-copy"><p className="eyebrow">Para diferentes preferências</p><h2>O buffet amplia a conversa da mesa.</h2><p>Saladas, pratos quentes e acompanhamentos trazem equilíbrio e variedade para que cada pessoa monte a refeição do seu jeito.</p><a className="button button-wine" href="/faq">Tirar dúvidas</a></div>
      </section>
    </main>
  );
}
