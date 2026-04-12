import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves, Plane, Utensils, Car, Calendar, Wifi, Clock, MapPin,
  Star, Thermometer, ChevronDown, Mail, Phone, ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHead from "@/components/PageHead";
import logoUrl from "@assets/image_1775935433037.png";

type PropertyTab = "Ocean Park" | "Isla Verde" | "both";

const SEASONS = [
  {
    months: { en: "December through April", es: "Diciembre a Abril" },
    label: { en: "Dry Season", es: "Temporada Seca" },
    temp: "75 to 83 °F",
    conditions: {
      en: "Clear skies, low humidity, calm ocean. Peak visitor season with higher occupancy.",
      es: "Cielos despejados, baja humedad, océano tranquilo. Temporada alta con mayor ocupación.",
    },
  },
  {
    months: { en: "May through June", es: "Mayo a Junio" },
    label: { en: "Shoulder Season", es: "Temporada Intermedia" },
    temp: "82 to 88 °F",
    conditions: {
      en: "Warm days, occasional afternoon showers. Fewer visitors, favorable rates.",
      es: "Días cálidos, lluvias ocasionales por la tarde. Menos visitantes, tarifas favorables.",
    },
  },
  {
    months: { en: "July through August", es: "Julio a Agosto" },
    label: { en: "Summer", es: "Verano" },
    temp: "85 to 90 °F",
    conditions: {
      en: "Hot and humid. Ocean conditions are ideal. Local festivals and cultural events throughout.",
      es: "Caluroso y húmedo. Condiciones ideales del océano. Festivales y eventos culturales locales.",
    },
  },
  {
    months: { en: "September through November", es: "Septiembre a Noviembre" },
    label: { en: "Rainy Season", es: "Temporada de Lluvia" },
    temp: "82 to 87 °F",
    conditions: {
      en: "Brief afternoon showers, clear mornings. Best availability and rates. Hurricane season peaks August through October.",
      es: "Lluvias breves por la tarde, mañanas despejadas. Mejor disponibilidad y tarifas. Temporada de huracanes pico agosto a octubre.",
    },
  },
];

const ACTIVITIES = [
  { name: { en: "Aqua Adventure PR", es: "Aqua Adventure PR" }, category: { en: "Snorkeling & Diving", es: "Snorkeling y Buceo" }, desc: { en: "Reef exploration and guided snorkeling in crystal-clear Caribbean waters.", es: "Exploración de arrecifes y snorkeling guiado en aguas cristalinas del Caribe." } },
  { name: { en: "Bioluminescent Bay Kayak", es: "Kayak Bahía Bioluminiscente" }, category: { en: "Night Excursion", es: "Excursión Nocturna" }, desc: { en: "One of Puerto Rico's most extraordinary natural experiences. Night kayaking through glowing waters.", es: "Una de las experiencias naturales más extraordinarias de Puerto Rico. Kayak nocturno en aguas luminiscentes." } },
  { name: { en: "San Juan Bike Rentals", es: "Bicicletas San Juan" }, category: { en: "City Exploration", es: "Exploración Urbana" }, desc: { en: "Guided and self-guided cycling through Old San Juan's historic forts and cobblestone streets.", es: "Ciclismo guiado y por cuenta propia por las fortalezas históricas y calles adoquinadas del Viejo San Juan." } },
  { name: { en: "Escape Room PR", es: "Escape Room PR" }, category: { en: "Entertainment", es: "Entretenimiento" }, desc: { en: "Immersive team challenges in themed rooms throughout San Juan.", es: "Retos inmersivos en equipo en salas temáticas por todo San Juan." } },
  { name: { en: "Clue Murder Mystery", es: "Misterio Tipo Clue" }, category: { en: "Dining Experience", es: "Experiencia Gastronómica" }, desc: { en: "Interactive murder mystery dinner combining entertainment with fine cuisine.", es: "Cena interactiva de misterio que combina entretenimiento con alta cocina." } },
  { name: { en: "Fine Arts Miramar", es: "Fine Arts Miramar" }, category: { en: "Cinema", es: "Cine" }, desc: { en: "Independent and international films in the elegant Miramar district.", es: "Películas independientes e internacionales en el elegante distrito de Miramar." } },
  { name: { en: "El Yunque National Forest", es: "Bosque Nacional El Yunque" }, category: { en: "Nature", es: "Naturaleza" }, desc: { en: "The only tropical rainforest in the US National Forest System. Approximately 40 minutes by car.", es: "El único bosque tropical en el Sistema Forestal Nacional de EE.UU. Aproximadamente 40 minutos en auto." } },
  { name: { en: "Old San Juan", es: "Viejo San Juan" }, category: { en: "Heritage & Culture", es: "Patrimonio y Cultura" }, desc: { en: "A 500-year-old Spanish colonial city. Blue cobblestones, El Morro fortress, and La Fortaleza.", es: "Ciudad colonial española de 500 años. Adoquines azules, El Morro y La Fortaleza." } },
  { name: { en: "Casa Bacardi", es: "Casa Bacardi" }, category: { en: "Distillery Tour", es: "Tour de Destilería" }, desc: { en: "The world-renowned Bacardi rum distillery. Guided tours and cocktail crafting experiences.", es: "La destilería de ron Bacardi de fama mundial. Tours guiados y experiencias de coctelería." } },
];

