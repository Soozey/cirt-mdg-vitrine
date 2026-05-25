# ─── Stage 1 : Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

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
RUN npm ci --only=production

# Copy the SSR server output (client assets + server bundle)
COPY --from=builder /app/dist ./dist

EXPOSE 2220

# Run using npm start (which executes srvx with correct PATH resolution)
CMD ["npm", "run", "start"]
