# Documentação do Projeto PetCare: A Refatoração do Frontend

**Da API ao Componente**

Data: 14 de Setembro de 2025

Este documento serve como um registo técnico e um guia de boas práticas para a equipa do PetCare, focado na arquitetura do Frontend. Ele detalha a completa refatoração da camada de comunicação com a API, a implementação de um sistema de autenticação robusto e a conexão de todos os componentes visuais com os dados reais do backend.

## Parte 1: O Diagnóstico (Inconsistências e Acoplamento Forte)

O projeto frontend, embora com uma UI bem construída, enfrentava problemas crónicos de integração que impediam a sua funcionalidade. A análise revelou problemas arquiteturais na forma como os componentes interagiam com o backend.

#### 1.1. O Problema Inicial: *Falhas de Integração e Erros `401 Unauthorized`*

O primeiro sintoma eram falhas constantes ao tentar salvar ou buscar dados, resultando em erros de rede. A causa raiz era a falta de um mecanismo centralizado para gerir o token de autenticação (JWT). Cada componente que tentava comunicar com a API o fazia sem as credenciais necessárias.

#### 1.2. Efeito Cascata: *Dados Incorretos e Lógica Fixa no Código*

A investigação inicial revelou uma cadeia de problemas que tornavam a aplicação frágil:

* **Inconsistência de Endpoints:** Diferentes componentes tentavam aceder aos mesmos recursos através de URLs diferentes (ex: `/pets` vs. `/owner/pets`), refletindo a falta de uma camada de API centralizada.
* **Estrutura de Dados Incorreta (Payload):** Os formulários enviavam objetos JSON que não correspondiam ao que o backend esperava (ex: campos em inglês como `name` em vez de `nome`; falta de IDs essenciais como `ownerId`).
* **Lógica de Negócio no Frontend:** Regras de negócio críticas, como os **preços dos serviços**, estavam fixadas diretamente no código dos componentes (`.jsx`). Qualquer alteração de preço exigiria uma nova implantação do frontend.
* **Dados "Mockados":** Quase todos os componentes dependiam de dados de exemplo estáticos, tornando impossível testar o fluxo real da aplicação.

## Parte 2: A Solução - Nova Arquitetura Frontend

Para resolver estes problemas de forma definitiva, implementámos uma nova arquitetura de frontend baseada em desacoplamento e centralização da lógica de dados.

#### 2.1. Arquitetura Orientada a Recursos (Camada de API)

A pasta `src/api/` foi criada para ser o único ponto de contacto com o backend. A sua estrutura espelha os controllers do backend:

* **`http.js`**: O coração da comunicação. Um wrapper `fetch` que automaticamente anexa o `Authorization: Bearer <token>` em todas as requisições autenticadas.
* **`auth.api.js`**: Centraliza as chamadas de `login` e `register`.
* **`owner.api.js`, `sitter.api.js`, `pet.api.js`, etc.**: Cada arquivo é dedicado a um único recurso do backend, exportando funções claras e reutilizáveis (ex: `listSitters()`, `getOwnerById(id)`). **Os componentes nunca mais chamarão a API diretamente.**

#### 2.2. O `AuthContext` como Fonte da Verdade da Sessão

O `src/context/AuthContext.jsx` foi refatorado para gerir todo o ciclo de vida da autenticação do usuário:

* **Estado Centralizado:** O contexto agora provê o objeto `user`, um booleano `isAuthenticated` e um estado de `loading` para toda a aplicação.
* **Persistência de Sessão:** Ao carregar a aplicação, o contexto verifica o `localStorage` em busca de um token JWT e/ou dados do usuário para manter a sessão ativa.
* **Hook `useAuth()`:** Os componentes acedem às informações e funções (`login`, `logout`) de forma simples e limpa através do hook `useAuth()`.

#### 2.3. Componentes Dinâmicos e Conectados

Todos os componentes visuais foram refatorados para se tornarem "consumidores" da nova arquitetura:

* **Dados Reais:** Todos os dados "mockados" foram substituídos por chamadas de API reais dentro de hooks `useEffect`.
* **Renderização Correta:** O JSX foi ajustado para ler a estrutura de dados complexa e aninhada que vem da API (ex: `agendamento.pet.nome` em vez de `agendamento.pet`).
* **Formulários Inteligentes:** Componentes como o de criação de agendamento (`AppointmentNew.jsx`) e o de gestão de serviços do Sitter (`ServicesForm.jsx`) agora buscam as suas opções (listas de pets, cuidadores, serviços) diretamente da API, tornando-se totalmente dinâmicos.

## Parte 3: O Novo Fluxo de Trabalho e Alinhamento com o Backend

Com a base do frontend sólida, o foco agora é a colaboração contínua com a equipa de backend para evoluir a API.

#### 3.1. Guia de Boas Práticas para Novos Componentes
1.  **Nunca Chame `http.js` Diretamente:** A lógica de API pertence aos arquivos `src/api/*.api.js`. Os componentes devem importar funções desses arquivos.
2.  **Use `useAuth()` para Contexto:** Para obter informações sobre o usuário logado (como `user.id` ou `user.role`), sempre utilize o hook `useAuth()`.
3.  **A API é a Fonte da Verdade:** Não fixe no código dados que podem mudar, como listas, preços ou status. Sempre busque essas informações da API.

#### 3.2. Alinhamento Crítico com o Backend (Próximos Passos)
A refatoração revelou que a UI/UX projetada é mais rica do que a API atual suporta. Para que a aplicação atinja seu potencial máximo, as seguintes melhorias na API são necessárias:

* **1. Enriquecer Respostas de API:**
    * `GET /owners` e `GET /api/sitters`: As respostas precisam incluir campos como `status`, `rating`, `registrationDate` e contagem de pets para preencher as tabelas do admin.
    * `PUT /owners/{id}` e `PUT /api/sitters/{id}`: Os corpos das requisições precisam aceitar os campos extras dos formulários de perfil (endereço, telefone, bio, preferências, etc.).

* **2. Adicionar Filtros aos Endpoints de Listagem:**
    * `GET /agendamentos`: Precisa aceitar filtros por data (`?dataInicio=...`) e por status (`?status=...`) para otimizar o Calendário e o Histórico.
    * `GET /api/sitters`: Precisa aceitar filtro por status (`?status=PENDING`) para a página de Aprovações.

* **3. Implementar Ações de Moderação do Admin:**
    * É necessário um método para **Aprovar/Rejeitar** um Sitter (provavelmente atualizando o campo `status` via `PUT /api/sitters/{id}`).
    * É necessário um método para **Remover um Sitter** (`DELETE /api/sitters/{id}`).

* **4. Criar um Endpoint de Estatísticas para o Admin:**
    * Um endpoint único como `GET /api/admin/stats` é crucial para o desempenho do Dashboard do Admin, evitando múltiplas chamadas para calcular os totais.