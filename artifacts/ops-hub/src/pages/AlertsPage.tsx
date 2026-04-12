import { useState } from "react";
import { useAlerts } from "@/lib/hooks";
import { generateNewId, type Alert, type AlertSeverity, type AlertStatus, type Department, type Property } from "@/lib/store";
import { AlertTriangle, AlertCircle, Info, Check, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react";

const SEV_CONFIG: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
  critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  warning: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/30" },
};
const STATUS_LABELS: Record<AlertStatus, string> = { active: "Active", acknowledged: "Acknowledged", resolved: "Resolved" };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AlertsPage() {
  const { alerts, save } = useAlerts();
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({ severity: "warning" as AlertSeverity, department: "maintenance" as Department, property: "Ocean Park" as Property, title: "", description: "" });

  const filtered = alerts.filter((a) => {
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => {
    const sev: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
    const sta: Record<AlertStatus, number> = { active: 0, acknowledged: 1, resolved: 2 };
    if (sta[a.status] !== sta[b.status]) return sta[a.status] - sta[b.status];
    return sev[a.severity] - sev[b.severity];
  });

  const updateStatus = (id: string, status: AlertStatus) => {
    save(alerts.map((a) => a.id === id ? {
      ...a, status, ...(status === "resolved" ? { resolvedAt: new Date().toISOString(), resolvedBy: "Staff" } : {})
    } : a));
  };

  const handleCreate = () => {
    if (!newAlert.title.trim()) return;
    const alert: Alert = {
      id: generateNewId(), ...newAlert, status: "active", actions: [],
      createdAt: new Date().toISOString(),
    };
    save([alert, ...alerts]);
    setNewAlert({ severity: "warning", department: "maintenance", property: "Ocean Park", title: "", description: "" });
    setShowCreate(false);
  };

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status === "active").length;

  return (
    <div className="p-4 md:p-6 max-w-5xl" data-testid="alerts-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl mb-1">Alerts Center</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} active{criticalCount > 0 ? `, ${criticalCount} critical` : ""}
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          data-testid="btn-create-alert">
          <Plus size={14} /> New Alert
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "critical", "warning", "info"] as const).map((s) => (
          <button key={s} onClick={() => setFilterSeverity(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterSeverity === s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {(["all", "active", "acknowledged", "resolved"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterStatus === s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {showCreate && (
        <div className="mb-4 p-4 rounded-lg border border-primary/30 bg-card space-y-3" data-testid="create-alert-form">
          <input type="text" placeholder="Alert title" value={newAlert.title}
            onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-alert-title" autoFocus />
          <textarea placeholder="Description" value={newAlert.description}
            onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground resize-none h-20" />
          <div className="flex flex-wrap gap-2">
            <select value={newAlert.severity} onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as AlertSeverity })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <select value={newAlert.department} onChange={(e) => setNewAlert({ ...newAlert, department: e.target.value as Department })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="maintenance">Maintenance</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="frontdesk">Front Desk</option>
              <option value="management">Management</option>
            </select>
            <select value={newAlert.property} onChange={(e) => setNewAlert({ ...newAlert, property: e.target.value as Property })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="Ocean Park">Ocean Park</option>
              <option value="Isla Verde">Isla Verde</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium" data-testid="btn-submit-alert">Create</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((alert) => {
          const config = SEV_CONFIG[alert.severity];
          const Icon = config.icon;
          const isExpanded = expanded === alert.id;
          return (
            <div key={alert.id} className={`rounded-lg border overflow-hidden ${alert.status === "resolved" ? "border-border opacity-60" : config.border} bg-card`}
              data-testid={`alert-${alert.id}`}>
              <div className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/20"
                onClick={() => setExpanded(isExpanded ? null : alert.id)}>
                <div className={`mt-0.5 ${config.color}`}><Icon size={16} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${config.bg} ${config.color}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{STATUS_LABELS[alert.status]}</span>
                  </div>
                  <h3 className="text-sm font-medium mt-1">{alert.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{alert.property}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span className="capitalize">{alert.department}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <Clock size={10} />
                    <span>{timeAgo(alert.createdAt)}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-muted-foreground mt-1" /> : <ChevronDown size={14} className="text-muted-foreground mt-1" />}
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.actions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Required Actions:</p>
                      <ul className="space-y-1">
                        {alert.actions.map((a, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">-</span> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {alert.resolvedAt && <p className="text-xs text-muted-foreground">Resolved: {new Date(alert.resolvedAt).toLocaleString()} by {alert.resolvedBy}</p>}
                  <div className="flex gap-2">
                    {alert.status === "active" && (
                      <button onClick={() => updateStatus(alert.id, "acknowledged")}
                        className="px-3 py-1 rounded-md bg-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/30"
                        data-testid={`btn-ack-${alert.id}`}>Acknowledge</button>
                    )}
                    {alert.status !== "resolved" && (
                      <button onClick={() => updateStatus(alert.id, "resolved")}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30"
                        data-testid={`btn-resolve-${alert.id}`}>
                        <Check size={12} /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No alerts match your filters</div>
        )}
      </div>
    </div>
  );
}
