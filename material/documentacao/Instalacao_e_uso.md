# 🐾 PetCare – Ambiente com Docker

Este projeto usa **Docker Compose** para orquestrar os serviços:

- **MySQL** (banco de dados)
- **Backend** (Spring Boot + Maven)
- **Frontend** (Vite/React, em dev ou prod)

------

## 📦 Pré-requisitos

- Docker Desktop
- Docker Compose
- (opcional) **MySQL Workbench** para conectar no banco

------

## ⚙️ Configuração inicial

Crie um arquivo **`.env`** na raiz do projeto (`petcare/.env`) com:

```bash
# MySQL
MYSQL_DATABASE=petcare
MYSQL_USER=petcare
MYSQL_PASSWORD=petcare
MYSQL_ROOT_PASSWORD=rootpassfortemp

# Backend
JWT_SECRET=uma_chave_grande_e_secreta
```

------

## 🚀 Subindo os serviços

### 🔹 Ambiente de Desenvolvimento (hot reload no frontend)

```bash
docker compose --profile dev up -d --build
```

- **Frontend (Vite)** → http://localhost:5173

- **Backend (Spring Boot)** → http://localhost:8080

- **MySQL** → `localhost:3306`


### 🔹 Ambiente de Produção (frontend buildado com Nginx)

```bash
docker compose --profile prod up -d --build
```

- **Frontend (Nginx)** → http://localhost:5173
  
- **Backend (Spring Boot)** → http://localhost:8080
  
- **MySQL** → `localhost:3306`

------

## 🛢️ Conectando ao Banco no MySQL Workbench

1. Abra o **MySQL Workbench**
2. Clique em **Database > Connect to Database**
3. Preencha com os dados do `.env`:
   - **Host:** `localhost`
   - **Port:** `3306`
   - **Username:** `petcare`
   - **Password:** `petcare`
4. Clique em **Test Connection** → deve conectar! 🎉

> ⚠️ Se quiser usar o usuário root, use:
>
> - **Username:** `root`
> - **Password:** `rootpassfortemp`

------

## 📂 Estrutura dos Serviços

- **petcare-db** → MySQL 8.0
- **backend** → API Spring Boot
- **frontend-dev** → React/Vite com hot reload
- **frontend** → build final do React servido por Nginx

------

## 🛠️ Comandos úteis

Parar os containers:

```bash
docker compose down
```

Parar e remover volumes (inclusive banco):

```bash
docker compose down -v
```

Rebuild geral:

```bash
docker compose build --no-cache
```

Logs de um serviço específico (ex: backend):

```bash
docker compose logs -f backend
```

------

## 🔧 Debug e Dicas

- **Erro no `pom.xml`** → confira se o `<dependencies>` está fechado antes do `<build>`.
- **Erro de `JWT_SECRET`** → verifique se o `.env` existe na raiz e está correto.
- **Hot reload não funciona no Windows** → adicione `--host` no script `npm run dev`.
- **Problemas de conexão no banco** → confira se a senha no Workbench é a mesma do `.env`.

------

## 📌 Fluxo recomendado para a equipe

1. **Dev frontend** → rodar com perfil `dev` (`frontend-dev`).
2. **Dev backend** → consumir a API em `http://localhost:8080`.
3. **Banco** → acessar pelo Workbench em `localhost:3306`.
4. **Testes de entrega** → rodar com perfil `prod`.

------

👉 Assim todo mundo da equipe consegue:

- subir o ambiente igualzinho com Docker
- conectar no banco via Workbench
- escolher entre **dev (hot reload)** ou **prod (build final)**
  