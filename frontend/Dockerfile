# =========================
# Stage DEV (hot-reload)
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

# opcional
RUN apk add --no-cache bash

# copiar manifests e instalar deps (cache de camadas)
COPY package*.json ./
RUN npm ci

# copie o resto do código (com bind mount será sobreposto no runtime)
COPY . .

# garantir binários locais no PATH (vite, tailwindcss, etc.)
ENV PATH="/app/node_modules/.bin:${PATH}"

# portas do Vite (5173) e HMR (24678)
EXPOSE 5173 24678

# roda Tailwind (watch) + Vite juntos via scripts npm
CMD ["npm","run","dev:all"]


# =========================
# Stage BUILD (produção)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# garantir binários locais no PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# gera CSS do Tailwind e faz o build do Vite (usa teus scripts)
RUN npm run build


# =========================
# Stage RUNTIME (Nginx)
# =========================
FROM nginx:alpine AS prod

# conf SPA: fallback de rotas pra index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# artefatos do Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
