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
