import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { PhoneCall, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LiveConcierge() {
  const { t } = useLanguage();
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("soon");

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsAfterHours(hour >= 2 && hour < 8);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCall = () => {
    window.open("https://meet.google.com/lookup/rosalina", "_blank");
  };

  return (
    <section id="concierge" className="py-16 px-6 bg-[#1A1A1A] text-white my-8 mx-4 md:mx-0 rounded-[2rem] shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden border-2 border-[#1A1A1A]">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" 
              alt="Jessica - Concierge"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[#1A1A1A] rounded-full"></div>
        </div>
        <h2 className="font-serif text-3xl mb-2 text-center">
          {t("Live Assistance", "Asistencia en Vivo")}
        </h2>
        <p className="text-secondary/80 text-sm text-center">
          {t("Jessica is online and ready to help.", "Jessica está en línea y lista para ayudar.")}
        </p>
      </div>

      {isAfterHours ? (
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
          <p className="text-secondary mb-4">
            {t(
              "Our live concierge desk is currently closed. For immediate assistance, please call our 24/7 emergency line.",
              "Nuestro servicio de concierge en vivo está cerrado. Para asistencia inmediata, llame a nuestra línea de emergencia 24/7."
            )}
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
              <Input 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-primary h-12"
                placeholder={t("Your name", "Su nombre")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
              />
            </div>
            
            <div>
              <Label className="text-secondary/80 mb-1.5 block">{t("Room", "Habitación")}</Label>
              <Input 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-primary h-12"
                placeholder={t("e.g. OP7, IV3", "ej. OP7, IV3")}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                data-testid="input-room"
              />
            </div>

            <div>
              <Label className="text-secondary/80 mb-1.5 block">{t("Reason", "Razón")}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12" data-testid="select-reason">
                  <SelectValue placeholder={t("Select a reason", "Seleccione una razón")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access">{t("Lockbox/access issue", "Problema con caja fuerte/acceso")}</SelectItem>
                  <SelectItem value="housekeeping">{t("Housekeeping", "Limpieza")}</SelectItem>
                  <SelectItem value="ac_tv">{t("AC/TV problem", "Problema de A/C o TV")}</SelectItem>
                  <SelectItem value="checkin">{t("Check-in/check-out question", "Pregunta de Check-in/out")}</SelectItem>
                  <SelectItem value="emergency">{t("Emergency", "Emergencia")}</SelectItem>
                  <SelectItem value="other">{t("Other", "Otro")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-secondary/80 mb-2.5 block">{t("Urgency", "Urgencia")}</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="urgency-low" className="border-white/40 text-primary" data-testid="radio-urgency-low" />
                  <Label htmlFor="urgency-low" className="text-white/90">{t("Low", "Baja")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soon" id="urgency-soon" className="border-white/40 text-primary" data-testid="radio-urgency-soon" />
                  <Label htmlFor="urgency-soon" className="text-white/90">{t("Soon", "Pronto")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgency-urgent" className="border-white/40 text-primary" data-testid="radio-urgency-urgent" />
                  <Label htmlFor="urgency-urgent" className="text-white/90">{t("Urgent", "Urgente")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            onClick={handleStartCall}
            disabled={!name || !room || !reason}
            data-testid="button-start-live-call"
          >
            <Video className="w-5 h-5 mr-2" />
            {t("Start live assistance", "Iniciar asistencia en vivo")}
          </Button>
        </div>
      )}
    </section>
  );
}