const RESTAURANTS: Record<"Ocean Park" | "Isla Verde", { name: string; cuisine: { en: string; es: string } }[]> = {
  "Ocean Park": [
    { name: "Acapulco Taqueria Mexicana", cuisine: { en: "Mexican", es: "Mexicano" } },
    { name: "Burger & Mayo Lab", cuisine: { en: "Gourmet Burgers", es: "Hamburguesas Gourmet" } },
    { name: "Bocca Osteria Romana", cuisine: { en: "Italian", es: "Italiano" } },
    { name: "Pirilo Pizza Rustica", cuisine: { en: "Artisan Pizza", es: "Pizza Artesanal" } },
    { name: "Berlingeri", cuisine: { en: "Puerto Rican Cuisine", es: "Cocina Puertorriqueña" } },
  ],
  "Isla Verde": [
    { name: "Mande Restaurant", cuisine: { en: "Modern Caribbean", es: "Caribeño Moderno" } },
    { name: "Euphoria Restaurant", cuisine: { en: "Fine Dining", es: "Alta Cocina" } },
    { name: "Piccolos", cuisine: { en: "Italian", es: "Italiano" } },
    { name: "Bistro Cafe", cuisine: { en: "Brunch & Cafe", es: "Brunch y Cafe" } },
    { name: "The New Ceviche", cuisine: { en: "Seafood", es: "Mariscos" } },
  ],
};

const TRANSPORT = [
  { title: { en: "Rideshare", es: "Transporte por App" }, desc: { en: "Uber and Lyft are widely available throughout the San Juan metro area. Best option for short trips and airport transfers.", es: "Uber y Lyft están ampliamente disponibles en el área metro de San Juan. La mejor opción para trayectos cortos y traslados al aeropuerto." } },
  { title: { en: "Car Rental", es: "Alquiler de Auto" }, desc: { en: "Recommended for day trips to El Yunque, Ponce, or the west coast beaches. All major rental brands operate from SJU Airport.", es: "Recomendado para excursiones a El Yunque, Ponce o las playas del oeste. Todas las principales marcas operan desde el aeropuerto SJU." } },
  { title: { en: "Taxi Service", es: "Servicio de Taxi" }, desc: { en: "Available at the airport and hotels. Fixed rates apply to select routes. Negotiate the fare or request the meter for other destinations.", es: "Disponible en el aeropuerto y hoteles. Tarifas fijas para rutas selectas. Negocie la tarifa o solicite el taxímetro para otros destinos." } },
];

