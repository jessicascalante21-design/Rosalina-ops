import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initStore } from "@/lib/store";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import CommunicationsPage from "@/pages/CommunicationsPage";
import AlertsPage from "@/pages/AlertsPage";
import AutomationsPage from "@/pages/AutomationsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

initStore();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/communications" component={CommunicationsPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/automations" component={AutomationsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("ops_hub_session");
  });

  useEffect(() => {
    const check = () => setAuthenticated(!!sessionStorage.getItem("ops_hub_session"));
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
