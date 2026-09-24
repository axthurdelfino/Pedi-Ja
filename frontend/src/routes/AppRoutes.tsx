import { Navigate, Route, Routes } from "react-router-dom";
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
function ProtectedLayout() {
  const { user } = useAuth();
  return user ? <Layout /> : <Navigate to="/login" replace />;
}
export default function AppRoutes() {
  return (
    <Routes>
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
  );
}
