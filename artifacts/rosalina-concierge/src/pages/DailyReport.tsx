import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, RefreshCw, ClipboardCopy, CheckCircle, LogOut, Users, ClipboardList, Hotel, TrendingUp, BarChart3, Sparkles, Bell, Mail } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { clearSession } from "@/lib/staff-auth";
import { useLocation } from "wouter";
import logoUrl from "@assets/image_1775935433037.png";
import conciergeAvatar from "@assets/4536937_1775962091124.png";

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

interface FAQEntry { q: string; ts: string; }
interface FAQGroup { question: string; count: number; lastAsked: string; category: string; }

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
    const normalized = entry.q.replace(/[?¿!¡.,]/g, "").replace(/\s+/g, " ").trim();
    const key = normalized.split(" ").slice(0, 6).join(" ");
    const existing = groups.get(key);
    if (existing) { existing.count++; if (entry.ts > existing.lastAsked) existing.lastAsked = entry.ts; }
    else groups.set(key, { count: 1, lastAsked: entry.ts, original: entry.q });
  }
  return Array.from(groups.entries())
    .map(([, v]) => ({ question: v.original, count: v.count, lastAsked: v.lastAsked, category: categorizeQuestion(v.original) }))
    .sort((a, b) => b.count - a.count);
}

const BG_IMAGES = ["/ocean-park.jpg", "/isla-verde.jpg"];

