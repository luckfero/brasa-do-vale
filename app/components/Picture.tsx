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
 * aponta para o arquivo original como último recurso.
 */
const WIDTHS = [480, 800, 1200, 1600] as const;

/** "/images/hero-churrasco.png" → "hero-churrasco" */
function baseName(src: string): string {
  return src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
}

function srcSet(name: string, format: "avif" | "webp", maxWidth: number): string {
  return WIDTHS.filter((w) => w <= maxWidth)
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
      <source type="image/avif" srcSet={srcSet(name, "avif", width)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, "webp", width)} sizes={sizes} />
      <img
        src={src}
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
