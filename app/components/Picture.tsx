/**
 * Imagem responsiva servida direto das variantes de public/images/r/.
 *
 * Substitui o `next/image` nas fotos: no Cloudflare o endpoint
 * `/_vinext/image` respondia 500 (erro 1101), então toda foto da galeria
 * chegava quebrada. Aqui o navegador escolhe o formato e a largura sozinho,
 * sem passar por otimizador em tempo de execução.
 *
 * A ordem dentro de `<picture>` importa: o primeiro `<source>` que o
 * navegador entende vence, então AVIF vem antes de WebP, e o `<img>` final
 * é o último recurso, para quem não entende nenhum dos dois.
 *
 * Esse último recurso era o PNG de origem: os três da galeria somam 6,7 MB e
 * o nome deles ia no `src` do HTML de todo visitante. PNG de foto não é
 * fallback, é peso morto. Agora o `<img>` aponta para um JPEG progressivo na
 * largura nativa da foto (`-fallback.jpg`), gerado junto com as variantes.
 * Quem cai nele baixa 140 a 195 KB em vez de 2 MB, com as mesmas medidas em
 * pixel, então nada se mexe na página. O PNG continua no repositório porque
 * é dele que as variantes são regeradas.
 */
/* Quais larguras foram realmente geradas para cada imagem. Uma foto menor
   que uma largura alvo não é ampliada, então nem toda imagem tem as
   quatro — citar no `srcset` um arquivo inexistente faz o navegador
   escolher justamente o que vai dar 404. */
import { imageFallbacks, imageWidths } from "../image-manifest";

/** "/images/hero-churrasco.png" → "hero-churrasco" */
function baseName(src: string): string {
  return src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
}

function srcSet(name: string, format: "avif" | "webp"): string {
  return (imageWidths[name] ?? [])
    .map((w) => `/images/r/${name}-${w}.${format} ${w}w`)
    .join(", ");
}

type PictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function Picture({ src, alt, width, height, sizes, className, priority = false }: PictureProps) {
  const name = baseName(src);
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, "webp")} sizes={sizes} />
      <img
        src={imageFallbacks[name] ?? src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
