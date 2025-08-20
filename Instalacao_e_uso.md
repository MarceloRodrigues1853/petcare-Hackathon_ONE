# PetCare Starter (Hackathon UM) 🐾

Mono-repo com **MySQL**, **Backend (Spring Boot)** e **Frontend (React + Vite)** já com **tela de cadastro**.

## Como rodar

### Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173

- Backend Swagger: http://localhost:8080/swagger-ui/index.html

### Local

1) MySQL com DB `petcare`:
 (user: 'pet' , pass: 'pet')

2) Backend:
 ```bash
 cd backend && ./mvnw spring-boot:run
 ou 
 (mvn spring-boot:run)
 ```

4) Frontend: 
`cd frontend && npm install && npm run dev`

🚀 Se tudo estiver certo

Quando rodar o comando, o **Docker** vai:

**Baixar** a imagem do **MySQL**

**Construir** o backend (**Spring Boot**)

**Construir** o frontend (**React**)

Depois é só acessar:

**Frontend**: http://localhost:5173

**Swagger Backend**: http://localhost:8080/swagger-ui/index.html