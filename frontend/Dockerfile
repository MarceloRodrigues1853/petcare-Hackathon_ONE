# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# utilitário opcional
RUN apk add --no-cache bash

# como vamos usar bind mount do código, não copiamos nada aqui
# o comando real é definido no docker-compose (section "command")
CMD ["npm","run","dev"]
