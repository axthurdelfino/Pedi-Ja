# PediJa — frontend

React + TypeScript + Vite. Node compatível com Vite 8 e npm.

```sh
npm ci
npm run dev
npm run build
```

Abra http://localhost:5173 com a API em localhost:8080. O Vite encaminha
`/api/*` para o backend removendo o prefixo. Isso evita colisões com as
rotas React /clientes, /produtos e /pedidos ao atualizar a página.

## Arquitetura

- contexts/AuthContext: sessão reativa, expiração, login e logout.
- routes: rotas públicas e protegidas.
- pages: composição das telas.
- components: layout, formulários CRUD, tabelas e paginação reutilizáveis.
- hooks: carregamento, operações de cadastro e estado do novo pedido.
- services: contratos HTTP por domínio.
- lib/http: Bearer, URL base, respostas 204 e erros JSON.
- lib/session: armazenamento e leitura da sessão. O backend valida a assinatura JWT.
- types: contratos da API; utils: formatação.

Produtos e clientes permitem cadastrar, buscar, editar e excluir. Pedidos
permitem criação, consulta detalhada, filtros e transições de status.
O total apresentado no formulário é uma prévia; o backend calcula o valor final.
O cancelamento devolve estoque. Só pedidos cancelados podem ser excluídos.

Dashboard, Financeiro e Relatórios usam os pedidos reais. "Pagos e enviados"
soma esses dois status; "A receber" soma PENDENTE. O período é a data de criação
do pedido, não a data de pagamento. Não há controle de despesas ou movimentação
bancária. Relatórios exportam CSV com os registros filtrados.

## Sessão e implantação

"Lembrar-me" usa localStorage; sem isso, sessionStorage. Tokens expirados ou
respostas 401 encerram a sessão. As permissões são verificadas na API.
Não armazene segredos em variáveis VITE_*.

Em produção, configure o servidor para entregar index.html nas rotas React.
Encaminhe /api para o backend ou defina VITE_API_URL na compilação e
CORS_ORIGINS no backend. `npm run preview` serve somente o build e não deve
ser usado como servidor de produção nem como substituto do proxy da API.

A paginação é local, em blocos de 10. Para grandes volumes, será necessário
adicionar paginação e agregações na API.
