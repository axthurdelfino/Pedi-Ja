import { type FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { productService } from "../services/productService";
import {
  stockMovementService,
  stockMovementsChanged,
  type StockMovementFilters,
} from "../services/stockMovementService";
import type { StockMovementType } from "../types";
import { errorMessage, useResource } from "../hooks/useResource";
import Pagination from "../components/Pagination";
import { dateTime } from "../utils/format";
import { useFormGuard } from "../contexts/LeaveGuardContext";

const initialFilters: StockMovementFilters = {};

export default function StockMovementsPage() {
  const [filters, setFilters] = useState<StockMovementFilters>(initialFilters);
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState<StockMovementType>("ENTRADA");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const [page, setPage] = useState(1);
  const movementsLoader = useCallback(
    () => stockMovementService.findAll(filters),
    [filters],
  );
  const productsLoader = useCallback(() => productService.findAll(), []);
  const movements = useResource(movementsLoader, [], stockMovementsChanged);
  const products = useResource(productsLoader, []);
  const safePage = Math.min(
    page,
    Math.max(1, Math.ceil(movements.data.length / 10)),
  );
  const entries = movements.data.filter((m) => m.tipo === "ENTRADA").length;
  const exits = movements.data.filter((m) => m.tipo === "SAIDA").length;

  useFormGuard({
    dirty: Boolean(produtoId || descricao || quantidade !== 1 || tipo !== "ENTRADA"),
    busy: saving,
  });

  function updateFilter(field: keyof StockMovementFilters, value: string) {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!produtoId || !Number.isSafeInteger(quantidade) || quantidade < 1) {
      setFailure("Selecione um produto e informe uma quantidade inteira positiva.");
      return;
    }
    setSaving(true);
    setFailure("");
    try {
      await stockMovementService.create({
        produtoId: Number(produtoId),
        tipo,
        quantidade,
        descricao: descricao.trim() || undefined,
      });
      setProdutoId("");
      setTipo("ENTRADA");
      setQuantidade(1);
      setDescricao("");
      toast.success("Movimentação de estoque registrada.");
      await Promise.all([movements.reload(true), products.reload(true)]);
    } catch (error) {
      setFailure(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Movimentações de estoque</h1>
          <p>Registre entradas e saídas e acompanhe o histórico dos produtos.</p>
        </div>
      </div>

      <div className="order-summary stock-summary">
        <div><small>Total de movimentações</small><strong>{movements.data.length}</strong></div>
        <div><small>Entradas</small><strong className="stock-entry">{entries}</strong></div>
        <div><small>Saídas</small><strong className="stock-exit">{exits}</strong></div>
      </div>

      <section className="panel inline-form-card">
        <div className="inline-form-header">
          <div><span className="eyebrow">NOVA MOVIMENTAÇÃO</span><h2>Registrar estoque</h2></div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label>Produto
            <select value={produtoId} required disabled={saving || products.loading} onChange={(e) => setProdutoId(e.target.value)}>
              <option value="">Selecione um produto</option>
              {products.data.map((product) => <option key={product.id} value={product.id}>{product.nome} — estoque: {product.estoque}</option>)}
            </select>
          </label>
          <label>Tipo
            <select value={tipo} disabled={saving} onChange={(e) => setTipo(e.target.value as StockMovementType)}>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </label>
          <label>Quantidade
            <input type="number" min="1" step="1" required disabled={saving} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
          </label>
          <label>Observação <span className="optional">(opcional)</span>
            <input maxLength={255} disabled={saving} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <div className="heading-actions stock-submit"><button className="primary-button" disabled={saving || products.loading}>{saving ? "Registrando…" : "Registrar movimentação"}</button></div>
        </form>
        {failure && <p className="form-error" role="alert">{failure}</p>}
      </section>

      <section className="panel list-panel">
        <div className="panel-heading"><h2>Histórico</h2></div>
        <div className="form-grid stock-filters">
          <label>Produto
            <select value={filters.produtoId || ""} onChange={(e) => updateFilter("produtoId", e.target.value)}>
              <option value="">Todos os produtos</option>
              {products.data.map((product) => <option key={product.id} value={product.id}>{product.nome}</option>)}
            </select>
          </label>
          <label>Tipo
            <select value={filters.tipo || ""} onChange={(e) => updateFilter("tipo", e.target.value)}>
              <option value="">Todos</option><option value="ENTRADA">Entradas</option><option value="SAIDA">Saídas</option>
            </select>
          </label>
          <label>De<input type="date" value={filters.inicio || ""} onChange={(e) => updateFilter("inicio", e.target.value)} /></label>
          <label>Até<input type="date" value={filters.fim || ""} onChange={(e) => updateFilter("fim", e.target.value)} /></label>
        </div>
        {(movements.error || products.error) && <p className="form-error" role="alert">{movements.error || products.error}</p>}
        {movements.loading ? <p role="status">Carregando movimentações…</p> : (
          <><div className="table-wrap"><table><thead><tr><th>Produto</th><th>Tipo</th><th className="money-cell">Quantidade</th><th>Data</th><th>Observação</th><th>Pedido</th></tr></thead><tbody>
            {movements.data.slice((safePage - 1) * 10, safePage * 10).map((movement) => <tr key={movement.id}>
              <td className="text-cell">{movement.produtoNome}</td>
              <td><span className={`stock-badge stock-${movement.tipo.toLowerCase()}`}>{movement.tipo === "ENTRADA" ? "Entrada" : "Saída"}</span></td>
              <td className="money-cell">{movement.quantidade}</td><td>{dateTime(movement.dataMovimentacao)}</td>
              <td className="text-cell">{movement.descricao || "—"}</td><td>{movement.pedidoId ? `#${movement.pedidoId}` : "—"}</td>
            </tr>)}</tbody></table>{movements.data.length === 0 && <p className="empty-state">Nenhuma movimentação encontrada.</p>}</div>
            <Pagination page={safePage} total={movements.data.length} onChange={setPage} /></>
        )}
      </section>
    </div>
  );
}
