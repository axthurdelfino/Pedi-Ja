import { request } from "../lib/http";
import type { Order, OrderStatus, PaymentPivot, SalesByProduct } from "../types";
import { stockMovementsChanged } from "./stockMovementService";
export const ordersChanged = "pedija:orders-changed";
async function notifyChange<T>(operation: Promise<T>): Promise<T> {
  const result = await operation;
  window.dispatchEvent(new Event(ordersChanged));
  window.dispatchEvent(new Event(stockMovementsChanged));
  return result;
}
export type CreateOrderPayload = {
  clienteId: number;
  paymentMethod: Order["paymentMethod"];
  items: { produtoId: number; quantidade: number }[];
};
export type OrderFilters = {
  status?: string;
  clienteId?: string;
  minPrice?: string;
  maxPrice?: string;
};
export type ReportFilters = {
  inicio?: string;
  fim?: string;
};
function reportQuery(filters: ReportFilters = {}) {
  const query = new URLSearchParams();
  if (filters.inicio) query.set("inicio", `${filters.inicio}T00:00:00`);
  if (filters.fim) query.set("fim", `${filters.fim}T23:59:59.999`);
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}
export const orderService = {
  findAll: (filters: OrderFilters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(
        ([, v]) => v !== "" && v !== undefined,
      ) as [string, string][],
    );
    return request<Order[]>("/pedidos?" + query.toString());
  },
  findById: (id: number) => request<Order>(`/pedidos/${id}`),
  salesByProduct: (filters: ReportFilters = {}) =>
    request<SalesByProduct[]>(`/pedidos/relatorios/por-produto${reportQuery(filters)}`),
  salesPivotByPayment: (filters: ReportFilters = {}) =>
    request<PaymentPivot[]>(`/pedidos/relatorios/pivot-pagamentos${reportQuery(filters)}`),
  create: (payload: CreateOrderPayload) =>
    notifyChange(
      request<Order>("/pedidos", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    ),
  updateStatus: (id: number, status: OrderStatus) =>
    notifyChange(
      request<Order>(`/pedidos/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    ),
};
