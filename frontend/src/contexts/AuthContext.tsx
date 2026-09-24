import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearSession, readSession, sessionChanged } from "../lib/session";
import { login as authenticate } from "../services/authService";
const AuthContext = createContext<{
  user: ReturnType<typeof readSession>;
  login: (login: string, senha: string, remember: boolean) => Promise<void>;
  logout: () => void;
} | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(readSession);
  useEffect(() => {
    const update = () => setUser(readSession());
    window.addEventListener(sessionChanged, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(sessionChanged, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(
      clearSession,
      Math.max(0, user.expiresAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [user]);
  return (
    <AuthContext.Provider
      value={{
        user,
        logout: clearSession,
        login: async (login, senha, remember) => {
          await authenticate(login, senha, remember);
          setUser(readSession());
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider ausente");
  return value;
}
