import { request } from "../lib/http";
import type { Client } from "../types";

export type ClientInput = Omit<Client, "id" | "dataCadastro">;

export const clientService = {
  findAll: (nome?: string) =>
    request<Client[]>(
      nome ? `/clientes?nome=${encodeURIComponent(nome)}` : "/clientes",
    ),
  create: (payload: ClientInput) =>
    request<Client>("/clientes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: ClientInput) =>
    request<Client>(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    request<void>(`/clientes/${id}`, { method: "DELETE" }),
};
