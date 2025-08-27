# =========================
# Stage DEV (hot-reload)
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

# opcional (teu reaproveitável)
RUN apk add --no-cache bash

# instala deps sem copiar o código (para funcionar com bind mount)
# copia só o package.json/lock pra cachear as deps
COPY package*.json ./
RUN npm ci

# Dica: quando usar bind mount (./frontend:/app) ele vai "tapar" /app,
# então garanta um volume separado pra /app/node_modules no compose.
# Comando real fica no docker-compose (npm run dev) ou aqui:
CMD ["npm","run","dev","--","--host"]

# =========================
# Stage BUILD (produção)
# =========================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =========================
# Stage RUNTIME (Nginx)
# =========================
FROM nginx:alpine AS prod
# conf SPA: fallback de rotas pra index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# artefato do Vite
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Se quiser usar este stage diretamente:
# CMD ["nginx","-g","daemon off;"]
