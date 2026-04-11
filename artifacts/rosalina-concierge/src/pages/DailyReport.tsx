import { useState, useEffect } from "react";
import { Download, Trash2, RefreshCw, ClipboardCopy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

interface ReportEntry {
  type: "service" | "feedback";
  timestamp: string;
  name?: string;
  room?: string;
  service?: string;
  urgency?: string;
  details?: string;
  feedbackType?: string;
  message?: string;
}

export default function DailyReport() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = JSON.parse(localStorage.getItem("rosalina_report") || "[]") as ReportEntry[];
    setEntries(data);
  };

  const todayEntries = entries.filter((e) => {
    const d = new Date(e.timestamp);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const serviceEntries = todayEntries.filter((e) => e.type === "service");
  const feedbackEntries = todayEntries.filter((e) => e.type === "feedback");
  const urgentCount = serviceEntries.filter((e) => e.urgency === "Urgent").length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const toCSV = () => {
    const headers = "Type,Timestamp,Name,Room,Service/Feedback Type,Urgency,Details/Message\n";
    const rows = todayEntries
      .map((e) =>
        [
          e.type,
          new Date(e.timestamp).toLocaleString("en-US"),
          e.name || "Anonymous",
          e.room || "—",
          e.service || e.feedbackType || "—",
          e.urgency || "—",
          `"${(e.details || e.message || "").replace(/"/g, '""')}"`,
        ].join(",")
      )
      .join("\n");
    return headers + rows;
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(toCSV()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadCSV = () => {
    const csv = toCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().split("T")[0];
    a.download = `rosalina-report-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmailReport = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const body = [
      `ROSALINA DAILY REPORT — ${today}`,
      ``,
      `SUMMARY`,
      `Total interactions: ${todayEntries.length}`,
      `Service requests: ${serviceEntries.length} (${urgentCount} urgent)`,
      `Feedback received: ${feedbackEntries.length}`,
      ``,
      serviceEntries.length > 0 ? `SERVICE REQUESTS` : "",
      ...serviceEntries.map(
        (e) =>
          `[${formatDate(e.timestamp)}] Room ${e.room} — ${e.name}: ${e.service} (${e.urgency})${e.details ? " — " + e.details : ""}`
      ),
      ``,
      feedbackEntries.length > 0 ? `GUEST FEEDBACK` : "",
      ...feedbackEntries.map(
        (e) =>
          `[${formatDate(e.timestamp)}] ${e.feedbackType} from ${e.name} (Room ${e.room}): ${e.message}`
      ),
    ]
      .filter((l) => l !== "")
      .join("\n");

    const subject = encodeURIComponent(`Rosalina Daily Report — ${today}`);
    window.location.href = `mailto:contact@rosalinapr.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleClearToday = () => {
    const keep = entries.filter((e) => {
      const d = new Date(e.timestamp);
      const today = new Date();
      return !(
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
    localStorage.setItem("rosalina_report", JSON.stringify(keep));
    setEntries(keep);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-6 pt-12 pb-8 text-white">
        <p className="text-xs font-bold tracking-[2.5px] uppercase text-primary mb-2">Staff View</p>
        <h1 className="font-serif text-4xl font-light mb-1">Daily Report</h1>
        <p className="text-white/50 text-sm">{today}</p>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-1 bg-secondary/20 py-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <p className="font-serif text-3xl text-foreground font-medium">{todayEntries.length}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-tight">{t("Total", "Total")}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <p className="font-serif text-3xl text-foreground font-medium">{serviceEntries.length}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-tight">{t("Requests", "Solicitudes")}</p>
        </div>
        <div className={`bg-card rounded-2xl p-4 border shadow-sm ${urgentCount > 0 ? "border-destructive/40" : "border-border"}`}>
          <p className={`font-serif text-3xl font-medium ${urgentCount > 0 ? "text-destructive" : "text-foreground"}`}>{urgentCount}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-tight">{t("Urgent", "Urgentes")}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 py-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCSV}
          className="flex items-center gap-2 rounded-full"
          data-testid="button-copy-csv"
          disabled={todayEntries.length === 0}
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <ClipboardCopy className="w-4 h-4" />}
          {copied ? t("Copied!", "¡Copiado!") : t("Copy CSV", "Copiar CSV")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 rounded-full"
          data-testid="button-download-csv"
          disabled={todayEntries.length === 0}
        >
          <Download className="w-4 h-4" />
          {t("Download CSV", "Descargar CSV")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmailReport}
          className="flex items-center gap-2 rounded-full"
          data-testid="button-email-report"
          disabled={todayEntries.length === 0}
        >
          <RefreshCw className="w-4 h-4" />
          {t("Email Report", "Enviar por Email")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearToday}
          className="flex items-center gap-2 rounded-full text-destructive hover:text-destructive"
          data-testid="button-clear-today"
          disabled={todayEntries.length === 0}
        >
          <Trash2 className="w-4 h-4" />
          {cleared ? t("Cleared", "Eliminado") : t("Clear Today", "Limpiar hoy")}
        </Button>
      </div>

      {/* Entries */}
      <div className="px-6 pb-24 space-y-4">
        {todayEntries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-serif text-2xl mb-2">{t("No entries yet", "Sin registros aún")}</p>
            <p className="text-sm">{t("Service requests and feedback will appear here.", "Las solicitudes y comentarios aparecerán aquí.")}</p>
          </div>
        ) : (
          [...todayEntries].reverse().map((entry, i) => (
            <div
              key={i}
              className={`bg-card rounded-2xl border p-5 shadow-sm ${
                entry.urgency === "Urgent" ? "border-destructive/40 bg-destructive/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${
                      entry.type === "service"
                        ? "bg-primary/15 text-primary"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {entry.type === "service" ? t("Service", "Servicio") : t("Feedback", "Comentario")}
                  </span>
                  {entry.urgency === "Urgent" && (
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-destructive/15 text-destructive">
                      {t("Urgent", "Urgente")}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(entry.timestamp)}</span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-foreground">{entry.name || "Anonymous"}</span>
                  {entry.room && <span className="text-muted-foreground ml-2">Room {entry.room}</span>}
                </p>
                <p className="text-muted-foreground">
                  {entry.service || entry.feedbackType}
                  {entry.urgency && entry.urgency !== "Urgent" && (
                    <span className="ml-2 text-xs">· {entry.urgency}</span>
                  )}
                </p>
                {(entry.details || entry.message) && (
                  <p className="text-foreground/80 pt-1 border-t border-border mt-2">
                    {entry.details || entry.message}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* How to use with Sheets hint */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground text-center">
          {t(
            'Tip: Use "Copy CSV" and paste into Google Sheets, or "Download CSV" to import directly.',
            'Tip: Usa "Copiar CSV" y pégalo en Google Sheets, o "Descargar CSV" para importar directamente.'
          )}
        </p>
      </div>
    </div>
  );
}
