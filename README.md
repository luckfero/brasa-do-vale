# Brasa do Vale Churrascaria

Site institucional responsivo da Brasa do Vale, com apresentação do rodízio,
cardápio, história, eventos, galeria, perguntas frequentes e formulários de
contato. O projeto utiliza React, Next.js, Vite e Vinext e está preparado para
publicação no Cloudflare Workers.

## Requisitos

- Node.js 22.13.0 ou superior
- npm

## Desenvolvimento local

```bash
npm ci
npm run dev
```

## Validação

```bash
npm run lint
npm test
```

### Antes de publicar

```bash
npm audit --omit=dev
```

Precisa voltar zero. O `.npmrc` desta pasta tem `audit=false`, então o `npm ci`
e o `npm install` não avisam sozinhos: quem lembra é este parágrafo. Em
2026-09-08 o comando voltou 3 (1 crítica em `next`, 1 alta em `sharp`, 1
moderada em `baseline-browser-mapping`), com correção disponível sem salto de
versão maior. Atualizar dependência exige rodar `npm test` depois, que inclui o
build, e conferir que o HTML e o CSS gerados não mudaram.

Em 2026-09-09 o `sharp` foi pregado em `0.35.4` (era `^0.35.3`, a única faixa
aberta do arquivo) e o alta saiu: o comando passou a voltar **2**. O `npm ci`
e o `npm run build` foram rodados depois, com os sete testes passando e o CSS
gerado conferido byte a byte contra o publicado. Ficaram duas atualizações
para uma rodada própria, porque mexem em quem entra no pacote do worker ou
decide o alvo de navegador do build:

- **`next`**, em salto de correção, não de versão maior. Subir, rodar
  `npm test` e comparar o HTML gerado antes de publicar.
- **`baseline-browser-mapping`**, que entra por baixo do `browserslist`.
  Mexer ali pode mudar o CSS gerado: só com comparação de folha antes e
  depois.

## Publicação automática na Cloudflare

No painel **Workers & Pages**, importe este repositório e configure:

- branch de produção: `main`
- comando de build: `npm run build`
- comando de deploy: `npm run deploy:cloudflare`
- comando para branches de preview: `npm run preview:cloudflare`
- diretório raiz: deixar em branco

O build gera o Worker em `dist/server` e os arquivos públicos em `dist/client`.
Os comandos de publicação utilizam automaticamente a configuração gerada em
`dist/server/wrangler.json`.

## Publicação manual

Depois de autenticar o Wrangler na conta Cloudflare:

```bash
npm run publish:cloudflare
```

## Estrutura

- `app/`: páginas, componentes, conteúdo e estilos
- `public/`: imagens e ícones
- `worker/`: entrada do Cloudflare Worker
- `tests/`: verificações automatizadas das páginas

## Rotas

- `/`: página inicial
- `/rodizio`: experiência do rodízio
- `/cardapio`: cardápio e buffet
- `/eventos`: eventos e confraternizações
- `/contato`: contato, seleção de assunto e localização demonstrativa
- `/galeria`: galeria de ambientes e pratos
- `/nossa-historia`: história da casa
- `/faq`: perguntas frequentes
- `/politica-de-privacidade`: política de privacidade
