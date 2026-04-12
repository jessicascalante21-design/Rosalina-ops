import { useLanguage } from "@/lib/language-context";
import { PhoneCall, AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";

interface EmergencyProps {
  pageMode?: boolean;
}

export default function Emergency({ pageMode = false }: EmergencyProps) {
  const { t } = useLanguage();

  const contacts = [
    {
      title: t("Emergency Line 24/7", "Línea de Emergencia 24/7"),
      number: "787-438-9393",
      icon: AlertTriangle,
      accent: "bg-primary/15 text-primary",
      highlight: true,
    },
    {
      title: t("Main Concierge (8 AM–2 AM)", "Concierge Principal (8 AM–2 AM)"),
      number: "787-304-3335",
      icon: PhoneCall,
      accent: "bg-secondary/30 text-secondary-foreground",
      highlight: false,
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

  if (pageMode) {
    return (
      <div className="max-w-xl mx-auto space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4 px-1">
          {t("Tap to call immediately", "Toque para llamar de inmediato")}
        </p>
        {contacts.map((c, i) => (
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
    <section id="emergency" className="py-16 px-6 bg-[#161616] text-white my-8 mx-4 md:mx-0 rounded-[2rem] shadow-xl">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="font-serif text-3xl mb-2">{t("Emergency Contacts", "Contactos de Emergencia")}</h2>
        <p className="text-secondary/70 text-sm">{t("Tap to call immediately", "Toque para llamar inmediatamente")}</p>
      </div>
      <div className="space-y-3">
        {contacts.map((c, i) => (
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
