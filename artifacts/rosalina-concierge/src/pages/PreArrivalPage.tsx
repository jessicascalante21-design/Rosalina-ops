import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import PageHead from "@/components/PageHead";
import { ClipboardCheck, Clock, Luggage, CheckCircle, ChevronRight, ChevronLeft, Copy, LogIn, Gift, UmbrellaIcon, Phone, Mail as MailIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { Link } from "wouter";
import { GuestRecord, generatePassword, getGuests, saveGuests, PACKAGE_OPTIONS, BEACH_EXTRAS } from "@/lib/guest-types";

export default function PreArrivalPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [guestRecord, setGuestRecord] = useState<GuestRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const [fullName, setFullName] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");
  const [property, setProperty] = useState("");
  const [numGuests, setNumGuests] = useState("1");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [additionalGuests, setAdditionalGuests] = useState("");

  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [carStatus, setCarStatus] = useState("no-car");
  const [preferredContact, setPreferredContact] = useState("whatsapp");

  const [earlyCheckin, setEarlyCheckin] = useState(false);
  const [luggageStorage, setLuggageStorage] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedBeachExtras, setSelectedBeachExtras] = useState<string[]>([]);

  const field = "bg-background/60 border-border focus-visible:ring-primary h-12 text-[15px]";
  const lbl = "text-foreground/70 font-medium mb-1.5 block text-sm";

  const step1Valid = fullName.trim() && reservationNumber.trim() && property && phone.trim();
  const step2Valid = arrivalDate;

  const togglePackage = (id: string) => {
    setSelectedPackages((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const toggleBeachExtra = (id: string) => {
    setSelectedBeachExtras((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    const password = generatePassword(fullName, reservationNumber);
    const timestamp = new Date().toISOString();
    const record: GuestRecord = {
      name: fullName, reservationNumber, property, arrivalDate, arrivalTime,
      departureDate, numGuests, earlyCheckin, luggageStorage, carStatus,
      preferredContact, specialRequests, createdAt: timestamp, password,
      phone, email, additionalGuests,
      roomNumber: "", lockboxCode: "", staffNotes: "",
      status: "pre-arrival",
      packages: selectedPackages,
      beachExtras: selectedBeachExtras,
    };

    const guests = getGuests();
    const existing = guests.findIndex((g) => g.reservationNumber.toUpperCase() === reservationNumber.toUpperCase());
    if (existing >= 0) guests[existing] = record;
    else guests.push(record);
    saveGuests(guests);

    const reportEntry = {
      type: "pre-arrival", timestamp, name: fullName, room: "", reservationNumber,
      arrivalDate, arrivalTime, departureDate, numGuests, carStatus, preferredContact,
      specialRequests, earlyCheckin, luggageStorage, property,
      details: `Pre-Arrival: Res ${reservationNumber}, ${property}, arriving ${arrivalDate}${arrivalTime ? " ~" + arrivalTime : ""}${earlyCheckin ? " [EARLY CHECKIN]" : ""}${luggageStorage ? " [LUGGAGE STORAGE]" : ""}${selectedPackages.length ? " [PACKAGES: " + selectedPackages.join(", ") + "]" : ""}${selectedBeachExtras.length ? " [BEACH: " + selectedBeachExtras.join(", ") + "]" : ""}`,
    };
    const report = JSON.parse(localStorage.getItem("rosalina_report") || "[]");
    localStorage.setItem("rosalina_report", JSON.stringify([...report, reportEntry]));

    const emailBody = [
      `Name: ${fullName}`, `Phone: ${phone}`, `Email: ${email || "N/A"}`,
      `Reservation #: ${reservationNumber}`, `Property: ${property}`,
      `Arrival: ${arrivalDate}${arrivalTime ? " ~" + arrivalTime : ""}`,
      `Departure: ${departureDate || "TBD"}`, `Guests: ${numGuests}`,
      additionalGuests ? `Additional Guests: ${additionalGuests}` : "",
      `Car: ${carStatus}`, `Contact via: ${preferredContact}`,
      `Early Check-in: ${earlyCheckin ? "YES (1 PM, $25 if available)" : "No"}`,
      `Luggage Storage: ${luggageStorage ? "YES (until 4 PM)" : "No"}`,
      selectedPackages.length ? `Packages: ${selectedPackages.join(", ")}` : "",
      selectedBeachExtras.length ? `Beach Extras: ${selectedBeachExtras.join(", ")}` : "",
      `Special Requests: ${specialRequests || "None"}`,
    ].filter(Boolean).join("\n");
    const subject = encodeURIComponent(`Pre-Arrival: ${fullName} (${reservationNumber})`);
    window.open(`mailto:contact@rosalinapr.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`, "_blank");

    setGuestRecord(record);
    setSubmitted(true);
  };

  const copyCredentials = () => {
    if (!guestRecord) return;
    navigator.clipboard.writeText(
      `Rosalina Guest Portal\nReservation ID: ${guestRecord.reservationNumber}\nPassword: ${guestRecord.password}\nhttps://rosalinapr.com/guest`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <PageHead title="Pre-Arrival" description="Confirm your arrival details for Rosalina Boutique Hotels" />
      <PageHeader
        badge={t("Pre-Arrival", "Pre-Llegada")}
        badgeIcon={<ClipboardCheck className="w-3 h-3" />}
        title={t("Confirm Your Arrival", "Confirme Su Llegada")}
        description={t(
          "Let us know when you're arriving so we can prepare everything perfectly.",
          "Indiquenos cuando llegara para que podamos preparar todo perfectamente."
        )}
        accentClass="from-green-500/18 via-green-500/4 to-transparent"
      />

      <div className="px-5 py-8 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted && guestRecord ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl mb-2">{t("You're all set!", "Todo listo!")}</h2>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                    {t("We received your arrival details. We'll confirm everything via your preferred contact method.", "Recibimos sus datos de llegada. Confirmaremos todo por su metodo de contacto preferido.")}
                  </p>
                </div>
              </div>

              <div className="bg-[#0D1B40] text-white rounded-2xl p-5">
                <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">{t("Your Guest Account", "Su Cuenta de Huesped")}</p>
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between bg-white/8 border border-white/12 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">{t("Reservation ID", "ID de Reserva")}</p>
                      <p className="font-mono font-semibold tracking-wide">{guestRecord.reservationNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/8 border border-white/12 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">{t("Password", "Contrasena")}</p>
                      <p className="font-mono font-semibold tracking-wide">{guestRecord.password}</p>
                    </div>
                  </div>
                </div>
                <p className="text-white/35 text-[11px] mb-4 leading-relaxed">
                  {t("Use these to log into the guest portal and interact with our team anytime.", "Uselos para acceder al portal del huesped e interactuar con nuestro equipo cuando quiera.")}
                </p>
                <div className="flex gap-2">
                  <button onClick={copyCredentials} className="flex-1 h-10 rounded-xl bg-white/10 border border-white/15 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/15 transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                    {copied ? t("Copied!", "Copiado!") : t("Copy credentials", "Copiar credenciales")}
                  </button>
                  <Link href="/guest" className="flex-1 h-10 rounded-xl bg-white text-[#0D1B40] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                    <LogIn className="w-4 h-4" />
                    {t("Open Portal", "Abrir Portal")}
                  </Link>
                </div>
              </div>

              {(earlyCheckin || luggageStorage || selectedPackages.length > 0 || selectedBeachExtras.length > 0) && (
                <div className="bg-card border border-border rounded-2xl p-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{t("Requests Logged", "Solicitudes Registradas")}</p>
                  <div className="space-y-2">
                    {earlyCheckin && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <div>
                          <p className="font-medium">{t("Early Check-in (1 PM)", "Check-in Temprano (1 PM)")}</p>
                          <p className="text-xs text-muted-foreground">{t("$25, subject to availability", "$25, sujeto a disponibilidad")}</p>
                        </div>
                      </div>
                    )}
                    {luggageStorage && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <div>
                          <p className="font-medium">{t("Luggage Storage", "Almacenamiento de Maletas")}</p>
                          <p className="text-xs text-muted-foreground">{t("Available until 4 PM at Ocean Park", "Disponible hasta 4 PM en Ocean Park")}</p>
                        </div>
                      </div>
                    )}
                    {selectedPackages.map((pkgId) => {
                      const pkg = PACKAGE_OPTIONS.find((p) => p.id === pkgId);
                      return pkg ? (
                        <div key={pkgId} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          <div>
                            <p className="font-medium">{t(pkg.en, pkg.es)}</p>
                            <p className="text-xs text-muted-foreground">{pkg.price}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {selectedBeachExtras.map((extId) => {
                      const ext = BEACH_EXTRAS.find((e) => e.id === extId);
                      return ext ? (
                        <div key={extId} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          <div>
                            <p className="font-medium">{t(ext.en, ext.es)}</p>
                            <p className="text-xs text-muted-foreground">{ext.price}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      s < step ? "bg-primary text-white" : s === step ? "bg-primary text-white ring-2 ring-primary/30 ring-offset-2" : "bg-secondary text-muted-foreground"
                    }`}>
                      {s < step ? <CheckCircle className="w-3.5 h-3.5" /> : s}
                    </div>
                    {s < 4 && <div className={`flex-1 h-px w-6 ${s < step ? "bg-primary" : "bg-border"}`} />}
                  </div>
                ))}
                <div className="ml-auto text-xs text-muted-foreground">{t(`Step ${step} of 4`, `Paso ${step} de 4`)}</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="font-serif text-xl mb-1">{t("Guest Information", "Informacion del Huesped")}</h3>
                        <p className="text-sm text-muted-foreground">{t("Tell us about yourself and your party.", "Cuentenos sobre usted y su grupo.")}</p>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Full Name (Primary Guest)", "Nombre Completo (Huesped Principal)")} <span className="text-primary">*</span></Label>
                        <Input className={field} placeholder="John Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} data-testid="input-pa-fullname" />
                      </div>

                      <div>
                        <Label className={lbl}>{t("Reservation Number", "Numero de Reserva")} <span className="text-primary">*</span></Label>
                        <Input className={field} placeholder="RES-12345" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)} data-testid="input-pa-reservation" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className={lbl}><Phone className="w-3 h-3 inline mr-1" />{t("Phone Number", "Telefono")} <span className="text-primary">*</span></Label>
                          <Input className={field} type="tel" placeholder="+1 787-000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="input-pa-phone" />
                        </div>
                        <div>
                          <Label className={lbl}><MailIcon className="w-3 h-3 inline mr-1" />{t("Email", "Correo")}</Label>
                          <Input className={field} type="email" placeholder="guest@email.com" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-pa-email" />
                        </div>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Property", "Propiedad")} <span className="text-primary">*</span></Label>
                        <Select value={property} onValueChange={setProperty}>
                          <SelectTrigger className={`${field} w-full`}>
                            <SelectValue placeholder={t("Select property...", "Seleccione propiedad...")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ocean Park">Ocean Park, San Juan</SelectItem>
                            <SelectItem value="Isla Verde">Isla Verde, Carolina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Number of Guests", "Numero de Huespedes")}</Label>
                        <Input type="number" min="1" max="20" className={field} value={numGuests} onChange={(e) => setNumGuests(e.target.value)} />
                      </div>

                      <div>
                        <Label className={lbl}><Users className="w-3 h-3 inline mr-1" />{t("Additional Guest Names", "Nombres de Huespedes Adicionales")}</Label>
                        <Textarea
                          className="bg-background/60 border-border focus-visible:ring-primary min-h-[60px] text-[15px] resize-none"
                          placeholder={t("e.g. Jane Smith, Carlos Rivera", "ej. Jane Smith, Carlos Rivera")}
                          value={additionalGuests}
                          onChange={(e) => setAdditionalGuests(e.target.value)}
                        />
                        <p className="text-[11px] text-muted-foreground mt-1">{t("One name per line or separated by commas", "Un nombre por linea o separados por comas")}</p>
                      </div>

                      <Button onClick={() => setStep(2)} disabled={!step1Valid} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90">
                        {t("Continue", "Continuar")} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="font-serif text-xl mb-1">{t("Arrival Details", "Detalles de Llegada")}</h3>
                        <p className="text-sm text-muted-foreground">{t("When are you arriving? Lockbox code sent at 11 AM on arrival day.", "Cuando llega? El codigo del candado se envia a las 11 AM del dia de llegada.")}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className={lbl}>{t("Arrival Date", "Fecha de Llegada")} <span className="text-primary">*</span></Label>
                          <Input type="date" className={field} value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} data-testid="input-pa-arrival-date" />
                        </div>
                        <div>
                          <Label className={lbl}>{t("Est. Arrival Time", "Hora Estimada")}</Label>
                          <Input type="time" className={field} value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} data-testid="input-pa-arrival-time" />
                        </div>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Departure Date", "Fecha de Salida")}</Label>
                        <Input type="date" className={field} value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} data-testid="input-pa-departure-date" />
                      </div>

                      <div>
                        <Label className={lbl}>{t("How are you arriving?", "Como llega?")}</Label>
                        <Select value={carStatus} onValueChange={setCarStatus}>
                          <SelectTrigger className={`${field} w-full`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-car">{t("No Car / Walking", "Sin Auto / Caminando")}</SelectItem>
                            <SelectItem value="has-car">{t("Own Vehicle", "Auto propio")}</SelectItem>
                            <SelectItem value="rental">{t("Rental Car", "Auto de Renta")}</SelectItem>
                            <SelectItem value="rideshare">{t("Rideshare / Taxi / Uber", "Rideshare / Taxi / Uber")}</SelectItem>
                            <SelectItem value="airport">{t("Arriving from Airport", "Llegando del Aeropuerto")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Preferred Contact", "Contacto Preferido")}</Label>
                        <Select value={preferredContact} onValueChange={setPreferredContact}>
                          <SelectTrigger className={`${field} w-full`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp (+1 787-438-9393)</SelectItem>
                            <SelectItem value="email">Email (contact@rosalinapr.com)</SelectItem>
                            <SelectItem value="sms">SMS / Text</SelectItem>
                            <SelectItem value="phone">{t("Phone Call", "Llamada Telefonica")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                          <ChevronLeft className="w-4 h-4 mr-1" /> {t("Back", "Atras")}
                        </Button>
                        <Button onClick={() => setStep(3)} disabled={!step2Valid} className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90">
                          {t("Continue", "Continuar")} <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="font-serif text-xl mb-1">{t("Services & Extras", "Servicios y Extras")}</h3>
                        <p className="text-sm text-muted-foreground">{t("Any special needs before or on arrival?", "Alguna necesidad especial antes o al llegar?")}</p>
                      </div>

                      <div
                        onClick={() => setEarlyCheckin(!earlyCheckin)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${earlyCheckin ? "border-primary/40 bg-primary/6" : "border-border hover:border-primary/20"}`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${earlyCheckin ? "bg-primary border-primary" : "border-border"}`}>
                          {earlyCheckin && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary/60" />
                            <p className="font-semibold text-sm">{t("Early Check-in (1 PM)", "Check-in Temprano (1 PM)")}</p>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">$25</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {t("Available from 1 PM (standard is 4 PM). Subject to room availability.", "Disponible desde la 1 PM (estandar es 4 PM). Sujeto a disponibilidad.")}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setLuggageStorage(!luggageStorage)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${luggageStorage ? "border-accent/40 bg-accent/6" : "border-border hover:border-accent/20"}`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${luggageStorage ? "bg-accent border-accent" : "border-border"}`}>
                          {luggageStorage && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Luggage className="w-4 h-4 text-amber-600/70" />
                            <p className="font-semibold text-sm">{t("Luggage Storage on Arrival", "Guardar Maletas al Llegar")}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {t("Store your bags before check-in or after check-out (until 4 PM, Ocean Park).", "Guarde su equipaje antes del check-in o despues del check-out (hasta 4 PM, Ocean Park).")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Gift className="w-4 h-4 text-primary/60" />
                          <p className="font-semibold text-sm">{t("Special Packages & Decorations", "Paquetes Especiales y Decoraciones")}</p>
                        </div>
                        <div className="space-y-2">
                          {PACKAGE_OPTIONS.map((pkg) => (
                            <div
                              key={pkg.id}
                              onClick={() => togglePackage(pkg.id)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                selectedPackages.includes(pkg.id) ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/15"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                selectedPackages.includes(pkg.id) ? "bg-primary border-primary" : "border-border"
                              }`}>
                                {selectedPackages.includes(pkg.id) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="flex-1 text-sm">{t(pkg.en, pkg.es)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{pkg.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                          <ChevronLeft className="w-4 h-4 mr-1" /> {t("Back", "Atras")}
                        </Button>
                        <Button onClick={() => setStep(4)} className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90">
                          {t("Continue", "Continuar")} <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="font-serif text-xl mb-1">{t("Beach & Final Notes", "Playa y Notas Finales")}</h3>
                        <p className="text-sm text-muted-foreground">{t("Beach gear rentals and any additional requests.", "Alquiler de equipo de playa y solicitudes adicionales.")}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <UmbrellaIcon className="w-4 h-4 text-amber-600/70" />
                          <p className="font-semibold text-sm">{t("Beach Chair & Umbrella Rentals", "Alquiler de Sillas y Sombrillas")}</p>
                        </div>
                        <div className="space-y-2">
                          {BEACH_EXTRAS.map((ext) => (
                            <div
                              key={ext.id}
                              onClick={() => toggleBeachExtra(ext.id)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                selectedBeachExtras.includes(ext.id) ? "border-amber-400/30 bg-amber-50" : "border-border hover:border-amber-200"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                selectedBeachExtras.includes(ext.id) ? "bg-amber-500 border-amber-500" : "border-border"
                              }`}>
                                {selectedBeachExtras.includes(ext.id) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="flex-1 text-sm">{t(ext.en, ext.es)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{ext.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className={lbl}>{t("Special Requests or Notes", "Solicitudes Especiales o Notas")}</Label>
                        <Textarea
                          className="bg-background/60 border-border focus-visible:ring-primary min-h-[90px] text-[15px] resize-none"
                          placeholder={t("Anything else you'd like us to know...", "Algo mas que le gustaria que supieramos...")}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12 rounded-xl">
                          <ChevronLeft className="w-4 h-4 mr-1" /> {t("Back", "Atras")}
                        </Button>
                        <Button onClick={handleSubmit} className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90">
                          <CheckCircle className="w-4 h-4 mr-1" /> {t("Submit Pre-Arrival", "Enviar Pre-Llegada")}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
