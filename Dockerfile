# Build e produção Next.js standalone — otimizado para Railway (Docker)
# Railway injeta PORT em tempo de execução; NEXT_PUBLIC_* vêm das variáveis do projeto no build.

# --- deps + build ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Railway envia variáveis do serviço como build args; exportamos pra `next build` ler.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_HERO_MODEL_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_HERO_MODEL_URL=${NEXT_PUBLIC_HERO_MODEL_URL}

RUN npm run build

# --- produção ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat dumb-init

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Railway define PORT; mantém default local
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
