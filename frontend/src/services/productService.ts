import { request } from "../lib/http";
import type { Product } from "../types";
import { stockMovementsChanged } from "./stockMovementService";

export type ProductInput = Omit<Product, "id">;

async function notifyStockChange<T>(operation: Promise<T>): Promise<T> {
  const result = await operation;
  window.dispatchEvent(new Event(stockMovementsChanged));
  return result;
}

export const productService = {
  findAll: (nome?: string) =>
    request<Product[]>(
      nome ? `/produtos?nome=${encodeURIComponent(nome)}` : "/produtos",
    ),
  create: (payload: ProductInput) =>
    notifyStockChange(
      request<Product>("/produtos", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    ),
  update: (id: number, payload: ProductInput) =>
    notifyStockChange(
      request<Product>(`/produtos/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    ),
  remove: (id: number) =>
    request<void>(`/produtos/${id}`, { method: "DELETE" }),
};
