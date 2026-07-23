"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealSelectors = [
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
];

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export default function SiteEnhancements() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      root.style.scrollBehavior = "auto";
      restoreScrollBehavior = () => {
        root.style.scrollBehavior = previousScrollBehavior;
        restoreScrollBehavior = undefined;
      };
      window.history.pushState(null, "", hash);

      if (reducedMotion) {
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
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return;

      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target, destination.hash);
    };

    document.addEventListener("click", handleAnchorClick);

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelectors.join(",")),
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    });

    document.body.classList.add("reveal-enabled");

    let observer: IntersectionObserver | undefined;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8%" },
      );
      revealItems.forEach((item) => observer?.observe(item));
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.cancelAnimationFrame(animationFrame);
      restoreScrollBehavior?.();
      observer?.disconnect();
      revealItems.forEach((item) => {
        item.classList.remove("reveal-item", "is-visible");
        item.style.removeProperty("--reveal-delay");
      });
    };
  }, [pathname]);

  return null;
}
