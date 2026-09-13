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
 *   HSTS           só HTTPS neste domínio, pelo prazo indicado.
 */
const cabecalhosDeSeguranca: Record<string, string> = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /* Um ano. Começou em um dia, em 2026-08-10, de propósito: quem memoriza
     esta ordem é o navegador do visitante, não o servidor, e parar de enviar
     o cabeçalho **não** apaga a memória de quem já recebeu. O prazo curto era
     rede de segurança enquanto o redirecionamento não estava comprovado.

     Subiu para um ano em 2026-08-17, depois de uma semana no ar e de 20 em 20
     amostras dos quatro sites respondendo 301 em HTTP puro e 200 em HTTPS.

     Sem `includeSubDomains` e sem `preload`, e as duas ausências são decisão.
     O primeiro estenderia a regra a todo subdomínio abaixo deste host,
     inclusive os que ainda não existem. O segundo é irreversível na prática:
     sai de uma lista embutida no navegador, não de um cabeçalho que a gente
     controla, e voltar atrás leva meses. */
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  /* CSP em modo de observação, não valendo ainda.
     `Report-Only` não bloqueia nada: o navegador só escreve no console o que
     a política teria barrado. Entra assim de propósito, porque a política
     valendo é capaz de apagar coisa da tela e isso precisa de prova antes,
     não depois. Dois pontos exigem conferência de olho no console das nove
     rotas antes de trocar o nome do cabeçalho para `Content-Security-Policy`:

       script-src 'unsafe-inline'  o HTML servido traz blocos <script> em
                                   linha do vinext e o de layout.tsx:76, que
                                   põe a classe `tem-js` antes da primeira
                                   pintura. Sem isso a barra de rolagem
                                   própria e a hidratação quebram.
       frame-src www.google.com    /contato embute o mapa do Google. Com
                                   `default-src 'self'` sozinho o mapa some.

     Quando o console vier limpo nas nove rotas, é só renomear o cabeçalho.

     `static.cloudflareinsights.com` em `script-src` e `cloudflareinsights.com`
     em `connect-src` são a analítica da própria borda que hospeda o site.
     Medido em 09/09/2026: a Cloudflare injeta
     `<script src="https://static.cloudflareinsights.com/beacon.min.js/...">`
     em toda resposta HTML, e esse script depois chama a origem de coleta.
     Nada disso passa pelo repositório, então não aparece em auditoria de
     código, e só aparece na resposta quando se pede a página com
     `accept: text/html` (curl seco não vê). Sem estas duas entradas, a
     política valendo derruba a analítica em silêncio: nenhum aviso, nenhum
     número. `connect-src` precisou ser escrito por extenso porque antes ele
     herdava `default-src 'self'`. */
  "Content-Security-Policy-Report-Only":
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " +
    "connect-src 'self' https://cloudflareinsights.com; " +
    "frame-src https://www.google.com; " +
    "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};

/**
 * Descobre se a requisição chegou sem criptografia.
 *
 * Duas fontes porque errar aqui derruba o site: dizer "é http" numa
 * requisição que já é HTTPS faz o worker redirecionar para um endereço que
 * ele vai julgar http de novo — laço infinito, site fora do ar. Só devolve
 * `true` quando as duas fontes disponíveis concordam.
 *
 * `CF-Visitor` é o que a borda da Cloudflare escreve com o esquema original,
 * e é a fonte confiável quando existe. Sem ele, sobra o próprio endereço.
 *
 * `localhost` fica **de fora**, e não é detalhe: o desenvolvimento roda em
 * `http://localhost:5173` e os testes chamam o worker com `http://localhost`.
 * Sem esta saída, todo `npm run dev` viraria um redirecionamento para um
 * HTTPS que não existe na máquina. Foram os testes que pegaram isso.
 */
const HOSTS_LOCAIS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function chegouSemCriptografia(request: Request, url: URL): boolean {
  if (HOSTS_LOCAIS.has(url.hostname) || url.hostname.endsWith(".local")) return false;

  const visitor = request.headers.get("CF-Visitor");
  if (visitor) {
    try {
      return JSON.parse(visitor).scheme === "http";
    } catch {
      /* Cabeçalho ilegível: cai para o endereço, abaixo. */
    }
  }
  return url.protocol === "http:";
}

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

/* Arquivos de configuração da Cloudflare que não são página: sem esta lista,
   `/_headers` cai no renderizador e responde 200 com corpo vazio e sem
   Content-Type, o que é resposta incoerente que scanner marca e cache guarda.
   Medido em produção em 09/09/2026: 200, zero byte, sem tipo. A Varanda já
   fechava o caso idêntico; aqui faltava. */
const CAMINHOS_DE_CONFIGURACAO = new Set(["/_headers", "/_redirects", "/.assetsignore"]);

const worker: WorkerHandler = {
  async fetch(request, env, ctx) {
    /* Antes de qualquer coisa: HTTP puro não entrega página.
       Sem isto o site respondia 200 em texto aberto — HTML inteiro numa
       conexão que qualquer um na mesma rede lê e altera. O HSTS acima só
       protege da segunda visita em diante; esta é a primeira. */
    const url = new URL(request.url);
    if (chegouSemCriptografia(request, url)) {
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: { Location: url.toString(), "Strict-Transport-Security": "max-age=31536000" },
      });
    }

    if (CAMINHOS_DE_CONFIGURACAO.has(url.pathname)) {
      return comSeguranca(
        new Response("Not Found", {
          status: 404,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        }),
      );
    }

    return comSeguranca(await upstream.fetch(request, env, ctx));
  },
};

export default worker;
