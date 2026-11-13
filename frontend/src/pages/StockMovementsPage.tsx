import { useCallback, useState } from "react";
import { productService } from "../services/productService";
import { stockMovementService, type StockMovementFilters } from "../services/stockMovementService";
import { useResource } from "../hooks/useResource";
import Pagination from "../components/Pagination";
import { dateTime } from "../utils/format";

export default function StockMovementsPage() {
  const [filters, setFilters] = useState<StockMovementFilters>({});
  const [page, setPage] = useState(1);
  const movementsLoader = useCallback(() => stockMovementService.findAll(filters), [filters]);
  const movements = useResource(movementsLoader, []);
  const products = useResource(useCallback(() => productService.findAll(), []), []);
  const safePage = Math.min(page, Math.max(1, Math.ceil(movements.data.length / 10)));
  const entries = movements.data.filter((movement) => movement.tipo === "ENTRADA").length;
  const exits = movements.data.filter((movement) => movement.tipo === "SAIDA").length;

  function updateFilter(field: keyof StockMovementFilters, value: string) {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return <div>
    <div className="page-heading"><div><h1>Movimentações de estoque</h1><p>Histórico automático de entradas, vendas, ajustes e estornos.</p></div></div>
    <div className="order-summary stock-summary">
      <div><small>Total de movimentações</small><strong>{movements.data.length}</strong></div>
      <div><small>Entradas</small><strong className="stock-entry">{entries}</strong></div>
      <div><small>Saídas</small><strong className="stock-exit">{exits}</strong></div>
    </div>
    <section className="panel list-panel">
      <div className="panel-heading"><h2>Histórico</h2></div>
      <div className="form-grid stock-filters">
        <label>Produto<select value={filters.produtoId || ""} onChange={(e) => updateFilter("produtoId", e.target.value)}><option value="">Todos os produtos</option>{products.data.map((product) => <option key={product.id} value={product.id}>{product.nome}</option>)}</select></label>
        <label>Tipo<select value={filters.tipo || ""} onChange={(e) => updateFilter("tipo", e.target.value)}><option value="">Todos</option><option value="ENTRADA">Entradas</option><option value="SAIDA">Saídas</option></select></label>
        <label>De<input type="date" value={filters.inicio || ""} onChange={(e) => updateFilter("inicio", e.target.value)} /></label>
        <label>Até<input type="date" value={filters.fim || ""} onChange={(e) => updateFilter("fim", e.target.value)} /></label>
      </div>
      {(movements.error || products.error) && <p className="form-error" role="alert">{movements.error || products.error}</p>}
      {movements.loading ? <p role="status">Carregando movimentações…</p> : <>
        <div className="table-wrap"><table><thead><tr><th>Produto</th><th>Tipo</th><th className="money-cell">Quantidade</th><th>Data</th><th>Observação</th><th>Pedido</th></tr></thead><tbody>
          {movements.data.slice((safePage - 1) * 10, safePage * 10).map((movement) => <tr key={movement.id}><td className="text-cell">{movement.produtoNome}</td><td><span className={`stock-badge stock-${movement.tipo.toLowerCase()}`}>{movement.tipo === "ENTRADA" ? "Entrada" : "Saída"}</span></td><td className="money-cell">{movement.quantidade}</td><td>{dateTime(movement.dataMovimentacao)}</td><td className="text-cell">{movement.descricao || "—"}</td><td>{movement.pedidoId ? `#${movement.pedidoId}` : "—"}</td></tr>)}
        </tbody></table>{movements.data.length === 0 && <p className="empty-state">Nenhuma movimentação encontrada.</p>}</div>
        <Pagination page={safePage} total={movements.data.length} onChange={setPage} />
      </>}
    </section>
  </div>;
}
