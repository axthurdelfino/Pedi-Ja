import { request } from "../lib/http";

export function login(login: string, senha: string) {
  return request<void>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });
}

export function logout() {
  return request<void>("/auth/logout", { method: "POST" });
}

export function currentUser() {
  return request<{ login: string; roles: string[] }>("/auth/me");
}
