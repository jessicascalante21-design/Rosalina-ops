import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Headphones, ArrowRight } from "lucide-react";
import logoUrl from "@assets/image_1775935433037.png";

type StatusType = "am" | "pm" | "late" | "closed";

export default function Hero() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<StatusType>("am");

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

  const getStatusDisplay = () => {
    switch (status) {
      case "am":
        return {
          dot: "bg-green-400",
          text: t("Concierge Online · AM Shift", "Concierge en Línea · Turno AM"),
          online: true
        };
      case "pm":
        return {
          dot: "bg-green-400",
          text: t("Concierge Online · PM Shift", "Concierge en Línea · Turno PM"),
          online: true
        };
      case "late":
        return {
          dot: "bg-yellow-400 animate-pulse",
          text: t("Late Night · Until 2 AM", "Noche · Hasta las 2 AM"),
          online: true
        };
      case "closed":
        return {
          dot: "bg-secondary",
          text: t("Closed · Opens at 8 AM", "Cerrado · Abre a las 8 AM"),
          online: false
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  const scrollToConcierge = () => {
    document.getElementById("concierge")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative w-full pt-24 pb-20 px-6 overflow-hidden text-white rounded-b-[2.5rem] shadow-xl" style={{ background: "var(--dark-navy, #0B1730)" }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(38,65,140,0.6),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">

        {/* Status pill */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm font-medium tracking-wide backdrop-blur-sm
          ${statusDisplay.online
            ? "bg-white/10 border-white/15 text-white"
            : "bg-secondary/20 border-secondary/20 text-secondary/80"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${statusDisplay.dot}`} />
          {statusDisplay.text}
        </div>

        {/* Headline */}
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

        {/* CTA */}
        <button
          onClick={scrollToConcierge}
          className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-7 py-4 rounded-2xl font-semibold text-base transition-all shadow-[0_4px_24px_rgba(13,27,64,0.35)] hover:shadow-[0_6px_32px_rgba(13,27,64,0.45)] active:scale-[0.97]"
          data-testid="hero-connect-cta"
        >
          <Headphones className="w-5 h-5" />
          {t("Connect with Concierge", "Conectar con Concierge")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Trust row */}
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
  );
}
