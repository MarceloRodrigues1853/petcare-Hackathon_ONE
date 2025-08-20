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
1) MySQL com DB `petcare` (user `pet`, pass `pet`)
2) Backend: `cd backend && ./mvnw spring-boot:run` (ou `mvn spring-boot:run`)
3) Frontend: `cd frontend && npm install && npm run dev`
