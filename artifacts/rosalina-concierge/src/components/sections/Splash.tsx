import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";
import { MapPin, Waves, Plane, ArrowRight } from "lucide-react";

const AUTO_ENTER_MS = 8000;

const SLIDES = [
  {
    image: "/ocean-park.jpg",
    label: { en: "Ocean Park", es: "Ocean Park" },
    sub: { en: "San Juan", es: "San Juan" },
    desc: {
      en: "Where palm-lined streets meet the Caribbean Sea",
      es: "Donde las calles de palmeras se encuentran con el mar Caribe",
    },
    icon: Waves,
  },
  {
    image: "/isla-verde.jpg",
    label: { en: "Isla Verde", es: "Isla Verde" },
    sub: { en: "Carolina", es: "Carolina" },
    desc: {
      en: "Vibrant energy steps from the Atlantic beach",
      es: "Energia vibrante a pasos de la playa atlantica",
    },
    icon: Plane,
  },
];

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const { t, language, setLanguage } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const ln = language === "ES" ? "es" : "en";

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

  useEffect(() => {
    const iv = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - (progress / 100) * circumference;
  const slide = SLIDES[activeSlide];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0D1B40" }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-[#0D1B40]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B40] via-[#0D1B40]/40 to-[#0D1B40]/60" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 right-6 z-10 flex gap-1 bg-white/8 rounded-full p-1 border border-white/10 backdrop-blur-sm">
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

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center p-3"
        >
          <img src={logoUrl} alt="Rosalina" className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>

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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-white/60">
              <slide.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{slide.label[ln]}</span>
              <span className="text-white/25">·</span>
              <span className="text-xs text-white/35">{slide.sub[ln]}</span>
            </div>
            <p className="text-white/40 text-sm italic">{slide.desc[ln]}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`rounded-full transition-all ${
                activeSlide === i ? "w-6 h-1.5 bg-white/50" : "w-1.5 h-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/45 text-sm leading-relaxed"
        >
          {t(
            "Your personal concierge hub for an unforgettable stay in Puerto Rico.",
            "Tu hub de concierge personal para una estadia inolvidable en Puerto Rico."
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative"
        >
          <button
            onClick={onDismiss}
            className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all active:scale-95 hover:scale-105 group"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-white/20 text-[10px] uppercase tracking-[2px]"
        >
          {t("LiveOps Concierge", "LiveOps Concierge")}
        </motion.p>
      </div>
    </motion.div>
  );
}
