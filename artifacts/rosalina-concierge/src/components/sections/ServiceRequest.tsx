import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceRequestProps {
  pageMode?: boolean;
}

export default function ServiceRequest({ pageMode = false }: ServiceRequestProps) {
  const { t } = useLanguage();
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("No rush");
  const [submitted, setSubmitted] = useState(false);

  const services = [
    t("Extra Towels", "Toallas Extra"),
    t("Housekeeping", "Limpieza"),
    t("AC Issue", "Problema A/C"),
    t("TV Issue", "Problema TV"),
    t("Early Check-in", "Check-in Temprano"),
    t("Late Check-out", "Check-out Tarde"),
    t("Luggage Storage", "Guardar Equipaje"),
    t("Noise Complaint", "Queja de Ruido"),
    t("Maintenance", "Mantenimiento"),
    t("Lost & Found", "Objetos Perdidos"),
    t("Other", "Otro"),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const entry = { type: "service", timestamp, name, room, service, urgency, details: details || "" };
    const existing = JSON.parse(localStorage.getItem("rosalina_report") || "[]");
    localStorage.setItem("rosalina_report", JSON.stringify([...existing, entry]));

    const waMsg = [
      `*ROSALINA GUEST REQUEST*`,
      ``,
      `Name: ${name}`,
      `Room: ${room}`,
      `Request: ${service}`,
      `Urgency: ${urgency}`,
      `Details: ${details || "None"}`,
      `Submitted: ${new Date().toLocaleString("en-US")}`,
      ``,
      `_Sent via Rosalina Concierge Hub_`,
    ].join("\n");
    window.open(`https://wa.me/19397938989?text=${encodeURIComponent(waMsg)}`, "_blank");
    setSubmitted(true);
  };

  const form = (
    <div className={pageMode ? "max-w-xl mx-auto px-5 py-8" : "py-16 px-6 md:px-8"}>
      {!pageMode && (
        <div className="mb-8">
          <h2 className="font-serif text-4xl text-foreground mb-3">{t("Service Request", "Solicitud de Servicio")}</h2>
          <p className="text-muted-foreground">{t("Need something? Let us know and our team will respond promptly.", "¿Necesita algo? Avísenos y nuestro equipo responderá prontamente.")}</p>
        </div>
      )}

      {submitted ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="font-serif text-2xl mb-2">{t("Request sent!", "¡Solicitud enviada!")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {t(
                "Your request has been logged and sent to our team via WhatsApp. We'll respond within 15 minutes during concierge hours.",
                "Su solicitud ha sido registrada y enviada a nuestro equipo por WhatsApp. Responderemos en 15 minutos durante el horario de concierge."
              )}
            </p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground">
            {t("Urgent issue? Call our 24/7 line: ", "¿Urgente? Llame nuestra línea 24/7: ")}
            <a href="https://wa.me/19397938989" target="_blank" rel="noreferrer" className="font-semibold text-foreground">WhatsApp +1 (939) 793-8989</a>
          </div>
          <button
            onClick={() => { setService(""); setName(""); setRoom(""); setDetails(""); setUrgency("No rush"); setSubmitted(false); }}
            className="text-sm text-primary hover:underline"
          >
            {t("New request", "Nueva solicitud")}
          </button>
        </div>
      ) : (
        <div className={`space-y-6 bg-card p-6 rounded-2xl shadow-sm border border-border ${!pageMode ? "rounded-[2rem]" : ""}`}>
          <div>
            <Label className="text-foreground/70 font-medium mb-3 block text-sm">{t("What do you need?", "¿Qué necesita?")}</Label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    service === s
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60 border border-border/50"
                  }`}
                  data-testid={`service-chip-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {service && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="req-name" className="text-foreground/70 mb-1.5 block text-sm">{t("Name", "Nombre")} *</Label>
                  <Input id="req-name" placeholder={t("Your name", "Su nombre")} value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-background/60" required data-testid="input-req-name" />
                </div>
                <div>
                  <Label htmlFor="req-room" className="text-foreground/70 mb-1.5 block text-sm">{t("Room", "Habitación")} *</Label>
                  <Input id="req-room" placeholder="e.g. OP7" value={room} onChange={(e) => setRoom(e.target.value)} className="h-11 bg-background/60" required data-testid="input-req-room" />
                </div>
              </div>

              <div>
                <Label htmlFor="req-details" className="text-foreground/70 mb-1.5 block text-sm">{t("Details (optional)", "Detalles (opcional)")}</Label>
                <Textarea
                  id="req-details"
                  placeholder={t("Any extra info...", "Cualquier información extra...")}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-background/60 min-h-[90px] resize-none"
                  data-testid="textarea-req-details"
                />
              </div>

              <div>
                <Label className="text-foreground/70 mb-2.5 block text-sm">{t("Urgency", "Urgencia")}</Label>
                <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-6">
                  {[
                    { val: "No rush", label: t("No rush", "Sin prisa") },
                    { val: "Soon",    label: t("Soon", "Pronto") },
                    { val: "Urgent",  label: t("Urgent", "Urgente") },
                  ].map((u) => (
                    <div key={u.val} className="flex items-center gap-2">
                      <RadioGroupItem value={u.val} id={`r-${u.val}`} className={u.val === "Urgent" ? "text-primary border-primary" : ""} data-testid={`radio-req-${u.val.toLowerCase().replace(" ", "-")}`} />
                      <Label htmlFor={`r-${u.val}`} className={`font-normal text-sm cursor-pointer ${u.val === "Urgent" ? "text-primary font-medium" : "text-secondary-foreground"}`}>{u.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
                disabled={!name || !room}
                data-testid="button-submit-request"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t("Send Request to Team", "Enviar Solicitud al Equipo")}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t("Requests are tracked for quality and responded to within 15 min.", "Las solicitudes se rastrean para calidad y se responden en 15 min.")}
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );

  if (pageMode) return form;
  return <section id="request" className="bg-secondary/10">{form}</section>;
}
