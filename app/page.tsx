const experiences = [
  {
    eyebrow: "O protagonista",
    title: "Rodízio premium",
    text: "Cortes selecionados passam pela brasa e chegam à mesa no ponto que você prefere, respeitando o ritmo de cada encontro.",
    href: "/rodizio",
    action: "Conhecer o rodízio",
  },
  {
    eyebrow: "Para acompanhar",
    title: "Buffet completo",
    text: "Saladas, pratos quentes e acompanhamentos completam a mesa com variedade para diferentes preferências.",
    href: "/cardapio",
    action: "Explorar o cardápio",
  },
  {
    eyebrow: "Para reunir",
    title: "Eventos com acolhimento",
    text: "Um salão reservado para até 40 pessoas recebe aniversários, confraternizações e encontros especiais.",
    href: "/eventos",
    action: "Planejar um evento",
  },
];

export default function Home() {
  return (
    <main id="conteudo-principal">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow hero-eyebrow">São Bernardo do Campo • desde 2018</p>
          <h1 id="hero-title">O fogo acende a tradição. A hospitalidade faz ficar.</h1>
          <p className="hero-copy">
            Cortes na brasa, buffet completo e uma hospitalidade que transforma
            cada visita em um encontro especial.
          </p>
          <div className="button-row">
            <a className="button button-gold" href="/cardapio">
              Conhecer o cardápio
            </a>
          </div>
        </div>
        <a className="hero-scroll" href="#experiencia">
          <span>Descobrir a experiência</span>
          <span className="scroll-arrow" aria-hidden="true" />
        </a>
      </section>

      <section className="quick-facts" aria-label="Informações principais">
        <div className="container quick-facts-grid">
          <div>
            <span className="quick-label">Funcionamento</span>
            <strong>Terça a domingo</strong>
            <small>Almoço, jantar e encontros especiais</small>
          </div>
          <div>
            <span className="quick-label">Localização</span>
            <strong>São Bernardo do Campo</strong>
            <small>Atendimento ao ABC e Grande São Paulo</small>
          </div>
          <div>
            <span className="quick-label">Atendimento</span>
            <strong>Reservas e eventos</strong>
            <small>Solicitações organizadas por assunto</small>
          </div>
        </div>
      </section>

      <section className="section section-cream" id="experiencia">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Brasa, mesa e presença</p>
              <h2>Uma experiência para todos os ritmos da mesa</h2>
            </div>
            <p>
              Do almoço em família à confraternização da empresa, cada ocasião
              encontra variedade, conforto e o cuidado de uma casa familiar.
            </p>
          </div>

          <div className="experience-grid">
            {experiences.map((item, index) => (
              <article className="experience-card" key={item.title}>
                <span className="card-number">0{index + 1}</span>
                <p className="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a className="text-link" href={item.href}>
                  {item.action} <span className="link-arrow" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-preview">
        <div className="container story-grid">
          <div className="story-visual" role="img" aria-label="Carnes preparadas no carvão">
            <div className="story-stat">
              <strong>8</strong>
              <span>anos de história familiar</span>
            </div>
          </div>
          <div className="story-copy">
            <p className="eyebrow">Da família para o salão</p>
            <h2>Tradição brasileira com um olhar contemporâneo</h2>
            <p>
              A Brasa do Vale nasceu em 2018, inspirada nos churrascos da
              família Costa. O primeiro salão cresceu, o buffet ganhou novos
              caminhos e a hospitalidade permaneceu no centro de tudo.
            </p>
            <div className="story-metrics" aria-label="Diferenciais em números">
              <div><strong>18</strong><span>cortes na seleção da casa</span></div>
              <div><strong>40</strong><span>lugares no salão reservado</span></div>
              <div><strong>35</strong><span>vagas de estacionamento</span></div>
            </div>
            <a className="button button-wine" href="/nossa-historia">
              Conhecer nossa história
            </a>
          </div>
        </div>
      </section>

      <section className="section section-wine events-callout" id="encontros">
        <div className="container events-feature">
          <div className="events-feature-copy">
            <p className="eyebrow eyebrow-gold">Encontros à sua maneira</p>
            <h2>Um salão reservado para celebrar, reunir e compartilhar.</h2>
            <p>
              Confraternizações empresariais, aniversários e ocasiões especiais
              com uma experiência planejada para grupos.
            </p>
            <a className="button button-gold" href="/eventos">
              Solicitar orçamento
            </a>
          </div>
          <div className="events-feature-image" role="img" aria-label="Salão reservado preparado para um encontro especial" />
        </div>
      </section>

      <section className="section visit-section" id="planejar-visita">
        <div className="container visit-panel">
          <div className="visit-heading">
            <p className="eyebrow">Sua mesa começa aqui</p>
            <h2>Conte o que está planejando.</h2>
          </div>
          <div className="visit-content">
            <p>Escolha o assunto para chegar ao formulário certo com menos etapas.</p>
            <div className="visit-options">
              <a href="/contato?assunto=Reserva#mensagem">
                <span>01</span><strong>Reserva</strong><small>Informe data, horário e tamanho do grupo.</small>
              </a>
              <a href="/eventos#orcamento">
                <span>02</span><strong>Evento</strong><small>Compartilhe o formato do encontro e os convidados.</small>
              </a>
            </div>
            <a className="button button-wine" href="/contato#mensagem">
              Falar com a casa
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
