import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ServiceRequest() {
  const { t } = useLanguage();
  
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("No rush");

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
    t("Other", "Otro")
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Hello Rosalina team! I have a service request.\n\nRoom: ${room}\nName: ${name}\nRequest: ${service}\nUrgency: ${urgency}\nDetails: ${details || 'None'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/17874389393?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="request" className="py-16 px-6 md:px-8 bg-secondary/10">
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-foreground mb-3">
          {t("Service Request", "Solicitud de Servicio")}
        </h2>
        <p className="text-muted-foreground">
          {t("Need something? Let us know and we'll handle it via WhatsApp.", "¿Necesita algo? Avísenos y lo gestionaremos vía WhatsApp.")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-[2rem] shadow-sm border border-border">
        
        <div>
          <Label className="text-foreground font-medium mb-3 block">{t("What do you need?", "¿Qué necesita?")}</Label>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  service === s 
                    ? "bg-primary text-primary-foreground shadow-md" 
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
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="req-name" className="text-foreground mb-1.5 block">{t("Name", "Nombre")}</Label>
                <Input 
                  id="req-name"
                  placeholder={t("Your name", "Su nombre")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 h-12"
                  data-testid="input-req-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="req-room" className="text-foreground mb-1.5 block">{t("Room", "Habitación")}</Label>
                <Input 
                  id="req-room"
                  placeholder="e.g. OP7"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="bg-background/50 h-12"
                  data-testid="input-req-room"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="req-details" className="text-foreground mb-1.5 block">
                {t("Details (Optional)", "Detalles (Opcional)")}
              </Label>
              <Textarea 
                id="req-details"
                placeholder={t("Any extra info...", "Cualquier información extra...")}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="bg-background/50 min-h-[100px] resize-none"
                data-testid="textarea-req-details"
              />
            </div>

            <div>
              <Label className="text-foreground mb-3 block">{t("Urgency", "Urgencia")}</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No rush" id="r-low" data-testid="radio-req-low" />
                  <Label htmlFor="r-low" className="text-secondary-foreground font-normal">{t("No rush", "Sin prisa")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Soon" id="r-soon" data-testid="radio-req-soon" />
                  <Label htmlFor="r-soon" className="text-secondary-foreground font-normal">{t("Soon", "Pronto")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Urgent" id="r-urgent" className="text-primary border-primary" data-testid="radio-req-urgent" />
                  <Label htmlFor="r-urgent" className="text-primary font-medium">{t("Urgent", "Urgente")}</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 mt-4 text-base font-medium rounded-xl shadow-md"
              disabled={!name || !room}
              data-testid="button-submit-request"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t("Send via WhatsApp", "Enviar por WhatsApp")}
            </Button>
          </div>
        )}

      </form>
    </section>
  );
}
