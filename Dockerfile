# Standalone Dockerfile for the apps/web Next.js storefront.
# This GitHub repo is rooted at apps/web (no monorepo root / packages/shared),
# and apps/web has no @texno/shared dependency, so it builds on its own.

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Railway (and most PaaS) inject PORT at runtime; fall back to 3001 locally.
ENV PORT=3001
EXPOSE 3001
CMD ["sh", "-c", "node_modules/.bin/next start -p ${PORT:-3001} -H 0.0.0.0"]
