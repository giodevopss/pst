# Build e produção Next.js standalone — Fly.io / Docker
# Fly/Railway injetam PORT em runtime; NEXT_PUBLIC_* devem existir no build (fly deploy --build-arg).

# --- deps + build ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

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
ENV DATA_DIR=/data

RUN apk add --no-cache libc6-compat dumb-init su-exec

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# better-sqlite3 (native) — não entra no bundle standalone sozinho
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bindings ./node_modules/bindings
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ENTRYPOINT ["dumb-init", "--", "docker-entrypoint.sh"]
CMD ["node", "server.js"]
