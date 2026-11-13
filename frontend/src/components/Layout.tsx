import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useLeaveGuard } from "../contexts/LeaveGuardContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/pedidos", label: "Pedidos", icon: "orders" },
  { to: "/clientes", label: "Clientes", icon: "clients" },
  { to: "/produtos", label: "Produtos", icon: "products" },
  { to: "/movimentacoes-estoque", label: "Estoque", icon: "stock" },
  { to: "/relatorios", label: "Relatórios", icon: "reports" },
] as const;

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const { requestLeave } = useLeaveGuard();

  function closeMenu() {
    const restoreFocus = menuOpen;
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!menuOpen) return;

    const focusable = () => [
      menuButtonRef.current,
      ...Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>("a") || [],
      ),
    ].filter((element): element is HTMLElement => element !== null);

    const firstLink = sidebarRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const elements = focusable();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function signOut() {
    requestLeave(() => {
      logout();
      navigate("/login");
    });
  }

  return (
    <div className={`app-shell ${menuOpen ? "menu-open" : ""}`}>
      {menuOpen && (
        <button
          className="menu-backdrop"
          type="button"
          tabIndex={-1}
          aria-label="Fechar menu"
          onClick={closeMenu}
        />
      )}
      <aside
        ref={sidebarRef}
        className="sidebar"
        id="main-navigation"
        aria-label="Menu principal"
      >
        <div className="brand">
          <span className="brand-symbol">
            <Icon name="bag" />
          </span>{" "}
          PediJa
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              onClick={closeMenu}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span className="nav-icon">
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name="menu" />
          </button>
          <span className="topbar-title">PediJa</span>
          <div className="topbar-actions">
            <span className="top-user">{user?.login}</span>
            <button className="outline-button" onClick={signOut}>
              Sair
            </button>
          </div>
        </header>
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
