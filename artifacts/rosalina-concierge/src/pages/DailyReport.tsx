import { useState, useEffect, useMemo } from "react";
import { Download, Trash2, RefreshCw, ClipboardCopy, CheckCircle, LogOut, Users, ClipboardList, MessageSquare, Hotel, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { clearSession } from "@/lib/staff-auth";
import { useLocation } from "wouter";
import logoUrl from "@assets/image_1775935433037.png";

type TabType = "today" | "prearrivals" | "guests" | "insights";

interface ReportEntry {
  type: "service" | "feedback" | "pre-arrival";
  timestamp: string;
  name?: string;
  room?: string;
  service?: string;
  urgency?: string;
  details?: string;
  feedbackType?: string;
  message?: string;
  reservationNumber?: string;
  property?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  earlyCheckin?: boolean;
  luggageStorage?: boolean;
}

interface GuestRecord {
  name: string;
  reservationNumber: string;
  property: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  numGuests: string;
  earlyCheckin: boolean;
  luggageStorage: boolean;
  carStatus: string;
  preferredContact: string;
  specialRequests: string;
  createdAt: string;
  password: string;
}

interface FAQEntry {
  q: string;
  ts: string;
}

interface FAQGroup {
  question: string;
  count: number;
  lastAsked: string;
  category: string;
}

const FAQ_CATEGORIES: Record<string, { keywords: string[]; label: string; labelEs: string }> = {
  wifi: { keywords: ["wifi", "wi-fi", "password", "clave", "internet", "contraseña"], label: "WiFi & Connectivity", labelEs: "WiFi y Conectividad" },
  checkin: { keywords: ["check-in", "checkin", "check in", "lockbox", "candado", "codigo", "code", "key", "llave", "arrival", "llegada"], label: "Check-in & Access", labelEs: "Check-in y Acceso" },
  checkout: { keywords: ["check-out", "checkout", "check out", "late", "salida"], label: "Check-out", labelEs: "Check-out" },
  beach: { keywords: ["beach", "playa", "towel", "toalla", "swim", "nadar", "ocean", "oceano", "surf"], label: "Beach & Pool", labelEs: "Playa y Piscina" },
  food: { keywords: ["restaurant", "restaurante", "food", "comida", "eat", "comer", "breakfast", "desayuno", "dinner", "cena", "brunch", "coffee", "cafe"], label: "Dining", labelEs: "Gastronomia" },
  activities: { keywords: ["do", "hacer", "activity", "actividad", "tour", "kayak", "snorkel", "yunque", "san juan", "bacardi", "experience", "experiencia"], label: "Activities", labelEs: "Actividades" },
  transport: { keywords: ["uber", "lyft", "taxi", "car", "auto", "airport", "aeropuerto", "drive", "parking", "estacionar", "bus"], label: "Transport", labelEs: "Transporte" },
  amenities: { keywords: ["pool", "piscina", "tv", "ac", "air", "kitchen", "cocina", "fridge", "microwave", "laundry", "lavanderia"], label: "Amenities", labelEs: "Amenidades" },
  rules: { keywords: ["pet", "mascota", "smoke", "fumar", "quiet", "party", "fiesta", "noise", "ruido", "guest"], label: "Policies", labelEs: "Politicas" },
  general: { keywords: [], label: "General", labelEs: "General" },
};

function categorizeQuestion(q: string): string {
  const lower = q.toLowerCase();
  for (const [cat, { keywords }] of Object.entries(FAQ_CATEGORIES)) {
    if (cat === "general") continue;
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return "general";
}

function groupFAQs(entries: FAQEntry[]): FAQGroup[] {
  const groups = new Map<string, { count: number; lastAsked: string; original: string }>();

  for (const entry of entries) {
    const normalized = entry.q
      .replace(/[?¿!¡.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const key = normalized.split(" ").slice(0, 6).join(" ");

    const existing = groups.get(key);
    if (existing) {
      existing.count++;
      if (entry.ts > existing.lastAsked) {
        existing.lastAsked = entry.ts;
      }
    } else {
      groups.set(key, { count: 1, lastAsked: entry.ts, original: entry.q });
    }
  }

  return Array.from(groups.entries())
    .map(([, v]) => ({
      question: v.original,
      count: v.count,
      lastAsked: v.lastAsked,
      category: categorizeQuestion(v.original),
    }))
    .sort((a, b) => b.count - a.count);
}

export default function DailyReport() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [faqEntries, setFaqEntries] = useState<FAQEntry[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [copied, setCopied] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);

  const handleLogout = () => { clearSession(); setLocation("/"); };

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("rosalina_report") || "[]") as ReportEntry[];
    setEntries(data);
    const gData = JSON.parse(localStorage.getItem("rosalina_guests") || "[]") as GuestRecord[];
    setGuests(gData);
    const fData = JSON.parse(localStorage.getItem("rosalina_chat_faq") || "[]") as FAQEntry[];
    setFaqEntries(fData);
  };

  const isToday = (iso: string) => {
    const d = new Date(iso); const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };

  const todayEntries = entries.filter((e) => isToday(e.timestamp) && e.type !== "pre-arrival");
  const preArrivalEntries = entries.filter((e) => e.type === "pre-arrival");
  const serviceEntries = todayEntries.filter((e) => e.type === "service");
  const feedbackEntries = todayEntries.filter((e) => e.type === "feedback");
  const urgentCount = serviceEntries.filter((e) => e.urgency === "Urgent").length;

  const faqGroups = useMemo(() => groupFAQs(faqEntries), [faqEntries]);
  const todayFaqCount = faqEntries.filter((e) => isToday(e.ts)).length;

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of faqGroups) {
      counts[g.category] = (counts[g.category] || 0) + g.count;
    }
    return Object.entries(counts)
      .map(([cat, count]) => ({
        category: cat,
        label: FAQ_CATEGORIES[cat]?.label || cat,
        labelEs: FAQ_CATEGORIES[cat]?.labelEs || cat,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [faqGroups]);

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const toReportCSV = () => {
    const hdr = "Type,Timestamp,Name,Room,Service/Feedback Type,Urgency,Details\n";
    const rows = todayEntries.map((e) =>
      [e.type, new Date(e.timestamp).toLocaleString("en-US"), e.name || "Anonymous", e.room || "",
       e.service || e.feedbackType || "", e.urgency || "",
       `"${(e.details || e.message || "").replace(/"/g, '""')}"`].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const toGuestsCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Departure,Guests,Early Check-in,Luggage Storage,Car,Contact,Special Requests,Registered\n";
    const rows = guests.map((g) =>
      [g.name, g.reservationNumber, g.property, g.arrivalDate, g.arrivalTime || "",
       g.departureDate || "", g.numGuests, g.earlyCheckin ? "YES" : "No", g.luggageStorage ? "YES" : "No",
       g.carStatus, g.preferredContact, `"${(g.specialRequests || "").replace(/"/g, '""')}"`,
       new Date(g.createdAt).toLocaleString("en-US")].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const toPreArrivalCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Early Check-in,Luggage Storage,Submitted\n";
    const rows = preArrivalEntries.map((e) =>
      [e.name || "", e.reservationNumber || "", e.property || "", e.arrivalDate || "",
       e.arrivalTime || "", e.earlyCheckin ? "YES" : "No", e.luggageStorage ? "YES" : "No",
       new Date(e.timestamp).toLocaleString("en-US")].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const toFaqCSV = () => {
    const hdr = "Question,Count,Category,Last Asked\n";
    const rows = faqGroups.map((g) =>
      [`"${g.question.replace(/"/g, '""')}"`, g.count, g.category, new Date(g.lastAsked).toLocaleString("en-US")].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const handleEmailReport = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const body = [
      `ROSALINA DAILY REPORT: ${today}`, ``,
      `SUMMARY`, `Total: ${todayEntries.length}`, `Service: ${serviceEntries.length} (${urgentCount} urgent)`, `Feedback: ${feedbackEntries.length}`, `AI Chat Questions Today: ${todayFaqCount}`, ``,
      serviceEntries.length > 0 ? `SERVICE REQUESTS` : "",
      ...serviceEntries.map((e) => `[${fmt(e.timestamp)}] Room ${e.room}, ${e.name}: ${e.service} (${e.urgency})${e.details ? " - " + e.details : ""}`),
      ``, feedbackEntries.length > 0 ? `FEEDBACK` : "",
      ...feedbackEntries.map((e) => `[${fmt(e.timestamp)}] ${e.feedbackType} from ${e.name}: ${e.message}`),
      ``, faqGroups.length > 0 ? `TOP AI CHAT QUESTIONS (All Time)` : "",
      ...faqGroups.slice(0, 10).map((g, i) => `${i + 1}. "${g.question}" (${g.count}x, ${g.category})`),
    ].filter(Boolean).join("\n");
    const subject = encodeURIComponent(`Rosalina Daily Report: ${today}`);
    window.location.href = `mailto:contact@rosalinapr.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleClearToday = () => {
    const keep = entries.filter((e) => !isToday(e.timestamp));
    localStorage.setItem("rosalina_report", JSON.stringify(keep));
    setEntries(keep);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const handleClearFaq = () => {
    localStorage.setItem("rosalina_chat_faq", "[]");
    setFaqEntries([]);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const tabs: { id: TabType; label: string; count: number; icon: React.ElementType }[] = [
    { id: "today", label: t("Today", "Hoy"), count: todayEntries.length, icon: ClipboardList },
    { id: "prearrivals", label: t("Pre-Arrivals", "Pre-Llegadas"), count: preArrivalEntries.length, icon: Hotel },
    { id: "guests", label: t("Guests", "Huéspedes"), count: guests.length, icon: Users },
    { id: "insights", label: t("AI Insights", "IA Insights"), count: faqEntries.length, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="px-6 pt-12 pb-8 text-white bg-[#0D1B40]">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img src={logoUrl} alt="Rosalina" className="w-10 h-10 object-contain brightness-0 invert opacity-70 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-primary mb-1">Staff · Admin</p>
              <h1 className="font-serif text-4xl font-light mb-1">Dashboard</h1>
              <p className="text-white/50 text-sm">{today}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white/50 hover:text-white/80 text-xs transition-colors mt-1" data-testid="button-staff-logout">
            <LogOut className="w-3.5 h-3.5" /> {t("Logout", "Salir")}
          </button>
        </div>
      </div>

      <div className="px-6 py-5 bg-secondary/20 grid grid-cols-4 gap-3 text-center">
        {[
          { value: todayEntries.length, label: t("Today", "Hoy") },
          { value: serviceEntries.length, label: t("Requests", "Solicitudes") },
          { value: urgentCount, label: t("Urgent", "Urgentes"), red: urgentCount > 0 },
          { value: todayFaqCount, label: t("AI Chats", "Chats IA") },
        ].map((s) => (
          <div key={s.label} className={`bg-card rounded-2xl p-3 border shadow-sm ${s.red ? "border-destructive/40" : "border-border"}`}>
            <p className={`font-serif text-2xl font-medium ${s.red ? "text-destructive" : "text-foreground"}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pt-4 pb-2">
        <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-border text-muted-foreground"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "today" && (
        <div className="px-6 pb-32">
          <div className="flex flex-wrap gap-2 py-4">
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(toReportCSV()); setCopied("report"); setTimeout(() => setCopied(null), 2500); }} className="flex items-center gap-1.5 rounded-full" data-testid="button-copy-csv" disabled={todayEntries.length === 0}>
              {copied === "report" ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
              {copied === "report" ? t("Copied!", "Copiado!") : t("Copy CSV", "Copiar CSV")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { const d = new Date().toISOString().split("T")[0]; downloadCSV(toReportCSV(), `rosalina-report-${d}.csv`); }} className="flex items-center gap-1.5 rounded-full" data-testid="button-download-csv" disabled={todayEntries.length === 0}>
              <Download className="w-3.5 h-3.5" /> {t("Download CSV", "Descargar CSV")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmailReport} className="flex items-center gap-1.5 rounded-full" data-testid="button-email-report" disabled={todayEntries.length === 0}>
              <RefreshCw className="w-3.5 h-3.5" /> {t("Email Report", "Enviar Email")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearToday} className="flex items-center gap-1.5 rounded-full text-destructive hover:text-destructive" data-testid="button-clear-today" disabled={todayEntries.length === 0}>
              <Trash2 className="w-3.5 h-3.5" /> {cleared ? t("Cleared", "Eliminado") : t("Clear Today", "Limpiar hoy")}
            </Button>
          </div>

          <div className="space-y-3">
            {todayEntries.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-serif text-2xl mb-2">{t("No entries today", "Sin registros hoy")}</p>
                <p className="text-sm">{t("Service requests and feedback will appear here.", "Las solicitudes y comentarios apareceran aqui.")}</p>
              </div>
            ) : (
              [...todayEntries].reverse().map((entry, i) => (
                <div key={i} className={`bg-card rounded-2xl border p-4 shadow-sm ${entry.urgency === "Urgent" ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${entry.type === "service" ? "bg-primary/12 text-primary" : "bg-accent/12 text-amber-700"}`}>
                        {entry.type === "service" ? t("Service", "Servicio") : t("Feedback", "Comentario")}
                      </span>
                      {entry.urgency === "Urgent" && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-destructive/12 text-destructive">{t("Urgent", "Urgente")}</span>}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{fmt(entry.timestamp)}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">{entry.name || "Anonymous"}</span>{entry.room && <span className="text-muted-foreground ml-2">Room {entry.room}</span>}</p>
                    <p className="text-muted-foreground">{entry.service || entry.feedbackType}{entry.urgency && entry.urgency !== "Urgent" && <span className="ml-2 text-xs">· {entry.urgency}</span>}</p>
                    {(entry.details || entry.message) && <p className="text-foreground/80 pt-2 border-t border-border mt-2">{entry.details || entry.message}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "prearrivals" && (
        <div className="px-6 pb-32">
          <div className="flex flex-wrap gap-2 py-4">
            <Button variant="outline" size="sm" onClick={() => { const d = new Date().toISOString().split("T")[0]; downloadCSV(toPreArrivalCSV(), `rosalina-prearrivals-${d}.csv`); }} className="flex items-center gap-1.5 rounded-full" disabled={preArrivalEntries.length === 0}>
              <Download className="w-3.5 h-3.5" /> {t("Download Pre-Arrivals CSV", "Descargar Pre-Llegadas CSV")}
            </Button>
          </div>

          <div className="space-y-3">
            {preArrivalEntries.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-serif text-2xl mb-2">{t("No pre-arrivals yet", "Sin pre-llegadas aun")}</p>
              </div>
            ) : (
              [...preArrivalEntries].reverse().map((e, i) => (
                <div key={i} className={`bg-card rounded-2xl border p-4 shadow-sm ${(e.earlyCheckin || e.luggageStorage) ? "border-primary/20" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">Pre-Arrival</span>
                      {e.earlyCheckin && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">Early Check-in</span>}
                      {e.luggageStorage && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Luggage</span>}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{fmtDate(e.timestamp)}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">{e.name}</span>{e.reservationNumber && <span className="text-muted-foreground ml-2">#{e.reservationNumber}</span>}</p>
                    <p className="text-muted-foreground">{e.property} · Arriving {e.arrivalDate}{e.arrivalTime ? " ~" + e.arrivalTime : ""}</p>
                    {e.details && <p className="text-foreground/70 pt-2 border-t border-border mt-2 text-xs leading-relaxed">{e.details}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "guests" && (
        <div className="px-6 pb-32">
          <div className="flex flex-wrap gap-2 py-4">
            <Button variant="outline" size="sm" onClick={() => { const d = new Date().toISOString().split("T")[0]; downloadCSV(toGuestsCSV(), `rosalina-guests-${d}.csv`); }} className="flex items-center gap-1.5 rounded-full" disabled={guests.length === 0}>
              <Download className="w-3.5 h-3.5" /> {t("Download Guest List CSV", "Descargar Lista CSV")}
            </Button>
          </div>

          <div className="space-y-3">
            {guests.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-serif text-2xl mb-2">{t("No guest accounts yet", "Sin cuentas de huesped aun")}</p>
              </div>
            ) : (
              [...guests].reverse().map((g, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-sm">{g.name}</p>
                      <p className="text-xs text-muted-foreground">#{g.reservationNumber} · {g.property}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{fmtDate(g.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div><span className="text-muted-foreground">Arrival: </span><span className="font-medium">{g.arrivalDate}{g.arrivalTime ? " ~" + g.arrivalTime : ""}</span></div>
                    <div><span className="text-muted-foreground">Guests: </span><span className="font-medium">{g.numGuests}</span></div>
                    {g.earlyCheckin && <div className="text-primary font-medium">Early check-in</div>}
                    {g.luggageStorage && <div className="text-amber-700 font-medium">Luggage storage</div>}
                    <div className="col-span-2"><span className="text-muted-foreground">Contact: </span><span className="font-medium">{g.preferredContact}</span></div>
                    {g.specialRequests && <div className="col-span-2 pt-1 border-t border-border mt-1"><span className="text-muted-foreground">Notes: </span>{g.specialRequests}</div>}
                  </div>
                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Login ID: <span className="font-mono font-medium text-foreground">{g.reservationNumber}</span></span>
                    <span className="text-[10px] text-muted-foreground">Password: <span className="font-mono font-medium text-foreground">{g.password}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "insights" && (
        <div className="px-6 pb-32">
          <div className="flex flex-wrap gap-2 py-4">
            <Button variant="outline" size="sm" onClick={() => { const d = new Date().toISOString().split("T")[0]; downloadCSV(toFaqCSV(), `rosalina-faq-${d}.csv`); }} className="flex items-center gap-1.5 rounded-full" disabled={faqGroups.length === 0}>
              <Download className="w-3.5 h-3.5" /> {t("Download FAQ CSV", "Descargar FAQ CSV")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearFaq} className="flex items-center gap-1.5 rounded-full text-destructive hover:text-destructive" disabled={faqEntries.length === 0}>
              <Trash2 className="w-3.5 h-3.5" /> {t("Reset Data", "Reiniciar Datos")}
            </Button>
          </div>

          {faqGroups.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-serif text-2xl mb-2">{t("No chat data yet", "Sin datos de chat aun")}</p>
              <p className="text-sm">{t("Questions from the AI concierge will be tracked here.", "Las preguntas del concierge IA se registraran aqui.")}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-muted-foreground mb-3">
                  {t("Question Categories", "Categorias de Preguntas")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categoryStats.slice(0, 8).map((cat) => {
                    const maxCount = categoryStats[0]?.count || 1;
                    const pct = Math.round((cat.count / maxCount) * 100);
                    return (
                      <div key={cat.category} className="bg-card border border-border rounded-xl p-3 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/5"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex items-center justify-between">
                          <p className="text-xs font-medium">{t(cat.label, cat.labelEs)}</p>
                          <span className="text-xs font-mono text-muted-foreground">{cat.count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-muted-foreground">
                  {t("Most Frequent Questions", "Preguntas Mas Frecuentes")}
                </p>
                <span className="text-[10px] text-muted-foreground">{faqGroups.length} {t("unique", "unicas")}</span>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                {faqGroups.slice(0, 20).map((g, i, arr) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-lg font-serif font-medium text-primary/60 w-6 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{g.question}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-primary/40">
                          {t(
                            FAQ_CATEGORIES[g.category]?.label || "General",
                            FAQ_CATEGORIES[g.category]?.labelEs || "General"
                          )}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {t("Last:", "Ultimo:")} {fmtDate(g.lastAsked)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <TrendingUp className="w-3 h-3 text-muted-foreground/40" />
                      <span className="text-sm font-mono font-semibold text-foreground">{g.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground text-center">
          {activeTab === "insights"
            ? t("AI chat questions are tracked automatically. Export to CSV for detailed analysis.", "Las preguntas del chat IA se rastrean automaticamente. Exporte a CSV para analisis detallado.")
            : activeTab === "today"
            ? t('Tip: Use "Download CSV" to import to Google Sheets.', 'Tip: Use "Descargar CSV" para importar a Google Sheets.')
            : t("Download guest data to keep track of all registrations.", "Descargue los datos para llevar registro de todas las reservas.")
          }
        </p>
      </div>
    </div>
  );
}
