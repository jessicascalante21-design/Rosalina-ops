import { useAutomations } from "@/lib/hooks";
import type { AutoCategory } from "@/lib/store";
import { Zap, Clock, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const CAT_LABELS: Record<AutoCategory, string> = {
  checkin: "Check-in", checkout: "Check-out", maintenance: "Maintenance",
  housekeeping: "Housekeeping", communication: "Communication",
};
const CAT_COLORS: Record<AutoCategory, string> = {
  checkin: "bg-green-500/10 text-green-400 border-green-500/30",
  checkout: "bg-blue-500/10 text-blue-400 border-blue-400/30",
  maintenance: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  housekeeping: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  communication: "bg-primary/10 text-primary border-primary/30",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AutomationsPage() {
  const { autos, save } = useAutomations();
  const [filterCat, setFilterCat] = useState<AutoCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = autos.filter((a) => filterCat === "all" || a.category === filterCat);
  const activeCount = autos.filter((a) => a.isActive).length;
  const totalTriggers = autos.reduce((s, a) => s + a.triggerCount, 0);

  const toggle = (id: string) => {
    save(autos.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl" data-testid="automations-page">
      <div className="mb-6">
        <h1 className="font-serif text-2xl mb-1">Automation Library</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} active automations | {totalTriggers} total triggers
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-serif">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-serif">{autos.length - activeCount}</p>
          <p className="text-xs text-muted-foreground">Paused</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-serif">{totalTriggers}</p>
          <p className="text-xs text-muted-foreground">Total Triggers</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "checkin", "checkout", "maintenance", "housekeeping", "communication"] as const).map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterCat === cat ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {cat === "all" ? "All" : CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((auto) => {
          const isExpanded = expanded === auto.id;
          return (
            <div key={auto.id} className={`rounded-lg border bg-card overflow-hidden transition-colors ${auto.isActive ? "border-primary/20" : "border-border opacity-60"}`}
              data-testid={`automation-${auto.id}`}>
              <div className="px-4 py-3 flex items-start gap-3">
                <button onClick={() => toggle(auto.id)} className="mt-0.5 shrink-0" data-testid={`toggle-${auto.id}`}>
                  {auto.isActive ? (
                    <ToggleRight size={22} className="text-primary" />
                  ) : (
                    <ToggleLeft size={22} className="text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : auto.id)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide border ${CAT_COLORS[auto.category]}`}>
                      {CAT_LABELS[auto.category]}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">{auto.department}</span>
                  </div>
                  <h3 className="text-sm font-medium">{auto.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap size={10} /> Trigger: {auto.trigger}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{auto.triggerCount}</p>
                  <p className="text-[10px] text-muted-foreground">triggers</p>
                </div>
                <button onClick={() => setExpanded(isExpanded ? null : auto.id)} className="mt-1">
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1">Actions:</p>
                    <ul className="space-y-1">
                      {auto.actions.map((a, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">{i + 1}.</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {auto.lastTriggered && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={10} />
                      <span>Last triggered: {timeAgo(auto.lastTriggered)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No automations in this category</div>
        )}
      </div>
    </div>
  );
}
