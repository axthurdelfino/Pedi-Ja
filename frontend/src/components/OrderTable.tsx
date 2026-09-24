import { Link, useLocation } from "react-router-dom";
import type { Order } from "../types";
import { dateTime, money } from "../utils/format";
import StatusBadge from "./StatusBadge";
export default function OrderTable({ orders }: { orders: Order[] }) {
  const location = useLocation();
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Data</th>
            <th className="money-cell">Total</th>
            <th>Status</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td className="text-cell">
                {o.clienteNome || `Cliente #${o.clienteId}`}
              </td>
              <td>{dateTime(o.dataPedido)}</td>
              <td className="money-cell">{money(o.valorTotal)}</td>
              <td>
                <StatusBadge status={o.status} />
              </td>
              <td>{o.paymentMethod}</td>
              <td>
                <Link
                  className="outline-button"
                  state={{ backgroundLocation: location }}
                  to={`/pedidos/${o.id}`}
                >
                  Ver pedido
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="empty-state">Nenhum pedido encontrado.</p>
      )}
    </div>
  );
}
