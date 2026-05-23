# Build e produção Next.js standalone — Fly.io / Docker
# Fly/Railway injetam PORT em runtime; NEXT_PUBLIC_* devem existir no build (fly deploy --build-arg).

# --- deps + build ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build args (Fly: fly deploy --build-arg NEXT_PUBLIC_SITE_URL=https://...)
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_HERO_MODEL_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_PIX_PROVIDER
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_HERO_MODEL_URL=${NEXT_PUBLIC_HERO_MODEL_URL}
ENV NEXT_PUBLIC_META_PIXEL_ID=${NEXT_PUBLIC_META_PIXEL_ID}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_PIX_PROVIDER=${NEXT_PUBLIC_PIX_PROVIDER}

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

# Fly define PORT; default 3000 (deve coincidir com internal_port no fly.toml)
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
