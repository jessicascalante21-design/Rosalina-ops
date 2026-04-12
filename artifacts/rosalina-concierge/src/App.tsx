import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import { isAuthenticated } from "@/lib/staff-auth";
import ErrorBoundary from "@/components/ErrorBoundary";

import GuestLayout from "@/components/layout/GuestLayout";

const HubPage = lazy(() => import("@/pages/HubPage"));
const PreArrivalPage = lazy(() => import("@/pages/PreArrivalPage"));
const ConciergePage = lazy(() => import("@/pages/ConciergePage"));
const RequestPage = lazy(() => import("@/pages/RequestPage"));
const FeedbackPage = lazy(() => import("@/pages/FeedbackPage"));
const EmergencyPage = lazy(() => import("@/pages/EmergencyPage"));
const DailyReport = lazy(() => import("@/pages/DailyReport"));
const StaffLogin = lazy(() => import("@/pages/StaffLogin"));
const GuestPortalPage = lazy(() => import("@/pages/GuestPortalPage"));
const WelcomeGuidePage = lazy(() => import("@/pages/WelcomeGuidePage"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1730]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
    </div>
  );
}

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
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/">{() => <GuestRoute component={HubPage} />}</Route>
        <Route path="/pre-arrival">{() => <GuestRoute component={PreArrivalPage} />}</Route>
        <Route path="/concierge">{() => <GuestRoute component={ConciergePage} />}</Route>
        <Route path="/request">{() => <GuestRoute component={RequestPage} />}</Route>
        <Route path="/feedback">{() => <GuestRoute component={FeedbackPage} />}</Route>
        <Route path="/emergency">{() => <GuestRoute component={EmergencyPage} />}</Route>
        <Route path="/guest" component={GuestPortalPage} />
        <Route path="/guide">{() => <GuestRoute component={WelcomeGuidePage} />}</Route>
        <Route path="/staff/login" component={StaffLogin} />
        <Route path="/staff/report">{() => <ProtectedRoute component={DailyReport} />}</Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
