# PediJa

Sistema web de gerenciamento de pedidos desenvolvido para a empresa **M.F. Torres**.

O PediJa foi desenvolvido como uma aplicação full-stack para centralizar o gerenciamento de usuários, clientes, produtos, estoque e pedidos, utilizando uma API REST no backend e uma interface web no frontend.

---

## Funcionalidades

### Autenticação e usuários

- Login de usuários
- Autenticação utilizando JWT
- Controle de acesso baseado em autenticação
- Cadastro de usuários
- Consulta de usuários
- Atualização de usuários
- Remoção de usuários
- Senhas armazenadas de forma segura

### Clientes

- Cadastro de clientes
- Consulta de clientes
- Consulta de cliente por ID
- Atualização de clientes
- Remoção de clientes
- Associação de clientes aos pedidos

### Produtos

- Cadastro de produtos
- Consulta de produtos
- Consulta de produto por ID
- Atualização de produtos
- Remoção de produtos
- Controle de estoque
- Controle de preço dos produtos

### Pedidos

- Criação de pedidos
- Consulta de pedidos
- Consulta de pedido por ID
- Atualização de pedidos
- Remoção de pedidos
- Associação entre clientes e pedidos
- Associação entre produtos e pedidos
- Controle de quantidade dos produtos
- Registro do preço do produto no momento da venda
- Cálculo do valor total do pedido
- Controle de status do pedido
- Controle da forma de pagamento
- Atualização do estoque durante o processamento dos pedidos

### API

- API REST
- DTOs para entrada e saída de dados
- Validação de dados
- Tratamento global de exceções
- Respostas HTTP padronizadas
- Filtros para consulta de pedidos

---

## Tecnologias

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- JWT
- Maven

### Banco de dados

- PostgreSQL
- Flyway

### Frontend

- React
- TypeScript

### Infraestrutura e ferramentas

- Docker
- Git
- GitHub
- Postman
- DBeaver

---

## Arquitetura

O backend utiliza uma arquitetura em camadas, separando responsabilidades entre os diferentes componentes da aplicação.

```text
React + TypeScript
        │
        │ HTTP / JSON
        ▼
   Controllers
        │
        ▼
    Services
        │
        ▼
   Repositories
        │
        ▼
 JPA / Hibernate
        │
        ▼
   PostgreSQL
