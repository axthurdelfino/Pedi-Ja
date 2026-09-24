import { Link } from "react-router-dom";
import { useReports } from "../hooks/useReports";
import { money, today } from "../utils/format";
import OrderTable from "../components/OrderTable";
export default function DashboardPage() {
  const r = useReports();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  });
  const values = days.map((d) =>
    r.orders
      .filter(
        (o) =>
          o.dataPedido.startsWith(d) && ["PAGO", "ENVIADO"].includes(o.status),
      )
      .reduce((s, o) => s + o.valorTotal, 0),
  );
  const max = Math.max(1, ...values);
  const points = values
    .map((v, i) => `${i * 100 + 50},${190 - (v / max) * 170}`)
    .join(" ");
  const recent = [...r.orders]
    .sort((a, b) => b.dataPedido.localeCompare(a.dataPedido))
    .slice(0, 5);
  return (
    <div>
      <div className="page-heading">
        <h1>Dashboard</h1>
        <span>{new Date().toLocaleDateString("pt-BR")}</span>
      </div>
      {r.error && (
        <p role="alert" className="form-error">
          {r.error}
        </p>
      )}
      {r.loading ? (
        <p role="status">Carregando…</p>
      ) : (
        <>
          <div className="metric-grid">
            {[
              [
                "Pedidos hoje",
                String(
                  r.orders.filter((o) => o.dataPedido.startsWith(today()))
                    .length,
                ),
              ],
              ["Pagos e enviados", money(r.paid)],
              [
                "Clientes com pedidos",
                String(
                  new Set(
                    r.orders
                      .filter((o) => o.status !== "CANCELADO")
                      .map((o) => o.clienteId),
                  ).size,
                ),
              ],
              [
                "Pedidos pendentes",
                String(r.orders.filter((o) => o.status === "PENDENTE").length),
              ],
            ].map(([label, value]) => (
              <div className="metric-card" key={label}>
                <div>
                  <span className="metric-label">{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </div>
          <section className="panel sales-panel">
            <h2>Vendas pagas — pedidos dos últimos 7 dias</h2>
            <div className="chart">
              <div className="y-labels">
                <span>{money(max)}</span>
              </div>
              <svg
                role="img"
                aria-label="Vendas pagas por data de criação do pedido"
              >
                <svg viewBox="0 0 700 210" preserveAspectRatio="none">
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#125bd5"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {values.map((v, i) => (
                  <circle
                    key={days[i]}
                    cx={`${((i + 0.5) / 7) * 100}%`}
                    cy={`${((190 - (v / max) * 170) / 210) * 100}%`}
                    r="5"
                    fill="#125bd5"
                  >
                    <title>
                      {days[i]}: {money(v)}
                    </title>
                  </circle>
                ))}
              </svg>
              <span className="chart-zero">R$ 0</span>
              <div className="x-labels">
                {days.map((d) => (
                  <span key={d}>
                    {d.slice(8)}/{d.slice(5, 7)}
                  </span>
                ))}
              </div>
            </div>
          </section>
          <section className="panel recent-panel">
            <div className="panel-heading">
              <h2>Pedidos recentes</h2>
              <Link to="/pedidos">Ver todos</Link>
            </div>
            <OrderTable orders={recent} />
          </section>
        </>
      )}
    </div>
  );
}
