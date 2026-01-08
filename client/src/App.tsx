import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";

// Pages - Contabilidad
import TenantSelection from "@/pages/TenantSelection";
import Dashboard from "@/pages/Dashboard";
import PlanCuentas from "@/pages/PlanCuentas";
import Terceros from "@/pages/Terceros";
import Asientos from "@/pages/Asientos";
import Niif from "@/pages/Niif";
import Periodos from "@/pages/Periodos";
import Comprobantes from "@/pages/Comprobantes";

// Pages - Mi Comunidad
import Unidades from "@/pages/Unidades";
import FacturaciónPH from "@/pages/FacturaciónPH";
import Reservas from "@/pages/Reservas";
import Documentos from "@/pages/Documentos";
import PQRS from "@/pages/PQRS";

function Router() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Proteger rutas - redirigir a login si no está autenticado
  if (!user && location !== "/" && location !== "/login") {
    setLocation("/login");
    return null;
  }

  // Si está autenticado en landing, redirigir a /app
  if (user && location === "/") {
    setLocation("/app");
    return null;
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/app" component={TenantSelection} />
      <Route path=":tenantId/dashboard" component={Dashboard} />
      {/* Contabilidad */}
      <Route path=":tenantId/cuentas" component={PlanCuentas} />
      <Route path=":tenantId/terceros" component={Terceros} />
      <Route path=":tenantId/asientos" component={Asientos} />
      <Route path=":tenantId/niif" component={Niif} />
      <Route path=":tenantId/periodos" component={Periodos} />
      <Route path=":tenantId/comprobantes" component={Comprobantes} />
      {/* Mi Comunidad */}
      <Route path=":tenantId/unidades" component={Unidades} />
      <Route path=":tenantId/facturacion-ph" component={FacturaciónPH} />
      <Route path=":tenantId/reservas" component={Reservas} />
      <Route path=":tenantId/documentos" component={Documentos} />
      <Route path=":tenantId/pqrs" component={PQRS} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
