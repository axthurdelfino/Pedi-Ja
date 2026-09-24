import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { orderService } from "../services/orderService";
import { errorMessage, useResource } from "../hooks/useResource";
import type { Order, OrderStatus } from "../types";
import { dateTime, money } from "../utils/format";
import StatusBadge from "../components/StatusBadge";
const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDENTE: ["PAGO", "CANCELADO"],
  PAGO: ["ENVIADO"],
  ENVIADO: [],
  CANCELADO: [],
};
export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback(() => orderService.findById(Number(id)), [id]);
  const {
    data: order,
    loading,
    error,
    reload,
  } = useResource<Order | null>(loader, null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  async function update(status: OrderStatus) {
    if (!order || !window.confirm(`Alterar pedido para ${status}?`)) return;
    setBusy(true);
    setFailure("");
    try {
      await orderService.updateStatus(order.id, status);
      await reload();
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !order ||
      !window.confirm(
        "Excluir este pedido cancelado? Esta ação não pode ser desfeita.",
      )
    )
      return;
    setBusy(true);
    setFailure("");
    try {
      await orderService.remove(order.id);
      navigate("/pedidos");
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="page-heading">
        <h1>Pedido #{id}</h1>
        <Link to="/pedidos">Voltar aos pedidos</Link>
      </div>
      {(error || failure) && (
        <p role="alert" className="form-error">
          {error || failure}
        </p>
      )}
      {loading ? (
        <p role="status">Carregando…</p>
      ) : (
        order && (
          <>
            <section className="panel order-form-panel">
              <h2>{order.clienteNome}</h2>
              <p>
                {dateTime(order.dataPedido)} · {order.paymentMethod}
              </p>
              <StatusBadge status={order.status} />
              <div className="heading-actions">
                {transitions[order.status].map((s) => (
                  <button
                    className="outline-button"
                    key={s}
                    disabled={busy}
                    onClick={() => void update(s)}
                  >
                    {s === "PAGO"
                      ? "Marcar como pago"
                      : s === "ENVIADO"
                        ? "Marcar como enviado"
                        : "Cancelar pedido"}
                  </button>
                ))}
                {order.status === "CANCELADO" && (
                  <button disabled={busy} onClick={() => void remove()}>
                    Excluir pedido
                  </button>
                )}
              </div>
            </section>
            <section className="panel list-panel">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço da venda</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((i) => (
                      <tr key={i.produtoId}>
                        <td>{i.produtoNome}</td>
                        <td>{i.quantidade}</td>
                        <td>{money(i.precoUnitario)}</td>
                        <td>{money(i.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2>Total: {money(order.valorTotal)}</h2>
            </section>
          </>
        )
      )}
    </div>
  );
}
