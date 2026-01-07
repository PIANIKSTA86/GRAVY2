import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import LandingPage from "@/pages/LandingPage";

// Pages
import TenantSelection from "@/pages/TenantSelection";
import Dashboard from "@/pages/Dashboard";
import PlanCuentas from "@/pages/PlanCuentas";
import Terceros from "@/pages/Terceros";
import Asientos from "@/pages/Asientos";
import Niif from "@/pages/Niif";

function Router() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app" component={TenantSelection} />
      <Route path=":tenantId/dashboard" component={Dashboard} />
      <Route path=":tenantId/cuentas" component={PlanCuentas} />
      <Route path=":tenantId/terceros" component={Terceros} />
      <Route path=":tenantId/asientos" component={Asientos} />
      <Route path=":tenantId/niif" component={Niif} />
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
