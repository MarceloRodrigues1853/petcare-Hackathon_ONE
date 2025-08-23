# frontend/Dockerfile
FROM node:20-alpine3.18
WORKDIR /app

# copia só os manifests (melhor cache)
COPY package.json package-lock.json* ./

# instala TUDO (incluindo devDependencies onde fica o vite)
RUN npm ci --include=dev

# copia o resto
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
