import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { LeaveGuardProvider } from "./contexts/LeaveGuardContext";
import { useInputMode } from "./hooks/useInputMode";
import AppRoutes from "./routes/AppRoutes";
export default function App() {
  useInputMode();
  return (
    <AuthProvider>
      <LeaveGuardProvider>
        <AppRoutes />
        <Toaster richColors closeButton position="bottom-right" />
      </LeaveGuardProvider>
    </AuthProvider>
  );
}
