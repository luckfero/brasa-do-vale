"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Rolagem suave até âncoras internas.
 *
 * A revelação por rolagem saiu daqui para components/Reveal.tsx — eram duas
 * responsabilidades sem relação no mesmo efeito, e a de reveal precisava de
 * uma rede de segurança que este arquivo não tinha.
 *
 * Por que não usar só `scroll-behavior: smooth` do CSS: o cabeçalho é fixo,
 * então o destino precisa ser deslocado pela altura dele, senão o título da
 * seção fica escondido atrás da barra. A duração também acompanha a
 * distância, para salto curto não parecer arrastado.
 */

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export default function SiteEnhancements() {
  const pathname = usePathname();

  useEffect(() => {
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let restoreScrollBehavior: (() => void) | undefined;

    const scrollToTarget = (target: HTMLElement, hash: string) => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const offset = (header?.offsetHeight ?? 0) + 18;
      const start = window.scrollY;
      const destination = Math.max(0, target.getBoundingClientRect().top + start - offset);
      const distance = destination - start;
      const duration = Math.min(1450, Math.max(900, Math.abs(distance) * 0.55));

      window.cancelAnimationFrame(animationFrame);
      restoreScrollBehavior?.();
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      /* O `scroll-behavior: smooth` do CSS brigaria com a animação daqui:
         são dois controladores mexendo na mesma posição. */
      root.style.scrollBehavior = "auto";
      restoreScrollBehavior = () => {
        root.style.scrollBehavior = previousScrollBehavior;
        restoreScrollBehavior = undefined;
      };
      window.history.pushState(null, "", hash);

      if (movimentoReduzido) {
        window.scrollTo({ top: destination });
        restoreScrollBehavior();
        return;
      }

      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        window.scrollTo({ top: start + distance * easeInOutCubic(progress) });
        if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
        else restoreScrollBehavior?.();
      };

      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      /* Só âncora da própria página: link para outra rota é navegação. */
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return;

      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target, destination.hash);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.cancelAnimationFrame(animationFrame);
      restoreScrollBehavior?.();
    };
  }, [pathname]);

  return null;
}
