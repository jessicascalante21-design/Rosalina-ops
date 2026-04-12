import { useTasks, useComms, useAlerts, useAutomations } from "@/lib/hooks";
import { Link } from "wouter";
import { ListTodo, MessageSquare, AlertTriangle, Zap, ArrowRight, Clock, Building2 } from "lucide-react";
import type { Priority } from "@/lib/store";

function PriorityDot({ priority }: { priority: Priority }) {
  const colors: Record<Priority, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-400",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[priority]}`} />;
}

function StatCard({ label, value, icon: Icon, accent, href }: {
  label: string; value: number; icon: typeof ListTodo; accent?: string; href: string;
}) {
  return (
    <Link href={href} className="block" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center ${accent || "bg-primary/10"}`}>
            <Icon size={16} className="text-primary" />
          </div>
          <ArrowRight size={14} className="text-muted-foreground" />
        </div>
        <p className="text-2xl font-semibold font-serif">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { tasks } = useTasks();
  const { comms } = useComms();
  const { alerts } = useAlerts();
  const { autos } = useAutomations();

  const activeTasks = tasks.filter((t) => t.status === "open" || t.status === "in-progress");
  const unreadComms = comms.filter((c) => !c.isRead);
  const activeAlerts = alerts.filter((a) => a.status === "active" || a.status === "acknowledged");
  const activeAutos = autos.filter((a) => a.isActive);
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "active");

  const opTasks = tasks.filter((t) => t.property === "Ocean Park" && (t.status === "open" || t.status === "in-progress"));
  const ivTasks = tasks.filter((t) => t.property === "Isla Verde" && (t.status === "open" || t.status === "in-progress"));

  const recent = [
    ...tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled").map((t) => ({
      id: t.id, type: "task" as const, title: t.title, priority: t.priority,
      time: t.updatedAt, property: t.property, status: t.status,
    })),
    ...alerts.filter((a) => a.status !== "resolved").map((a) => ({
      id: a.id, type: "alert" as const, title: a.title, priority: a.severity === "critical" ? "critical" as const : a.severity === "warning" ? "high" as const : "low" as const,
      time: a.createdAt, property: a.property, status: a.status,
    })),
    ...comms.filter((c) => !c.isRead).map((c) => ({
      id: c.id, type: "comm" as const, title: c.structuredSummary, priority: c.priority,
      time: c.createdAt, property: c.property, status: c.direction,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const typeIcons = { task: ListTodo, alert: AlertTriangle, comm: MessageSquare };

  return (
    <div className="p-4 md:p-6 max-w-5xl" data-testid="dashboard-page">
      <div className="mb-6">
        <h1 className="font-serif text-2xl mb-1">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time overview across both properties</p>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/5 p-4" data-testid="critical-banner">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-sm font-medium text-red-400">
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""}
            </span>
          </div>
          {criticalAlerts.map((a) => (
            <p key={a.id} className="text-sm text-red-300/80 ml-6">{a.title} - {a.property}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Tasks" value={activeTasks.length} icon={ListTodo} href="/tasks" />
        <StatCard label="Unread Messages" value={unreadComms.length} icon={MessageSquare} href="/communications" />
        <StatCard label="Open Alerts" value={activeAlerts.length} icon={AlertTriangle} href="/alerts" />
        <StatCard label="Active Automations" value={activeAutos.length} icon={Zap} href="/automations" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-base">Recent Activity</h2>
              <span className="text-xs text-muted-foreground">{recent.length} items</span>
            </div>
            <div className="divide-y divide-border">
              {recent.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No recent activity</div>
              )}
              {recent.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <div key={item.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                    data-testid={`activity-${item.id}`}>
                    <div className="mt-0.5">
                      <Icon size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <PriorityDot priority={item.priority} />
                        <span className="text-sm truncate">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.property}</span>
                        <span>-</span>
                        <Clock size={10} />
                        <span>{timeAgo(item.time)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4" data-testid="property-ocean-park">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-primary" />
              <h3 className="text-sm font-medium">Ocean Park</h3>
            </div>
            <p className="text-2xl font-serif mb-1">{opTasks.length}</p>
            <p className="text-xs text-muted-foreground">active tasks</p>
            <div className="mt-3 space-y-1.5">
              {opTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <PriorityDot priority={t.priority} />
                  <span className="text-xs truncate">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4" data-testid="property-isla-verde">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-primary" />
              <h3 className="text-sm font-medium">Isla Verde</h3>
            </div>
            <p className="text-2xl font-serif mb-1">{ivTasks.length}</p>
            <p className="text-xs text-muted-foreground">active tasks</p>
            <div className="mt-3 space-y-1.5">
              {ivTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <PriorityDot priority={t.priority} />
                  <span className="text-xs truncate">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
