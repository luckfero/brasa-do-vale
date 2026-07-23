"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  ["Início", "/"],
  ["Cardápio", "/cardapio"],
  ["Rodízio", "/rodizio"],
  ["Eventos", "/eventos"],
  ["Nossa história", "/nossa-historia"],
  ["Contato", "/contato"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* A navegação documental preserva transições entre páginas e evita dependência de JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="wordmark" href="/" aria-label="Brasa do Vale Churrascaria — início">
          <Image className="brand-mark" src="/logo-mark.svg" alt="" width={46} height={46} priority />
          <span className="wordmark-copy">
            <span className="wordmark-main">Brasa do Vale</span>
            <span className="wordmark-sub">Churrascaria</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          <span>{open ? "Fechar" : "Menu"}</span>
        </button>

        <nav id="main-navigation" className={open ? "main-nav is-open" : "main-nav"} aria-label="Navegação principal">
          <ul>
            {navigation.map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <a href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{label}</a>
                </li>
              );
            })}
          </ul>
          <a className="button button-gold header-cta" href="/contato?assunto=Reserva#mensagem" onClick={() => setOpen(false)}>
            Solicitar reserva
          </a>
        </nav>
      </div>
    </header>
  );
}
