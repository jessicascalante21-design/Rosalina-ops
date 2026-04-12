import { useState, useEffect } from "react";
import { Download, Trash2, RefreshCw, ClipboardCopy, CheckCircle, LogOut, Users, ClipboardList, MessageSquare, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { clearSession } from "@/lib/staff-auth";
import { useLocation } from "wouter";
import logoUrl from "@assets/image_1775935433037.png";

type TabType = "today" | "prearrivals" | "guests";

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

export default function DailyReport() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
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
      [e.type, new Date(e.timestamp).toLocaleString("en-US"), e.name || "Anonymous", e.room || "—",
       e.service || e.feedbackType || "—", e.urgency || "—",
       `"${(e.details || e.message || "").replace(/"/g, '""')}"`].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const toGuestsCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Departure,Guests,Early Check-in,Luggage Storage,Car,Contact,Special Requests,Registered\n";
    const rows = guests.map((g) =>
      [g.name, g.reservationNumber, g.property, g.arrivalDate, g.arrivalTime || "—",
       g.departureDate || "—", g.numGuests, g.earlyCheckin ? "YES" : "No", g.luggageStorage ? "YES" : "No",
       g.carStatus, g.preferredContact, `"${(g.specialRequests || "").replace(/"/g, '""')}"`,
       new Date(g.createdAt).toLocaleString("en-US")].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const toPreArrivalCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Early Check-in,Luggage Storage,Submitted\n";
    const rows = preArrivalEntries.map((e) =>
      [e.name || "—", e.reservationNumber || "—", e.property || "—", e.arrivalDate || "—",
       e.arrivalTime || "—", e.earlyCheckin ? "YES" : "No", e.luggageStorage ? "YES" : "No",
       new Date(e.timestamp).toLocaleString("en-US")].join(",")
    ).join("\n");
    return hdr + rows;
  };

  const handleEmailReport = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const body = [
      `ROSALINA DAILY REPORT — ${today}`, ``,
      `SUMMARY`, `Total: ${todayEntries.length}`, `Service: ${serviceEntries.length} (${urgentCount} urgent)`, `Feedback: ${feedbackEntries.length}`, ``,
      serviceEntries.length > 0 ? `SERVICE REQUESTS` : "",
      ...serviceEntries.map((e) => `[${fmt(e.timestamp)}] Room ${e.room} — ${e.name}: ${e.service} (${e.urgency})${e.details ? " — " + e.details : ""}`),
      ``, feedbackEntries.length > 0 ? `FEEDBACK` : "",
      ...feedbackEntries.map((e) => `[${fmt(e.timestamp)}] ${e.feedbackType} from ${e.name}: ${e.message}`),
    ].filter(Boolean).join("\n");
    const subject = encodeURIComponent(`Rosalina Daily Report — ${today}`);
    window.location.href = `mailto:contact@rosalinapr.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleClearToday = () => {
    const keep = entries.filter((e) => !isToday(e.timestamp));
    localStorage.setItem("rosalina_report", JSON.stringify(keep));
    setEntries(keep);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const tabs: { id: TabType; label: string; count: number; icon: React.ElementType }[] = [
    { id: "today", label: t("Today", "Hoy"), count: todayEntries.length, icon: ClipboardList },
    { id: "prearrivals", label: t("Pre-Arrivals", "Pre-Llegadas"), count: preArrivalEntries.length, icon: Hotel },
    { id: "guests", label: t("Guest Accounts", "Cuentas"), count: guests.length, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
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

      {/* Stats */}
      <div className="px-6 py-5 bg-secondary/20 grid grid-cols-4 gap-3 text-center">
        {[
          { value: todayEntries.length, label: t("Today", "Hoy") },
          { value: serviceEntries.length, label: t("Requests", "Solicitudes") },
          { value: urgentCount, label: t("Urgent", "Urgentes"), red: urgentCount > 0 },
          { value: guests.length, label: t("Guests", "Huéspedes") },
        ].map((s) => (
          <div key={s.label} className={`bg-card rounded-2xl p-3 border shadow-sm ${s.red ? "border-destructive/40" : "border-border"}`}>
            <p className={`font-serif text-2xl font-medium ${s.red ? "text-destructive" : "text-foreground"}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
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

      {/* Tab: TODAY */}
      {activeTab === "today" && (
        <div className="px-6 pb-32">
          {/* Actions */}
          <div className="flex flex-wrap gap-2 py-4">
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(toReportCSV()); setCopied("report"); setTimeout(() => setCopied(null), 2500); }} className="flex items-center gap-1.5 rounded-full" data-testid="button-copy-csv" disabled={todayEntries.length === 0}>
              {copied === "report" ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
              {copied === "report" ? t("Copied!", "¡Copiado!") : t("Copy CSV", "Copiar CSV")}
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
                <p className="text-sm">{t("Service requests and feedback will appear here.", "Las solicitudes y comentarios aparecerán aquí.")}</p>
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

      {/* Tab: PRE-ARRIVALS */}
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
                <p className="font-serif text-2xl mb-2">{t("No pre-arrivals yet", "Sin pre-llegadas aún")}</p>
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

      {/* Tab: GUEST ACCOUNTS */}
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
                <p className="font-serif text-2xl mb-2">{t("No guest accounts yet", "Sin cuentas de huésped aún")}</p>
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
                    {g.earlyCheckin && <div className="text-primary font-medium">✓ Early check-in</div>}
                    {g.luggageStorage && <div className="text-amber-700 font-medium">✓ Luggage storage</div>}
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

      {/* Bottom tip */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground text-center">
          {activeTab === "today"
            ? t('Tip: Use "Download CSV" to import to Google Sheets.', 'Tip: Use "Descargar CSV" para importar a Google Sheets.')
            : t("Download guest data to keep track of all registrations.", "Descargue los datos para llevar registro de todas las reservas.")
          }
        </p>
      </div>
    </div>
  );
}
