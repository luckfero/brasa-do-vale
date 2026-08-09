import type { Metadata } from "next";
import DemoForm from "../components/DemoForm";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { alternates: { canonical: "/eventos" }, title: "Eventos", description: "Conheça o salão reservado da Brasa do Vale para aniversários, grupos e confraternizações." };

export default function EventsPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Eventos e confraternizações" title="Um encontro reservado, com a hospitalidade da casa." description="Aniversários, grupos e eventos empresariais encontram conforto e privacidade em um salão climatizado para até 40 pessoas." image="events" action={{href:"#orcamento", label:"Solicitar orçamento"}} />
      <section className="section section-cream"><div className="container events-overview"><div className="events-image" role="img" aria-label="Salão reservado preparado para um jantar corporativo"><span>Salão reservado</span></div><div><p className="eyebrow">Estrutura reservada</p><h2>Espaço para transformar reunião em presença.</h2><p>O salão recebe até 40 pessoas em um ambiente climatizado e preparado para celebrações. Menu, horário e organização do espaço são definidos de acordo com o formato de cada encontro.</p><dl className="detail-list"><div><dt>Capacidade</dt><dd>Até 40 pessoas</dd></div><div><dt>Ocasiões</dt><dd>Empresas, aniversários e grupos</dd></div><div><dt>Orçamento</dt><dd>Planejado para cada evento</dd></div></dl><small>A capacidade pode variar conforme a configuração escolhida para o salão.</small></div></div></section>
      <section className="section form-section" id="orcamento"><div className="container wide-form-container"><DemoForm variant="events" /></div></section>
    </main>
  );
}
