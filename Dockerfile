# ─── Stage 1 : Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

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

# Install dependencies first (layer cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2 : Runner ───────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=2220
ENV HOST=0.0.0.0

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the SSR server output (client assets + server bundle)
COPY --from=builder /app/dist ./dist

EXPOSE 2220

# Run using npm start (which executes srvx with correct PATH resolution)
CMD ["npm", "run", "start"]
