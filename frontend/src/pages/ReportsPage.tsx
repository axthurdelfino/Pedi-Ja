import { useCallback, useState } from "react";
import { useReports } from "../hooks/useReports";
import { money } from "../utils/format";
import OrderTable from "../components/OrderTable";
import Pagination from "../components/Pagination";
import { useResource } from "../hooks/useResource";
import { orderService, ordersChanged } from "../services/orderService";
import RetryMessage from "../components/RetryMessage";
export default function ReportsPage() {
  const r = useReports();
  const [page, setPage] = useState(1);
  const reportFilters = { inicio: r.start, fim: r.end };
  const groupedLoader = useCallback(
    () => orderService.salesByProduct(reportFilters),
    [r.start, r.end],
  );
  const pivotLoader = useCallback(
    () => orderService.salesPivotByPayment(reportFilters),
    [r.start, r.end],
  );
  const grouped = useResource(groupedLoader, [], ordersChanged);
  const pivot = useResource(pivotLoader, [], ordersChanged);
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
        <h1>Relatórios</h1>
        <button
          className="primary-button"
          disabled={r.loading || !!r.error || r.invalid}
          onClick={exportCsv}
        >
          Exportar pedidos CSV
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
      {(r.error || r.invalid || grouped.error || pivot.error) &&
        (r.invalid ? (
          <p role="alert" className="form-error">
            O início deve ser anterior ao fim do período.
          </p>
        ) : (
          <RetryMessage
            message={r.error || grouped.error || pivot.error || "Erro ao carregar relatórios."}
            onRetry={() => {
              if (r.error) void r.reload();
              if (grouped.error) void grouped.reload();
              if (pivot.error) void pivot.reload();
            }}
          />
        ))}
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
          <section className="panel list-panel report-table">
            <div className="panel-heading"><h2>Vendas por produto</h2></div>
            {grouped.loading ? <p role="status">Calculando vendas…</p> : grouped.error ? <p className="empty-state">Não foi possível carregar este relatório.</p> : <div className="table-wrap" role="region" tabIndex={0} aria-label="Vendas por produto"><table><thead><tr><th>Produto</th><th className="money-cell">Quantidade vendida</th><th className="money-cell">Valor total</th></tr></thead><tbody>{grouped.data.map((item) => <tr key={item.produtoId}><td>{item.produtoNome}</td><td className="money-cell">{item.quantidadeVendida}</td><td className="money-cell">{money(item.valorTotal)}</td></tr>)}</tbody></table>{!grouped.data.length && <p className="empty-state">Nenhuma venda paga encontrada.</p>}</div>}
          </section>
          <section className="panel list-panel report-table">
            <div className="panel-heading"><h2>Pivot de vendas por pagamento</h2></div>
            {pivot.loading ? <p role="status">Calculando pivot…</p> : pivot.error ? <p className="empty-state">Não foi possível carregar este relatório.</p> : <div className="table-wrap" role="region" tabIndex={0} aria-label="Vendas por forma de pagamento"><table><thead><tr><th>Produto</th><th className="money-cell">PIX</th><th className="money-cell">Cartão</th><th className="money-cell">Dinheiro</th><th className="money-cell">Total</th></tr></thead><tbody>{pivot.data.map((item) => <tr key={item.produtoId}><td>{item.produtoNome}</td><td className="money-cell">{money(item.pix)}</td><td className="money-cell">{money(item.cartao)}</td><td className="money-cell">{money(item.dinheiro)}</td><td className="money-cell">{money(item.total)}</td></tr>)}</tbody></table>{!pivot.data.length && <p className="empty-state">Nenhuma venda paga encontrada.</p>}</div>}
          </section>
        </>
      )}
    </div>
  );
}
