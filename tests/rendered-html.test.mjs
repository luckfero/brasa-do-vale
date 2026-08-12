import assert from "node:assert/strict";
import test from "node:test";

const routes = [
  "/",
  "/rodizio",
  "/cardapio",
  "/eventos",
  "/galeria",
  "/nossa-historia",
  "/faq",
  "/contato",
  "/politica-de-privacidade",
];

test("renders every Brasa do Vale page in Brazilian Portuguese", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const route of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );

    assert.equal(response.status, 200, route);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
      route,
    );
    const html = await response.text();
    assert.match(html, /<html[^>]*\blang=["']pt-BR["']/i, route);
    assert.match(html, /Brasa do Vale Churrascaria/i, route);
    assert.doesNotMatch(html, /href=["'][^"']*\/reservas/i, route);
  }

  const removedReservationPage = await worker.fetch(
    new Request("http://localhost/reservas", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(removedReservationPage.status, 404);

  const contactResponse = await worker.fetch(
    new Request("http://localhost/contato", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const contactHtml = await contactResponse.text();
  assert.ok(contactHtml.indexOf('id="mapa"') < contactHtml.indexOf('id="mensagem"'));
  const contactCardsHtml = contactHtml.slice(
    contactHtml.indexOf('class="contact-cards"'),
    contactHtml.indexOf('class="location-card"'),
  );
  assert.doesNotMatch(contactCardsHtml, /<a\b/i);

  const homeResponse = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.doesNotMatch(await homeResponse.text(), /A casa cuida dos próximos passos/i);
});

const CABECALHOS_ESPERADOS = {
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=86400",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

test("toda resposta traz os cabeçalhos de segurança", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-cab`);
  const { default: worker } = await import(workerUrl.href);

  const pedir = (rota) =>
    worker.fetch(
      new Request(`http://localhost${rota}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

  /* Página normal, 404 e recurso que não é HTML. */
  for (const rota of ["/", "/cardapio", "/rota-que-nao-existe", "/robots.txt"]) {
    const response = await pedir(rota);
    for (const [nome, valor] of Object.entries(CABECALHOS_ESPERADOS)) {
      assert.equal(response.headers.get(nome), valor, `${nome} em ${rota}`);
    }
  }
});

test("HTTP puro não entrega página: redireciona para HTTPS", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-tls`);
  const { default: worker } = await import(workerUrl.href);

  const pedir = (endereco, cabecalhos = {}) =>
    worker.fetch(
      new Request(endereco, { headers: { accept: "text/html", ...cabecalhos } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

  /* Visitante em texto aberto: 301 para o mesmo caminho em HTTPS. */
  const aberto = await pedir("http://brasa-do-vale.exemplo/cardapio?x=1");
  assert.equal(aberto.status, 301);
  assert.equal(aberto.headers.get("location"), "https://brasa-do-vale.exemplo/cardapio?x=1");

  /* A borda da Cloudflare entrega o esquema original no CF-Visitor. Ele
     manda mais que o endereço: numa borda que já terminou o TLS, a URL
     chega como https mesmo quando o visitante veio de http. */
  const viaBorda = await pedir("https://brasa-do-vale.exemplo/", { "CF-Visitor": '{"scheme":"http"}' });
  assert.equal(viaBorda.status, 301, "CF-Visitor http deve redirecionar mesmo com URL https");

  /* E o contrário: quem já está em HTTPS **não** pode ser redirecionado,
     senão o destino vira http de novo e o site entra em laço infinito. */
  const seguro = await pedir("https://brasa-do-vale.exemplo/", { "CF-Visitor": '{"scheme":"https"}' });
  assert.notEqual(seguro.status, 301, "requisição já segura não pode redirecionar");

  /* localhost fica de fora: é onde rodam o dev e estes testes. */
  const local = await pedir("http://localhost/cardapio");
  assert.notEqual(local.status, 301, "localhost não pode redirecionar");
});

test("o robots.txt é o nosso, não o padrão da Cloudflare", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-rob`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/robots.txt"),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const txt = await response.text();

  assert.equal(response.status, 200);
  assert.match(txt, /User-Agent: \*/i);
  /* Varredura liberada de propósito: o buscador precisa baixar a página
     para ler o `noindex`. Um `Disallow: /` teria o efeito oposto. */
  assert.match(txt, /Allow: \//i);
  assert.doesNotMatch(txt, /Disallow: \//i);
  assert.doesNotMatch(txt, /content-signal|EUROPEAN UNION DIRECTIVE/i);
});

test("cada página declara um canonical absoluto e único", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-can`);
  const { default: worker } = await import(workerUrl.href);
  /* Domínio próprio desde 2026-08-10. O endereço `workers.dev` continua
     respondendo, mas o canonical precisa apontar para um só lugar, e é este. */
  const SITE = "https://brasa.varandaestudioweb.com";

  for (const rota of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${rota}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const head = (await response.text()).split("</head>")[0];
    const encontrados = [...head.matchAll(/rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);

    /* Duas tags de canonical fazem o buscador ignorar as duas. */
    assert.equal(encontrados.length, 1, `${rota} tem ${encontrados.length} canonical`);
    /* Relativo é ambíguo: o mesmo caminho existe em qualquer host, então
       não diz qual endereço é o oficial. */
    assert.equal(encontrados[0], `${SITE}${rota === "/" ? "/" : rota}`, rota);
  }
});

test("o HTML servido não esconde nada: a trava do reveal só entra pelo JS", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-rev`);
  const { default: worker } = await import(workerUrl.href);

  for (const rota of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${rota}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const html = await response.text();

    /* `reveal-enabled` é o que faz o CSS zerar a opacidade. Se viesse já no
       HTML, quem abrisse o site com o JavaScript bloqueado — ou antes de ele
       carregar — veria a página em branco. A classe tem que ser adicionada
       pelo componente, depois de confirmar que dá para revelar de volta. */
    assert.doesNotMatch(html, /class="[^"]*\breveal-enabled\b/, rota);
    assert.doesNotMatch(html, /class="[^"]*\breveal-item\b/, rota);
  }
});

test("todo SVG do projeto é XML válido", async () => {
  /* Um favicon com XML inválido não avisa: o navegador não faz o parse, não
     renderiza nada, e mantém o ícone anterior. Parece cache e não é.

     Aconteceu aqui: um comentário trazia o nome de uma variável CSS, e
     comentário XML **não pode conter dois hifens seguidos**. O arquivo foi
     publicado, o md5 do que o servidor entregava batia com o do repositório,
     e mesmo assim o ícone não aparecia. Comparar bytes prova que o arquivo
     chegou, não que ele é válido.

     `DOMParser` não existe no Node, então a validação é por regex sobre as
     armadilhas conhecidas de XML, mais uma checagem de tags balanceadas. */
  const { readdir, readFile } = await import("node:fs/promises");
  const dir = new URL("../public/", import.meta.url);

  async function svgsDe(caminho, prefixo = "") {
    const saida = [];
    for (const item of await readdir(caminho, { withFileTypes: true })) {
      const nome = prefixo + item.name;
      if (item.isDirectory()) saida.push(...await svgsDe(new URL(item.name + "/", caminho), nome + "/"));
      else if (item.name.endsWith(".svg")) saida.push([nome, new URL(item.name, caminho)]);
    }
    return saida;
  }

  const arquivos = await svgsDe(dir);
  assert.ok(arquivos.length > 0, "nenhum SVG encontrado em public/");

  for (const [nome, url] of arquivos) {
    const texto = await readFile(url, "utf8");

    for (const comentario of texto.matchAll(/<!--([\s\S]*?)-->/g)) {
      assert.doesNotMatch(
        comentario[1],
        /--/,
        `${nome}: comentário XML com dois hifens seguidos, o que invalida o arquivo inteiro`,
      );
    }

    /* Contar tags exige tirar os comentários antes: o `assinatura.svg` cita
       literalmente uma tag dentro de um aviso, e contá-la dava desequilíbrio
       onde o arquivo estava correto. Foi este teste que errou primeiro. */
    const semComentario = texto.replace(/<!--[\s\S]*?-->/g, "");

    const abre = (semComentario.match(/<(?!\/|!|\?)[a-zA-Z]/g) || []).length;
    const fecha = (semComentario.match(/<\//g) || []).length + (semComentario.match(/\/>/g) || []).length;
    assert.equal(abre, fecha, `${nome}: ${abre} tags abertas contra ${fecha} fechadas`);

    assert.match(semComentario, /<svg[\s>]/, `${nome}: não começa com <svg>`);
    assert.doesNotMatch(semComentario, /&(?!amp;|lt;|gt;|quot;|apos;|#)/, `${nome}: & sem escapar`);
  }
});
