import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Headphones, ClipboardList, AlertTriangle, ArrowRight, ClipboardCheck, Clock3, Waves, ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Splash from "@/components/sections/Splash";
import PropertyShowcase from "@/components/sections/PropertyShowcase";
import LocationSection from "@/components/sections/LocationSection";
import FAQ from "@/components/sections/FAQ";
import PageHead from "@/components/PageHead";

type StatusType = "am" | "pm" | "late" | "closed";
type PropertyType = "Ocean Park" | "Isla Verde" | null;

const SLIDES = ["hero", "properties", "actions", "location"] as const;
type SlideId = (typeof SLIDES)[number];

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

  const handleSplashDismiss = () => {
    setShowSplash(false);
    sessionStorage.setItem("rosalina_splash_seen", "1");
  };

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

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const [id, el] of Object.entries(sectionRefs.current)) {
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlide(id as SlideId); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [showSplash]);

  const scrollTo = (id: SlideId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePropertySelect = (p: PropertyType) => {
    setSelectedProperty(p);
    if (p) localStorage.setItem("rosalina_property", p);
    else localStorage.removeItem("rosalina_property");
  };

  const statusDisplay = {
    am:     { text: t("Concierge Available", "Concierge Disponible"), dot: "bg-emerald-400", pulse: true, online: true },
    pm:     { text: t("Evening Concierge", "Concierge Nocturno"), dot: "bg-amber-400", pulse: true, online: true },
    late:   { text: t("Late Night Support", "Soporte Nocturno"), dot: "bg-amber-400", pulse: true, online: true },
    closed: { text: t("After Hours", "Fuera de Horario"), dot: "bg-white/30", pulse: false, online: false },
  }[status];

  const actions = [
    {
      icon: Headphones, to: "/concierge",
      label: t("Live Concierge", "Concierge en Vivo"),
      desc: t("Connect via video call", "Conectar por videollamada"),
      primary: true,
    },
    {
      icon: ClipboardCheck, to: "/pre-arrival",
      label: t("Pre-Arrival", "Pre-Llegada"),
      desc: t("Prepare your stay", "Prepare su estadia"),
    },
    {
      icon: ClipboardList, to: "/request",
      label: t("Service Request", "Solicitud"),
      desc: t("Towels, amenities & more", "Toallas y mas"),
    },
    {
      icon: AlertTriangle, to: "/emergency",
      label: t("Emergency", "Emergencia"),
      desc: t("24/7 emergency line", "Linea 24/7"),
    },
  ];

  const slideOrder = SLIDES;
  const slideIdx = slideOrder.indexOf(activeSlide);

  return (
    <>
      <PageHead title="Concierge Hub" description="Your personal concierge hub for an unforgettable stay in Puerto Rico" />
      <AnimatePresence>{showSplash && <Splash onDismiss={handleSplashDismiss} />}</AnimatePresence>
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
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

          <section
            ref={(el) => { sectionRefs.current.hero = el; }}
            className="relative w-full min-h-[92vh] flex flex-col justify-center pt-20 md:pt-16 pb-16 px-6 overflow-hidden text-white"
            style={{ background: "#0B1730" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,rgba(30,58,110,0.6),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_100%,rgba(184,155,94,0.08),transparent)] pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[11px] font-sans font-medium tracking-[5px] uppercase text-white/30 mb-8"
              >
                {t("Welcome to Rosalina", "Bienvenido a Rosalina")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 mb-8 text-[11px] tracking-widest uppercase font-sans"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot} ${statusDisplay.pulse ? "animate-pulse" : ""}`} />
                <span className={statusDisplay.online ? "text-white/60" : "text-white/35"}>{statusDisplay.text}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-[44px] md:text-[56px] font-medium mb-5 leading-[1.1] tracking-[-0.02em]"
              >
                {t("Your stay,", "Tu estadia,")}
                <br />
                <span style={{ color: "var(--gold, #B89B5E)" }}>
                  {t("elevated.", "elevada.")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-white/40 text-[15px] max-w-sm mx-auto font-light leading-relaxed mb-10"
              >
                {t(
                  "One hub for everything: live support, services, and local recommendations.",
                  "Un hub para todo: soporte en vivo, servicios y recomendaciones locales."
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row items-center gap-3 justify-center"
              >
                <Link
                  href="/concierge"
                  className="group inline-flex items-center gap-3 bg-white/8 border border-white/15 hover:bg-white/12 text-white px-7 py-3.5 rounded-xl font-medium text-[14px] transition-all active:scale-[0.97]"
                  data-testid="hero-connect-cta"
                >
                  <Headphones className="w-4.5 h-4.5" />
                  {t("Connect with Concierge", "Conectar con Concierge")}
                </Link>
                <button
                  onClick={() => scrollTo("properties")}
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors font-sans"
                >
                  {t("Explore properties", "Explorar propiedades")}
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10"
              >
                {[
                  { icon: Waves, text: "Ocean Park & Isla Verde" },
                  { icon: Clock3, text: t("8 AM to 2 AM Daily", "8 AM a 2 AM Diario") },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-2 text-white/25 text-[11px] tracking-wider uppercase font-sans">
                    <item.icon className="w-3.5 h-3.5 text-white/20" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/15"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>

            <div className="absolute bottom-4 right-4 flex gap-1.5 md:hidden">
              {SLIDES.map((id, i) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`rounded-full transition-all ${activeSlide === id ? "w-5 h-1.5 bg-white/60" : "w-1.5 h-1.5 bg-white/15"}`}
                />
              ))}
            </div>
          </section>

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
                {t(`Your experience is personalized for ${selectedProperty}.`, `Su experiencia esta personalizada para ${selectedProperty}.`)}
              </motion.div>
            )}
          </section>

          <section
            ref={(el) => { sectionRefs.current.actions = el; }}
            className="px-5 py-12 bg-card/50"
          >
            <div className="max-w-xl mx-auto">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <p className="text-[10px] font-sans font-semibold tracking-[3px] uppercase text-muted-foreground/60 mb-1.5">
                    {t("Services", "Servicios")}
                  </p>
                  <h2 className="font-serif text-2xl font-medium">{t("How can we help?", "Como podemos ayudar?")}</h2>
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
                      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.975] card-hover ${
                        action.primary
                          ? "border-primary/12 bg-primary/4 hover:bg-primary/8"
                          : "border-border bg-card hover:border-primary/15 hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        action.primary ? "bg-primary text-white shadow-[0_4px_14px_rgba(11,23,48,0.2)]" : "bg-secondary/50 text-foreground/60"
                      }`}>
                        <action.icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium text-[13px] leading-snug ${action.primary ? "text-primary" : "text-foreground"}`}>
                          {action.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section
            ref={(el) => { sectionRefs.current.location = el; }}
            className="bg-background border-t border-border"
          >
            <LocationSection />
          </section>

          <div className="border-t border-border">
            <FAQ />
          </div>
        </motion.div>
      )}
    </>
  );
}