function GlassButton({ children, onClick, disabled, destructive, testId }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; destructive?: boolean; testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-sm border disabled:opacity-30 disabled:cursor-not-allowed ${
        destructive
          ? "bg-red-500/10 border-red-300/20 text-red-300 hover:bg-red-500/20"
          : "bg-white/8 border-white/12 text-white/70 hover:bg-white/14 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
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
  const [bgIdx, setBgIdx] = useState(0);

  const handleLogout = () => { clearSession(); setLocation("/"); };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const iv = setInterval(() => setBgIdx((p) => (p + 1) % BG_IMAGES.length), 6000);
    return () => clearInterval(iv);
  }, []);

  const loadData = () => {
    setEntries(JSON.parse(localStorage.getItem("rosalina_report") || "[]"));
    setGuests(JSON.parse(localStorage.getItem("rosalina_guests") || "[]"));
    setFaqEntries(JSON.parse(localStorage.getItem("rosalina_chat_faq") || "[]"));
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
    for (const g of faqGroups) counts[g.category] = (counts[g.category] || 0) + g.count;
    return Object.entries(counts)
      .map(([cat, count]) => ({ category: cat, label: FAQ_CATEGORIES[cat]?.label || cat, labelEs: FAQ_CATEGORIES[cat]?.labelEs || cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [faqGroups]);

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const toReportCSV = () => {
    const hdr = "Type,Timestamp,Name,Room,Service/Feedback Type,Urgency,Details\n";
    return hdr + todayEntries.map((e) =>
      [e.type, new Date(e.timestamp).toLocaleString("en-US"), e.name || "Anonymous", e.room || "", e.service || e.feedbackType || "", e.urgency || "", `"${(e.details || e.message || "").replace(/"/g, '""')}"`].join(",")
    ).join("\n");
  };

  const toGuestsCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Departure,Guests,Early Check-in,Luggage Storage,Car,Contact,Special Requests,Registered\n";
    return hdr + guests.map((g) =>
      [g.name, g.reservationNumber, g.property, g.arrivalDate, g.arrivalTime || "", g.departureDate || "", g.numGuests, g.earlyCheckin ? "YES" : "No", g.luggageStorage ? "YES" : "No", g.carStatus, g.preferredContact, `"${(g.specialRequests || "").replace(/"/g, '""')}"`, new Date(g.createdAt).toLocaleString("en-US")].join(",")
    ).join("\n");
  };

  const toPreArrivalCSV = () => {
    const hdr = "Name,Reservation,Property,Arrival Date,Arrival Time,Early Check-in,Luggage Storage,Submitted\n";
    return hdr + preArrivalEntries.map((e) =>
      [e.name || "", e.reservationNumber || "", e.property || "", e.arrivalDate || "", e.arrivalTime || "", e.earlyCheckin ? "YES" : "No", e.luggageStorage ? "YES" : "No", new Date(e.timestamp).toLocaleString("en-US")].join(",")
    ).join("\n");
  };

  const toFaqCSV = () => {
    const hdr = "Question,Count,Category,Last Asked\n";
    return hdr + faqGroups.map((g) =>
      [`"${g.question.replace(/"/g, '""')}"`, g.count, g.category, new Date(g.lastAsked).toLocaleString("en-US")].join(",")
    ).join("\n");
  };

  const handleEmailReport = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const body = [
      `ROSALINA DAILY REPORT: ${today}`, ``, `SUMMARY`, `Total: ${todayEntries.length}`, `Service: ${serviceEntries.length} (${urgentCount} urgent)`, `Feedback: ${feedbackEntries.length}`, `AI Chat Questions Today: ${todayFaqCount}`, ``,
      serviceEntries.length > 0 ? `SERVICE REQUESTS` : "",
      ...serviceEntries.map((e) => `[${fmt(e.timestamp)}] Room ${e.room}, ${e.name}: ${e.service} (${e.urgency})${e.details ? " - " + e.details : ""}`),
      ``, feedbackEntries.length > 0 ? `FEEDBACK` : "",
      ...feedbackEntries.map((e) => `[${fmt(e.timestamp)}] ${e.feedbackType} from ${e.name}: ${e.message}`),
      ``, faqGroups.length > 0 ? `TOP AI CHAT QUESTIONS (All Time)` : "",
      ...faqGroups.slice(0, 10).map((g, i) => `${i + 1}. "${g.question}" (${g.count}x, ${g.category})`),
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:contact@rosalinapr.com?subject=${encodeURIComponent(`Rosalina Daily Report: ${today}`)}&body=${encodeURIComponent(body)}`;
  };

  const handleClearToday = () => {
    const keep = entries.filter((e) => !isToday(e.timestamp));
    localStorage.setItem("rosalina_report", JSON.stringify(keep));
    setEntries(keep);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const handleClearFaq = () => { localStorage.setItem("rosalina_chat_faq", "[]"); setFaqEntries([]); };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("Good morning", "Buenos dias") : hour < 18 ? t("Good afternoon", "Buenas tardes") : t("Good evening", "Buenas noches");

  const tabs: { id: TabType; label: string; count: number; icon: React.ElementType }[] = [
    { id: "today", label: t("Today", "Hoy"), count: todayEntries.length, icon: ClipboardList },
    { id: "prearrivals", label: t("Pre-Arrivals", "Pre-Llegadas"), count: preArrivalEntries.length, icon: Hotel },
    { id: "guests", label: t("Guests", "Huespedes"), count: guests.length, icon: Users },
    { id: "insights", label: t("AI Insights", "IA Insights"), count: faqEntries.length, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-0"
        >
          <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})`, filter: "blur(8px) brightness(0.3)" }} />
        </motion.div>
      </AnimatePresence>

      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D1B40]/70 via-[#0D1B40]/50 to-[#0D1B40]/80 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* Glass Sidebar */}
        <div className="lg:w-72 lg:min-h-screen lg:sticky lg:top-0 shrink-0">
          <div className="lg:h-full p-5 lg:p-6 lg:border-r border-white/8" style={{ background: "rgba(13,27,64,0.45)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
            <div className="flex lg:flex-col items-center lg:items-stretch gap-4 lg:gap-0">

              <div className="flex items-center gap-3 lg:mb-8">
                <img src={logoUrl} alt="Rosalina" className="w-8 h-8 lg:w-10 lg:h-10 object-contain brightness-0 invert opacity-70 shrink-0" />
                <div className="lg:block">
                  <p className="text-[10px] font-bold tracking-[2px] uppercase" style={{ color: "hsl(38 72% 65%)" }}>Staff Portal</p>
                  <p className="text-white/40 text-[10px] hidden lg:block">Rosalina Boutique Hotels</p>
                </div>
                <button onClick={handleLogout} className="ml-auto lg:ml-0 lg:absolute lg:top-6 lg:right-6 w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors" data-testid="button-staff-logout">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="hidden lg:flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full p-1 border border-white/15" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                    <img src={conciergeAvatar} alt="Rosa AI" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-white/20" style={{ background: "rgba(13,27,64,0.8)" }}>
                    <Sparkles className="w-3 h-3" style={{ color: "hsl(38 72% 65%)" }} />
                  </div>
                </div>
                <p className="text-white font-serif text-lg mb-0.5">Rosa AI</p>
                <p className="text-white/35 text-[10px] tracking-wider uppercase">Experience Concierge</p>
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-300/80 text-[10px] font-medium">{t("Online", "En linea")}</span>
                </div>
              </div>

              <div className="hidden lg:block space-y-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-white/40 hover:text-white/65 hover:bg-white/4"
                    }`}
                    style={activeTab === tab.id ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" } : {}}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[10px] ml-auto px-1.5 py-0.5 rounded-full font-mono ${
                        activeTab === tab.id ? "bg-white/10 text-white/70" : "text-white/30"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block mt-auto pt-8">
                <div className="p-3.5 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-white/30 text-[10px] tracking-wider uppercase mb-2">{t("Quick Actions", "Acciones Rapidas")}</p>
                  <div className="space-y-1.5">
                    <button onClick={handleEmailReport} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                      <Mail className="w-3.5 h-3.5" /> {t("Email Report", "Enviar Reporte")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="p-5 lg:p-8 max-w-4xl">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-white/30 text-xs mb-1">{today}</p>
              <h1 className="font-serif text-3xl lg:text-4xl text-white font-light mb-1">{greeting}</h1>
              <p className="text-white/40 text-sm">{t("Property management overview", "Vista general de gestion de propiedades")}</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { value: todayEntries.length, label: t("Today's Activity", "Actividad de Hoy"), accent: false },
                { value: serviceEntries.length, label: t("Service Requests", "Solicitudes"), accent: false },
                { value: urgentCount, label: t("Urgent", "Urgentes"), accent: urgentCount > 0, urgent: true },
                { value: todayFaqCount, label: t("AI Conversations", "Conversaciones IA"), accent: false },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`rounded-2xl p-4 border ${s.urgent && s.accent ? "border-red-400/30" : "border-white/10"}`}
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                >
                  <p className={`font-serif text-3xl font-light ${s.urgent && s.accent ? "text-red-300" : "text-white"}`}>
                    {s.value}
                  </p>
                  <p className="text-white/35 text-[10px] mt-1 tracking-wider uppercase">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile Tab Bar */}
            <div className="lg:hidden flex gap-1 p-1 rounded-xl mb-5 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-white/12 text-white" : "text-white/35"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="text-[10px] text-white/30 ml-0.5">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab: TODAY */}
            {activeTab === "today" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-wrap gap-2 mb-5">
                  <GlassButton onClick={() => { navigator.clipboard.writeText(toReportCSV()); setCopied("report"); setTimeout(() => setCopied(null), 2500); }} disabled={todayEntries.length === 0} testId="button-copy-csv">
                    {copied === "report" ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                    {copied === "report" ? t("Copied!", "Copiado!") : t("Copy CSV", "Copiar CSV")}
                  </GlassButton>
                  <GlassButton onClick={() => { downloadCSV(toReportCSV(), `rosalina-report-${new Date().toISOString().split("T")[0]}.csv`); }} disabled={todayEntries.length === 0} testId="button-download-csv">
                    <Download className="w-3.5 h-3.5" /> {t("Download", "Descargar")}
                  </GlassButton>
                  <GlassButton onClick={handleEmailReport} disabled={todayEntries.length === 0} testId="button-email-report">
                    <RefreshCw className="w-3.5 h-3.5" /> {t("Email", "Email")}
                  </GlassButton>
                  <GlassButton onClick={handleClearToday} disabled={todayEntries.length === 0} destructive testId="button-clear-today">
                    <Trash2 className="w-3.5 h-3.5" /> {cleared ? t("Cleared", "Eliminado") : t("Clear", "Limpiar")}
                  </GlassButton>
                </div>

                <div className="space-y-3">
                  {todayEntries.length === 0 ? (
                    <div className="text-center py-20">
                      <Bell className="w-10 h-10 mx-auto mb-4 text-white/15" />
                      <p className="font-serif text-2xl text-white/50 mb-2">{t("All clear today", "Todo en orden hoy")}</p>
                      <p className="text-white/25 text-sm">{t("Service requests and feedback will appear here.", "Las solicitudes y comentarios apareceran aqui.")}</p>
                    </div>
                  ) : (
                    [...todayEntries].reverse().map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i }}
                        className={`rounded-2xl p-4 border ${entry.urgency === "Urgent" ? "border-red-400/25" : "border-white/8"}`}
                        style={{ background: entry.urgency === "Urgent" ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${entry.type === "service" ? "bg-blue-400/15 text-blue-300" : "text-amber-300"}`} style={entry.type !== "service" ? { background: "rgba(180,140,60,0.15)" } : {}}>
                              {entry.type === "service" ? t("Service", "Servicio") : t("Feedback", "Comentario")}
                            </span>
                            {entry.urgency === "Urgent" && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-red-400/15 text-red-300">{t("Urgent", "Urgente")}</span>}
                          </div>
                          <span className="text-[11px] text-white/30 font-mono shrink-0">{fmt(entry.timestamp)}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/90 text-sm"><span className="font-medium">{entry.name || "Anonymous"}</span>{entry.room && <span className="text-white/35 ml-2">Room {entry.room}</span>}</p>
                          <p className="text-white/40 text-sm">{entry.service || entry.feedbackType}{entry.urgency && entry.urgency !== "Urgent" && <span className="ml-2 text-xs">· {entry.urgency}</span>}</p>
                          {(entry.details || entry.message) && <p className="text-white/60 pt-2 border-t border-white/8 mt-2 text-sm">{entry.details || entry.message}</p>}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab: PRE-ARRIVALS */}
            {activeTab === "prearrivals" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-wrap gap-2 mb-5">
                  <GlassButton onClick={() => downloadCSV(toPreArrivalCSV(), `rosalina-prearrivals-${new Date().toISOString().split("T")[0]}.csv`)} disabled={preArrivalEntries.length === 0}>
                    <Download className="w-3.5 h-3.5" /> {t("Download CSV", "Descargar CSV")}
                  </GlassButton>
                </div>
                <div className="space-y-3">
                  {preArrivalEntries.length === 0 ? (
                    <div className="text-center py-20">
                      <Hotel className="w-10 h-10 mx-auto mb-4 text-white/15" />
                      <p className="font-serif text-2xl text-white/50 mb-2">{t("No pre-arrivals yet", "Sin pre-llegadas aun")}</p>
                    </div>
                  ) : (
                    [...preArrivalEntries].reverse().map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i }}
                        className="rounded-2xl p-4 border border-white/8"
                        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-green-400/15 text-green-300">Pre-Arrival</span>
                            {e.earlyCheckin && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-blue-400/15 text-blue-300">Early Check-in</span>}
                            {e.luggageStorage && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-amber-300" style={{ background: "rgba(180,140,60,0.15)" }}>Luggage</span>}
                          </div>
                          <span className="text-[11px] text-white/30 font-mono shrink-0">{fmtDate(e.timestamp)}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-white/90"><span className="font-medium">{e.name}</span>{e.reservationNumber && <span className="text-white/35 ml-2">#{e.reservationNumber}</span>}</p>
                          <p className="text-white/40">{e.property} · Arriving {e.arrivalDate}{e.arrivalTime ? " ~" + e.arrivalTime : ""}</p>
                          {e.details && <p className="text-white/50 pt-2 border-t border-white/8 mt-2 text-xs leading-relaxed">{e.details}</p>}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab: GUESTS */}
            {activeTab === "guests" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-wrap gap-2 mb-5">
                  <GlassButton onClick={() => downloadCSV(toGuestsCSV(), `rosalina-guests-${new Date().toISOString().split("T")[0]}.csv`)} disabled={guests.length === 0}>
                    <Download className="w-3.5 h-3.5" /> {t("Download Guest List", "Descargar Lista")}
                  </GlassButton>
                </div>
                <div className="space-y-3">
                  {guests.length === 0 ? (
                    <div className="text-center py-20">
                      <Users className="w-10 h-10 mx-auto mb-4 text-white/15" />
                      <p className="font-serif text-2xl text-white/50 mb-2">{t("No guest accounts yet", "Sin cuentas de huesped aun")}</p>
                    </div>
                  ) : (
                    [...guests].reverse().map((g, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i }}
                        className="rounded-2xl p-4 border border-white/8"
                        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-semibold text-sm text-white/90">{g.name}</p>
                            <p className="text-xs text-white/35">#{g.reservationNumber} · {g.property}</p>
                          </div>
                          <span className="text-[10px] text-white/25 font-mono shrink-0">{fmtDate(g.createdAt)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                          <div><span className="text-white/35">Arrival: </span><span className="text-white/70 font-medium">{g.arrivalDate}{g.arrivalTime ? " ~" + g.arrivalTime : ""}</span></div>
                          <div><span className="text-white/35">Guests: </span><span className="text-white/70 font-medium">{g.numGuests}</span></div>
                          {g.earlyCheckin && <div className="text-blue-300 font-medium">Early check-in</div>}
                          {g.luggageStorage && <div className="font-medium" style={{ color: "hsl(38 72% 65%)" }}>Luggage storage</div>}
                          <div className="col-span-2"><span className="text-white/35">Contact: </span><span className="text-white/70 font-medium">{g.preferredContact}</span></div>
                          {g.specialRequests && <div className="col-span-2 pt-1 border-t border-white/8 mt-1"><span className="text-white/35">Notes: </span><span className="text-white/50">{g.specialRequests}</span></div>}
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/8 flex items-center justify-between">
                          <span className="text-[10px] text-white/25">Login: <span className="font-mono text-white/50">{g.reservationNumber}</span></span>
                          <span className="text-[10px] text-white/25">Pass: <span className="font-mono text-white/50">{g.password}</span></span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab: AI INSIGHTS */}
            {activeTab === "insights" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-wrap gap-2 mb-5">
                  <GlassButton onClick={() => downloadCSV(toFaqCSV(), `rosalina-faq-${new Date().toISOString().split("T")[0]}.csv`)} disabled={faqGroups.length === 0}>
                    <Download className="w-3.5 h-3.5" /> {t("Download FAQ CSV", "Descargar FAQ CSV")}
                  </GlassButton>
                  <GlassButton onClick={handleClearFaq} disabled={faqEntries.length === 0} destructive>
                    <Trash2 className="w-3.5 h-3.5" /> {t("Reset", "Reiniciar")}
                  </GlassButton>
                </div>

                {faqGroups.length === 0 ? (
                  <div className="text-center py-20">
                    <BarChart3 className="w-10 h-10 mx-auto mb-4 text-white/15" />
                    <p className="font-serif text-2xl text-white/50 mb-2">{t("No chat data yet", "Sin datos de chat aun")}</p>
                    <p className="text-white/25 text-sm">{t("Questions from the AI concierge will be tracked here.", "Las preguntas del concierge IA se registraran aqui.")}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-white/30 text-[10px] font-semibold tracking-[2px] uppercase mb-3">
                        {t("Question Categories", "Categorias de Preguntas")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryStats.slice(0, 8).map((cat) => {
                          const maxCount = categoryStats[0]?.count || 1;
                          const pct = Math.round((cat.count / maxCount) * 100);
                          return (
                            <div key={cat.category} className="rounded-xl p-3 relative overflow-hidden border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                              <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: `${pct}%`, background: "rgba(180,140,60,0.1)" }} />
                              <div className="relative flex items-center justify-between">
                                <p className="text-xs text-white/60 font-medium">{t(cat.label, cat.labelEs)}</p>
                                <span className="text-xs font-mono text-white/35">{cat.count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-white/30 text-[10px] font-semibold tracking-[2px] uppercase">
                        {t("Most Frequent Questions", "Preguntas Mas Frecuentes")}
                      </p>
                      <span className="text-[10px] text-white/20 font-mono">{faqGroups.length} {t("unique", "unicas")}</span>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                      {faqGroups.slice(0, 20).map((g, i, arr) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-white/6" : ""}`}>
                          <span className="text-lg font-serif font-light w-6 text-center shrink-0" style={{ color: "hsl(38 72% 65% / 0.5)" }}>{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 font-medium truncate">{g.question}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "hsl(38 72% 65% / 0.4)" }}>
                                {t(FAQ_CATEGORIES[g.category]?.label || "General", FAQ_CATEGORIES[g.category]?.labelEs || "General")}
                              </span>
                              <span className="text-[10px] text-white/20">{fmtDate(g.lastAsked)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <TrendingUp className="w-3 h-3 text-white/15" />
                            <span className="text-sm font-mono text-white/50">{g.count}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
