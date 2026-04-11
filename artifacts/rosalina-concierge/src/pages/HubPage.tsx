import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Headphones, ClipboardList, Info, AlertTriangle, ArrowRight, Star, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Splash from "@/components/sections/Splash";
import PropertyInfo from "@/components/sections/PropertyInfo";
import FAQ from "@/components/sections/FAQ";
import logoUrl from "@assets/image_1775935433037.png";

type StatusType = "am" | "pm" | "late" | "closed";

export default function HubPage() {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem("rosalina_splash_seen");
    return !seen;
  });
  const [status, setStatus] = useState<StatusType>("am");

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
    const updateStatus = () => {
      const hour = new Date().getHours();
      if (hour >= 8 && hour < 17) setStatus("am");
      else if (hour >= 17 && hour < 22) setStatus("pm");
      else if (hour >= 22 || hour < 2) setStatus("late");
      else setStatus("closed");
    };
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusDisplay = {
    am:     { dot: "bg-green-400", text: t("Concierge Online · AM Shift", "Concierge en Línea · Turno AM"), online: true },
    pm:     { dot: "bg-green-400", text: t("Concierge Online · PM Shift", "Concierge en Línea · Turno PM"), online: true },
    late:   { dot: "bg-yellow-400 animate-pulse", text: t("Late Night · Until 2 AM", "Noche · Hasta las 2 AM"), online: true },
    closed: { dot: "bg-secondary", text: t("Closed · Opens at 8 AM", "Cerrado · Abre a las 8 AM"), online: false },
  }[status];

  const actions = [
    {
      to: "/concierge",
      label: t("Get Help Now", "Obtener Ayuda"),
      desc: t("Connect with our live concierge team", "Conéctese con nuestro equipo de concierge"),
      icon: Headphones,
      accent: true,
    },
    {
      to: "/pre-arrival",
      label: t("Pre-Arrival Check-In", "Check-In Previo"),
      desc: t("Complete your arrival information", "Complete su información de llegada"),
      icon: ClipboardCheck,
      accent: false,
    },
    {
      to: "/request",
      label: t("Request Service", "Solicitar Servicio"),
      desc: t("Submit a maintenance or amenity request", "Envíe una solicitud de servicio"),
      icon: ClipboardList,
      accent: false,
    },
    {
      to: "/emergency",
      label: t("Emergency", "Emergencia"),
      desc: t("Report an urgent safety issue", "Reporte un problema urgente de seguridad"),
      icon: AlertTriangle,
      accent: false,
    },
  ];

  return (
    <>
      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          {/* Hero */}
          <section id="home" className="relative w-full pt-24 md:pt-10 pb-20 px-6 bg-[#1A1A1A] overflow-hidden text-white md:rounded-b-[2rem]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(196,139,107,0.28),transparent)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
              {/* Status pill */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm font-medium backdrop-blur-sm ${statusDisplay.online ? "bg-white/10 border-white/15 text-white" : "bg-secondary/20 border-secondary/20 text-secondary/80"}`}>
                <div className={`w-2 h-2 rounded-full ${statusDisplay.dot}`} />
                {statusDisplay.text}
              </div>

              <h1 className="font-serif text-5xl md:text-6xl mb-5 leading-tight tracking-tight">
                {t("Real-time support", "Apoyo en tiempo real")}<br />
                <span className="italic text-primary/90">{t("for your stay", "durante su estancia")}</span>
              </h1>

              <p className="text-white/60 text-lg max-w-sm font-light leading-relaxed mb-10">
                {t(
                  "Your personal concierge hub — get help, request services, and access property information all in one place.",
                  "Su concierge personal — obtenga ayuda, solicite servicios e información de la propiedad en un solo lugar."
                )}
              </p>

              <Link
                href="/concierge"
                className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-2xl font-semibold text-base transition-all shadow-[0_4px_24px_rgba(196,139,107,0.35)] hover:shadow-[0_6px_32px_rgba(196,139,107,0.5)] active:scale-[0.97]"
                data-testid="hero-connect-cta"
              >
                <Headphones className="w-5 h-5" />
                {t("Connect with Concierge", "Conectar con Concierge")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="flex items-center gap-6 mt-10 text-white/30 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <img src={logoUrl} alt="" className="w-4 h-4 object-contain brightness-0 invert opacity-40" />
                  {t("Ocean Park & Isla Verde", "Ocean Park & Isla Verde")}
                </span>
                <span>·</span>
                <span>{t("Available 8 AM – 2 AM", "Disponible 8 AM – 2 AM")}</span>
              </div>
            </div>
          </section>

          {/* Action Cards */}
          <section className="px-6 py-12">
            <h2 className="font-serif text-3xl text-foreground mb-6">{t("How can we help?", "¿Cómo podemos ayudar?")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {actions.map((action, i) => (
                <motion.div
                  key={action.to}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={action.to}
                    className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                      action.accent
                        ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                        : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      action.accent ? "bg-primary text-white" : "bg-secondary/50 text-foreground"
                    }`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
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
