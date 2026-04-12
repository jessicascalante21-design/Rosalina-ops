import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Key, User, CalendarClock, Mail, Video, CheckCircle, Luggage, Clock, MapPin, Phone, MessageSquare, Gift, UmbrellaIcon, Wifi, Copy, Lock, Waves, Car, Coffee, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import PageHead from "@/components/PageHead";
import logoUrl from "@assets/image_1775935433037.png";
import { GuestRecord, getGuestByReservation, PACKAGE_OPTIONS, BEACH_EXTRAS, SPECIAL_CODES } from "@/lib/guest-types";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

function InfoAccordion({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GuestPortalPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reservationId, setReservationId] = useState("");
  const [password, setPassword] = useState("");
  const [guest, setGuest] = useState<GuestRecord | null>(null);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getGuestByReservation(reservationId.trim());
    if (!found) {
      setError(t("Reservation not found. Please complete pre-arrival first.", "Reserva no encontrada. Primero complete el pre-llegada."));
      return;
    }
    if (found.password !== password.trim()) {
      setError(t("Incorrect password. Check your welcome email.", "Contrasena incorrecta. Revise su correo de bienvenida."));
      return;
    }
    setError("");
    setGuest(found);
  };

  const handleLogout = () => { setGuest(null); setReservationId(""); setPassword(""); };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("Copied!", "Copiado!"), description: text, duration: 2000 });
  };

  if (guest) {
    const selectedPkgs = (guest.packages || []).map((id) => PACKAGE_OPTIONS.find((p) => p.id === id)).filter(Boolean);
    const selectedExtras = (guest.beachExtras || []).map((id) => BEACH_EXTRAS.find((e) => e.id === id)).filter(Boolean);
    const additionalNames = guest.additionalGuests ? guest.additionalGuests.split(/[,\n]/).map((n) => n.trim()).filter(Boolean) : [];
    const isOP = guest.property === "Ocean Park";
    const prefix = isOP ? "OP" : "IV";
    const specialCodes = guest.property ? SPECIAL_CODES[guest.property] : null;
    const isIVDoorCode = !isOP && guest.roomNumber && parseInt(guest.roomNumber) >= 1 && parseInt(guest.roomNumber) <= 4;

    return (
      <div className="min-h-screen bg-background">
        <PageHead title="Guest Portal" description="View your stay details and contact the Rosalina team" />
        <div className="px-6 pt-20 md:pt-16 pb-10 text-white bg-[#0B1730] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(38,65,140,0.5),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
                  <img src={logoUrl} alt="" className="w-7 h-7 object-contain brightness-0 invert" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase">Rosalina</p>
                  <p className="text-white/80 text-sm font-medium">{t("Guest Portal", "Portal del Huesped")}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-white/40 hover:text-white/70 text-xs transition-colors">
                {t("Sign out", "Cerrar sesion")}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-serif text-white">
                {guest.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="font-serif text-2xl">{t(`Welcome, ${guest.name.split(" ")[0]}`, `Bienvenido, ${guest.name.split(" ")[0]}`)}</h1>
                <p className="text-white/40 text-sm">{guest.property} · #{guest.reservationNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 max-w-xl mx-auto space-y-4">

          {/* ── 1. PROPERTY-SPECIFIC CHECK-IN INSTRUCTIONS ── */}
          {guest.roomNumber && guest.lockboxCode && (
            <div className="bg-primary/6 border border-primary/15 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold tracking-widest uppercase text-primary">{t("Your Check-in Details", "Detalles de Check-in")}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">{t("Room", "Habitacion")}</p>
                  <p className="font-serif text-2xl font-medium">{prefix}-{guest.roomNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">{t("Lockbox Code", "Codigo Candado")}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-2xl font-bold tracking-wider text-primary">{guest.lockboxCode}</p>
                    <button onClick={() => handleCopy(guest.lockboxCode)} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {isIVDoorCode && (
                <div className="bg-card border border-border rounded-xl p-3 mb-3">
                  <p className="text-[11px] text-muted-foreground mb-0.5">{t("Door Access Code (Rooms 1-4)", "Codigo de Puerta (Habitaciones 1-4)")}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg font-bold">2323#</p>
                    <button onClick={() => handleCopy("2323#")} className="w-6 h-6 rounded-md bg-secondary/30 flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                <p>{t(
                  "The lockbox is located at the entrance of your room. Enter your code to retrieve the key.",
                  "El candado esta ubicado en la entrada de su habitacion. Ingrese su codigo para obtener la llave."
                )}</p>
                <p>{t(
                  "Check-in time is 4:00 PM. Please return the key to the lockbox at check-out (11:00 AM).",
                  "La hora de check-in es 4:00 PM. Devuelva la llave al candado al hacer check-out (11:00 AM)."
                )}</p>
              </div>
            </div>
          )}

          {/* ── 2. PROPERTY INFO CARD ── */}
          <InfoAccordion title={`${guest.property} — ${t("Property Info", "Info de Propiedad")}`} icon={MapPin} defaultOpen={true}>
            {isOP ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{t(
                  "A peaceful residential neighborhood in San Juan. Palm-lined streets and one of the city's most beautiful beaches within a 5-minute walk.",
                  "Un barrio residencial tranquilo en San Juan. Calles con palmeras y una de las playas mas hermosas de la ciudad a 5 minutos caminando."
                )}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5"><Waves className="w-3 h-3 text-primary/40" />{t("5 min to beach", "5 min a la playa")}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary/40" />{t("9 min to airport", "9 min al aeropuerto")}</div>
                  <div className="flex items-center gap-1.5"><Waves className="w-3 h-3 text-primary/40" />{t("2 pools on site", "2 piscinas")}</div>
                  <div className="flex items-center gap-1.5"><Coffee className="w-3 h-3 text-primary/40" />{t("Coffee station", "Estacion de cafe")}</div>
                </div>
                <div className="bg-secondary/20 rounded-xl p-3 text-xs">
                  <p className="font-medium text-foreground mb-0.5">{t("Address", "Direccion")}</p>
                  <p>2020 Av. McLeary, San Juan PR 00911</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{t(
                  "A vibrant beach strip in Carolina. 4-minute walk to the beach, close to the airport. Isla Verde guests have complimentary access to Ocean Park pools (~8 min drive).",
                  "Una animada franja playera en Carolina. 4 minutos caminando a la playa, cerca del aeropuerto. Acceso gratuito a piscinas de Ocean Park (~8 min en auto)."
                )}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5"><Waves className="w-3 h-3 text-primary/40" />{t("4 min to beach", "4 min a la playa")}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary/40" />{t("6 min to airport", "6 min al aeropuerto")}</div>
                  <div className="flex items-center gap-1.5"><Waves className="w-3 h-3 text-primary/40" />{t("Pool access at OP", "Acceso a piscinas OP")}</div>
                  <div className="flex items-center gap-1.5"><Coffee className="w-3 h-3 text-primary/40" />{t("Coffee station", "Estacion de cafe")}</div>
                </div>
                <div className="bg-secondary/20 rounded-xl p-3 text-xs">
                  <p className="font-medium text-foreground mb-0.5">{t("Address", "Direccion")}</p>
                  <p>84 Calle Jupiter, Carolina PR 00979</p>
                </div>
              </div>
            )}
          </InfoAccordion>

          {/* ── 3. WI-FI CREDENTIALS (guest-only) ── */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                <Wifi className="w-4 h-4" />
              </div>
              <p className="font-medium text-sm">Wi-Fi</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Network", "Red")}</p>
                <p className="font-medium">Rosalina Guest</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Password", "Contrasena")}</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-semibold tracking-wide">RosalinaForever1!</p>
                  <button onClick={() => handleCopy("RosalinaForever1!")} className="w-7 h-7 rounded-lg bg-secondary/30 flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-colors" data-testid="button-copy-wifi">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. YOUR STAY DETAILS ── */}
          <InfoAccordion title={t("Your Stay", "Su Estadia")} icon={CalendarClock} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Arrival", "Llegada")}</p>
                <p className="font-semibold">{guest.arrivalDate}</p>
                {guest.arrivalTime && <p className="text-muted-foreground text-xs">~{guest.arrivalTime}</p>}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Departure", "Salida")}</p>
                <p className="font-semibold">{guest.departureDate || t("TBD", "Por confirmar")}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Property", "Propiedad")}</p>
                <p className="font-semibold">{guest.property || t("To be confirmed", "Por confirmar")}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">{t("Guests", "Huespedes")}</p>
                <p className="font-semibold">{guest.numGuests}</p>
              </div>
            </div>
            {additionalNames.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-1">{t("Additional Guests", "Huespedes Adicionales")}</p>
                <p className="text-sm">{additionalNames.join(", ")}</p>
              </div>
            )}
          </InfoAccordion>

          {(guest.earlyCheckin || guest.luggageStorage) && (
            <div className="flex gap-2 flex-wrap">
              {guest.earlyCheckin && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full text-xs font-medium text-primary">
                  <Clock className="w-3 h-3" /> {t("Early Check-in Requested", "Check-in Temprano Solicitado")}
                </div>
              )}
              {guest.luggageStorage && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-amber-700">
                  <Luggage className="w-3 h-3" /> {t("Luggage Storage Requested", "Almacenamiento de Maletas Solicitado")}
                </div>
              )}
            </div>
          )}

          {(selectedPkgs.length > 0 || selectedExtras.length > 0) && (
            <InfoAccordion title={t("Your Add-Ons", "Sus Extras")} icon={Gift} defaultOpen={false}>
              <div className="space-y-2">
                {selectedPkgs.map((pkg) => pkg && (
                  <div key={pkg.id} className="flex items-center gap-2.5 text-sm">
                    <Gift className="w-4 h-4 text-primary/60 shrink-0" />
                    <span className="flex-1">{t(pkg.en, pkg.es)}</span>
                    <span className="text-xs text-muted-foreground font-mono">{pkg.price}</span>
                  </div>
                ))}
                {selectedExtras.map((ext) => ext && (
                  <div key={ext.id} className="flex items-center gap-2.5 text-sm">
                    <UmbrellaIcon className="w-4 h-4 text-amber-600/60 shrink-0" />
                    <span className="flex-1">{t(ext.en, ext.es)}</span>
                    <span className="text-xs text-muted-foreground font-mono">{ext.price}</span>
                  </div>
                ))}
              </div>
            </InfoAccordion>
          )}

          {guest.specialRequests && (
            <div className="bg-secondary/30 border border-border rounded-2xl p-4 text-sm">
              <p className="text-xs text-muted-foreground mb-1">{t("Your special requests", "Sus solicitudes especiales")}</p>
              <p className="text-foreground/80 leading-relaxed">{guest.specialRequests}</p>
            </div>
          )}

          {/* ── 5. GENERAL INFO ── */}
          <InfoAccordion title={t("Check-in & Check-out", "Check-in y Check-out")} icon={Clock}>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Check-in: 4:00 PM</p>
                <p className="text-xs">{t("Access code sent at 11 AM on arrival day", "Codigo de acceso enviado a las 11 AM el dia de llegada")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Check-out: 11:00 AM</p>
                <p className="text-xs">{t("Return keys to the lockbox", "Devuelva las llaves al candado")}</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-3 text-xs">
                <p>{t("Early check-in (1 PM) = $25 | Late check-out (1 PM) = $25", "Check-in temprano (1 PM) = $25 | Late check-out (1 PM) = $25")}</p>
                <p className="text-muted-foreground/60 italic mt-0.5">{t("*Subject to availability", "*Sujeto a disponibilidad")}</p>
              </div>
            </div>
          </InfoAccordion>

          <InfoAccordion title={t("Pools & Quiet Hours", "Piscinas y Horas de Silencio")} icon={Waves}>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t(
                "2 pools at Ocean Park. Isla Verde guests have free access (~8 min drive).",
                "2 piscinas en Ocean Park. Huespedes de Isla Verde tienen acceso gratuito (~8 min en auto)."
              )}</p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-medium">{t("Quiet hours: 10 PM - 8 AM", "Horas de silencio: 10 PM - 8 AM")}</p>
                <p className="mt-0.5">{t("No gatherings in common areas after midnight.", "No se permiten reuniones en areas comunes despues de la medianoche.")}</p>
              </div>
            </div>
          </InfoAccordion>

          <InfoAccordion title={t("Parking & Transport", "Estacionamiento y Transporte")} icon={Car}>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("Street parking available. Uber/Lyft recommended for airport transfers.", "Estacionamiento en la calle disponible. Uber/Lyft recomendado para traslados al aeropuerto.")}</p>
              <p>{t("Car rental recommended for day trips (El Yunque, west coast).", "Alquiler de auto recomendado para excursiones (El Yunque, costa oeste).")}</p>
            </div>
          </InfoAccordion>

          {/* ── 6. QUICK ACTIONS ── */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{t("Quick Actions", "Acciones Rapidas")}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link href="/request" className="flex items-center gap-2 p-3 rounded-xl bg-primary/6 border border-primary/15 hover:bg-primary/10 transition-all text-sm font-medium text-primary">
                <MessageSquare className="w-4 h-4" /> {t("Request Service", "Solicitar Servicio")}
              </Link>
              <Link href="/guide" className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-all text-sm font-medium">
                <MapPin className="w-4 h-4" /> {t("Area Guide", "Guia del Area")}
              </Link>
            </div>
          </div>

          {/* ── 7. CONTACT ── */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{t("Reach Our Team", "Contacte a Nuestro Equipo")}</p>
            <div className="grid grid-cols-1 gap-2">
              <a href="https://wa.me/19397938989" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100/80 transition-all active:scale-[0.97]">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0"><MessageSquare className="w-5 h-5 text-white" /></div>
                <div>
                  <p className="font-semibold text-sm text-green-800">{t("WhatsApp", "WhatsApp")}</p>
                  <p className="text-xs text-green-600/70">+1 (939) 793-8989</p>
                </div>
              </a>
              <a href="tel:17873043335" className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all active:scale-[0.97]">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-foreground/70" /></div>
                <div>
                  <p className="font-semibold text-sm">{t("Call Concierge", "Llamar al Concierge")}</p>
                  <p className="text-xs text-muted-foreground">787-304-3335 · 8 AM to 2 AM</p>
                </div>
              </a>
              <a href="https://meet.google.com/rcs-ugkv-cyk" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-primary/6 border border-primary/15 hover:bg-primary/10 transition-all active:scale-[0.97]">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><Video className="w-5 h-5 text-white" /></div>
                <div>
                  <p className="font-semibold text-sm text-primary">{t("Video Concierge", "Video Concierge")}</p>
                  <p className="text-xs text-muted-foreground">{t("Join a live video session", "Unase a una sesion de video")}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dark-navy, #0B1730)" }}>
      <PageHead title="Guest Portal" description="Log in to view your stay details at Rosalina Boutique Hotels" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(38,65,140,0.6),transparent)] pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6 p-3">
          <img src={logoUrl} alt="Rosalina" className="w-full h-full object-contain brightness-0 invert" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-1">{t("Guest Portal", "Portal del Huesped")}</h1>
          <p className="text-white/40 text-sm">{t("Access your reservation and stay info.", "Acceda a su reserva e informacion de estadia.")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="bg-white/8 border border-white/12 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">{t("Reservation Number", "Numero de Reserva")}</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input type="text" value={reservationId} onChange={(e) => setReservationId(e.target.value)} placeholder="RES-12345"
                  className="pl-9 bg-white/8 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-white/20 h-12" required data-testid="guest-portal-reservation" />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">{t("Password", "Contrasena")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********"
                  className="pl-9 bg-white/8 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-white/20 h-12" required data-testid="guest-portal-password" />
              </div>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-300 text-xs text-center bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-xl">{error}</motion.p>
            )}
            <Button type="submit" className="w-full h-12 font-semibold rounded-xl bg-white text-[#0B1730] hover:bg-white/90 transition-colors" data-testid="guest-portal-login">
              <LogIn className="w-4 h-4 mr-2" /> {t("Access My Stay", "Acceder a Mi Estadia")}
            </Button>
          </form>
          <p className="text-center text-white/30 text-xs mt-4">{t("Your credentials were sent after completing Pre-Arrival.", "Sus credenciales fueron enviadas al completar el Pre-Llegada.")}</p>
          <div className="text-center mt-3">
            <a href="/pre-arrival" className="text-white/40 hover:text-white/70 text-xs transition-colors underline underline-offset-2">
              {t("Complete Pre-Arrival first", "Completar Pre-Llegada primero")}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
