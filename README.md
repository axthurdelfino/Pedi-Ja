# PediJa

Sistema full-stack de gerenciamento de pedidos desenvolvido para a empresa **M.F. Torres**.

O PediJa centraliza usuários, clientes, produtos, estoque e pedidos em uma API REST com uma interface web administrativa.

## Funcionalidades

### Autenticação e usuários

- Login e logout de usuários.
- Autenticação baseada em sessão HTTP e cookie `JSESSIONID`.
- Endpoint `/auth/me` para consultar a sessão atual.
- Controle de acesso por roles (`USER` e `ADMIN`).
- CRUD de usuários.
- Senhas armazenadas com BCrypt.

### Clientes

- CRUD de clientes.
- Busca por nome.
- Associação entre clientes e pedidos.

### Produtos

- CRUD de produtos.
- Busca por nome.
- Controle de preço e estoque.

### Pedidos

- Criação e consulta de pedidos.
- Associação entre clientes, produtos e itens do pedido.
- Consolidação de produtos repetidos.
- Registro do preço unitário no momento da venda.
- Cálculo do valor total.
- Controle de status e forma de pagamento.
- Atualização do estoque durante a criação do pedido.
- Filtros por status e cliente.
- Atualização de status e exclusão de pedidos cancelados.

### API

- DTOs para entrada e saída de dados.
- Validação com Bean Validation.
- Tratamento global de exceções.
- Respostas HTTP padronizadas.
- Transações para preservar a consistência do estoque e dos pedidos.

## Tecnologias

### Backend

- Java 21.
- Spring Boot.
- Spring Web MVC.
- Spring Security.
- Spring Data JPA e Hibernate.
- Bean Validation.
- Maven.

### Banco de dados

- PostgreSQL 17.
- Flyway.
- Docker Compose.

### Frontend

- React.
- TypeScript.
- Vite.
- React Router.
- Base UI Dialog.
- Sonner.

