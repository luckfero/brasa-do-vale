"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Revelação por rolagem.
 *
 * A regra que organiza tudo aqui: **animação nunca pode custar conteúdo**.
 * O CSS só esconde depois que a classe de trava entra, e ela só entra
 * quando já se sabe que dá para revelar de volta. Três proteções, nessa
 * ordem:
 *
 *  1. Sem `IntersectionObserver`, a trava nunca é aplicada — a página fica
 *     visível e estática.
 *  2. Sem JavaScript, o efeito não roda e a trava também não entra.
 *  3. Se o observer não responder em 1 segundo, tudo é revelado e ele é
 *     descartado. Um observer saudável responde quase de imediato;
 *     silêncio significa ambiente que não entrega esses eventos — aba que
 *     nunca pintou, webview embutida, pré-renderização.
 *
 * A terceira era o que faltava aqui: sem ela, um observer mudo deixava a
 * página em branco para sempre. Não é hipótese — foi observado em teste.
 */

/**
 * Quais elementos animam.
 *
 * A lista vive no JavaScript porque a marcação do site não tem atributo
 * próprio para isso. É frágil por natureza: renomear uma classe no CSS tira
 * o elemento da animação em silêncio, e cada seção nova precisa ser
 * lembrada aqui. O efeito de esquecer é discreto — o bloco simplesmente
 * aparece sem transição — mas se um dia a marcação for tocada a fundo, o
 * caminho melhor é um `data-reveal` no JSX, como fazem os outros sites.
 */
const SELETORES = [
  ".quick-facts-grid > div",
  ".section-heading > *",
  ".experience-card",
  ".story-grid > *",
  ".callout-grid > *",
  ".events-feature > *",
  ".visit-panel > *",
  ".visit-options > *",
  ".content-intro > *",
  ".menu-sections article",
  ".image-text-section > *",
  ".journey-grid article",
  ".two-column-copy > *",
  ".events-overview > *",
  ".form-heading > *",
  ".demo-form .form-grid",
  ".demo-form .form-footer",
  ".story-long-grid > *",
  ".timeline article",
  ".timeline-heading > *",
  ".legacy-intro > *",
  ".legacy-values > div",
  ".gallery-grid figure",
  ".gallery-note",
  ".faq-layout > *",
  ".contact-grid > *",
  ".map-heading > *",
  ".map-frame",
  ".legal-content > *",
  ".footer-grid > *",
].join(",");

const CLASSE_ITEM = "reveal-item";
const CLASSE_TRAVA = "reveal-enabled";
const CLASSE_VISIVEL = "is-visible";

/** Tempo até desistir do observer e mostrar tudo. */
const LIMITE_MS = 1000;

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(SELETORES));
    if (alvos.length === 0) return;

    alvos.forEach((el, i) => {
      el.classList.add(CLASSE_ITEM);
      /* Três degraus e repete: a diagonal aparece dentro de cada linha da
         grade sem que o fim da página acumule um atraso longo. */
      el.style.setProperty("--reveal-delay", `${(i % 3) * 90}ms`);
    });

    const limpar = () => {
      document.body.classList.remove(CLASSE_TRAVA);
      alvos.forEach((el) => {
        el.classList.remove(CLASSE_ITEM, CLASSE_VISIVEL);
        el.style.removeProperty("--reveal-delay");
      });
    };

    const mostrarTudo = () => alvos.forEach((el) => el.classList.add(CLASSE_VISIVEL));
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Sem suporte não há como revelar de volta: melhor nunca esconder. */
    if (movimentoReduzido || typeof IntersectionObserver === "undefined") {
      mostrarTudo();
      return limpar;
    }

    document.body.classList.add(CLASSE_TRAVA);

    let respondeu = false;
    const observer = new IntersectionObserver(
      (entries) => {
        respondeu = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(CLASSE_VISIVEL);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    alvos.forEach((el) => observer.observe(el));

    const rede = window.setTimeout(() => {
      if (respondeu) return;
      mostrarTudo();
      observer.disconnect();
    }, LIMITE_MS);

    return () => {
      window.clearTimeout(rede);
      observer.disconnect();
      limpar();
    };
  }, [pathname]);

  return null;
}
