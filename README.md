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
