export const sessionChanged = "pedija-session";

export function clearSession() {
  window.dispatchEvent(new Event(sessionChanged));
}

export function readSession() {
  return null;
}
