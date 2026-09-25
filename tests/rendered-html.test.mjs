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

test("endereço que não existe responde 404 com a página do site", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-404`);
  const { default: worker } = await import(workerUrl.href);

  const pedir = (rota) =>
    worker.fetch(
      new Request(`http://localhost${rota}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

  for (const rota of ["/nao-existe", "/reservas", "/cardapio/xx", "/faq/algo/aqui"]) {
    const response = await pedir(rota);
    /* Código certo: 200 com cara de erro seria soft 404, e o buscador
       indexaria endereço que não existe (regra 9.3). */
    assert.equal(response.status, 404, rota);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, rota);

    const html = await response.text();
    /* Antes desta página, a resposta eram nove bytes de texto puro. */
    assert.ok(html.length > 5000, `${rota} devolveu ${html.length} bytes`);

    /* A cara do site: cabeçalho, rodapé, atalho de acessibilidade, folha de
       estilo e um h1 só. */
    assert.match(html, /class="site-header/, rota);
    assert.match(html, /class="site-footer/, rota);
    assert.match(html, /class="skip-link"/, rota);
    assert.match(html, /<html[^>]*\blang=["']pt-BR["']/i, rota);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${rota} tem mais de um h1`);
    assert.match(html, /Este endereço saiu do cardápio/, rota);

    /* Metadado se confere recortando a head e CONTANDO (regra 9.2): duas
       `<title>` fazem o navegador usar a primeira, que seria a errada. */
    const head = html.slice(0, html.indexOf("</head>"));
    assert.match(head, /<link[^>]*rel="stylesheet"/, `${rota} sem folha de estilo`);
    assert.equal((head.match(/<title[ >]/g) ?? []).length, 1, `${rota} não tem exatamente uma title`);

    /* O vinext emite um `robots: noindex` próprio na resposta de not-found e
       o layout emite o dele: são duas tags, e as duas precisam dizer
       noindex. Repetir a mesma diretiva é inofensivo (o robô combina as
       duas); o que não pode é uma delas liberar o índice. */
    const robots = [...head.matchAll(/<meta[^>]*name="robots"[^>]*>/g)].map((m) => m[0]);
    assert.ok(robots.length >= 1, `${rota} sem meta robots`);
    for (const tag of robots) assert.match(tag, /noindex/i, `${rota}: ${tag}`);
  }
});

const CABECALHOS_ESPERADOS = {
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000",
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

test("a galeria não põe o PNG de origem no HTML de quem visita", async () => {
  const { stat } = await import("node:fs/promises");
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-gal`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/galeria", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();

  /* Os três PNG de origem somam 6,7 MB. Como fallback do `<picture>` o nome
     deles ia no `src` de todo visitante, e quem não tem AVIF nem WebP
     baixava 2 MB por foto. O último recurso agora é um JPEG progressivo na
     largura nativa. O PNG continua no repositório: é dele que as variantes
     são regeradas. */
  assert.equal((html.match(/\.png/g) ?? []).length, 0, "PNG de origem citado no HTML");

  const fallbacks = [...html.matchAll(/<img[^>]*src="([^"]*-fallback\.jpg)"/g)].map((m) => m[1]);
  assert.equal(fallbacks.length, 3, `esperava 3 fallbacks, achei ${fallbacks.length}`);

  for (const caminho of fallbacks) {
    const arquivo = new URL(`../public${caminho}`, import.meta.url);
    const { size } = await stat(arquivo);
    assert.ok(size > 0, `${caminho} tem zero byte`);
    assert.ok(size < 600_000, `${caminho} tem ${size} bytes, grande demais para fallback`);
  }
});

test("a CSP libera o beacon de analítica da própria borda", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-csp`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  /* A Cloudflare injeta o beacon em toda resposta HTML, fora do repositório.
     Sem estas duas entradas, a política valendo mata a analítica em
     silêncio. Medido em produção em 09/09/2026. */
  const politica = response.headers.get("content-security-policy") ?? "";
  assert.match(politica, /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(politica, /connect-src[^;]*https:\/\/cloudflareinsights\.com/);

  /* A política vale desde 25/09/2026, depois de conferida em Chromium e
     WebKit. O Report-Only não pode sobrar ao lado dela: não protege nada a
     mais, e o Safari acusa erro no console de toda página por ele não ter
     destino de relatório. */
  assert.equal(response.headers.get("content-security-policy-report-only"), null);
});

test("a folha não esconde a barra de rolagem nativa sem ter outra no lugar", async () => {
  const { readFile } = await import("node:fs/promises");
  const globais = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  /* Regra 9.25: quem esconde a nativa é a classe `tem-js`, e só em ponteiro
     fino, e isso mora em barra-rolagem.css. Escondendo aqui, sem condição,
     quem abre o site sem JavaScript, ou no celular, fica sem barra nenhuma. */
  assert.doesNotMatch(globais, /scrollbar-width\s*:/, "globals.css voltou a mexer na barra nativa");
  assert.doesNotMatch(globais, /::-webkit-scrollbar/, "globals.css voltou a mexer na barra nativa");

  const barra = await readFile(new URL("../app/barra-rolagem.css", import.meta.url), "utf8");
  assert.match(barra, /html\.tem-js\s*\{[^}]*scrollbar-width:\s*none/);
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
