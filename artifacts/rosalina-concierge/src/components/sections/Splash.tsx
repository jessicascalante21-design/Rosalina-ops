import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";
import { ArrowRight } from "lucide-react";

const AUTO_ENTER_MS = 8000;

const SLIDES = [
  {
    image: "/ocean-park.jpg",
    label: { en: "Ocean Park", es: "Ocean Park" },
    sub: { en: "San Juan, Puerto Rico", es: "San Juan, Puerto Rico" },
  },
  {
    image: "/isla-verde.jpg",
    label: { en: "Isla Verde", es: "Isla Verde" },
    sub: { en: "Carolina, Puerto Rico", es: "Carolina, Puerto Rico" },
  },
];

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const { language, setLanguage } = useLanguage();
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
    }, 3800);
    return () => clearInterval(iv);
  }, []);

  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - (progress / 100) * circumference;
  const slide = SLIDES[activeSlide];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,23,48,0.82), rgba(11,23,48,0.65), rgba(11,23,48,0.88))" }} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 right-6 z-10 flex gap-0.5 rounded-full p-0.5 border border-white/12 backdrop-blur-md" style={{ background: "rgba(255,255,255,0.06)" }}>
        {(["EN", "ES"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider transition-all ${
              language === l ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <img
            src={logoUrl}
            alt="Rosalina"
            className="w-16 h-16 mx-auto mb-8 object-contain"
            style={{ mixBlendMode: "screen", opacity: 0.9 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-3"
        >
          <h1 className="font-serif text-[42px] text-white font-medium tracking-[-0.02em] leading-none mb-2">
            Rosalina
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-white/20" />
            <p className="text-white/50 text-[11px] uppercase tracking-[4px] font-sans font-medium">
              Boutique Hotels
            </p>
            <div className="w-8 h-px bg-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 mb-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-1.5"
            >
              <p className="text-white/70 text-sm font-serif italic tracking-wide">
                {slide.label[ln]}
              </p>
              <p className="text-white/35 text-xs font-sans tracking-wider">
                {slide.sub[ln]}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  activeSlide === i ? "w-6 h-[3px] bg-white/60" : "w-[3px] h-[3px] bg-white/20"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <button
            onClick={onDismiss}
            className="relative w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-95 hover:scale-105 group"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="rgba(184,155,94,0.7)"
                strokeWidth="1.5"
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
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-white/20 text-[10px] uppercase tracking-[3px] font-sans mt-6"
        >
          Digital Concierge
        </motion.p>
      </div>
    </motion.div>
  );
}
