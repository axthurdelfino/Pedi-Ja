import { request } from "../lib/http";
import type { Order, OrderStatus } from "../types";
export const ordersChanged = "pedija:orders-changed";
async function notifyChange<T>(operation: Promise<T>): Promise<T> {
  const result = await operation;
  window.dispatchEvent(new Event(ordersChanged));
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
  remove: (id: number) =>
    notifyChange(request<void>(`/pedidos/${id}`, { method: "DELETE" })),
};
