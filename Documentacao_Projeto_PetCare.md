# Documentação do Projeto PetCare:

**Da Depuração à Nuvem**

Data: 11 de Setembro de 2025

Este documento serve como um registo técnico completo e um guia de boas práticas para a equipa do PetCare. Ele detalha a maratona de depuração que enfrentámos, a refatoração arquitetural do backend, a implementação de um banco de dados partilhado na nuvem e a construção do painel de administração no frontend.

## Parte 1: A Maratona de Depuração (O Diagnóstico)

O projeto enfrentou uma série de erros que impediam a sua execução. O processo de resolução revelou **problemas profundos** na **arquitetura** e **configuração**, que foram corrigidos passo a passo.

#### 1.1. O Problema Inicial: *Falha no Build do Docker*

O primeiro erro reportado era uma falha ao executar docker compose up. A análise do log mostrou que o problema não era o Docker, mas sim um erro de compilação no código Java (cannot find symbol: method hash). Isto ensinou-nos a primeira lição: ler o log de erros até ao fim para encontrar a causa raiz.

#### 1.2. Efeito Cascata: *Conflitos e Inconsistências*

A correção do primeiro erro revelou uma cadeia de problemas arquiteturais:

**Conflito de Beans**: A aplicação falhava ao iniciar devido a um BeanDefinitionOverrideException. Identificámos que existiam duas classes de repositório com o mesmo nome (PrecoServicoRepository) em pacotes diferentes. A solução foi renomeá-las para nomes únicos e específicos (SitterPrecoServicoRepository).

**Referências Quebradas**: Após renomear, surgiram erros de cannot find symbol, pois as classes que usavam os repositórios antigos não foram atualizadas. Isto foi corrigido manualmente, ajustando os import e as declarações nas classes de serviço.

**Erro de Herança do JPA/Hibernate**: O erro mais complexo foi uma AnnotationException (Entity is a subclass... may not be annotated @Table). Isto ocorreu porque as classes Owner e Sitter herdavam de User, mas o modelo de dados não estava configurado para suportar herança no banco de dados.
Erro de Discriminador (Unrecognized discriminator value): Após corrigir a herança, o login falhava porque os dados antigos no banco não tinham a coluna user_type que diferencia Owners de Sitters, causando um erro de execução no Hibernate.

#### 1.3. Problemas de Configuração Final

Os últimos obstáculos estavam nos ficheiros de configuração:

**JWT_SECRET em Falta**: A aplicação falhava ao criar o JwtService porque a variável de ambiente para a chave secreta do JWT não estava definida no docker-compose.yml.

**Perfil Spring Ausente**: A aplicação não se conectava ao Railway porque não estava a carregar o ficheiro application-docker.properties. A solução foi adicionar a variável SPRING_PROFILES_ACTIVE=docker ao docker-compose.yml.

**Erro de Conexão com a Nuvem (UnknownHostException)**: A aplicação não encontrava o banco de dados porque estávamos a usar a morada privada do Railway (mysql.railway.internal). A solução foi usar a morada pública (tramway.proxy.rlwy.net).

## Parte 2: A Solução - Nova Arquitetura e Boas Práticas

Para resolver estes problemas de forma definitiva, implementámos uma nova arquitetura e seguimos um conjunto de boas práticas.

#### 2.1. Arquitetura Orientada a Domínios

A estrutura de pastas do **backend** foi reorganizada para ser mais intuitiva:

**com.petcare.user**: Contém a lógica de utilizador base (**User, Owner, Sitter**).

**com.petcare.sitter**: Contém TUDO relacionado a um **Sitter**.

**com.petcare.servico**: Contém a definição dos tipos de **serviço** (ex: "*Passeio*").

**com.petcare.agendamento**: Representa o **agendamento** de um **serviço**, o coração da aplicação.

#### 2.2. Herança com SINGLE_TABLE (Tabela Única)

A classe **User** é agora a classe *"mãe"* (@Inheritance(strategy = InheritanceType.SINGLE_TABLE)).

**Owner** e **Sitter** são classes *"filhas"* (extends User).
Não existem tabelas **owners** ou **sitters**. Todos os utilizadores ficam na tabela **users**.

A coluna **user_type** diferencia os *tipos*. Para consultar apenas os **Owners**, por exemplo, usa-se o comando: `SELECT * FROM users WHERE user_type = 'OWNER';`.

#### 2.3. Frontend - Painel de Administração

Construímos um painel de administração completo e funcional com as seguintes páginas:

**Dashboard Principal**: Com estatísticas sobre a plataforma.

**Gerir Sitters e Owners**: Listagens com ações de aprovação, rejeição e exclusão.

**Tipos de Serviço**: Uma página com CRUD completo (Criar, Ler, Atualizar, Apagar) para gerir os serviços que os Sitters podem oferecer.

**Aprovações**: Uma fila de trabalho para aprovar novos Sitters.

**Calendário Semanal**: Uma visão geral de todos os agendamentos na plataforma.

## Parte 3: O Novo Fluxo de Trabalho com o Banco de Dados na Nuvem

Para garantir que toda a equipa trabalhe de forma sincronizada, adotámos um banco de dados partilhado na nuvem.

#### 3.1. Guia de Configuração (Railway.app)

Um membro da equipa deve criar um serviço MySQL gratuito no Railway.app.
No separador "Variables" do serviço no Railway, devem ser copiadas as credenciais de conexão (MYSQLHOST, MYSQLPORT, etc.).

## 3.2. Configuração do Projeto (Todos devem fazer)

A. docker-compose.yml: O **serviço db** foi removido. O serviço backend agora lê as credenciais das variáveis de ambiente.

```yml
name: petcare

services:
  backend:
    build: ./backend
    environment:
      - MYSQLHOST=tramway.proxy.rlwy.net
      - MYSQLPORT=16347
      - MYSQLDATABASE=railway
      - MYSQLUSER=root
      - MYSQLPASSWORD=o-seu-password-real-aqui
      - JWT_SECRET=ChaveSuperSecretaParaPetCare2025NaoPartilharComNinguem!
      - SPRING_PROFILES_ACTIVE=docker
    # ... resto da configuração ...

  frontend-dev:
    # ... configuração do frontend ...

B. application-docker.properties: Este ficheiro em backend/src/main/resources/ foi ajustado para ler as variáveis acima:
spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}
spring.jpa.hibernate.ddl-auto=update
```