import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";

const AUTO_ENTER_MS = 6000;

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const { t, language, setLanguage } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / AUTO_ENTER_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(tick);
        onDismiss();
      }
    }, 50);
    return () => clearInterval(tick);
  }, [onDismiss]);

  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0D1B40" }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(38,65,140,0.55) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(180,140,60,0.12) 0%, transparent 70%)" }} />
      </div>

      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-10 flex gap-1 bg-white/8 rounded-full p-1 border border-white/10">
        {(["EN", "ES"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === l ? "bg-white/15 text-white" : "text-white/45 hover:text-white/70"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center max-w-sm">
        {/* Logo */}
        <motion.img
          src={logoUrl}
          alt="Rosalina"
          className="w-28 h-28 object-contain drop-shadow-xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="font-serif text-4xl text-white tracking-wide leading-tight">
            Rosalina
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-[3px] font-medium">
            Boutique Hotels
          </p>
          <div className="w-24 h-px mt-1" style={{ background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)" }} />
        </motion.div>

        {/* Property locations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center gap-3 text-white/35 text-xs tracking-wide"
        >
          <span>Ocean Park · San Juan</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Isla Verde · Carolina</span>
        </motion.div>

        {/* Purpose description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-white/55 text-sm leading-relaxed"
        >
          {t(
            "Your personal concierge hub for an unforgettable stay in Puerto Rico. Request services, explore local recommendations, and connect with our team anytime.",
            "Tu hub de concierge personal para una estadía inolvidable en Puerto Rico. Solicita servicios, explora recomendaciones locales y conéctate con nuestro equipo en cualquier momento."
          )}
        </motion.p>

        {/* Enter button with countdown ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="relative"
        >
          <button
            onClick={onDismiss}
            className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all active:scale-95 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            {t("Enter", "Entrar")}
            {/* SVG ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="rgba(180,140,60,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
          </button>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-white/25 text-[11px] uppercase tracking-[2px]"
        >
          {t("Your experience is important to us", "Tu experiencia es importante para nosotros")}
        </motion.p>
      </div>
    </motion.div>
  );
}
