import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import TenantSelection from "@/pages/TenantSelection";
import Dashboard from "@/pages/Dashboard";
import PlanCuentas from "@/pages/PlanCuentas";
import Terceros from "@/pages/Terceros";
import Asientos from "@/pages/Asientos";
import Niif from "@/pages/Niif";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TenantSelection} />
      <Route path="/:tenantId/dashboard" component={Dashboard} />
      <Route path="/:tenantId/cuentas" component={PlanCuentas} />
      <Route path="/:tenantId/terceros" component={Terceros} />
      <Route path="/:tenantId/asientos" component={Asientos} />
      <Route path="/:tenantId/niif" component={Niif} />
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
