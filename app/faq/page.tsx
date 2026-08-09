import type { Metadata } from "next";
import FaqList from "../components/FaqList";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { alternates: { canonical: "/faq" }, title: "Perguntas frequentes", description: "Tire suas dúvidas antes de visitar a Brasa do Vale Churrascaria." };

const faqs = [
  { question: "A solicitação feita pelo site confirma a reserva?", answer: "Ainda não. Toda solicitação depende do retorno da equipe com a disponibilidade para a data, o horário e o tamanho do grupo informado." },
  { question: "Quais são os dias de funcionamento?", answer: "A churrascaria funciona de terça a domingo e permanece fechada às segundas. Consulte a programação da casa antes da visita." },
  { question: "Quanto custa o rodízio?", answer: "Os valores podem variar conforme o dia, o horário e as condições vigentes. Consulte a equipe para receber a informação atualizada." },
  { question: "Há opções para pessoas vegetarianas?", answer: "O buffet oferece alternativas para diferentes preferências. Fale com a equipe antes da visita caso precise confirmar um item ou cuidado alimentar específico." },
  { question: "Existe estacionamento?", answer: "Sim. A casa conta com estacionamento próprio para trazer mais praticidade à chegada." },
  { question: "O local possui acessibilidade?", answer: "Sim. O espaço possui acesso para cadeirantes. A equipe pode orientar a melhor entrada e apoiar a chegada sempre que necessário." },
  { question: "Qual é a capacidade para eventos?", answer: "O salão reservado recebe até 40 pessoas. A capacidade final pode variar conforme a configuração escolhida para cada evento." },
  { question: "Como solicitar um orçamento para evento?", answer: "Acesse a página de eventos, informe a data, o tipo de encontro e a quantidade estimada de convidados. A equipe prepara a proposta de acordo com a ocasião." },
];

export default function FaqPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Perguntas frequentes" title="Clareza antes mesmo de chegar à mesa." description="Reunimos as respostas para as dúvidas mais comuns sobre reservas, funcionamento, estrutura e eventos." />
      <section className="section section-cream"><div className="container faq-layout"><div><p className="eyebrow">Dúvidas comuns</p><h2>Informações para planejar sua visita.</h2><p>Se ainda precisar de ajuda, envie uma mensagem com sua dúvida e o contexto da sua visita.</p><a className="button button-wine" href="/contato">Ir para contato</a></div><FaqList items={faqs} /></div></section>
    </main>
  );
}
