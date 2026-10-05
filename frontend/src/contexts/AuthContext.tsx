import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearSession, sessionChanged } from "../lib/session";
import {
  currentUser,
  login as authenticate,
  logout as signOut,
} from "../services/authService";

type AuthUser = { login: string; roles: string[] };

const AuthContext = createContext<{
  user: AuthUser | null;
  ready: boolean;
  login: (login: string, senha: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    currentUser()
      .then((value) => {
        if (active) setUser(value);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    const update = () => {
      setUser(null);
      setReady(true);
    };
    window.addEventListener(sessionChanged, update);
    return () => {
      active = false;
      window.removeEventListener(sessionChanged, update);
    };
  }, []);

  async function login(loginValue: string, password: string, _remember: boolean) {
    await authenticate(loginValue, password);
    setUser(await currentUser());
    setReady(true);
  }

  async function logout() {
    try {
      await signOut();
    } finally {
      setUser(null);
      clearSession();
    }
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider ausente");
  return value;
}
