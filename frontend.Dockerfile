# ── Stage 1: Build Vite/React app ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build          # outputs to /app/dist

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:stable-alpine AS runtime

# Copy compiled assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config (SPA fallback + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
