import { useState } from "react";
import { useComms } from "@/lib/hooks";
import { generateNewId, type Communication, type CommChannel, type CommCategory, type CommDirection, type Priority, type Property } from "@/lib/store";
import { MessageSquare, Phone, Mail, Users, Clock, Plus, Filter, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Check } from "lucide-react";

const CHANNEL_ICONS: Record<CommChannel, typeof MessageSquare> = {
  whatsapp: MessageSquare, sms: Phone, email: Mail, internal: Users,
};
const CHANNEL_COLORS: Record<CommChannel, string> = {
  whatsapp: "text-green-400", sms: "text-blue-400", email: "text-purple-400", internal: "text-primary",
};
const DIR_ICONS: Record<CommDirection, typeof ArrowDownLeft> = {
  inbound: ArrowDownLeft, outbound: ArrowUpRight, internal: ArrowLeftRight,
};
const CAT_LABELS: Record<CommCategory, string> = {
  "guest-request": "Guest Request", "staff-update": "Staff Update",
  vendor: "Vendor", complaint: "Complaint", info: "Info",
};
const PRIORITY_DOT: Record<Priority, string> = {
  critical: "bg-red-500", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-blue-400",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommunicationsPage() {
  const { comms, save } = useComms();
  const [filterChannel, setFilterChannel] = useState<CommChannel | "all">("all");
  const [filterCategory, setFilterCategory] = useState<CommCategory | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [newComm, setNewComm] = useState({ channel: "whatsapp" as CommChannel, direction: "inbound" as CommDirection, from: "", to: "", originalMessage: "", category: "guest-request" as CommCategory, priority: "medium" as Priority, property: "Ocean Park" as Property });

  const filtered = comms.filter((c) => {
    if (filterChannel !== "all" && c.channel !== filterChannel) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markRead = (id: string) => {
    save(comms.map((c) => c.id === id ? { ...c, isRead: true } : c));
  };

  const handleCreate = () => {
    if (!newComm.originalMessage.trim()) return;
    const comm: Communication = {
      id: generateNewId(), ...newComm,
      structuredSummary: newComm.originalMessage.slice(0, 80),
      createdAt: new Date().toISOString(), isRead: false,
    };
    save([comm, ...comms]);
    setNewComm({ channel: "whatsapp", direction: "inbound", from: "", to: "", originalMessage: "", category: "guest-request", priority: "medium", property: "Ocean Park" });
    setShowCompose(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl" data-testid="comms-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl mb-1">Communications</h1>
          <p className="text-sm text-muted-foreground">
            {comms.filter((c) => !c.isRead).length} unread of {comms.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted/50" data-testid="btn-filter-comms">
            <Filter size={14} /> Filter
          </button>
          <button onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90" data-testid="btn-compose">
            <Plus size={14} /> Log Message
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 rounded-lg border border-border bg-card flex flex-wrap gap-3">
          <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value as CommChannel | "all")}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="internal">Internal</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as CommCategory | "all")}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
            <option value="all">All Categories</option>
            {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      )}

      {showCompose && (
        <div className="mb-4 p-4 rounded-lg border border-primary/30 bg-card space-y-3" data-testid="compose-form">
          <div className="flex flex-wrap gap-2">
            <select value={newComm.direction} onChange={(e) => setNewComm({ ...newComm, direction: e.target.value as CommDirection })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="internal">Internal</option>
            </select>
            <select value={newComm.channel} onChange={(e) => setNewComm({ ...newComm, channel: e.target.value as CommChannel })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="internal">Internal</option>
            </select>
            <select value={newComm.category} onChange={(e) => setNewComm({ ...newComm, category: e.target.value as CommCategory })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={newComm.priority} onChange={(e) => setNewComm({ ...newComm, priority: e.target.value as Priority })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select value={newComm.property} onChange={(e) => setNewComm({ ...newComm, property: e.target.value as Property })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="Ocean Park">Ocean Park</option>
              <option value="Isla Verde">Isla Verde</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="From" value={newComm.from} onChange={(e) => setNewComm({ ...newComm, from: e.target.value })}
              className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground" data-testid="input-comm-from" />
            <input type="text" placeholder="To" value={newComm.to} onChange={(e) => setNewComm({ ...newComm, to: e.target.value })}
              className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground" data-testid="input-comm-to" />
          </div>
          <textarea placeholder="Message content..." value={newComm.originalMessage} onChange={(e) => setNewComm({ ...newComm, originalMessage: e.target.value })}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground resize-none h-24" data-testid="input-comm-message" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCompose(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium" data-testid="btn-submit-comm">Log</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((comm) => {
          const ChannelIcon = CHANNEL_ICONS[comm.channel];
          const DirIcon = DIR_ICONS[comm.direction];
          const isExpanded = selected === comm.id;
          return (
            <div key={comm.id}
              className={`rounded-lg border bg-card overflow-hidden transition-colors ${!comm.isRead ? "border-primary/30" : "border-border"}`}
              data-testid={`comm-${comm.id}`}>
              <div className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/20"
                onClick={() => { setSelected(isExpanded ? null : comm.id); if (!comm.isRead) markRead(comm.id); }}>
                <div className={`mt-0.5 ${CHANNEL_COLORS[comm.channel]}`}>
                  <ChannelIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[comm.priority]}`} />
                    <span className="text-sm font-medium truncate">{comm.structuredSummary}</span>
                    {!comm.isRead && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">NEW</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DirIcon size={10} />
                    <span>{comm.from} → {comm.to}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span>{comm.property}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <Clock size={10} />
                    <span>{timeAgo(comm.createdAt)}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground capitalize">{CAT_LABELS[comm.category]}</span>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1 text-muted-foreground">Original Message:</p>
                    <div className="bg-muted/50 rounded-md p-3 text-sm italic">"{comm.originalMessage}"</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!comm.isRead && (
                      <button onClick={() => markRead(comm.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary/20 text-primary text-xs font-medium">
                        <Check size={12} /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No messages match your filters</div>
        )}
      </div>
    </div>
  );
}
