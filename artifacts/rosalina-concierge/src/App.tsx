import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import { isAuthenticated } from "@/lib/staff-auth";
import { AnimatePresence } from "framer-motion";

import GuestLayout from "@/components/layout/GuestLayout";
import HubPage from "@/pages/HubPage";
import PreArrivalPage from "@/pages/PreArrivalPage";
import ConciergePage from "@/pages/ConciergePage";
import RequestPage from "@/pages/RequestPage";
import FeedbackPage from "@/pages/FeedbackPage";
import EmergencyPage from "@/pages/EmergencyPage";
import DailyReport from "@/pages/DailyReport";
import StaffLogin from "@/pages/StaffLogin";
import GuestPortalPage from "@/pages/GuestPortalPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) return <Redirect to="/staff/login" />;
  return <Component />;
}

function GuestRoute({ component: Page }: { component: React.ComponentType }) {
  return (
    <GuestLayout>
      <Page />
    </GuestLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <GuestRoute component={HubPage} />}</Route>
      <Route path="/pre-arrival">{() => <GuestRoute component={PreArrivalPage} />}</Route>
      <Route path="/concierge">{() => <GuestRoute component={ConciergePage} />}</Route>
      <Route path="/request">{() => <GuestRoute component={RequestPage} />}</Route>
      <Route path="/feedback">{() => <GuestRoute component={FeedbackPage} />}</Route>
      <Route path="/emergency">{() => <GuestRoute component={EmergencyPage} />}</Route>
      <Route path="/guest" component={GuestPortalPage} />
      <Route path="/staff/login" component={StaffLogin} />
      <Route path="/staff/report">{() => <ProtectedRoute component={DailyReport} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
