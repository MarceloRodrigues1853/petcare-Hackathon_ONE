## 🐾 PetCare – Hackathon UM

Olá, equipe! 🚀
Aqui está o guia completo para começarmos o nosso projeto no GitHub.

### 📄 README.md (resumo do projeto)

## Plataforma de cuidados com animais de estimação, desenvolvida pela Equipe 2 - Brasil no Hackathon UM – Oracle Next Education (ONE).

### Visão Geral do MVP

**Dono**: cadastra pet e agenda serviço.

**Sitter**: define disponibilidade e aceita/recusa reservas.

**Admin**: aprova cuidadores e garante qualidade.

## Stack

**Backend**: Java + Spring Boot

**Frontend**: React + Vite

**Banco de Dados**: MySQL

**Infra**: Docker + Docker Compose

**Documentação**: Swagger (OpenAPI)

## Como rodar

### Com Docker (recomendado):

git clone `https://github.com/MarceloRodrigues1853/petcare-Hackathon_ONE.git`

cd `petcare-Hackathon_ONE`

`docker-compose up --build`

**Frontend** → http://localhost:5173

**Backend Swagger** → http://localhost:8080/swagger-ui/index.html

🚀 Se tudo estiver certo

Quando rodar o comando, o **Docker** vai:

**Baixar** a imagem do **MySQL**

**Construir** o backend (**Spring Boot**)

**Construir** o frontend (**React**)

Depois é só acessar:

Frontend: http://localhost:5173

Swagger Backend: http://localhost:8080/swagger-ui/index.html

### Sem Docker (opcional):

Criar **banco petcare** no **MySQL** (user: **pet**, senha: **pet**).

**Backend**: cd `backend && mvn spring-boot:run`

**Frontend**: cd `frontend && npm install && npm run dev`

## Funcionalidades iniciais

Cadastro de usuário (**/auth/register**) com senha criptografada.

Tela de cadastro no **frontend** integrada ao **backend**.

**Swagger UI** para explorar **API**.

## Próximos passos

Implementar /auth/login com JWT.

Criar entidades Pet, Sitter, Booking.

Construir dashboards (Owner, Sitter, Admin).

Criar seed inicial com usuário admin e dados de teste.

## 👥 Equipe 2 – Brasil

**Amanda Prudêncio Souza** - Frontend (UX e Telas)

**Tadeu Junior** - Backend (Banco de Dados)

**Taylam Nascimento Santos de Moura** - Backend (Reservas e Agenda)

**Luiz Eduardo Reis Souza** - Backend (Admin e Relatórios)

**Marcelo Rodrigues** - Full Stack (Integração e Apoio)

**Alessandra Cardozo dos Santos** - Frontend (UX e Telas)

## 🌿 Organização das Branches

Para evitar conflitos, vamos seguir este padrão:

main → branch estável (apenas código pronto e testado).

dev → branch de desenvolvimento (onde juntamos as features).

feat/ → cada funcionalidade fica numa branch própria, por exemplo:

feat/frontend-cadastro

feat/backend-auth

feat/backend-booking

feat/admin-dashboard

Fluxo sugerido

Criar branch nova a partir de dev.

Implementar a funcionalidade.

Abrir Pull Request para dev.

Revisão por pelo menos 1 colega.

Quando tudo pronto → merge para main.

## 📜 Licença

Projeto desenvolvido exclusivamente para fins educacionais no Hackathon UM – Oracle Next Education.