# Copa 2026 Store

Loja temática para a Copa do Mundo FIFA 2026 — álbum oficial, caixinhas de figurinhas e
camisetas das seleções classificadas. MVP em Next.js + Tailwind, deploy em Fly.io.

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
    checkout/         # checkout (PIX Stripe opcional / cartão, frete grátis)
    pedido/sucesso/   # tela com QR Code PIX
  components/         # componentes reutilizáveis
  config/             # config da loja (PIX, social, e-mail)
  data/               # produtos e seleções (estático, edite à vontade)
  lib/                # carrinho, utils
```

## Personalizando a loja

Tudo o que muda no dia a dia está em arquivos simples:

- **Dados da loja** (PIX, redes sociais, e-mail): `src/config/store.ts`
- **Produtos e preços**: `src/data/produtos.ts`
- **Seleções e cores**: `src/data/selecoes.ts`
- **URL do modelo 3D do hero**: `NEXT_PUBLIC_HERO_MODEL_URL` no `.env.local`

### Hero 3D (modelo GLB)

- O hero usa `react-three-fiber` (`src/components/HeroAlbum3D.tsx`).
- Para usar 3D nativo estável, aponte `NEXT_PUBLIC_HERO_MODEL_URL` para um `.glb` direto.
- O repositório inclui `public/models/album-copa-2026.glb` (hero por padrão). Para outro arquivo:
  - `NEXT_PUBLIC_HERO_MODEL_URL=/models/seu-modelo.glb`
- Se o link não for GLB válido, o site cai automaticamente no viewer da Meshy como fallback.

## Fluxo de pedido

1. Cliente monta o carrinho (persistido em `localStorage`).
2. Em `/checkout` preenche dados e escolhe **PIX** (chave da loja ou **Stripe**, se configurado) ou **cartão**.
3. O pedido é enviado à API (`/api/pedidos`) e gravado em **SQLite** (`DATA_DIR/copa2026.db`).
4. Redirecionamento para `/pedido/sucesso?id=...` com QR/copia-e-cola (PIX), resumo do pedido e frete **grátis** anunciado no site.

> Stripe: webhook em `/api/stripe/webhook` para acompanhar confirmação de PIX onde aplicável.

## Deploy no Fly.io

O app usa **`output: "standalone"`** no Next.js, imagem **Docker** multi-stage (`Dockerfile`) e **`sharp`**. Produção: `node server.js` na porta **3000** (`internal_port` no `fly.toml` deve ser **3000**).

### Passo a passo

1. Instale o [flyctl](https://fly.io/docs/flyctl/install/) e faça login: `fly auth login`.
2. **Dois apps** (bancos SQLite **separados** — um volume por app):
   | App | Config | URL exemplo |
   |-----|--------|-------------|
   | `pst-gs1z4w` | `fly.toml` | https://pst-gs1z4w.fly.dev |
   | `pst2-rxovda` | `fly.pst2.toml` | https://pst2-rxovda.fly.dev |
3. **Volume** (uma vez por app, região `gru`):
   ```bash
   fly volumes create copa_data --size 1 --region gru -a pst-gs1z4w
   fly volumes create copa_data --size 1 --region gru -a pst2-rxovda
   ```
4. **Secrets** (runtime — **sem** `MONGODB_URI`):
   ```bash
   fly secrets set \
     ADMIN_PASSWORD="..." \
     ADMIN_PANEL_SECRET="..." \
     USER_SESSION_SECRET="..." \
     MERCADOPAGO_ACCESS_TOKEN="..." \
     -a pst-gs1z4w
   ```
   Repita para `-a pst2-rxovda` (mesmos ou outros valores).
5. **Deploy** (`DATA_DIR=/data` já está no `fly.toml`; volume monta em `/data`):
   ```bash
   ./scripts/deploy-fly-pst1.sh
   ./scripts/deploy-fly-pst2.sh
   ```
   Ou manualmente:
   ```bash
   fly deploy -a pst-gs1z4w --config fly.toml \
     --build-arg NEXT_PUBLIC_SITE_URL=https://pst-gs1z4w.fly.dev \
     --build-arg NEXT_PUBLIC_META_PIXEL_ID=2545916985811236

   fly deploy -a pst2-rxovda --config fly.pst2.toml \
     --build-arg NEXT_PUBLIC_SITE_URL=https://pst2-rxovda.fly.dev \
     --build-arg NEXT_PUBLIC_META_PIXEL_ID=2545916985811236
   ```
6. Domínio customizado: `fly certs add seudominio.com -a NOME_DO_APP` e redeploy com `NEXT_PUBLIC_SITE_URL` correto.
7. Webhooks MP/Stripe: URL de **cada** domínio → `/api/mercadopago/webhook` e `/api/stripe/webhook`.
8. **Backup** ocasional do SQLite:
   ```bash
   fly ssh console -a pst-gs1z4w -C "cat /data/copa2026.db" > backup-pst1-$(date +%F).db
   ```

Consulte todas as variáveis em [`.env.example`](.env.example).

### Falha comum: porta

Se os logs mostram `listening on 0.0.0.0:8080` mas o Next sobe em **3000**, ajuste `internal_port = 3000` em `fly.toml` e rode `fly deploy` de novo.

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

- Logs: `fly logs -a pst-gs1z4w`
- Com `min_machines_running = 0`, a máquina **para quando ociosa** (cold start na primeira visita).
- VM recomendada: **1 GB** RAM (`[[vm]]` no `fly.toml`).
- Garanta **`package-lock.json`** commitado junto ao `package.json`.

## Roadmap pós-MVP

- Banco de dados (Postgres + Prisma) e painel admin
- Gateway PIX automático com webhook (Mercado Pago / Asaas)
- Cálculo de frete via API (Frenet / Melhor Envio)
- Conta de cliente + álbum digital interativo
- Sistema de troca de figurinhas entre usuários
- Personalização de camisetas (nome/número)
- Blog/conteúdo para SEO
