import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ClipboardCheck, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";

export default function PreArrivalPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [roomUnit, setRoomUnit] = useState("");
  const [numGuests, setNumGuests] = useState("1");
  const [carStatus, setCarStatus] = useState("no-car");
  const [preferredContact, setPreferredContact] = useState("email");
  const [specialRequests, setSpecialRequests] = useState("");
  const [wantsLiveAssistance, setWantsLiveAssistance] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const entry = {
      type: "pre-arrival", timestamp, name: fullName, room: roomUnit,
      reservationNumber, arrivalDate, arrivalTime, departureDate, numGuests,
      carStatus, preferredContact, specialRequests, wantsLiveAssistance,
      details: `Pre-Arrival: Res ${reservationNumber}, arriving ${arrivalDate}${arrivalTime ? " at " + arrivalTime : ""}, ${numGuests} guest(s)`,
    };
    const existing = JSON.parse(localStorage.getItem("rosalina_report") || "[]");
    localStorage.setItem("rosalina_report", JSON.stringify([...existing, entry]));

    const body = [
      `Full Name: ${fullName}`,
      `Reservation #: ${reservationNumber}`,
      `Arrival: ${arrivalDate}${arrivalTime ? " at " + arrivalTime : ""}`,
      `Departure: ${departureDate || "TBD"}`,
      `Room / Unit: ${roomUnit || "TBD"}`,
      `Guests: ${numGuests}`,
      `Car Status: ${carStatus}`,
      `Preferred Contact: ${preferredContact}`,
      `Special Requests: ${specialRequests || "None"}`,
      `Live Arrival Assistance: ${wantsLiveAssistance ? "YES" : "No"}`,
    ].join("\n");

    const subject = encodeURIComponent(`Pre-Arrival Form – ${fullName} (${reservationNumber})`);
    window.open(`mailto:contact@rosalinapr.com?subject=${subject}&body=${encodeURIComponent(body)}`, "_blank");
    setSubmitted(true);
  };

  const field = "bg-background/60 border-border focus-visible:ring-primary h-12 text-[15px]";
  const lbl   = "text-foreground/70 font-medium mb-1.5 block text-sm";

  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Pre-Arrival", "Pre-Llegada")}
        badgeIcon={<ClipboardCheck className="w-3 h-3" />}
        title={t("Pre-Arrival Check-In", "Check-In Previo")}
        description={t(
          "Complete this form before your arrival for a seamless experience.",
          "Complete este formulario antes de su llegada para una experiencia perfecta."
        )}
        accentClass="from-green-500/18 via-green-500/4 to-transparent"
      />

      <div className="px-5 py-8 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-16 gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="font-serif text-3xl mb-2">{t("All set!", "¡Todo listo!")}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto text-sm">
                  {t(
                    "We've received your pre-arrival form. Our team will be ready to welcome you.",
                    "Hemos recibido su formulario. Nuestro equipo estará listo para recibirle."
                  )}
                </p>
              </div>
              {wantsLiveAssistance && (
                <div className="bg-primary/8 border border-primary/20 rounded-2xl px-6 py-4 text-sm text-primary font-medium">
                  {t(
                    "Live arrival assistance confirmed — we'll be with you.",
                    "Asistencia de llegada en vivo confirmada — estaremos con usted."
                  )}
                </div>
              )}
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("Submit another form", "Enviar otro formulario")}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="space-y-5 bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
              <div>
                <Label className={lbl} htmlFor="pa-fullname">
                  {t("Full Name", "Nombre Completo")} <span className="text-primary">✦</span>
                </Label>
                <Input id="pa-fullname" className={field} placeholder="John Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required data-testid="input-pa-fullname" />
              </div>

              <div>
                <Label className={lbl} htmlFor="pa-reservation">
                  {t("Reservation Number", "Número de Reserva")} <span className="text-primary">✦</span>
                </Label>
                <Input id="pa-reservation" className={field} placeholder="RES-12345" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)} required data-testid="input-pa-reservation" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={lbl} htmlFor="pa-arrival-date">
                    {t("Arrival Date", "Fecha de Llegada")} <span className="text-primary">✦</span>
                  </Label>
                  <Input id="pa-arrival-date" type="date" className={field} value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required data-testid="input-pa-arrival-date" />
                </div>
                <div>
                  <Label className={lbl} htmlFor="pa-arrival-time">{t("Arrival Time", "Hora de Llegada")}</Label>
                  <Input id="pa-arrival-time" type="time" className={field} value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} data-testid="input-pa-arrival-time" />
                </div>
              </div>

              <div>
                <Label className={lbl} htmlFor="pa-departure-date">{t("Departure Date", "Fecha de Salida")}</Label>
                <Input id="pa-departure-date" type="date" className={field} value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} data-testid="input-pa-departure-date" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={lbl} htmlFor="pa-room">{t("Room / Unit", "Habitación / Unidad")}</Label>
                  <Input id="pa-room" className={field} placeholder="204" value={roomUnit} onChange={(e) => setRoomUnit(e.target.value)} data-testid="input-pa-room" />
                </div>
                <div>
                  <Label className={lbl} htmlFor="pa-guests">{t("# Guests", "# Huéspedes")}</Label>
                  <Input id="pa-guests" type="number" min="1" max="20" className={field} value={numGuests} onChange={(e) => setNumGuests(e.target.value)} data-testid="input-pa-guests" />
                </div>
              </div>

              <div>
                <Label className={lbl}>{t("Car Status", "Estado del Auto")}</Label>
                <Select value={carStatus} onValueChange={setCarStatus}>
                  <SelectTrigger className={`${field} w-full`} data-testid="select-pa-car">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-car">{t("No Car", "Sin Auto")}</SelectItem>
                    <SelectItem value="has-car">{t("Bringing a Car", "Traigo Auto")}</SelectItem>
                    <SelectItem value="rental">{t("Rental Car", "Auto de Renta")}</SelectItem>
                    <SelectItem value="rideshare">{t("Rideshare / Taxi", "Taxi / Rideshare")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={lbl}>{t("Preferred Contact", "Contacto Preferido")}</Label>
                <Select value={preferredContact} onValueChange={setPreferredContact}>
                  <SelectTrigger className={`${field} w-full`} data-testid="select-pa-contact">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">{t("Email", "Correo Electrónico")}</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">{t("Phone Call", "Llamada Telefónica")}</SelectItem>
                    <SelectItem value="sms">SMS / Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={lbl} htmlFor="pa-special">{t("Special Requests", "Solicitudes Especiales")}</Label>
                <Textarea
                  id="pa-special"
                  className="bg-background/60 border-border focus-visible:ring-primary min-h-[90px] text-[15px] resize-none"
                  placeholder={t("Dietary needs, accessibility requirements, preferences...", "Necesidades dietéticas, accesibilidad, preferencias...")}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  data-testid="textarea-pa-special"
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/6 border border-primary/15">
                <Checkbox
                  id="pa-live-assist"
                  checked={wantsLiveAssistance}
                  onCheckedChange={(v) => setWantsLiveAssistance(!!v)}
                  className="mt-0.5 border-primary data-[state=checked]:bg-primary"
                  data-testid="checkbox-pa-live"
                />
                <Label htmlFor="pa-live-assist" className="text-sm text-foreground/75 leading-relaxed cursor-pointer">
                  {t(
                    "I'd like live arrival assistance from the concierge team",
                    "Me gustaría asistencia de llegada en vivo del equipo de concierge"
                  )}
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(13,27,64,0.25)]"
                disabled={!fullName || !reservationNumber || !arrivalDate}
                data-testid="button-pa-submit"
              >
                <Send className="w-4 h-4 mr-2" />
                {t("Submit Pre-Arrival Form", "Enviar Formulario de Pre-Llegada")}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                {t("This will open your email app with the form pre-filled.", "Esto abrirá su correo electrónico con el formulario pre-llenado.")}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
