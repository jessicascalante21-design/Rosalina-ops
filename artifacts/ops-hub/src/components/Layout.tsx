import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ListTodo, MessageSquare, AlertTriangle, Zap, Menu, X, LogOut } from "lucide-react";

const NAV = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tasks", label: "Tasks", icon: ListTodo },
  { path: "/communications", label: "Comms", icon: MessageSquare },
  { path: "/alerts", label: "Alerts", icon: AlertTriangle },
  { path: "/automations", label: "Automations", icon: Zap },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("ops_hub_session");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex" data-testid="ops-layout">
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border">
          <h1 className="font-serif text-lg tracking-wide text-primary" data-testid="brand-title">Rosalina</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-0.5">Operations Hub</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const active = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}>
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full transition-colors"
            data-testid="btn-logout">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="font-serif text-lg tracking-wide text-primary">Rosalina</h1>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-0.5">Operations Hub</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {NAV.map((item) => {
                const active = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      active ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}>
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-border">
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full transition-colors">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar">
          <button onClick={() => setMobileOpen(true)} className="text-muted-foreground" data-testid="btn-mobile-menu">
            <Menu size={20} />
          </button>
          <h1 className="font-serif text-base tracking-wide text-primary">Rosalina Ops</h1>
          <div className="w-5" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