function SectionDivider() {
  return <div className="h-px bg-border my-10" />;
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold tracking-[3px] uppercase text-primary/50 mb-2">{label}</p>
      <h2 className="font-serif text-2xl md:text-3xl tracking-tight leading-tight">{title}</h2>
    </div>
  );
}

export default function WelcomeGuidePage() {
  const { t, language } = useLanguage();
  const [propertyTab, setPropertyTab] = useState<PropertyTab>("both");
  const [expanded, setExpanded] = useState<number | null>(null);

  const ln = language === "ES" ? "es" : "en";

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Guest Guide" description="Everything you need for your stay at Rosalina Boutique Hotels" />
      <div className="relative overflow-hidden text-white" style={{ background: "#0B1730" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(38,65,140,0.5),transparent)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto px-6 pt-24 md:pt-12 pb-14 text-center"
        >
          <img src={logoUrl} alt="Rosalina" className="w-10 h-10 mx-auto mb-6 object-contain" style={{ mixBlendMode: "screen", opacity: 0.7 }} />
          <p className="text-[10px] font-sans font-medium tracking-[4px] uppercase text-white/35 mb-4">
            {t("Guest Services", "Servicios al Huesped")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-[-0.01em] mb-4">
            {t("Your Puerto Rico Guide", "Tu Guía de Puerto Rico")}
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            {t(
              "Curated by our concierge team for your stay at Rosalina Boutique Hotels. Restaurants, activities, seasonal conditions, and local knowledge.",
              "Seleccionado por nuestro equipo de concierge para su estadía en Rosalina Boutique Hotels. Restaurantes, actividades, condiciones estacionales y conocimiento local."
            )}
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* ── Essential Info ──────────────────────────────────── */}
        <SectionHeader
          label={t("Essentials", "Esenciales")}
          title={t("Before You Arrive", "Antes de Llegar")}
        />

        <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {[
            { icon: Wifi, label: "Wi-Fi", value: "Rosalina Guest", sub: "RosalinaForever1!" },
            { icon: Clock, label: t("Check-in", "Check-in"), value: "4:00 PM", sub: t("Access code sent at 11 AM", "Código enviado a las 11 AM") },
            { icon: Clock, label: t("Check-out", "Check-out"), value: "11:00 AM", sub: t("Late check-out available", "Late check-out disponible") },
            { icon: Thermometer, label: t("Climate", "Clima"), value: "75 to 90 °F", sub: t("Year-round tropical", "Tropical todo el año") },
          ].map((item) => (
            <div key={item.label} className="bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold tracking-wider uppercase">{item.label}</span>
              </div>
              <p className="font-serif text-lg leading-snug mb-0.5">{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 px-1">
          <div className="w-px h-4 bg-primary/20" />
          <p className="text-xs text-muted-foreground italic">
            {t("Complimentary self-service coffee station at the entrance for all guests.", "Estación de café self-service cortesía en la entrada para todos los huéspedes.")}
          </p>
        </div>

        <SectionDivider />

        {/* ── Properties ──────────────────────────────────────── */}
        <SectionHeader
          label={t("Properties", "Propiedades")}
          title={t("Your Neighborhood", "Tu Vecindario")}
        />

        <div className="flex bg-secondary/30 p-1 rounded-lg mb-6">
          {(["Ocean Park", "Isla Verde", "both"] as PropertyTab[]).map((p) => (
            <button
              key={p}
              onClick={() => setPropertyTab(p)}
              className={`flex-1 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                propertyTab === p ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "both" ? t("Both", "Ambas") : p}
            </button>
          ))}
        </div>

        {(propertyTab === "Ocean Park" || propertyTab === "both") && (
          <div className="mb-4 border-l-2 border-primary/20 pl-5">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-primary/40" />
              <h3 className="font-serif text-lg">Ocean Park</h3>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase ml-1">San Juan</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {t(
                "A peaceful residential neighborhood beloved by locals, expats, and surfers. Palm-lined streets, colorful homes, and one of San Juan's most beautiful beaches within a five-minute walk. An authentic, community-centered Puerto Rico experience.",
                "Un barrio residencial tranquilo amado por locales, expatriados y surfistas. Calles bordeadas de palmeras, casas coloridas y una de las playas más hermosas de San Juan a solo cinco minutos caminando."
              )}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              {[
                t("5 min to beach", "5 min a la playa"),
                t("9 min to airport", "9 min al aeropuerto"),
                t("2 pools on site", "2 piscinas"),
                t("10+ restaurants walking", "10+ restaurantes caminando"),
              ].map((d) => (
                <span key={d} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {(propertyTab === "Isla Verde" || propertyTab === "both") && (
          <div className="mb-4 border-l-2 border-primary/20 pl-5">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-primary/40" />
              <h3 className="font-serif text-lg">Isla Verde</h3>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase ml-1">Carolina</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {t(
                "A vibrant beach strip known for its energy, oceanfront dining, and proximity to the airport. A four-minute walk to a stunning Atlantic beach. Isla Verde guests receive complimentary access to Ocean Park pools, approximately eight minutes by car.",
                "Una animada franja playera conocida por su energía, gastronomía frente al mar y cercanía al aeropuerto. Cuatro minutos caminando a una playa atlántica. Huéspedes de Isla Verde tienen acceso gratuito a las piscinas de Ocean Park, aproximadamente ocho minutos en auto."
              )}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              {[
                t("4 min to beach", "4 min a la playa"),
                t("6 min to airport", "6 min al aeropuerto"),
                t("Pool access at OP", "Acceso a piscinas OP"),
                t("Vibrant nightlife", "Vida nocturna"),
              ].map((d) => (
                <span key={d} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        <SectionDivider />

        {/* ── Seasonal Reference ──────────────────────────────── */}
        <SectionHeader
          label={t("Climate", "Clima")}
          title={t("Seasonal Reference", "Referencia Estacional")}
        />

        <div className="border border-border rounded-xl overflow-hidden">
          {SEASONS.map((s, i) => (
            <div key={i} className={`p-5 ${i < SEASONS.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-baseline justify-between mb-1.5">
                <h3 className="font-serif text-base">{s.months[ln]}</h3>
                <span className="text-xs text-muted-foreground font-mono">{s.temp}</span>
              </div>
              <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary/40 mb-1.5">
                {s.label[ln]}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.conditions[ln]}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 px-1">
          <div className="w-px h-4 bg-primary/20" />
          <p className="text-xs text-muted-foreground italic">
            {t("Ocean temperature year-round: 80 to 84 °F (27 to 29 °C). Ideal for swimming in every season.", "Temperatura del océano todo el año: 27 a 29 °C. Ideal para nadar en cualquier temporada.")}
          </p>
        </div>

        <SectionDivider />

        {/* ── Dining ──────────────────────────────────────────── */}
        <SectionHeader
          label={t("Dining", "Gastronomía")}
          title={t("Nearby Restaurants", "Restaurantes Cercanos")}
        />

        <div className="flex bg-secondary/30 p-1 rounded-lg mb-6">
          {(["Ocean Park", "Isla Verde"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPropertyTab(p)}
              className={`flex-1 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                propertyTab === p ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          {(propertyTab === "both" ? RESTAURANTS["Ocean Park"] : RESTAURANTS[propertyTab as "Ocean Park" | "Isla Verde"]).map((r, i, arr) => (
            <div key={r.name} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{r.cuisine[ln]}</p>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-primary/30">
                {t("Walking", "Caminando")}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-3 px-1">
          {t("All within walking distance of your property. Our concierge team can provide personalized recommendations.", "Todos a distancia caminable de su propiedad. Nuestro equipo de concierge puede ofrecer recomendaciones personalizadas.")}
        </p>

        <SectionDivider />

        {/* ── Activities ──────────────────────────────────────── */}
        <SectionHeader
          label={t("Explore", "Explorar")}
          title={t("Activities and Experiences", "Actividades y Experiencias")}
        />

        <div className="border border-border rounded-xl overflow-hidden">
          {ACTIVITIES.map((act, i) => (
            <div key={act.name.en} className={i < ACTIVITIES.length - 1 ? "border-b border-border" : ""}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{act.name[ln]}</p>
                  <p className="text-[10px] text-primary/40 font-semibold tracking-wider uppercase mt-0.5">{act.category[ln]}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {act.desc[ln]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* ── Getting Around ──────────────────────────────────── */}
        <SectionHeader
          label={t("Transport", "Transporte")}
          title={t("Getting Around", "Cómo Moverse")}
        />

        <div className="space-y-4">
          {TRANSPORT.map((g) => (
            <div key={g.title.en} className="border-l-2 border-border pl-5">
              <h3 className="font-medium text-sm mb-1">{g.title[ln]}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.desc[ln]}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#0B1730] text-white rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-white/30" />
            <p className="font-serif text-base">{t("Between Our Properties", "Entre Nuestras Propiedades")}</p>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            {t(
              "Ocean Park to Isla Verde: approximately 12 km, 25 minutes via PR-26 highway. Taxi fare ranges from $25 to $35.",
              "Ocean Park a Isla Verde: aproximadamente 12 km, 25 minutos por la autopista PR-26. Tarifa de taxi de $25 a $35."
            )}
          </p>
        </div>

        <SectionDivider />

        {/* ── Beach ───────────────────────────────────────────── */}
        <SectionHeader
          label={t("Beach", "Playa")}
          title={t("Beach Guide", "Guía de Playa")}
        />

        <div className="space-y-0 border border-border rounded-xl overflow-hidden">
          {[
            t("Grey towels are designated for pool use. Please ask our team for beach towels, which are the branded urban-color style.", "Las toallas grises son para la piscina. Solicite toallas de playa a nuestro equipo, son las de colores de marca Urbano."),
            t("Apply sunscreen generously before heading to the beach. The Caribbean sun is intense throughout the year.", "Aplique protector solar generosamente antes de ir a la playa. El sol caribeño es intenso durante todo el año."),
            t("Ocean Park beach is calmer and ideal for swimming. Isla Verde beach is more energetic with greater activity.", "La playa de Ocean Park es más tranquila e ideal para nadar. La playa de Isla Verde es más dinámica con mayor actividad."),
            t("Sunrise and the early morning hours are particularly beautiful. The beach is quiet and the light is exceptional.", "El amanecer y las primeras horas de la mañana son especialmente hermosos. La playa está tranquila y la luz es excepcional."),
            t("Outdoor showers are available at the beach access points for your convenience.", "Hay duchas exteriores disponibles en los accesos a la playa para su comodidad."),
          ].map((tip, i, arr) => (
            <div key={i} className={`flex gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-[10px] font-mono text-primary/30 mt-0.5 shrink-0">0{i + 1}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* ── Contact CTA ─────────────────────────────────────── */}
        <div className="text-center py-4">
          <p className="text-[10px] font-semibold tracking-[3px] uppercase text-primary/40 mb-3">
            {t("Assistance", "Asistencia")}
          </p>
          <h2 className="font-serif text-2xl mb-2">{t("We are here for you", "Estamos aquí para usted")}</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
            {t(
              "Speak with Rosa, our AI concierge, or reach our team directly for personalized assistance.",
              "Hable con Rosa, nuestra concierge IA, o contacte directamente a nuestro equipo para asistencia personalizada."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contact@rosalinapr.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-secondary/30 transition-colors"
            >
              <Mail className="w-4 h-4 text-muted-foreground" />
              contact@rosalinapr.com
            </a>
            <a
              href="tel:17873043335"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0B1730] text-white text-sm font-medium hover:bg-[#132350] transition-colors"
            >
              <Phone className="w-4 h-4" />
              787-304-3335
            </a>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
