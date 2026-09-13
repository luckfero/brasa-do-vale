/* Gerado por scripts/optimize-images.mjs. Não editar à mão.
 * Larguras que existem de fato para cada imagem em public/images/r/. */
export const imageWidths: Record<string, number[]> = {
  "buffet-ilustrativo": [480, 800, 1200, 1448],
  "hero-churrasco": [480, 800, 1200, 1584],
  "hero-contato": [480, 800, 1200, 1586],
  "hero-historia": [480, 800, 1200, 1568],
  "hero-rodizio": [480, 800, 1200, 1586],
  "sala-eventos-ilustrativa": [480, 800, 1200, 1448],
};

/* Último recurso do <picture>: o que um navegador sem AVIF e sem WebP
 * baixa. Só existe para origem em PNG, que é pesada demais para entrar
 * no HTML. Origem sem entrada aqui cai no arquivo original. */
export const imageFallbacks: Record<string, string> = {
  "buffet-ilustrativo": "/images/r/buffet-ilustrativo-fallback.jpg",
  "hero-churrasco": "/images/r/hero-churrasco-fallback.jpg",
  "sala-eventos-ilustrativa": "/images/r/sala-eventos-ilustrativa-fallback.jpg",
};
