# Standalone Dockerfile for the apps/web Next.js storefront.
# This GitHub repo is rooted at apps/web (no monorepo root / packages/shared),
# and apps/web has no @texno/shared dependency, so it builds on its own.

FROM node:20-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* values are inlined into the bundle at build time, so they must be
# present during `npm run build`. Railway passes service variables as build args
# when declared here. Leave unset to default to http://localhost:3000 (lib/api.ts).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

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
