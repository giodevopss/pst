# Copa 2026 Store

Loja temática para a Copa do Mundo FIFA 2026 — álbum oficial, caixinhas de figurinhas e
camisetas das seleções classificadas. MVP em Next.js + Tailwind, deploy em Railway.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** com tema customizado festivo
- **Framer Motion** para animações
- **lucide-react** + SVGs inline para ícones
- **qrcode.react** para o QR Code de PIX
- Carrinho persistido em `localStorage` (sem banco de dados no MVP)

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

Ou use o script que abre o browser automaticamente:

```bash
npm run start:browser
```

## Estrutura

```
src/
  app/                # rotas (App Router)
    page.tsx          # Home
    album/            # página dedicada ao álbum
    camisetas/        # catálogo + páginas de camiseta
    produto/[slug]/   # página de produto genérica (álbum / kit / figurinhas)
    selecoes/         # grid de seleções
    sobre/            # institucional
    checkout/         # checkout que abre WhatsApp
    pedido/sucesso/   # tela com QR Code PIX
  components/         # componentes reutilizáveis
  config/             # config da loja (WhatsApp, PIX, social, e-mail)
  data/               # produtos e seleções (estático, edite à vontade)
  lib/                # carrinho, utils
```

## Personalizando a loja

Tudo o que muda no dia a dia está em arquivos simples:

- **Dados da loja** (WhatsApp, chave PIX, e-mail): `src/config/store.ts`
- **Produtos e preços**: `src/data/produtos.ts`
- **Seleções e cores**: `src/data/selecoes.ts`
- **URL do modelo 3D do hero**: `NEXT_PUBLIC_HERO_MODEL_URL` no `.env.local`

### Hero 3D (modelo GLB)

- O hero usa `react-three-fiber` (`src/components/HeroAlbum3D.tsx`).
- Para usar 3D nativo estável, aponte `NEXT_PUBLIC_HERO_MODEL_URL` para um `.glb` direto.
- Melhor opção: colocar o arquivo em `public/models/album-copa-2026.glb` e usar:
  - `NEXT_PUBLIC_HERO_MODEL_URL=/models/album-copa-2026.glb`
- Se o link não for GLB válido, o site cai automaticamente no viewer da Meshy como fallback.

## Fluxo de pedido

1. Cliente monta o carrinho (persistido em `localStorage`).
2. Em `/checkout` preenche dados e clica em "Pagar com PIX".
3. Abre o WhatsApp da loja já com a mensagem do pedido pronta.
4. Cliente é redirecionado para `/pedido/sucesso?id=...` com:
   - QR Code da chave PIX
   - Botão para copiar a chave
   - Botão para abrir o WhatsApp e enviar o comprovante
   - Resumo do pedido
5. Você confirma o pagamento manualmente e despacha.

> Próxima fase: substituir o fluxo manual por gateway PIX (Mercado Pago / Asaas / Pagar.me)
> com webhook para confirmação automática.

## Deploy no Railway

O app usa **`output: "standalone"`** no Next.js, imagem **Docker** multi-stage (`Dockerfile`) e **`sharp`** como dependência (otimização de imagens em Linux). O comando de produção é `node server.js` (Railway define `PORT` automaticamente).

### Passo a passo

1. Crie um serviço: <https://railway.com/new> → **Empty project** ou **Deploy from GitHub repo**.
2. Se for por GitHub, conecte o repositório e escolha a branch. O arquivo **`railway.json`** define builder **DOCKERFILE**.
3. Em **Variables** (mesmo antes do primeiro deploy bem-sucedido), configure pelo menos:
   - **`NEXT_PUBLIC_SITE_URL`** — URL canônica pública, ex.: `https://seudominio.up.railway.app` (sem barra final). Usada em `metadataBase`, `sitemap` e `robots`.
   - Opcional: **`NEXT_PUBLIC_HERO_MODEL_URL`** — `.glb` ou caminho sob `/public` (ex.: `/models/3dcopa.glb`).
4. **Networking → Generate Domain** (ou domínio customizado).
5. Faça um **Redeploy** após mudar qualquer `NEXT_PUBLIC_*`, pois são embutidas no bundle no **`next build`**.

Consulte modelo de variáveis em [`.env.example`](.env.example).

### Testar a imagem localmente

```bash
docker build -t copa2026:test .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  copa2026:test
```

Abra <http://localhost:3000>.

### Produção local (sem Docker)

Depois de `npm run build`, o standalone fica em `.next/standalone`:

```bash
cd .next/standalone
node server.js
```

(No monorepo, copie também `public` e `.next/static` como no `Dockerfile` — o uso normal é só via Docker.)

### Saúde e falhas comuns

- Healthcheck configurado para **`/`** em `railway.json` (`healthcheckTimeout` 120s para cold start).
- Se o deploy reiniciar em loop: veja logs de build (**Build Logs**) e garanta **`package-lock.json`** commitado junto ao `package.json`.
- Imagens CDN: garanta **`sharp`** instalado (`package.json`) — já incluído.

## Roadmap pós-MVP

- Banco de dados (Postgres + Prisma) e painel admin
- Gateway PIX automático com webhook (Mercado Pago / Asaas)
- Cálculo de frete via API (Frenet / Melhor Envio)
- Conta de cliente + álbum digital interativo
- Sistema de troca de figurinhas entre usuários
- Personalização de camisetas (nome/número)
- Blog/conteúdo para SEO
