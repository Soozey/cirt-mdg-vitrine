# ─── Stage 1 : Dependencies ─────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies once and reuse them across stages.
COPY package.json package-lock.json* ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# ─── Stage 2 : Build ────────────────────────────────────────────────────────
FROM deps AS builder

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_USE_FIREBASE_EMULATOR

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_USE_FIREBASE_EMULATOR=$VITE_USE_FIREBASE_EMULATOR

# Copy source and build
COPY . .
RUN npm run build
RUN test "$(find dist/client/album-webp -type f -name '*.webp' | wc -l)" -eq 104
RUN npm prune --omit=dev

# ─── Stage 3 : Runner ───────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=2220
ENV HOST=0.0.0.0

# Copy package files, pruned production dependencies, and build output.
COPY package.json package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 2220

# Serve the SSR bundle and the Vite client assets copied from public/.
CMD ["./node_modules/.bin/srvx", "serve", "--prod", "--dir", "./dist/server", "--entry", "./server.js", "--static", "../client"]
