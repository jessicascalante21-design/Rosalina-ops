import { useState } from "react";
import { useTasks } from "@/lib/hooks";
import { generateNewId, type Task, type TaskType, type Priority, type Department, type Property, type TaskStatus } from "@/lib/store";
import { Plus, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const TYPE_LABELS: Record<TaskType, string> = {
  maintenance: "Maintenance", housekeeping: "Housekeeping", frontdesk: "Front Desk",
  management: "Management", followup: "Follow-up",
};
const PRIORITY_COLORS: Record<Priority, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-400/20 text-blue-300 border-blue-400/30",
};
const STATUS_COLORS: Record<TaskStatus, string> = {
  open: "bg-blue-500/20 text-blue-300", "in-progress": "bg-primary/20 text-primary",
  completed: "bg-green-500/20 text-green-400", cancelled: "bg-muted text-muted-foreground",
};

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide border ${className}`}>{children}</span>;
}

export default function TasksPage() {
  const { tasks, save } = useTasks();
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterProperty, setFilterProperty] = useState<Property | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", type: "maintenance" as TaskType, priority: "medium" as Priority, department: "maintenance" as Department, property: "Ocean Park" as Property, assignee: "" });

  const filtered = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterProperty !== "all" && t.property !== filterProperty && t.property !== "Both") return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => {
    const prio: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return prio[a.priority] - prio[b.priority];
  });

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: generateNewId(), ...newTask, status: "open", actions: [],
      createdAt: now, updatedAt: now,
    };
    save([task, ...tasks]);
    setNewTask({ title: "", description: "", type: "maintenance", priority: "medium", department: "maintenance", property: "Ocean Park", assignee: "" });
    setShowCreate(false);
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    save(tasks.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString(), ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}) } : t));
  };

  const deleteTask = (id: string) => {
    save(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl" data-testid="tasks-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl mb-1">Task Board</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted/50 transition-colors"
            data-testid="btn-filter">
            <Filter size={14} />
            Filter
          </button>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="btn-create-task">
            <Plus size={14} />
            New Task
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 rounded-lg border border-border bg-card flex flex-wrap gap-3">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm" data-testid="filter-priority">
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value as Property | "all")}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm" data-testid="filter-property">
            <option value="all">All Properties</option>
            <option value="Ocean Park">Ocean Park</option>
            <option value="Isla Verde">Isla Verde</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
            className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm" data-testid="filter-status">
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {showCreate && (
        <div className="mb-4 p-4 rounded-lg border border-primary/30 bg-card space-y-3" data-testid="create-task-form">
          <input type="text" placeholder="Task title" value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-task-title" autoFocus />
          <textarea placeholder="Description (optional)" value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20"
            data-testid="input-task-desc" />
          <div className="flex flex-wrap gap-2">
            <select value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select value={newTask.property} onChange={(e) => setNewTask({ ...newTask, property: e.target.value as Property })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
              <option value="Ocean Park">Ocean Park</option>
              <option value="Isla Verde">Isla Verde</option>
              <option value="Both">Both</option>
            </select>
            <input type="text" placeholder="Assignee" value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm placeholder:text-muted-foreground w-32"
              data-testid="input-task-assignee" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              data-testid="btn-submit-task">Create Task</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((task) => (
          <div key={task.id} className="rounded-lg border border-border bg-card overflow-hidden" data-testid={`task-${task.id}`}>
            <div className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                  <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
                  <span className="text-xs text-muted-foreground">{task.property}</span>
                </div>
                <h3 className="text-sm font-medium">{task.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{TYPE_LABELS[task.type]}</span>
                  {task.assignee && <span>Assigned: {task.assignee}</span>}
                  {task.roomNumber && <span>Room {task.roomNumber}</span>}
                </div>
              </div>
              {expanded === task.id ? <ChevronUp size={14} className="text-muted-foreground mt-1" /> : <ChevronDown size={14} className="text-muted-foreground mt-1" />}
            </div>
            {expanded === task.id && (
              <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                {task.actions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Action Items:</p>
                    <ul className="space-y-1">
                      {task.actions.map((a, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">-</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {task.guestName && <p className="text-xs text-muted-foreground">Guest: {task.guestName}</p>}
                <div className="flex flex-wrap gap-2 pt-1">
                  {task.status === "open" && (
                    <button onClick={() => updateStatus(task.id, "in-progress")}
                      className="px-3 py-1 rounded-md bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30"
                      data-testid={`btn-start-${task.id}`}>Start</button>
                  )}
                  {(task.status === "open" || task.status === "in-progress") && (
                    <button onClick={() => updateStatus(task.id, "completed")}
                      className="px-3 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30"
                      data-testid={`btn-complete-${task.id}`}>Complete</button>
                  )}
                  {task.status !== "cancelled" && task.status !== "completed" && (
                    <button onClick={() => updateStatus(task.id, "cancelled")}
                      className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80">Cancel</button>
                  )}
                  <button onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 rounded-md text-red-400 text-xs font-medium hover:bg-red-500/10 ml-auto"
                    data-testid={`btn-delete-${task.id}`}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No tasks match your filters</div>
        )}
      </div>
    </div>
  );
}
