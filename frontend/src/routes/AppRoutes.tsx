import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  type Location,
} from "react-router-dom";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../contexts/AuthContext";
import ClientsPage from "../pages/ClientsPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import NewOrderPage from "../pages/NewOrderPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import OrdersPage from "../pages/OrdersPage";
import ProductsPage from "../pages/ProductsPage";
import ReportsPage from "../pages/ReportsPage";
function ProtectedLayout() {
  const { user } = useAuth();
  return user ? <Layout /> : <Navigate to="/login" replace />;
}
function ProtectedOverlay() {
  const { user } = useAuth();
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
    </>
  );
}
