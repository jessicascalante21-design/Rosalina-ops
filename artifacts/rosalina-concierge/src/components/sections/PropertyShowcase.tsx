import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight, Waves, Plane } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface PropertyShowcaseProps {
  selectedProperty?: string | null;
  onSelect?: (property: string | null) => void;
}

const PROPERTIES = [
  {
    id: "Ocean Park" as const,
    name: "Ocean Park",
    tagline: "San Juan · Residential",
    taglineES: "San Juan · Residencial",
    photo: "/ocean-park.jpg",
    icon: Waves,
    badge: "Pool · Beach 4 min",
    badgeES: "Piscina · Playa 4 min",
    highlights: [
      { en: "Pool & waterfall on-site", es: "Piscina y cascada en el lugar" },
      { en: "Quiet residential neighborhood", es: "Barrio residencial tranquilo" },
      { en: "4 min walk to the beach", es: "4 min caminando a la playa" },
      { en: "Coffee bar at entrance", es: "Bar de café en la entrada" },
    ],
    address: "2020 Av. McLeary, San Juan PR 00911",
  },
  {
    id: "Isla Verde" as const,
    name: "Isla Verde",
    tagline: "Carolina · Airport Area",
    taglineES: "Carolina · Zona Aeropuerto",
    photo: "/isla-verde.jpg",
    icon: Plane,
    badge: "Beach 8 min · Near Airport",
    badgeES: "Playa 8 min · Cerca Aeropuerto",
    highlights: [
      { en: "Modern minimalist design", es: "Diseño minimalista moderno" },
      { en: "8 min walk to the beach", es: "8 min caminando a la playa" },
      { en: "Near LMM Airport", es: "Cerca del Aeropuerto LMM" },
      { en: "Vibrant nightlife area", es: "Zona de vida nocturna vibrante" },
    ],
    address: "84 Calle Júpiter, Carolina PR 00979",
  },
];

export default function PropertyShowcase({ selectedProperty, onSelect }: PropertyShowcaseProps) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);
  const startXRef = useRef(0);

  const go = (dir: number) => setActive((p) => Math.max(0, Math.min(PROPERTIES.length - 1, p + dir)));

  const handleTouchStart = (e: React.TouchEvent) => { startXRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between px-5 mb-5">
        <div>
          <p className="text-[10px] font-sans font-semibold tracking-[3px] uppercase text-muted-foreground/60 mb-1">
            {t("Our Properties", "Nuestras Propiedades")}
          </p>
          <h2 className="font-serif text-2xl font-medium">{t("Where are you staying?", "Donde se hospeda?")}</h2>
        </div>
        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {PROPERTIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${active === i ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground/40"}`}
              aria-label={`Property ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `${-active * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {PROPERTIES.map((prop, i) => {
            const isSelected = selectedProperty === prop.id;
            return (
              <div key={prop.id} className="w-full shrink-0 px-5">
                <div className={`rounded-2xl overflow-hidden border transition-all ${isSelected ? "border-primary/30 shadow-[0_4px_24px_rgba(11,23,48,0.12)]" : "border-border"}`}>
                  {/* Photo */}
                  <div className="relative h-56 overflow-hidden bg-secondary/30">
                    <img
                      src={prop.photo}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-serif text-2xl font-medium">{prop.name}</p>
                          <p className="text-white/60 text-sm">
                            {language === "ES" ? prop.taglineES : prop.tagline}
                          </p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 rounded-full text-xs font-medium">
                          {language === "ES" ? prop.badgeES : prop.badge}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-md">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="bg-card p-4">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
                      {prop.highlights.map((h, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-foreground/65 leading-snug">
                          <span className="text-primary/50 mt-0.5 shrink-0">·</span>
                          {language === "ES" ? h.es : h.en}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-3">{prop.address}</p>
                    <button
                      onClick={() => onSelect?.(isSelected ? null : prop.id)}
                      className={`w-full h-10 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                        isSelected
                          ? "bg-primary text-white shadow-[0_4px_16px_rgba(13,27,64,0.22)]"
                          : "bg-secondary/50 text-foreground hover:bg-secondary"
                      }`}
                      data-testid={`property-select-${prop.id.toLowerCase().replace(" ", "-")}`}
                    >
                      {isSelected
                        ? t(`✓ ${prop.name} Selected`, `✓ ${prop.name} Seleccionado`)
                        : t(`I'm staying at ${prop.name}`, `Me hospedo en ${prop.name}`)
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Desktop arrow nav */}
        {active > 0 && (
          <button onClick={() => go(-1)} className="absolute left-6 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-border flex items-center justify-center hover:bg-white transition-colors hidden md:flex">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {active < PROPERTIES.length - 1 && (
          <button onClick={() => go(1)} className="absolute right-6 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-border flex items-center justify-center hover:bg-white transition-colors hidden md:flex">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-center text-[11px] text-muted-foreground/50 mt-3 md:hidden">
        {t("Swipe to see both properties", "Deslice para ver ambas propiedades")}
      </p>
    </section>
  );
}
