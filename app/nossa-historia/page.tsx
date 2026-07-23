import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { title: "Nossa história", description: "Conheça a história da família Costa e da Brasa do Vale Churrascaria." };

export default function StoryPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Nossa história" title="Uma tradição de família que encontrou lugar à mesa." description="A Brasa do Vale começou nos churrascos da família Costa e cresceu sem deixar a hospitalidade para trás." image="history" />
      <section className="section section-cream"><div className="container story-long-grid"><div><p className="eyebrow">O começo</p><h2>Da memória dos churrascos ao primeiro salão.</h2></div><div><p>Mariana e Eduardo Costa cresceram acompanhando os encontros organizados pela família. Em setembro de 2018, essa memória inspirou a criação da Brasa do Vale, que abriu as portas com espaço para 70 pessoas.</p><p>Desde o início, o propósito é unir a tradição do churrasco brasileiro a um ambiente confortável e contemporâneo. Uma casa preparada tanto para o almoço em família quanto para uma grande confraternização.</p></div></div></section>
      <section className="section timeline-section" id="caminho-da-casa"><div className="container"><div className="timeline-heading"><p className="eyebrow">Caminho da casa</p><h2>Uma história contada em encontros.</h2></div><div className="timeline timeline-horizontal">
        <article><div className="timeline-marker"><time>2018</time><span className="timeline-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M6 14.5 16 6l10 8.5V26H6Z"/><path d="M12.5 26v-7h7v7"/></svg></span></div><h3>A abertura</h3><p>Inauguração em setembro, com um primeiro salão preparado para receber 70 pessoas.</p></article>
        <article><div className="timeline-marker"><time>2021</time><span className="timeline-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M7 25V11h18v14"/><path d="M4 25h24M11 11V7h10v4M11 17h4M19 17h4M11 21h4M19 21h4"/></svg></span></div><h3>Novos espaços</h3><p>Ampliação do buffet, criação da área infantil e início do atendimento a eventos corporativos.</p></article>
        <article><div className="timeline-marker"><time>Hoje</time><span className="timeline-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 23h22M8 23a8 8 0 0 1 16 0M16 11V7M13 7h6"/></svg></span></div><h3>Hospitalidade em evolução</h3><p>Rodízio premium, buffet, almoço executivo e salão reservado compõem os principais momentos da casa.</p></article>
      </div></div></section>
      <section className="section legacy-section"><div className="container legacy-shell">
        <div className="legacy-intro"><p className="eyebrow eyebrow-gold">O que permanece</p><h2>O cuidado de receber continua sendo o ingrediente central.</h2><p>A casa mudou, ganhou novos espaços e ampliou o serviço. O jeito próximo de acolher cada mesa continua o mesmo.</p></div>
        <div className="legacy-values" aria-label="Valores que permanecem na casa">
          <div><span>01</span><strong>Proximidade</strong></div>
          <div><span>02</span><strong>Cuidado</strong></div>
          <div><span>03</span><strong>Hospitalidade</strong></div>
        </div>
        <a className="button button-gold" href="/contato?assunto=Reserva#mensagem">Solicitar reserva</a>
      </div></section>
    </main>
  );
}
