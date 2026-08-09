import type { MetadataRoute } from "next";

/**
 * Sem este arquivo, quem pedia /robots.txt recebia o padrão da Cloudflare:
 * um texto em inglês sobre sinais de conteúdo e a diretiva europeia de
 * copyright, só com comentários e nenhuma regra de verdade.
 *
 * O site inteiro está em `noindex` porque é projeto conceitual — restaurante,
 * endereço e telefone são fictícios. E é justamente por isso que aqui a
 * varredura é **liberada**: o buscador precisa conseguir baixar a página para
 * ler o `noindex`. Com `Disallow: /` ele nunca leria a tag e ainda poderia
 * listar o endereço sozinho, a partir de um link de fora — o oposto do que
 * se quer.
 *
 * Nenhum sitemap, pela mesma razão: não há nada aqui para entrar em índice.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
