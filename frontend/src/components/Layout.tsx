import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Icon from "./Icon";
import { useLeaveGuard } from "../contexts/LeaveGuardContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/pedidos", label: "Pedidos", icon: "orders" },
  { to: "/clientes", label: "Clientes", icon: "clients" },
  { to: "/produtos", label: "Produtos", icon: "products" },
  { to: "/financeiro", label: "Financeiro", icon: "finance" },
  { to: "/relatorios", label: "Relatórios", icon: "reports" },
] as const;

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { requestLeave } = useLeaveGuard();

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
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className="sidebar">
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
              onClick={() => setMenuOpen(false)}
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
        <button className="profile-card" onClick={signOut} title="Sair">
          <span className="avatar">{user?.login[0]?.toUpperCase()}</span>
          <span>
            <strong>{user?.login}</strong>
            <small>
              {user?.roles.includes("ROLE_ADMIN") ? "Administrador" : "Usuário"}
            </small>
          </span>
          <span className="chevron">⌄</span>
        </button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
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
