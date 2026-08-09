/** Ponto de entrada do Worker da Brasa do Vale. */
import handler from "vinext/server/app-router-entry";

interface WorkerHandler {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>;
}

/**
 * Cabeçalhos de segurança, aplicados a toda resposta.
 *
 * Nenhum muda o que a página faz — todos fecham porta que o site não usa:
 *   nosniff        impede o navegador de adivinhar o tipo de um arquivo e
 *                  executar como script algo servido como texto ou imagem.
 *   DENY           o site não pode ser embutido em iframe de terceiro, que é
 *                  como se monta clickjacking.
 *   Referrer       ao sair para outro domínio vai só a origem, nunca o
 *                  caminho completo que a pessoa estava visitando.
 *   Permissions    câmera, microfone e localização desligados. O site não
 *                  pede nada disso; sem o cabeçalho, um script injetado
 *                  poderia pedir.
 *   COOP           isola a janela de quem a abriu, cortando acesso cruzado.
 */
const cabecalhosDeSeguranca: Record<string, string> = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function comSeguranca(response: Response): Response {
  /* Passar o corpo adiante sem ler preserva o streaming da renderização. */
  const saida = new Response(response.body, response);
  for (const [nome, valor] of Object.entries(cabecalhosDeSeguranca)) {
    saida.headers.set(nome, valor);
  }
  return saida;
}

/* O endpoint `/_vinext/image` foi removido daqui.
 *
 * Ele dependia da ligação `IMAGES` do Cloudflare, que nunca foi declarada em
 * wrangler.jsonc — toda chamada lançava exceção e o Worker respondia 500
 * (erro 1101). Era o que deixava as três fotos da galeria quebradas em
 * produção. As fotos agora vêm de `<picture>` apontando direto para as
 * variantes de public/images/r/, sem otimizador em tempo de execução, então
 * nada mais usa esse caminho.
 */

const upstream = handler as unknown as WorkerHandler;

const worker: WorkerHandler = {
  async fetch(request, env, ctx) {
    return comSeguranca(await upstream.fetch(request, env, ctx));
  },
};

export default worker;
