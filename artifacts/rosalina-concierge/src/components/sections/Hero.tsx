import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

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
          color: "bg-accent/20 text-accent-foreground",
          text: t("Concierge available · AM shift", "Concierge disponible · Turno AM")
        };
      case "pm":
        return {
          color: "bg-accent/20 text-accent-foreground",
          text: t("PM shift active · until 2 AM", "Turno PM activo · hasta 2 AM")
        };
      case "late":
        return {
          color: "bg-yellow-500/20 text-yellow-100",
          text: t("Late night · still here until 2 AM", "Noche · seguimos aquí hasta 2 AM")
        };
      case "closed":
        return {
          color: "bg-secondary/20 text-secondary",
          text: t("Closed · opens at 8 AM · emergency: 787-438-9393", "Cerrado · abre a las 8 AM · emergencia: 787-438-9393")
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <section id="home" className="relative w-full pt-20 pb-16 px-6 bg-[#1A1A1A] overflow-hidden text-white rounded-b-[2.5rem] shadow-xl">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-[#1A1A1A] to-[#1A1A1A] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Smart Status Ribbon */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8 inline-flex items-center gap-2 ${statusDisplay.color} border border-white/10 backdrop-blur-sm`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'closed' ? 'bg-secondary' : status === 'late' ? 'bg-yellow-400' : 'bg-green-400'}`} />
          {statusDisplay.text}
        </div>

        <h1 className="font-serif text-5xl md:text-6xl mb-4 leading-tight">
          {t("Welcome to", "Bienvenido a")}<br />
          <span className="italic text-primary-foreground">Rosalina</span>
        </h1>
        
        <p className="text-secondary/80 text-lg max-w-md font-light">
          {t("Your tropical getaway awaits. We're here to make your stay effortless.", "Su escapada tropical le espera. Estamos aquí para hacer su estancia perfecta.")}
        </p>
      </div>
    </section>
  );
}
