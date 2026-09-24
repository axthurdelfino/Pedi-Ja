# PediJa — API

Java 21, Maven, Spring Boot, PostgreSQL 17 e Flyway.

```sh
docker compose up -d
mvn spring-boot:run
```

Variáveis: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET (Base64, ao menos 32
bytes), JWT_EXPIRATION_MS, CORS_ORIGINS e REGISTRATION_ENABLED.
Os valores locais do banco correspondem ao docker-compose. Configure credenciais
próprias na implantação. Sem JWT_SECRET, uma chave aleatória é gerada por
inicialização: reiniciar a API invalida os tokens. Para múltiplas instâncias
ou sessões persistentes, forneça a mesma chave segura externamente.

## Primeiro acesso

O cadastro público fica desativado por padrão. Para preparar o ambiente local,
inicie temporariamente com REGISTRATION_ENABLED=true e envie
POST /usuarios com login (5–50 caracteres) e senha (mínimo 8 caracteres).
O usuário será criado com role USER. Desative o cadastro público após o setup.
Se precisar administrar usuários, atribua ADMIN ao usuário escolhido no banco
por um administrador autorizado. Não existe promoção pública de privilégios.

POST /auth/login recebe login e senha e devolve token, type e expiresIn
(milissegundos). Use Authorization: Bearer TOKEN nas demais chamadas.
GET/PUT/DELETE /usuarios exigem ADMIN; POST exige ADMIN quando o cadastro
público está desativado. Clientes, produtos e pedidos exigem autenticação.

## Endpoints

- /clientes e /produtos: GET (filtro nome), POST, GET/{id}, PUT/{id}, DELETE/{id}.
- /pedidos: GET com status, clienteId, minPrice e maxPrice combináveis; POST.
- /pedidos/{id}: GET; DELETE somente para CANCELADO.
- /pedidos/{id}/status: PATCH com status.

Pedido: clienteId, paymentMethod (PIX, CARTAO, DINHEIRO) e items
[{produtoId, quantidade}]. A API consolida produtos repetidos, copia preços,
calcula o total e reduz estoque na mesma transação.

PENDENTE pode virar PAGO ou CANCELADO; PAGO pode virar ENVIADO.
Repetir o mesmo status é idempotente. Cancelar devolve estoque uma única vez.
Pedidos pagos/enviados são preservados. Versionamento otimista em pedido e
produto impede gravações concorrentes silenciosas; conflitos retornam 409.

Migrations V1–V3 existentes foram preservadas. V4 adiciona version em produto
e pedido e será aplicada pelo Flyway na próxima inicialização.

Erros: 400 entrada inválida, 401 autenticação, 403 autorização, 404 inexistente,
409 integridade/concorrência e 422 regra de negócio.

Build: mvn clean package -DskipTests. Testes automatizados não foram adicionados
nesta etapa, conforme a preferência registrada no projeto.
