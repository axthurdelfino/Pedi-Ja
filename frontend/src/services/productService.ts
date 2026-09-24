import { request } from "../lib/http";
import type { Product } from "../types";

export type ProductInput = Omit<Product, "id">;

export const productService = {
  findAll: (nome?: string) =>
    request<Product[]>(
      nome ? `/produtos?nome=${encodeURIComponent(nome)}` : "/produtos",
    ),
  create: (payload: ProductInput) =>
    request<Product>("/produtos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: ProductInput) =>
    request<Product>(`/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    request<void>(`/produtos/${id}`, { method: "DELETE" }),
};
