FROM node:20-alpine

WORKDIR /app

# copie apenas os manifests primeiro (melhor cache)
COPY package.json package-lock.json* ./

# instale tudo, incluindo devDependencies (onde está o Vite)
RUN npm ci

# agora copie o resto
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
