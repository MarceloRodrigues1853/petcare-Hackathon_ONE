# =========================
# Stage DEV (hot-reload)
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

# Opcional: Adiciona o bash para facilitar o acesso ao container
RUN apk add --no-cache bash

# Copiar manifests e instalar as dependências
COPY package*.json ./
#
# CORREÇÃO APLICADA: Usamos 'npm install' aqui para que ele crie um
# package-lock.json caso não exista, evitando o erro durante o build.
#
RUN npm install

# Copia o resto do código (será sobreposto pelo volume no runtime)
COPY . .

# Garante que os binários locais (vite, etc.) estejam no PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Expõe as portas do Vite para o servidor de desenvolvimento e HMR
EXPOSE 5173 24678

# O comando para iniciar é definido no docker-compose.yml, mas este seria o padrão
CMD ["npm","run","dev"]


# =========================
# Stage BUILD (produção)
# =========================
# Este estágio é usado para criar a versão final otimizada da aplicação
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# No build de produção, 'npm ci' é preferível por ser mais rápido e seguro
RUN npm ci
COPY . .

# Garante que os binários locais estejam no PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Roda o script de build definido no seu package.json
RUN npm run build


# =========================
# Stage RUNTIME (Nginx)
# =========================
# Este estágio final serve os arquivos estáticos gerados no estágio de build
FROM nginx:alpine AS prod

# Configuração do Nginx para Single-Page Applications (SPA)
# Isso redireciona todas as rotas para o index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos da build para a pasta que o Nginx serve
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80, padrão do Nginx
EXPOSE 80

