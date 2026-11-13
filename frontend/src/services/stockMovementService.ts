import { request } from "../lib/http";
import type { StockMovement, StockMovementType } from "../types";

export const stockMovementsChanged = "pedija:stock-movements-changed";

export type StockMovementFilters = {
  produtoId?: string;
  tipo?: StockMovementType | "";
  inicio?: string;
  fim?: string;
};

export const stockMovementService = {
  findAll: (filters: StockMovementFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.produtoId) query.set("produtoId", filters.produtoId);
    if (filters.tipo) query.set("tipo", filters.tipo);
    if (filters.inicio) query.set("inicio", `${filters.inicio}T00:00:00`);
    if (filters.fim) query.set("fim", `${filters.fim}T23:59:59.999`);
    const suffix = query.size ? `?${query.toString()}` : "";
    return request<StockMovement[]>(`/stock-movements${suffix}`);
  },
};
