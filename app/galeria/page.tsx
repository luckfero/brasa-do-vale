import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import Picture from "../components/Picture";

export const metadata: Metadata = { alternates: { canonical: "/galeria" }, title: "Galeria", description: "Conheça os sabores e ambientes que compõem a experiência da Brasa do Vale." };

/* Largura e altura são as do cabeçalho IHDR de cada PNG, lidas do arquivo em
   2026-09-08 e não estimadas: antes estavam 1600x1000 e 1456x1088, que não
   correspondem a nenhum dos três. Aqui elas não pintam nada, porque
   `.gallery-grid img` declara `aspect-ratio` no CSS (4/3, e 2/1 na primeira
   foto em tela larga), e proporção declarada em CSS vence a que vem do
   atributo. Conferido no site publicado: as caixas medem exatamente 2,0000 e
   1,3333, não 1,6 nem 1,3382. O valor certo fica valendo para o dia em que
   esse `aspect-ratio` sair da folha. */
const gallery = [
  { image: "/images/hero-churrasco.png", width: 1584, height: 990, title: "A brasa como protagonista", text: "O tempo do fogo realça cada corte e marca a identidade da casa." },
  { image: "/images/buffet-ilustrativo.png", width: 1448, height: 1086, title: "Variedade à mesa", text: "Acompanhamentos, saladas e pratos quentes completam a experiência." },
  { image: "/images/sala-eventos-ilustrativa.png", width: 1448, height: 1086, title: "Encontros reservados", text: "Um ambiente preparado para celebrar e reunir com conforto." },
];

export default function GalleryPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Galeria" title="Sabores e ambientes que convidam a ficar." description="Conheça alguns dos detalhes que compõem a experiência da Brasa do Vale, da brasa ao salão reservado." image="buffet" />
      <section className="section section-cream"><div className="container"><div className="gallery-grid">
        {gallery.map((item) => <figure key={item.title}><Picture src={item.image} width={item.width} height={item.height} sizes="(max-width: 720px) 100vw, 50vw" alt={item.text} /><figcaption><span>Brasa do Vale</span><h2>{item.title}</h2><p>{item.text}</p></figcaption></figure>)}
      </div><div className="demo-disclosure gallery-note"><strong>Feito para compartilhar</strong><p>Uma boa experiência também vive nos detalhes: o ponto da carne, a variedade do buffet e o ambiente preparado para receber.</p></div></div></section>
    </main>
  );
}
