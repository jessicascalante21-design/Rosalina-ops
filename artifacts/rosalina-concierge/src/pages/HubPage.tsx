import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Headphones, ClipboardList, AlertTriangle, ArrowRight, ClipboardCheck, Clock3, Waves, ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Splash from "@/components/sections/Splash";
import PropertyShowcase from "@/components/sections/PropertyShowcase";
import LocationSection from "@/components/sections/LocationSection";
import FAQ from "@/components/sections/FAQ";
import logoUrl from "@assets/image_1775935433037.png";

type StatusType = "am" | "pm" | "late" | "closed";
type PropertyType = "Ocean Park" | "Isla Verde" | null;

const SLIDES = ["hero", "properties", "actions", "location"] as const;
type SlideId = typeof SLIDES[number];

export default function HubPage() {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("rosalina_splash_seen"));
  const [status, setStatus] = useState<StatusType>("am");
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>(() =>
    (localStorage.getItem("rosalina_property") as PropertyType) || null
  );
  const [activeSlide, setActiveSlide] = useState<SlideId>("hero");

  const sectionRefs = useRef<Record<SlideId, HTMLElement | null>>({
    hero: null, properties: null, actions: null, location: null,
  });

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("rosalina_splash_seen", "1");
    }, 2200);
    return () => clearTimeout(timer);
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

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SLIDES.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlide(id); },
        { threshold: 0.45 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [showSplash]);

  const handlePropertySelect = (prop: PropertyType) => {
    setSelectedProperty(prop);
    if (prop) localStorage.setItem("rosalina_property", prop);
    else localStorage.removeItem("rosalina_property");
  };

  const scrollTo = (id: SlideId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const statusDisplay = {
    am:     { dot: "bg-green-400", pulse: false, text: t("Concierge Online · AM Shift", "Concierge en Línea · Turno AM"), online: true },
    pm:     { dot: "bg-green-400", pulse: false, text: t("Concierge Online · PM Shift", "Concierge en Línea · Turno PM"), online: true },
    late:   { dot: "bg-amber-400", pulse: true,  text: t("Late Night · Until 2 AM", "Soporte Nocturno · Hasta 2 AM"), online: true },
    closed: { dot: "bg-white/20",  pulse: false, text: t("Closed · Opens at 8 AM", "Cerrado · Abre a las 8 AM"), online: false },
  }[status];

  const actions = [
    { to: "/concierge", label: t("Get Help Now", "Obtener Ayuda"), desc: t("Live video concierge", "Video en vivo"), icon: Headphones, primary: true },
    { to: "/pre-arrival", label: t("Pre-Arrival", "Pre-Llegada"), desc: t("Confirm your arrival", "Confirme su llegada"), icon: ClipboardCheck, primary: false },
    { to: "/request", label: t("Request Service", "Solicitar Servicio"), desc: t("Amenities & housekeeping", "Toallas y limpieza"), icon: ClipboardList, primary: false },
    { to: "/emergency", label: t("Emergency", "Emergencia"), desc: t("24/7 emergency line", "Línea 24/7"), icon: AlertTriangle, primary: false },
  ];

  const slideOrder = SLIDES;
  const slideIdx = slideOrder.indexOf(activeSlide);

  return (
    <>
      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* ── Slide dot nav (right side, desktop) ──────────── */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
            {SLIDES.map((id, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`rounded-full transition-all border border-primary/20 ${
                  activeSlide === id
                    ? "h-6 w-2.5 bg-primary"
                    : "h-2.5 w-2.5 bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={id}
              />
            ))}
          </div>

          {/* ══ SLIDE 1 — HERO ══════════════════════════════════ */}
          <section
            ref={(el) => { sectionRefs.current.hero = el; }}
            className="relative w-full min-h-[88vh] flex flex-col justify-center pt-20 md:pt-16 pb-12 px-6 overflow-hidden text-white"
            style={{ background: "var(--dark-navy, #0D1B40)" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_-10%,rgba(38,65,140,0.7),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(212,151,42,0.1),transparent)] pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto text-center">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 mx-auto mb-6 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center"
              >
                <img src={logoUrl} alt="Rosalina" className="w-9 h-9 object-contain brightness-0 invert" />
              </motion.div>

              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/6 mb-6 text-xs tracking-wide backdrop-blur-sm"
              >
                <span className={`w-2 h-2 rounded-full ${statusDisplay.dot} ${statusDisplay.pulse ? "animate-pulse" : ""}`} />
                <span className={statusDisplay.online ? "text-white/70" : "text-white/40"}>{statusDisplay.text}</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-6xl font-light mb-4 leading-[1.08]"
              >
                {t("Your stay,", "Tu estadía,")}
                <br />
                <em className="not-italic" style={{ color: "hsl(38 72% 65%)" }}>
                  {t("elevated.", "elevada.")}
                </em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-white/45 text-base max-w-sm mx-auto font-light leading-relaxed mb-8"
              >
                {t(
                  "One hub for everything — live support, services, and property info.",
                  "Un hub para todo — soporte en vivo, servicios e información de la propiedad."
                )}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-3 justify-center"
              >
                <Link
                  href="/concierge"
                  className="group inline-flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/15 text-white px-7 py-3.5 rounded-2xl font-semibold text-[15px] transition-all active:scale-[0.97]"
                  data-testid="hero-connect-cta"
                >
                  <Headphones className="w-5 h-5" />
                  {t("Connect with Concierge", "Conectar con Concierge")}
                </Link>
                <button
                  onClick={() => scrollTo("properties")}
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors"
                >
                  {t("Select your property", "Seleccione su propiedad")}
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Info pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8"
              >
                {[
                  { icon: Waves, text: "Ocean Park & Isla Verde" },
                  { icon: Clock3, text: t("8 AM – 2 AM Daily", "8 AM – 2 AM Diario") },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-white/22 text-xs">
                    <item.icon className="w-3.5 h-3.5 text-white/18" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>

            {/* Mobile slide dots */}
            <div className="absolute bottom-4 right-4 flex gap-1.5 md:hidden">
              {SLIDES.map((id, i) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`rounded-full transition-all ${activeSlide === id ? "w-5 h-1.5 bg-white/70" : "w-1.5 h-1.5 bg-white/20"}`}
                />
              ))}
            </div>
          </section>

          {/* ══ SLIDE 2 — PROPERTY SHOWCASE ═════════════════════ */}
          <section
            ref={(el) => { sectionRefs.current.properties = el; }}
            className="bg-background relative"
          >
            <PropertyShowcase selectedProperty={selectedProperty} onSelect={handlePropertySelect} />
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-muted-foreground pb-2 -mt-2"
              >
                {t(`Your experience is personalized for ${selectedProperty}.`, `Su experiencia está personalizada para ${selectedProperty}.`)}
              </motion.div>
            )}
          </section>

          {/* ══ SLIDE 3 — ACTION HUB ════════════════════════════ */}
          <section
            ref={(el) => { sectionRefs.current.actions = el; }}
            className="px-5 py-10 bg-card/50"
          >
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                  {t("Services", "Servicios")}
                </p>
                <h2 className="font-serif text-2xl">{t("How can we help?", "¿Cómo podemos ayudar?")}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, i) => (
                <motion.div
                  key={action.to}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.05 * i }}
                  className={action.primary ? "col-span-2" : ""}
                >
                  <Link
                    href={action.to}
                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.975] card-hover ${
                      action.primary
                        ? "border-primary/15 bg-primary/5 hover:bg-primary/9"
                        : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      action.primary ? "bg-primary text-white shadow-[0_4px_14px_rgba(13,27,64,0.22)]" : "bg-secondary/50 text-foreground/70"
                    }`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold text-sm leading-snug ${action.primary ? "text-primary" : "text-foreground"}`}>
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ SLIDE 4 — LOCATION & CONTACT ════════════════════ */}
          <section
            ref={(el) => { sectionRefs.current.location = el; }}
            className="bg-background border-t border-border"
          >
            <LocationSection />
          </section>

          {/* ── FAQ (bonus section below slides) ─────────────── */}
          <div className="border-t border-border">
            <FAQ />
          </div>
        </motion.div>
      )}
    </>
  );
}
