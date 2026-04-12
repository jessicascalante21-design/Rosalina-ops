import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { PhoneCall, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import logoUrl from "@assets/image_1775935433037.png";

interface LiveConciergeProps {
  pageMode?: boolean;
}

export default function LiveConcierge({ pageMode = false }: LiveConciergeProps) {
  const { t } = useLanguage();
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("soon");

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsAfterHours(h >= 2 && h < 8);
    };
    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, []);

  const handleStartCall = () => {
    window.open("https://meet.google.com/rcs-ugkv-cyk", "_blank");
  };

  if (pageMode) {
    return (
      <div className="max-w-xl mx-auto space-y-5">
        {/* Status badge */}
        <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${isAfterHours ? "bg-secondary/30 border-border text-muted-foreground" : "bg-green-50 border-green-200 text-green-800"}`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${isAfterHours ? "bg-secondary" : "bg-green-500 animate-pulse"}`} />
          {isAfterHours
            ? t("Live desk closed (2 AM to 8 AM). Emergency line: 787-438-9393.", "Concierge cerrado (2 AM a 8 AM). Línea de emergencia: 787-438-9393.")
            : t("Your concierge team is online and ready.", "Su equipo de concierge está en línea y listo.")
          }
        </div>

        {isAfterHours ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto">
              <img src={logoUrl} alt="Rosalina" className="w-10 h-10 object-contain" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {t(
                "Our live concierge desk is offline (2 AM to 8 AM). For emergencies, call the after-hours line.",
                "Nuestro concierge está fuera de línea (2 AM a 8 AM). Para emergencias, llame a la línea de emergencia."
              )}
            </p>
            <a
              href="tel:17874389393"
              className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              data-testid="button-call-emergency"
            >
              <PhoneCall className="w-4 h-4" />
              787-438-9393
            </a>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden">
                  <img src={logoUrl} alt="Rosalina" className="w-8 h-8 object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t("Rosalina Concierge Team", "Equipo Concierge Rosalina")}</p>
                <p className="text-xs text-green-600">{t("Online · Typically replies instantly", "En línea · Responde al instante")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground/70 mb-1.5 block text-sm">{t("Your name", "Su nombre")}</Label>
                <Input
                  className="h-12 bg-background/60 focus-visible:ring-primary"
                  placeholder={t("Full name", "Nombre completo")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>

              <div>
                <Label className="text-foreground/70 mb-1.5 block text-sm">{t("Room", "Habitación")}</Label>
                <Input
                  className="h-12 bg-background/60 focus-visible:ring-primary"
                  placeholder={t("e.g. OP7, IV3", "ej. OP7, IV3")}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  data-testid="input-room"
                />
              </div>

              <div>
                <Label className="text-foreground/70 mb-1.5 block text-sm">{t("How can we help?", "¿Cómo podemos ayudar?")}</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-12 bg-background/60" data-testid="select-reason">
                    <SelectValue placeholder={t("Select a topic", "Seleccione un tema")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">{t("Lockbox / access issue", "Problema de acceso / caja")}</SelectItem>
                    <SelectItem value="housekeeping">{t("Housekeeping", "Limpieza")}</SelectItem>
                    <SelectItem value="ac_tv">{t("AC / TV problem", "Problema de A/C o TV")}</SelectItem>
                    <SelectItem value="checkin">{t("Check-in / check-out", "Check-in / check-out")}</SelectItem>
                    <SelectItem value="emergency">{t("Emergency", "Emergencia")}</SelectItem>
                    <SelectItem value="other">{t("Other", "Otro")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground/70 mb-2 block text-sm">{t("Urgency", "Urgencia")}</Label>
                <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-5">
                  {[
                    { val: "low",    label: t("Low", "Baja") },
                    { val: "soon",   label: t("Soon", "Pronto") },
                    { val: "urgent", label: t("Urgent", "Urgente") },
                  ].map((u) => (
                    <div key={u.val} className="flex items-center gap-2">
                      <RadioGroupItem value={u.val} id={`urg-${u.val}`} className="border-border text-primary" data-testid={`radio-urgency-${u.val}`} />
                      <Label htmlFor={`urg-${u.val}`} className="text-foreground/80 text-sm cursor-pointer">{u.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <Button
              className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(13,27,64,0.25)]"
              onClick={handleStartCall}
              disabled={!name || !room || !reason}
              data-testid="button-start-live-call"
            >
              <Video className="w-5 h-5 mr-2" />
              {t("Start Live Session", "Iniciar Sesión en Vivo")}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t("Opens Google Meet in a new tab.", "Abre Google Meet en una nueva pestaña.")}
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ── Embedded (dark card) version for when used inside Hub ── */
  return (
    <section id="concierge" className="py-16 px-6 text-white my-8 mx-4 md:mx-0 rounded-[2rem] shadow-xl" style={{ background: "var(--dark-navy, #0B1730)" }}>
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-white/90 border border-white/20 flex items-center justify-center overflow-hidden">
            <img src={logoUrl} alt="Rosalina Concierge Team" className="w-14 h-14 object-contain" />
          </div>
          <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-[#0B1730] ${isAfterHours ? "bg-secondary" : "bg-green-500"}`} />
        </div>
        <h2 className="font-serif text-3xl mb-2 text-center">{t("Live Assistance", "Asistencia en Vivo")}</h2>
        <p className="text-secondary/80 text-sm text-center max-w-xs">
          {isAfterHours
            ? t("Our team will be back at 8 AM.", "Nuestro equipo regresa a las 8 AM.")
            : t("Our team is ready to help. Start a live video session.", "Nuestro equipo está listo. Inicie una sesión en vivo.")
          }
        </p>
      </div>

      {isAfterHours ? (
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
          <p className="text-secondary/80 text-sm mb-5">
            {t("Live concierge is offline (2 AM to 8 AM). For immediate help, call the emergency line.", "El concierge en vivo está fuera de línea (2 AM a 8 AM). Para ayuda inmediata, llame a la línea de emergencia.")}
          </p>
          <a href="tel:17874389393" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors" data-testid="button-call-emergency">
            <PhoneCall className="w-4 h-4" />
            787-438-9393
          </a>
        </div>
      ) : (
        <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="space-y-4">
            <div>
              <Label className="text-secondary/80 mb-1.5 block">{t("Name", "Nombre")}</Label>
              <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-primary h-12" placeholder={t("Your name", "Su nombre")} value={name} onChange={(e) => setName(e.target.value)} data-testid="input-name" />
            </div>
            <div>
              <Label className="text-secondary/80 mb-1.5 block">{t("Room", "Habitación")}</Label>
              <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-primary h-12" placeholder={t("e.g. OP7, IV3", "ej. OP7, IV3")} value={room} onChange={(e) => setRoom(e.target.value)} data-testid="input-room" />
            </div>
            <div>
              <Label className="text-secondary/80 mb-1.5 block">{t("How can we help?", "¿Cómo podemos ayudar?")}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12" data-testid="select-reason">
                  <SelectValue placeholder={t("Select a reason", "Seleccione una razón")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access">{t("Lockbox/access issue", "Problema con acceso")}</SelectItem>
                  <SelectItem value="housekeeping">{t("Housekeeping", "Limpieza")}</SelectItem>
                  <SelectItem value="ac_tv">{t("AC/TV problem", "Problema A/C o TV")}</SelectItem>
                  <SelectItem value="checkin">{t("Check-in/check-out question", "Pregunta de check-in/out")}</SelectItem>
                  <SelectItem value="emergency">{t("Emergency", "Emergencia")}</SelectItem>
                  <SelectItem value="other">{t("Other", "Otro")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-secondary/80 mb-2.5 block">{t("Urgency", "Urgencia")}</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-4">
                {[
                  { val: "low", label: t("Low", "Baja") },
                  { val: "soon", label: t("Soon", "Pronto") },
                  { val: "urgent", label: t("Urgent", "Urgente") },
                ].map((u) => (
                  <div key={u.val} className="flex items-center gap-2">
                    <RadioGroupItem value={u.val} id={`e-urg-${u.val}`} className="border-white/40 text-primary" data-testid={`radio-urgency-${u.val}`} />
                    <Label htmlFor={`e-urg-${u.val}`} className="text-white/90">{u.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <Button className="w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 rounded-xl" onClick={handleStartCall} disabled={!name || !room || !reason} data-testid="button-start-live-call">
            <Video className="w-5 h-5 mr-2" />
            {t("Connect with our team", "Conectar con nuestro equipo")}
          </Button>
        </div>
      )}
    </section>
  );
}
