import CrudPage from "../components/CrudPage";
import { productService, type ProductInput } from "../services/productService";
import { money } from "../utils/format";
const empty: ProductInput = { nome: "", descricao: "", preco: 0, estoque: 0 };
export default function ProductsPage() {
  return (
    <CrudPage
      title="Produtos"
      empty={empty}
      service={productService}
      fields={[
        { key: "nome", label: "Nome", minLength: 3, maxLength: 100 },
        { key: "descricao", label: "Descrição", minLength: 5, maxLength: 100 },
        {
          key: "preco",
          label: "Preço",
          type: "number",
          min: 0,
          max: 99999999.99,
          step: "0.01",
        },
        {
          key: "estoque",
          label: "Estoque",
          type: "number",
          min: 0,
          max: 2147483647,
          step: "1",
        },
      ]}
      columns={[
        { wrap: true, label: "Produto", render: (p) => p.nome },
        { wrap: true, label: "Descrição", render: (p) => p.descricao },
        { numeric: true, label: "Preço", render: (p) => money(p.preco) },
        { numeric: true, label: "Estoque", render: (p) => p.estoque },
      ]}
      toInput={(p) => ({
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        estoque: p.estoque,
      })}
    />
  );
}
