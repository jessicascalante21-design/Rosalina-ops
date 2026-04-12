import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Headphones, ClipboardList, AlertTriangle, ArrowRight, ClipboardCheck, MapPin, Clock3, Waves, Hotel } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Splash from "@/components/sections/Splash";
import PropertyInfo from "@/components/sections/PropertyInfo";
import FAQ from "@/components/sections/FAQ";
import logoUrl from "@assets/image_1775935433037.png";

type StatusType = "am" | "pm" | "late" | "closed";
type PropertyType = "Ocean Park" | "Isla Verde" | null;

export default function HubPage() {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("rosalina_splash_seen"));
  const [status, setStatus] = useState<StatusType>("am");
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>(() => {
    return (localStorage.getItem("rosalina_property") as PropertyType) || null;
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("rosalina_splash_seen", "1");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      if (h >= 8 && h < 17) setStatus("am");
      else if (h >= 17 && h < 22) setStatus("pm");
      else if (h >= 22 || h < 2) setStatus("late");
      else setStatus("closed");
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  const handlePropertySelect = (prop: PropertyType) => {
    setSelectedProperty(prop);
    if (prop) localStorage.setItem("rosalina_property", prop);
    else localStorage.removeItem("rosalina_property");
  };

  const statusDisplay = {
    am:     { dot: "bg-green-400", pulse: false, text: t("Concierge Online · AM Shift", "Concierge en Línea · Turno AM"), online: true },
    pm:     { dot: "bg-green-400", pulse: false, text: t("Concierge Online · PM Shift", "Concierge en Línea · Turno PM"), online: true },
    late:   { dot: "bg-amber-400",  pulse: true,  text: t("Late Night Support · Until 2 AM", "Soporte Nocturno · Hasta 2 AM"), online: true },
    closed: { dot: "bg-white/20",  pulse: false, text: t("Closed · Opens at 8 AM", "Cerrado · Abre a las 8 AM"), online: false },
  }[status];

  const actions = [
    {
      to: "/concierge",
      label: t("Get Help Now", "Obtener Ayuda Ahora"),
      desc: t("Live video with our concierge team", "Video en vivo con nuestro equipo"),
      icon: Headphones,
      primary: true,
    },
    {
      to: "/pre-arrival",
      label: t("Pre-Arrival Check-In", "Check-In Previo"),
      desc: t("Submit arrival info in advance", "Envíe su información de llegada"),
      icon: ClipboardCheck,
      primary: false,
    },
    {
      to: "/request",
      label: t("Request Service", "Solicitar Servicio"),
      desc: t("Amenities, housekeeping, and more", "Toallas, limpieza y más"),
      icon: ClipboardList,
      primary: false,
    },
    {
      to: "/emergency",
      label: t("Emergency", "Emergencia"),
      desc: t("24/7 emergency contact line", "Línea de emergencia 24/7"),
      icon: AlertTriangle,
      primary: false,
    },
  ];

  const properties = [
    {
      id: "Ocean Park" as PropertyType,
      name: "Ocean Park",
      subtitle: t("San Juan · Beachfront", "San Juan · Frente al Mar"),
      note: t("Pool · Quiet residential vibe · 4 min to beach", "Piscina · Ambiente tranquilo · 4 min a la playa"),
      color: "from-primary/12 to-primary/5",
      border: "border-primary/30",
    },
    {
      id: "Isla Verde" as PropertyType,
      name: "Isla Verde",
      subtitle: t("Carolina · Near Airport", "Carolina · Cerca del Aeropuerto"),
      note: t("Vibrant beach area · 8 min to beach · Near nightlife", "Área de playa vibrante · 8 min a la playa"),
      color: "from-accent/12 to-accent/5",
      border: "border-accent/30",
    },
  ];

  return (
    <>
      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Hero ─────────────────────────────────────────── */}
          <section
            className="relative w-full pt-20 md:pt-0 pb-16 px-6 overflow-hidden text-white"
            style={{ background: "var(--dark-navy, #0D1B40)" }}
          >
            {/* Radial glow accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_-10%,rgba(38,65,140,0.7),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(212,151,42,0.12),transparent)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            <div className="relative z-10 max-w-xl mx-auto text-center pt-8 md:pt-16 pb-4">
              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/6 mb-7 text-xs font-medium tracking-wide backdrop-blur-sm"
              >
                <span className={`w-2 h-2 rounded-full ${statusDisplay.dot} ${statusDisplay.pulse ? "animate-pulse" : ""}`} />
                <span className={statusDisplay.online ? "text-white/70" : "text-white/40"}>{statusDisplay.text}</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-6xl font-light mb-4 leading-[1.08] tracking-tight"
              >
                {t("Your stay,", "Tu estadía,")}
                <br />
                <em className="not-italic" style={{ color: "hsl(38 72% 65%)" }}>
                  {t("elevated.", "elevada.")}
                </em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.5 }}
                className="text-white/45 text-base max-w-sm mx-auto font-light leading-relaxed mb-9"
              >
                {t(
                  "One hub for everything — live support, services, and property info.",
                  "Un hub para todo — soporte en vivo, servicios e información de la propiedad."
                )}
              </motion.p>

              {/* Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
              >
                <Link
                  href="/concierge"
                  className="group inline-flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/15 text-white px-8 py-4 rounded-2xl font-semibold text-[15px] transition-all backdrop-blur-sm active:scale-[0.97]"
                  data-testid="hero-connect-cta"
                >
                  <Headphones className="w-5 h-5" />
                  {t("Connect with Concierge", "Conectar con Concierge")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-9"
              >
                {[
                  { icon: MapPin, text: t("Ocean Park & Isla Verde", "Ocean Park & Isla Verde") },
                  { icon: Clock3, text: t("8 AM – 2 AM Daily", "8 AM – 2 AM Diario") },
                  { icon: Waves, text: t("Steps from the beach", "A pasos de la playa") },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-white/22 text-xs">
                    <item.icon className="w-3.5 h-3.5 text-white/18" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Property Selector ─────────────────────────────── */}
          <section className="px-5 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-4 h-4 text-primary/60" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {t("Select Your Property", "Seleccione su Propiedad")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {properties.map((prop) => {
                const active = selectedProperty === prop.id;
                return (
                  <button
                    key={prop.id}
                    onClick={() => handlePropertySelect(active ? null : prop.id)}
                    className={`relative text-left p-4 rounded-2xl border-2 transition-all card-hover ${
                      active
                        ? `bg-gradient-to-br ${prop.color} ${prop.border} shadow-sm`
                        : "bg-card border-border hover:border-primary/20"
                    }`}
                    data-testid={`property-${prop.id?.toLowerCase().replace(" ", "-")}`}
                  >
                    {active && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">✓</span>
                      </div>
                    )}
                    <p className={`font-serif text-base font-semibold mb-0.5 ${active ? "text-primary" : "text-foreground"}`}>
                      {prop.name}
                    </p>
                    <p className={`text-xs mb-2 ${active ? "text-primary/70" : "text-muted-foreground"}`}>
                      {prop.subtitle}
                    </p>
                    <p className={`text-[10px] leading-relaxed ${active ? "text-primary/60" : "text-muted-foreground/70"}`}>
                      {prop.note}
                    </p>
                  </button>
                );
              })}
            </div>
            {selectedProperty && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground text-center mt-3"
              >
                {t(
                  `Your concierge and AI chat are personalized for ${selectedProperty}.`,
                  `Su concierge y chat están personalizados para ${selectedProperty}.`
                )}
              </motion.p>
            )}
          </section>

          {/* ── Action Cards ─────────────────────────────────── */}
          <section className="px-5 pb-10 md:px-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-serif text-2xl text-foreground">{t("How can we help?", "¿Cómo podemos ayudar?")}</h2>
              <img src={logoUrl} alt="" className="w-6 h-6 object-contain opacity-15" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, i) => (
                <motion.div
                  key={action.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={action.primary ? "col-span-2" : ""}
                >
                  <Link
                    href={action.to}
                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.975] card-hover ${
                      action.primary
                        ? "border-primary/20 bg-primary/6 hover:bg-primary/10"
                        : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      action.primary
                        ? "bg-primary text-white shadow-[0_4px_14px_rgba(13,27,64,0.22)]"
                        : "bg-secondary/50 text-foreground/70 group-hover:bg-secondary/80"
                    }`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`font-semibold text-sm leading-snug group-hover:text-primary transition-colors ${action.primary ? "text-primary" : "text-foreground"}`}>
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary shrink-0 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Property Info */}
          <PropertyInfo />

          {/* FAQ */}
          <FAQ />
        </motion.div>
      )}
    </>
  );
}
