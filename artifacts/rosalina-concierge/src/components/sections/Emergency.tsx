import { useLanguage } from "@/lib/language-context";
import { PhoneCall, AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";

export default function Emergency() {
  const { t } = useLanguage();

  const contacts = [
    {
      title: t("Emergency Line 24/7", "Línea de Emergencia 24/7"),
      number: "787-438-9393",
      icon: AlertTriangle,
      color: "text-primary"
    },
    {
      title: t("Main Concierge (8 AM–2 AM)", "Concierge Principal (8 AM–2 AM)"),
      number: "787-304-3335",
      icon: PhoneCall,
      color: "text-white"
    },
    {
      title: t("Local Police", "Policía Local"),
      number: "787-480-2920",
      icon: ShieldAlert,
      color: "text-blue-400"
    },
    {
      title: t("Local Fire / Medical", "Bomberos / Médico"),
      number: "911",
      icon: HeartPulse,
      color: "text-red-400"
    }
  ];

  return (
    <section id="emergency" className="py-16 px-6 bg-[#1A1A1A] text-white my-8 mx-4 md:mx-0 rounded-[2rem] shadow-xl">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="font-serif text-3xl mb-2">
          {t("Emergency Contacts", "Contactos de Emergencia")}
        </h2>
        <p className="text-secondary/70 text-sm">
          {t("Tap to call immediately", "Toque para llamar inmediatamente")}
        </p>
      </div>

      <div className="space-y-3">
        {contacts.map((contact, i) => (
          <a 
            key={i}
            href={`tel:${contact.number.replace(/-/g, '')}`}
            className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-colors active:scale-[0.98]"
            data-testid={`emergency-contact-${i}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${contact.color}`}>
                <contact.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-secondary/80 mb-0.5">{contact.title}</p>
                <p className="font-mono text-lg tracking-wide font-medium">{contact.number}</p>
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
