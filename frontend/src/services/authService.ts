import { request } from "../lib/http";
import { saveSession } from "../lib/session";
export async function login(login: string, senha: string, remember = false) {
  const result = await request<{ token: string; expiresIn: number }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ login, senha }) },
  );
  saveSession(result.token, remember);
}
