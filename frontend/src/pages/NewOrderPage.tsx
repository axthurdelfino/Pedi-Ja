import { type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { PaymentMethod } from "../types";
import { useNewOrder } from "../hooks/useNewOrder";
import { money } from "../utils/format";
export default function NewOrderPage() {
  const navigate = useNavigate();
  const {
    clients,
    products,
    clienteId,
    setClienteId,
    paymentMethod,
    setPaymentMethod,
    lines,
    productId,
    setProductId,
    quantity,
    setQuantity,
    error,
    total,
    addProduct,
    removeProduct,
    saving,
    loading,
    save,
  } = useNewOrder();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const order = await save();
    if (order) navigate("/pedidos/" + order.id);
  }
  return (
    <form onSubmit={submit}>
      <div className="page-heading">
        <div>
          <h1>Novo Pedido</h1>
          <p>
            <Link to="/pedidos">Pedidos</Link>　/　Novo Pedido
          </p>
        </div>
        <div className="heading-actions">
          <Link className="outline-button" to="/pedidos">
            Cancelar
          </Link>

          <button className="primary-button" disabled={saving || loading}>
            {saving ? "Salvando…" : "Criar pedido"}
          </button>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      {loading && <p role="status">Carregando clientes e produtos…</p>}
      <section className="panel order-form-panel">
        <div className="form-grid">
          <label>
            Cliente
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Forma de pagamento
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </label>
          <label>
            Status
            <input value="Pendente" disabled />
          </label>
          <label>
            Data do pedido
            <input value={new Date().toLocaleDateString("pt-BR")} disabled />
          </label>
        </div>
      </section>
      <section className="panel items-panel">
        <div className="panel-heading">
          <h2>Itens do Pedido</h2>
          <div className="add-line">
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Adicionar produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nome} — {money(product.preco)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              type="button"
              className="outline-button"
              onClick={addProduct}
            >
              ＋ Adicionar
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço Unit.</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const product = products.find((p) => p.id === line.produtoId)!;
                return (
                  <tr key={line.produtoId}>
                    <td>{product?.nome}</td>
                    <td>{line.quantidade}</td>
                    <td>{money(product?.preco || 0)}</td>
                    <td>{money((product?.preco || 0) * line.quantidade)}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => removeProduct(line.produtoId)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lines.length === 0 && (
            <div className="empty-order">
              ▱<strong>Nenhum item adicionado</strong>
              <span>
                Selecione um produto acima para incluir itens no pedido.
              </span>
            </div>
          )}
        </div>
        <div className="total-box">
          <span>Subtotal</span>
          <strong>{money(total)}</strong>
          <hr />
          <span>Total</span>
          <strong className="total-value">{money(total)}</strong>
        </div>
      </section>
    </form>
  );
}
