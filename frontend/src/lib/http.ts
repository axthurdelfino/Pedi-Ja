import { clearSession } from "./session";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(baseUrl + path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message =
      response.status === 401
        ? "Sua sessão expirou. Entre novamente."
        : `Erro HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body.message === "string") message = body.message;
    } catch {
      /* resposta sem JSON */
    }
    if (response.status === 401 && path !== "/auth/login") clearSession();
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
