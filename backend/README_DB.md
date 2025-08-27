# Banco de Dados – Petcare (MySQL + Flyway)

## Visão geral

- **Flyway** versiona o schema via arquivos `.sql` em `src/main/resources/db/migration`.
- **data.sql** popula dados iniciais para dev.
- Ao subir o backend, o Flyway roda **automaticamente** e cria/atualiza as tabelas.

## Onde ficam os arquivos

backend/
└─ src/main/resources/
├─ db/migration/
│ ├─ V1__create_users.sql
│ ├─ V2__create_sitters.sql
│ ├─ V3__create_pets.sql
│ └─ V4__create_bookings.sql
└─ data.sql

```bash
## Configuração recomendada (application.properties)

# Desabilita DDL automático do Hibernate (deixa o schema com o Flyway)
spring.jpa.hibernate.ddl-auto=none

# Flyway (auto-detecta classpath:db/migration)
spring.flyway.enabled=true

```

## Subir local (dev)

```powershell
# na raiz do projeto
docker compose --profile dev up -d mysql backend
docker compose logs -f backend
```

## Criar nova migration

1. Crie um novo arquivo em src/main/resources/db/migration seguindo o padrão:

 - V5__descricao_curta.sql
  
2. Coloque apenas DDL (CREATE/ALTER/DROP) e constraints.

3. Não edite migrations antigas já aplicadas; crie uma nova versão.

Exemplo:

```sql
-- V5__add_index_users_email.sql
CREATE INDEX idx_users_email ON users (email);
```

## Seeds (dados iniciais)

- Use src/main/resources/data.sql apenas para dev (usuários de teste, etc.).
- Ele roda no startup do Spring (com MySQL disponível).

## Variáveis de ambiente (compose)

```ini
MYSQL_DATABASE=petcare
MYSQL_USER=petcare
MYSQL_PASSWORD=petcare
MYSQL_ROOT_PASSWORD=rootpassfortemp

SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/petcare
JWT_SECRET=<base64>
```

## Resolução de problemas

- Errei a migration em dev:

```powershell
docker compose down -v --remove-orphans
docker compose --profile dev up -d mysql backend
```

(⚠️ Isso apaga o volume do MySQL – ok pra dev, nunca em prod)

- **Flyway não rodou**: verifique logs do backend e se o MySQL está “healthy”.

- **Workbench não conecta**: Host 127.0.0.1, Porta 3306, User petcare, Senha petcare.

```yaml

---

# Passo a passo agora para **testar no MySQL**

## 1) Garantir que MySQL e backend estão de pé
```powershell
# na raiz do projeto
docker compose --profile dev up -d mysql backend

# checar se o MySQL está healthy
docker compose ps

# (opcional) ver logs
docker compose logs -f mysql
docker compose logs -f backend
```

## 2) Entrar no MySQL pelo terminal

```powershell
docker exec -it petcare-db mysql -upetcare -ppetcare petcare
```

Dentro do MySQL, rode:

```sql
-- ver tabelas criadas pelas migrations
SHOW TABLES;

-- conferir histórico do Flyway
SELECT installed_rank, version, success, script
FROM flyway_schema_history
ORDER BY installed_rank;

-- ver os usuários de seed
SELECT id, name, email, role FROM users;

-- verificar sitter vinculado ao usuário da tabela users
SELECT s.id AS sitter_id, u.name, u.email
FROM sitters s JOIN users u ON u.id = s.id;

-- checar pets
SELECT p.id, p.name, p.type, u.name AS owner
FROM pets p JOIN users u ON u.id = p.owner_id;

-- checar bookings
SELECT b.id, p.name AS pet, su.name AS sitter, b.status, b.start_date, b.end_date
FROM bookings b
JOIN pets p ON p.id = b.pet_id
JOIN sitters s ON s.id = b.sitter_id
JOIN users su ON su.id = s.id;
```

Você deve ver:

- Tabelas: `users`, `sitters`, `pets`, `bookings`, `flyway_schema_history`.

- Linhas de seed (admin, owner, sitter, pet “Rex”, booking “CONFIRMED”).

## 3) Testar conexão via Workbench (GUI)

- **Host**: `127.0.0.1`

- **Porta**: `3306`

- **Usuário/Senha**: `petcare` / `petcare` (ou `root`/`rootpassfortemp`)

- **Database**: `petcare`

Depois de conectar, rode os mesmos SELECTs acima.

## 4) (Opcional) Testar autenticação pelo backend

Com o backend rodando:

```powershell

# login do admin (depende dos dados do seu data.sql)
curl -X POST http://localhost:8080/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@petcare.com\",\"password\":\"123456\"}"
```

Deve retornar um **token JWT**.

Use esse token como `Authorization: Bearer <token>**** em endpoints protegidos.
