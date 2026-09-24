import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { orderService, type OrderFilters } from "../services/orderService";
import { useResource } from "../hooks/useResource";
import OrderTable from "../components/OrderTable";
import Pagination from "../components/Pagination";
import { money, today } from "../utils/format";
export default function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const loader = useCallback(() => orderService.findAll(filters), [filters]);
  const { data: orders, error, loading } = useResource(loader, []);
  const filtered = orders.filter((o) =>
    `${o.id} ${o.clienteNome}`.toLowerCase().includes(search.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 10)));
  function filter(field: keyof OrderFilters, value: string) {
    setPage(1);
    setFilters((f) => ({ ...f, [field]: value }));
  }
  return (
    <div>
      <div className="page-heading">
        <h1>Pedidos</h1>
        <Link className="primary-button" to="/pedidos/novo">
          ＋ Novo pedido
        </Link>
      </div>
      <div className="order-summary">
        <div>
          <small>Pedidos filtrados</small>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <small>Valor total filtrado</small>
          <strong>{money(orders.reduce((s, o) => s + o.valorTotal, 0))}</strong>
        </div>
        <div>
          <small>Hoje nos resultados</small>
          <strong>
            {orders.filter((o) => o.dataPedido.startsWith(today())).length}
          </strong>
        </div>
        <div>
          <small>Pendentes nos resultados</small>
          <strong>
            {orders.filter((o) => o.status === "PENDENTE").length}
          </strong>
        </div>
      </div>
      <section className="panel list-panel">
        <div className="form-grid">
          <label>
            Buscar por nome ou pedido
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            Status
            <select
              value={filters.status || ""}
              onChange={(e) => filter("status", e.target.value)}
            >
              <option value="">Todos</option>
              {["PENDENTE", "PAGO", "ENVIADO", "CANCELADO"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            ID do cliente
            <input
              type="number"
              min="1"
              step="1"
              value={filters.clienteId || ""}
              onChange={(e) => filter("clienteId", e.target.value)}
            />
          </label>
          <label>
            Valor mínimo
            <input
              type="number"
              min="0"
              step=".01"
              value={filters.minPrice || ""}
              onChange={(e) => filter("minPrice", e.target.value)}
            />
          </label>
          <label>
            Valor máximo
            <input
              type="number"
              min="0"
              step=".01"
              value={filters.maxPrice || ""}
              onChange={(e) => filter("maxPrice", e.target.value)}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status">Carregando…</p>
        ) : (
          <>
            <OrderTable
              orders={filtered.slice((safePage - 1) * 10, safePage * 10)}
            />
            <Pagination
              page={safePage}
              total={filtered.length}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
