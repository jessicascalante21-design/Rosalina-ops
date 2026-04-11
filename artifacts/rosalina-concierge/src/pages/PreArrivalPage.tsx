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
      type: "pre-arrival",
      timestamp,
      name: fullName,
      room: roomUnit,
      reservationNumber,
      arrivalDate,
      arrivalTime,
      departureDate,
      numGuests,
      carStatus,
      preferredContact,
      specialRequests,
      wantsLiveAssistance,
      details: `Pre-Arrival: Res ${reservationNumber}, arriving ${arrivalDate}${arrivalTime ? " at " + arrivalTime : ""}, ${numGuests} guest(s), car: ${carStatus}`,
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
      `Car Status: ${carStatus === "no-car" ? t("No Car", "Sin Auto") : t("Has Car", "Tiene Auto")}`,
      `Preferred Contact: ${preferredContact}`,
      `Special Requests: ${specialRequests || "None"}`,
      `Live Arrival Assistance: ${wantsLiveAssistance ? "YES – please arrange" : "No"}`,
    ].join("\n");

    const subject = encodeURIComponent(`Pre-Arrival Form – ${fullName} (${reservationNumber})`);
    const bodyEncoded = encodeURIComponent(body);
    window.open(`mailto:contact@rosalinapr.com?subject=${subject}&body=${bodyEncoded}`, "_blank");

    setSubmitted(true);
  };

  const fieldClass = "bg-background border-border focus-visible:ring-primary h-12 text-base";
  const labelClass = "text-foreground/80 font-medium mb-1.5 block text-sm";

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-[#1A1A1A] px-6 pt-24 md:pt-10 pb-10 text-white">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium tracking-wide mb-4">
            <ClipboardCheck className="w-3.5 h-3.5" />
            {t("Pre-Arrival", "Pre-Llegada")}
          </div>
          <h1 className="font-serif text-4xl mb-3 leading-tight">
            {t("Pre-Arrival Check-In", "Check-In Previo a la Llegada")}
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            {t(
              "Complete this form before your arrival for a seamless experience.",
              "Complete este formulario antes de su llegada para una experiencia perfecta."
            )}
          </p>
        </div>
      </div>

      <div className="px-6 py-10 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-16 gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="font-serif text-3xl mb-2">{t("All set!", "¡Todo listo!")}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {t(
                    "We've received your pre-arrival form. Our team will be ready for you on arrival.",
                    "Hemos recibido su formulario. Nuestro equipo estará listo para su llegada."
                  )}
                </p>
              </div>
              {wantsLiveAssistance && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 text-sm text-primary font-medium">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-card border border-border rounded-3xl p-6 shadow-sm"
            >
              {/* Full Name */}
              <div>
                <Label className={labelClass} htmlFor="pa-fullname">
                  {t("Full Name", "Nombre Completo")} <span className="text-primary">*</span>
                </Label>
                <Input
                  id="pa-fullname"
                  className={fieldClass}
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  data-testid="input-pa-fullname"
                />
              </div>

              {/* Reservation Number */}
              <div>
                <Label className={labelClass} htmlFor="pa-reservation">
                  {t("Reservation Number", "Número de Reserva")} <span className="text-primary">*</span>
                </Label>
                <Input
                  id="pa-reservation"
                  className={fieldClass}
                  placeholder="RES-12345"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  required
                  data-testid="input-pa-reservation"
                />
              </div>

              {/* Arrival Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass} htmlFor="pa-arrival-date">
                    {t("Arrival Date", "Fecha de Llegada")} <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="pa-arrival-date"
                    type="date"
                    className={fieldClass}
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                    data-testid="input-pa-arrival-date"
                  />
                </div>
                <div>
                  <Label className={labelClass} htmlFor="pa-arrival-time">
                    {t("Arrival Time", "Hora de Llegada")}
                  </Label>
                  <Input
                    id="pa-arrival-time"
                    type="time"
                    className={fieldClass}
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    data-testid="input-pa-arrival-time"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <Label className={labelClass} htmlFor="pa-departure-date">
                  {t("Departure Date", "Fecha de Salida")}
                </Label>
                <Input
                  id="pa-departure-date"
                  type="date"
                  className={fieldClass}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  data-testid="input-pa-departure-date"
                />
              </div>

              {/* Room / Unit + Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass} htmlFor="pa-room">
                    {t("Room / Unit", "Habitación / Unidad")}
                  </Label>
                  <Input
                    id="pa-room"
                    className={fieldClass}
                    placeholder="204"
                    value={roomUnit}
                    onChange={(e) => setRoomUnit(e.target.value)}
                    data-testid="input-pa-room"
                  />
                </div>
                <div>
                  <Label className={labelClass} htmlFor="pa-guests">
                    {t("Number of Guests", "Número de Huéspedes")}
                  </Label>
                  <Input
                    id="pa-guests"
                    type="number"
                    min="1"
                    max="20"
                    className={fieldClass}
                    value={numGuests}
                    onChange={(e) => setNumGuests(e.target.value)}
                    data-testid="input-pa-guests"
                  />
                </div>
              </div>

              {/* Car Status */}
              <div>
                <Label className={labelClass}>
                  {t("Car Status", "Estado del Auto")}
                </Label>
                <Select value={carStatus} onValueChange={setCarStatus}>
                  <SelectTrigger className={`${fieldClass} w-full`} data-testid="select-pa-car">
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

              {/* Preferred Contact */}
              <div>
                <Label className={labelClass}>
                  {t("Preferred Contact", "Contacto Preferido")}
                </Label>
                <Select value={preferredContact} onValueChange={setPreferredContact}>
                  <SelectTrigger className={`${fieldClass} w-full`} data-testid="select-pa-contact">
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

              {/* Special Requests */}
              <div>
                <Label className={labelClass} htmlFor="pa-special">
                  {t("Special Requests", "Solicitudes Especiales")}
                </Label>
                <Textarea
                  id="pa-special"
                  className="bg-background border-border focus-visible:ring-primary min-h-[100px] text-base resize-none"
                  placeholder={t(
                    "Any dietary needs, accessibility requirements, or preferences...",
                    "Necesidades dietéticas, requisitos de accesibilidad o preferencias..."
                  )}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  data-testid="textarea-pa-special"
                />
              </div>

              {/* Live Assistance Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                <Checkbox
                  id="pa-live-assist"
                  checked={wantsLiveAssistance}
                  onCheckedChange={(v) => setWantsLiveAssistance(!!v)}
                  className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  data-testid="checkbox-pa-live"
                />
                <Label htmlFor="pa-live-assist" className="text-sm text-foreground/80 leading-relaxed cursor-pointer">
                  {t(
                    "I'd like live arrival assistance from the concierge team",
                    "Me gustaría asistencia de llegada en vivo del equipo de concierge"
                  )}
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(196,139,107,0.3)]"
                disabled={!fullName || !reservationNumber || !arrivalDate}
                data-testid="button-pa-submit"
              >
                <Send className="w-4 h-4 mr-2" />
                {t("Submit Pre-Arrival Form", "Enviar Formulario de Pre-Llegada")}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {t(
                  "This will open your email app with the form data pre-filled.",
                  "Esto abrirá su aplicación de correo con los datos pre-llenados."
                )}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
