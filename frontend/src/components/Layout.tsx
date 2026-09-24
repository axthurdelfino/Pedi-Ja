import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/pedidos", label: "Pedidos", icon: "▤" },
  { to: "/clientes", label: "Clientes", icon: "♙" },
  { to: "/produtos", label: "Produtos", icon: "▣" },
  { to: "/financeiro", label: "Financeiro", icon: "$" },
  { to: "/relatorios", label: "Relatórios", icon: "▥" },
];

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className={`app-shell ${menuOpen ? "menu-open" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">◆</span> PediJa
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
              <span className="nav-icon">{item.icon}</span>
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
            ☰
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
