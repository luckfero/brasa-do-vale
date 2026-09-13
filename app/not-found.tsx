import PageHero from "./components/PageHero";

/* Página de endereço que não existe.
 *
 * Antes daqui, quem digitava errado recebia nove bytes de texto puro:
 * `Not Found`, sem folha de estilo, sem cabeçalho, sem caminho de volta. O
 * código HTTP já estava certo (regra 9.3), o que faltava era a página.
 *
 * O vinext **não aplica `metadata` nem `generateMetadata` deste arquivo**
 * (regra 9.3), então o título e o `robots` desta resposta são os do layout:
 * uma `<title>` só, e o `noindex` que já vale no site inteiro. Escrever as
 * tags à mão no JSX seria pior, porque as do layout continuam lá e o
 * navegador usa a primeira (regra 9.2). Conferido contando as tags na head.
 */

const ATALHOS: readonly [string, string, string][] = [
  ["Cardápio", "/cardapio", "Os cortes, os acompanhamentos e as sobremesas da casa."],
  ["Rodízio", "/rodizio", "Como funciona o rodízio, do primeiro corte ao cafezinho."],
  ["Eventos", "/eventos", "O salão reservado para aniversário, confraternização e reunião."],
  ["Nossa história", "/nossa-historia", "De onde vem a casa e quem cuida da brasa todo dia."],
  ["Contato", "/contato", "Endereço, horário e o formulário para falar com a gente."],
];

export default function NotFound() {
  return (
    <main id="conteudo-principal">
      <PageHero
        eyebrow="Página não encontrada"
        title="Este endereço saiu do cardápio."
        description="O caminho que você abriu não existe por aqui. Pode ter sido um caractere a mais na digitação, ou um link antigo que ficou para trás. A casa segue no mesmo lugar."
        image="meat"
        action={{ href: "/", label: "Voltar para o início" }}
      />
      <section className="section section-cream">
        <div className="container narrow-container">
          <div className="section-heading">
            <p className="eyebrow">Por onde seguir</p>
            <h2>Talvez fosse uma destas.</h2>
          </div>
          <ul className="rota-perdida">
            {ATALHOS.map(([nome, href, resumo]) => (
              <li key={href}>
                <a href={href}>
                  <strong>{nome}</strong>
                  <span>{resumo}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
