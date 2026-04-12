import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Key, User, CalendarClock, Mail, Video, CheckCircle, Luggage, Clock, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";

interface GuestData {
  name: string;
  reservationNumber: string;
  property: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  numGuests: string;
  earlyCheckin: boolean;
  luggageStorage: boolean;
  carStatus: string;
  specialRequests: string;
  createdAt: string;
  password: string;
}

function getGuest(reservationNumber: string): GuestData | null {
  const guests = JSON.parse(localStorage.getItem("rosalina_guests") || "[]") as GuestData[];
  return guests.find((g) => g.reservationNumber.toUpperCase() === reservationNumber.toUpperCase()) || null;
}

export default function GuestPortalPage() {
  const { t } = useLanguage();
  const [reservationId, setReservationId] = useState("");
  const [password, setPassword] = useState("");
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getGuest(reservationId.trim());
    if (!found) {
      setError(t("Reservation not found. Please complete pre-arrival first.", "Reserva no encontrada. Primero complete el pre-llegada."));
      return;
    }
    if (found.password !== password.trim()) {
      setError(t("Incorrect password. Check your welcome email.", "Contraseña incorrecta. Revise su correo de bienvenida."));
      return;
    }
    setError("");
    setGuest(found);
  };

  const handleLogout = () => {
    setGuest(null);
    setReservationId("");
    setPassword("");
  };

  if (guest) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="px-6 pt-20 md:pt-16 pb-10 text-white bg-[#0D1B40] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(38,65,140,0.5),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
                  <img src={logoUrl} alt="" className="w-7 h-7 object-contain brightness-0 invert" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase">Rosalina</p>
                  <p className="text-white/80 text-sm font-medium">{t("Guest Portal", "Portal del Huésped")}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-white/40 hover:text-white/70 text-xs transition-colors">
                {t("Sign out", "Cerrar sesión")}
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
          {/* Reservation card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              {t("Your Stay", "Su Estadía")}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
                  <CalendarClock className="w-3 h-3" /> {t("Arrival", "Llegada")}
                </div>
                <p className="font-semibold">{guest.arrivalDate}</p>
                {guest.arrivalTime && <p className="text-muted-foreground text-xs">~{guest.arrivalTime}</p>}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
                  <CalendarClock className="w-3 h-3" /> {t("Departure", "Salida")}
                </div>
                <p className="font-semibold">{guest.departureDate || t("TBD", "Por confirmar")}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
                  <MapPin className="w-3 h-3" /> {t("Property", "Propiedad")}
                </div>
                <p className="font-semibold">{guest.property || t("To be confirmed", "Por confirmar")}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
                  <User className="w-3 h-3" /> {t("Guests", "Huéspedes")}
                </div>
                <p className="font-semibold">{guest.numGuests}</p>
              </div>
            </div>
          </div>

          {/* Status badges */}
          {(guest.earlyCheckin || guest.luggageStorage) && (
            <div className="flex gap-2 flex-wrap">
              {guest.earlyCheckin && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full text-xs font-medium text-primary">
                  <Clock className="w-3 h-3" />
                  {t("Early Check-in Requested", "Check-in Temprano Solicitado")}
                </div>
              )}
              {guest.luggageStorage && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-amber-700">
                  <Luggage className="w-3 h-3" />
                  {t("Luggage Storage Requested", "Almacenamiento de Maletas Solicitado")}
                </div>
              )}
            </div>
          )}

          {/* Special requests */}
          {guest.specialRequests && (
            <div className="bg-secondary/30 border border-border rounded-2xl p-4 text-sm">
              <p className="text-xs text-muted-foreground mb-1">{t("Your special requests", "Sus solicitudes especiales")}</p>
              <p className="text-foreground/80 leading-relaxed">{guest.specialRequests}</p>
            </div>
          )}

          {/* Contact options */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              {t("Reach Our Team", "Contacte a Nuestro Equipo")}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <a
                href={`mailto:contact@rosalinapr.com?subject=Guest Inquiry – ${guest.name} (${guest.reservationNumber})&body=Hello, my name is ${guest.name}, reservation ${guest.reservationNumber}. I have a question.`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-primary/6 border border-primary/15 hover:bg-primary/10 transition-all active:scale-[0.97]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-primary">{t("Email Our Team", "Escribir al Equipo")}</p>
                  <p className="text-xs text-muted-foreground">contact@rosalinapr.com</p>
                </div>
              </a>
              <a
                href="tel:17873043335"
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all active:scale-[0.97]"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("Call Concierge", "Llamar al Concierge")}</p>
                  <p className="text-xs text-muted-foreground">787-304-3335 · 8 AM to 2 AM</p>
                </div>
              </a>
              <a
                href="https://meet.google.com/rcs-ugkv-cyk"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-primary/6 border border-primary/15 hover:bg-primary/10 transition-all active:scale-[0.97]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-primary">{t("Video Concierge", "Video Concierge")}</p>
                  <p className="text-xs text-muted-foreground">{t("Join a live video session", "Únase a una sesión de video")}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dark-navy, #0D1B40)" }}>
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(38,65,140,0.6),transparent)] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6"
        >
          <img src={logoUrl} alt="Rosalina" className="w-10 h-10 object-contain brightness-0 invert" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-3xl text-white mb-1">{t("Guest Portal", "Portal del Huésped")}</h1>
          <p className="text-white/40 text-sm">
            {t("Access your reservation and stay info.", "Acceda a su reserva e información de estadía.")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleLogin} className="bg-white/8 border border-white/12 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">
                {t("Reservation Number", "Número de Reserva")}
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="text"
                  value={reservationId}
                  onChange={(e) => setReservationId(e.target.value)}
                  placeholder="RES-12345"
                  className="pl-9 bg-white/8 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-white/20 h-12"
                  required
                  data-testid="guest-portal-reservation"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">
                {t("Password", "Contraseña")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-white/8 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-white/20 h-12"
                  required
                  data-testid="guest-portal-password"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-300 text-xs text-center bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-12 font-semibold rounded-xl bg-white text-[#0D1B40] hover:bg-white/90 transition-colors"
              data-testid="guest-portal-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t("Access My Stay", "Acceder a Mi Estadía")}
            </Button>
          </form>

          <p className="text-center text-white/30 text-xs mt-4">
            {t("Your credentials were sent after completing Pre-Arrival.", "Sus credenciales fueron enviadas al completar el Pre-Llegada.")}
          </p>

          <div className="text-center mt-3">
            <a href="/pre-arrival" className="text-white/40 hover:text-white/70 text-xs transition-colors underline underline-offset-2">
              {t("Complete Pre-Arrival first →", "Completar Pre-Llegada primero →")}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
