import { useState } from "react";
import { useReports } from "../hooks/useReports";
import { money } from "../utils/format";
import OrderTable from "../components/OrderTable";
import Pagination from "../components/Pagination";
export default function ReportsPage({
  financial = false,
}: {
  financial?: boolean;
}) {
  const r = useReports();
  const [page, setPage] = useState(1);
  const safePage = Math.min(page, Math.max(1, Math.ceil(r.orders.length / 10)));
  function exportCsv() {
    const cell = (v: unknown) =>
      '"' +
      String(v)
        .replace(/^(\s*[=+@-]|[\t\r\n])/, "'$1")
        .replace(/"/g, '""') +
      '"';
    const rows = [
      ["Pedido", "Cliente", "Data", "Status", "Pagamento", "Total"],
      ...r.orders.map((o) => [
        o.id,
        o.clienteNome,
        o.dataPedido,
        o.status,
        o.paymentMethod,
        o.valorTotal.toFixed(2),
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF" + rows.map((row) => row.map(cell).join(";")).join("\r\n")],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedija-pedidos.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div>
      <div className="page-heading">
        <h1>{financial ? "Financeiro" : "Relatórios"}</h1>
        <button
          className="primary-button"
          disabled={r.loading || !!r.error || r.invalid}
          onClick={exportCsv}
        >
          Exportar CSV
        </button>
      </div>
      <p>
        Valores derivados dos pedidos e de seus status. Não inclui despesas,
        fluxo bancário ou estornos.
      </p>
      <section className="panel compact-form-panel">
        <div className="form-grid">
          <label>
            De
            <input
              type="date"
              value={r.start}
              onChange={(e) => {
                r.setStart(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            Até
            <input
              type="date"
              value={r.end}
              onChange={(e) => {
                r.setEnd(e.target.value);
                setPage(1);
              }}
            />
          </label>
        </div>
      </section>
      {(r.error || r.invalid) && (
        <p role="alert" className="form-error">
          {r.error || "O início deve ser anterior ao fim do período."}
        </p>
      )}
      {r.loading ? (
        <p role="status">Carregando…</p>
      ) : (
        <>
          <div className="metric-grid">
            <div className="metric-card">
              <div>
                <span>Pagos e enviados</span>
                <strong>{money(r.paid)}</strong>
              </div>
            </div>
            <div className="metric-card">
              <div>
                <span>A receber (pendentes)</span>
                <strong>{money(r.pending)}</strong>
              </div>
            </div>
            <div className="metric-card">
              <div>
                <span>Cancelados</span>
                <strong>{money(r.cancelled)}</strong>
              </div>
            </div>
            <div className="metric-card">
              <div>
                <span>Pedidos no período</span>
                <strong>{r.orders.length}</strong>
              </div>
            </div>
          </div>
          <section className="panel list-panel">
            <OrderTable
              orders={r.orders.slice((safePage - 1) * 10, safePage * 10)}
            />
            <Pagination
              page={safePage}
              total={r.orders.length}
              onChange={setPage}
            />
          </section>
        </>
      )}
    </div>
  );
}
