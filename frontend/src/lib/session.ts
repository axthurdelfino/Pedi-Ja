const key = "pedija_token";
export const sessionChanged = "pedija-session";
export const getToken = () =>
  sessionStorage.getItem(key) || localStorage.getItem(key);
export function clearSession() {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
  window.dispatchEvent(new Event(sessionChanged));
}
export function saveSession(token: string, remember: boolean) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(key, token);
  window.dispatchEvent(new Event(sessionChanged));
}
export function readSession() {
  try {
    const token = getToken();
    if (!token) return null;
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(part), (c) => c.charCodeAt(0)),
      ),
    );
    if (
      typeof claims.exp !== "number" ||
      claims.exp * 1000 <= Date.now() ||
      typeof claims.sub !== "string"
    )
      return null;
    return {
      login: claims.sub as string,
      expiresAt: claims.exp * 1000,
      roles: (claims.roles || []) as string[],
    };
  } catch {
    return null;
  }
}
