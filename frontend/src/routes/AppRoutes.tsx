import { Navigate, Outlet, Route, Routes, useLocation, type Location } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import OrdersPage from "../pages/OrdersPage";
import NewOrderPage from "../pages/NewOrderPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import ClientsPage from "../pages/ClientsPage";
import ProductsPage from "../pages/ProductsPage";
import ReportsPage from "../pages/ReportsPage";
import Modal from "../components/Modal";

function ProtectedLayout() {
  const { user, ready } = useAuth();
  if (!ready) return <p className="loading">Carregando sessão…</p>;
  return user ? <Layout /> : <Navigate to="/login" replace />;
}

function ProtectedOverlay() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = (
    location.state as { backgroundLocation?: Location } | null
  )?.backgroundLocation;
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/pedidos/novo" element={<NewOrderPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/financeiro" element={<ReportsPage financial />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Route>
        {backgroundLocation && (
          <Routes>
            <Route element={<ProtectedOverlay />}>
              <Route
                path="/pedidos/novo"
                element={
                  <Modal key={location.key} title="Novo pedido">
                    <NewOrderPage />
                  </Modal>
                }
              />
              <Route
                path="/pedidos/:id"
                element={
                  <Modal key={location.key} title="Detalhes do pedido">
                    <OrderDetailsPage />
                  </Modal>
                }
              />
            </Route>
          </Routes>
        )}
      </Routes>
    </>
  );
}
