export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="wordmark-main">Brasa do Vale</span>
          <span className="wordmark-sub">Churrascaria</span>
          <p>Tradição brasileira, cortes na brasa e hospitalidade no coração do ABC.</p>
        </div>
        <div>
          <h2>Visite</h2>
          <p>São Bernardo do Campo, SP</p>
          <p>Terça a domingo</p>
          <p className="footer-muted">Consulte a programação da casa antes da visita.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            <li><a href="/cardapio">Cardápio</a></li>
            <li><a href="/eventos">Eventos</a></li>
            <li><a href="/galeria">Galeria</a></li>
            <li><a href="/faq">Perguntas frequentes</a></li>
          </ul>
        </div>
        <div>
          <h2>Fale com a casa</h2>
          <p>Reservas, eventos e dúvidas sobre a experiência.</p>
          <a className="text-link text-link-light" href="/contato#mensagem">Enviar uma solicitação</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Brasa do Vale Churrascaria</p>
        <a href="/politica-de-privacidade">Política de privacidade</a>
      </div>
    </footer>
  );
}
