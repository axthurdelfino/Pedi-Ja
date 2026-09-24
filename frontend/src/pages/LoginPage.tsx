import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../hooks/useResource";
import Icon from "../components/Icon";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginValue, senha, remember);
      navigate("/dashboard");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-presentation">
        <div className="brand login-brand">
          <span className="brand-mark">
            <Icon name="bag" />
          </span>{" "}
          PediJa
        </div>
        <div className="presentation-copy">
          <h1>
            Gestão de pedidos
            <br />
            simples, rápida e eficiente
          </h1>
          <p>
            Organize, acompanhe e entregue o melhor para seus clientes todos os
            dias.
          </p>
        </div>
        <div className="presentation-features">
          <div>
            <span>
              <Icon name="bag" />
            </span>
            <p>
              <strong>Centralize seus pedidos</strong>
              <small>Tenha todos os pedidos em um só lugar.</small>
            </p>
          </div>
          <div>
            <span>
              <Icon name="clients" />
            </span>
            <p>
              <strong>Atenda seus clientes melhor</strong>
              <small>Informações completas para decisões rápidas.</small>
            </p>
          </div>
          <div>
            <span>
              <Icon name="reports" />
            </span>
            <p>
              <strong>Acompanhe seus resultados</strong>
              <small>Relatórios claros para impulsionar suas vendas.</small>
            </p>
          </div>
        </div>
      </div>
      <div className="login-content">
        <form className="login-card" onSubmit={submit}>
          <h2>Entrar no PediJa</h2>
          <p>Acesse sua conta para gerenciar pedidos</p>
          <label>
            Usuário
            <input
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Digite seu login"
              required
              autoComplete="username"
            />
          </label>
          <label>
            Senha
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                aria-label="Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                <Icon name="eye" />
              </button>
            </div>
          </label>
          <div className="login-options">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Lembrar-me
            </label>
            <span>Problemas de acesso? Contate o administrador.</span>
          </div>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button className="primary-button login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <footer>© 2026 PediJa. Todos os direitos reservados.</footer>
      </div>
    </div>
  );
}
