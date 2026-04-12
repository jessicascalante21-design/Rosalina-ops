import { useLanguage } from "@/lib/language-context";
import { PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, MessageCircle } from "lucide-react";
import { useAfterHours } from "@/lib/use-after-hours";

interface EmergencyProps {
  pageMode?: boolean;
}

export default function Emergency({ pageMode = false }: EmergencyProps) {
  const { t } = useLanguage();
  const afterHours = useAfterHours();

  const contacts = [
    {
      title: afterHours
        ? t("After-Hours Emergency Line (2 AM to 8 AM)", "Línea de Emergencia (2 AM a 8 AM)")
        : t("Emergency Line, After Hours Only (2 AM to 8 AM)", "Línea de Emergencia, Solo fuera de horario (2 AM a 8 AM)"),
      number: "787-438-9393",
      icon: AlertTriangle,
      accent: afterHours ? "bg-red-100 text-red-600" : "bg-primary/15 text-primary",
      highlight: afterHours,
    },
    {
      title: t("Main Concierge (8 AM to 2 AM)", "Concierge Principal (8 AM a 2 AM)"),
      number: "787-304-3335",
      icon: PhoneCall,
      accent: "bg-secondary/30 text-secondary-foreground",
      highlight: !afterHours,
    },
    {
      title: t("Local Police", "Policía Local"),
      number: "787-480-2920",
      icon: ShieldAlert,
      accent: "bg-blue-100 text-blue-600",
      highlight: false,
    },
    {
      title: t("Local Fire / Medical", "Bomberos / Médico"),
      number: "911",
      icon: HeartPulse,
      accent: "bg-red-100 text-red-600",
      highlight: false,
    },
  ];

  // Sort so the time-appropriate contact is first
  const sorted = afterHours
    ? contacts
    : [contacts[1], contacts[0], contacts[2], contacts[3]];

  if (pageMode) {
    return (
      <div className="max-w-xl mx-auto space-y-3">
        {/* Time-aware status banner */}
        <div className={`flex items-center gap-2 p-3 rounded-xl mb-2 ${
          afterHours ? "bg-red-50 border border-red-100" : "bg-secondary/30 border border-border"
        }`}>
          <div className={`w-2 h-2 rounded-full shrink-0 ${afterHours ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
          <p className={`text-xs font-medium ${afterHours ? "text-red-700" : "text-muted-foreground"}`}>
            {afterHours
              ? t(
                  "After-hours (2 AM to 8 AM): concierge desk is closed. Call the emergency line or send a WhatsApp alert.",
                  "Fuera de horario (2 AM a 8 AM): el concierge está cerrado. Llame a la línea de emergencia o envíe un alerta por WhatsApp."
                )
              : t(
                  "Concierge is online (8 AM to 2 AM). For non-urgent requests use the Service Request form.",
                  "El concierge está en línea (8 AM a 2 AM). Para solicitudes no urgentes use el formulario de Servicio."
                )}
          </p>
        </div>

        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4 px-1">
          {t("Tap to call immediately", "Toque para llamar de inmediato")}
        </p>

        {sorted.map((c, i) => (
          <a
            key={i}
            href={`tel:${c.number.replace(/-/g, "")}`}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.97] card-hover group ${
              c.highlight
                ? "bg-primary/6 border-primary/25 hover:bg-primary/10"
                : "bg-card border-border hover:border-primary/20"
            }`}
            data-testid={`emergency-contact-${i}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.accent}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{c.title}</p>
                <p className={`font-mono text-xl font-semibold tracking-wide ${c.highlight ? "text-primary" : "text-foreground"}`}>
                  {c.number}
                </p>
              </div>
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              c.highlight ? "bg-primary/15 text-primary group-hover:bg-primary group-hover:text-white" : "bg-secondary/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}>
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>
        ))}

        {/* WhatsApp staff alert — shown during after hours */}
        {afterHours && (
          <a
            href={`https://wa.me/17874389393?text=${encodeURIComponent("🚨 EMERGENCY ALERT — Rosalina guest needs immediate assistance. Please respond.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl border border-green-100 bg-green-50 hover:bg-green-100/80 transition-all active:scale-[0.97] group"
            data-testid="emergency-whatsapp-alert"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{t("Alert staff group via WhatsApp", "Alertar al grupo del personal por WhatsApp")}</p>
                <p className="font-semibold text-sm text-green-800">WhatsApp Alert</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
          </a>
        )}

        <div className="mt-6 p-4 rounded-2xl bg-secondary/30 border border-border text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(
              "For non-urgent requests, use the Service Request or Feedback forms.",
              "Para solicitudes no urgentes, use los formularios de Servicio o Comentarios."
            )}
          </p>
        </div>
      </div>
    );
  }

  /* ── Dark card version (legacy / embedded) ── */
  return (
    <section id="emergency" className="py-16 px-6 text-white my-8 mx-4 md:mx-0 rounded-[2rem] shadow-xl" style={{ background: "var(--dark-navy, #0B1730)" }}>
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="font-serif text-3xl mb-2">{t("Emergency Contacts", "Contactos de Emergencia")}</h2>
        <p className="text-secondary/70 text-sm">{t("Tap to call immediately", "Toque para llamar inmediatamente")}</p>
      </div>
      <div className="space-y-3">
        {sorted.map((c, i) => (
          <a key={i} href={`tel:${c.number.replace(/-/g, "")}`} className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-colors active:scale-[0.98]" data-testid={`emergency-contact-${i}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-secondary/80 mb-0.5">{c.title}</p>
                <p className="font-mono text-lg tracking-wide font-medium">{c.number}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
