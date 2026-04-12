import { useState } from "react";
import { motion } from "framer-motion";
import {
  Waves, Plane, Utensils, Activity, Car, Sun, Calendar, Wifi, Clock, MapPin,
  Star, Umbrella, Thermometer, Info, ChevronDown, ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHeader from "@/components/layout/PageHeader";

type PropertyTab = "Ocean Park" | "Isla Verde" | "both";

const SEASONS = [
  {
    icon: Sun,
    name: { en: "Dec – Apr · Best Season", es: "Dic – Abr · Mejor Época" },
    desc: {
      en: "Dry season. Temperatures 75–85°F. Best weather for the beach, lowest humidity. Book early — this is peak season.",
      es: "Temporada seca. 24–29°C. El mejor clima para la playa, humedad baja. Reserve con anticipación — es temporada alta.",
    },
    color: "bg-amber-50 border-amber-200 text-amber-800",
    badge: { en: "Peak Season", es: "Temporada Alta" },
  },
  {
    icon: Activity,
    name: { en: "Jun – Aug · Hot & Lively", es: "Jun – Ago · Caluroso y Activo" },
    desc: {
      en: "Warm season, 85–90°F. Ocean perfect for swimming. Lots of local festivals and live music. Book early.",
      es: "Temporada cálida, 29–32°C. El océano está perfecto. Festivales locales y música en vivo. Reserve temprano.",
    },
    color: "bg-orange-50 border-orange-200 text-orange-800",
    badge: { en: "Summer High", es: "Verano Alto" },
  },
  {
    icon: Umbrella,
    name: { en: "Sep – Nov · Quieter Deals", es: "Sep – Nov · Más Tranquilo" },
    desc: {
      en: "Rainy season — short afternoon showers, clear mornings. Best rates and fewer crowds. Hurricane season peaks Aug–Oct.",
      es: "Temporada de lluvia — chubascos breves por la tarde, mañanas despejadas. Mejores tarifas y menos turistas.",
    },
    color: "bg-blue-50 border-blue-200 text-blue-800",
    badge: { en: "Off-Peak Value", es: "Mejor Precio" },
  },
];

const ACTIVITIES = [
  { icon: "🤿", name: { en: "Aqua Adventure PR", es: "Aqua Adventure PR" }, desc: { en: "Snorkeling & diving tours. Reef exploration in crystal waters.", es: "Snorkeling y buceo. Exploración de arrecifes en aguas cristalinas." } },
  { icon: "🚣", name: { en: "Night Kayak", es: "Kayak Nocturno" }, desc: { en: "Bioluminescent bay kayaking — one of PR's most magical experiences.", es: "Kayak en bahía bioluminiscente — una de las experiencias más mágicas de PR." } },
  { icon: "🚲", name: { en: "San Juan Bike Rentals", es: "Bicicletas San Juan" }, desc: { en: "Explore Old San Juan on two wheels — historic forts, colorful streets.", es: "Explora el Viejo San Juan en bici — fortalezas históricas y calles coloridas." } },
  { icon: "🧩", name: { en: "Escape Room PR", es: "Escape Room PR" }, desc: { en: "Fun team escape room challenges in San Juan.", es: "Emocionantes retos de escape room en San Juan." } },
  { icon: "🕵️", name: { en: "Clue Murder Mystery", es: "Misterio Tipo Clue" }, desc: { en: "Interactive murder mystery dining experience.", es: "Experiencia de cena con misterio interactivo." } },
  { icon: "🎬", name: { en: "Fine Arts Miramar", es: "Fine Arts Miramar" }, desc: { en: "Arthouse cinema in the trendy Miramar neighborhood.", es: "Cine de arte en el elegante barrio de Miramar." } },
  { icon: "🏔️", name: { en: "El Yunque Rainforest", es: "El Yunque" }, desc: { en: "The only tropical rainforest in the US National Forest system. ~40 min drive.", es: "El único bosque tropical del sistema forestal de EE.UU. ~40 min en auto." } },
  { icon: "🏰", name: { en: "Old San Juan", es: "Viejo San Juan" }, desc: { en: "500-year-old Spanish colonial city with blue cobblestones, El Morro & La Fortaleza.", es: "Ciudad colonial española de 500 años, adoquines azules, El Morro y La Fortaleza." } },
  { icon: "🥃", name: { en: "Casa Bacardí", es: "Casa Bacardí" }, desc: { en: "The world-famous Bacardi rum distillery tour & cocktail experience.", es: "El famoso tour de la destilería Bacardí y experiencia de cócteles." } },
];

const RESTAURANTS: Record<"Ocean Park" | "Isla Verde", { name: string; type: { en: string; es: string }; note?: { en: string; es: string } }[]> = {
  "Ocean Park": [
    { name: "Acapulco Taqueria Mexicana", type: { en: "Mexican", es: "Mexicano" } },
    { name: "Burger & Mayo Lab", type: { en: "Burgers", es: "Hamburguesas" } },
    { name: "Bocca Osteria Romana", type: { en: "Italian", es: "Italiano" } },
    { name: "Pirilo Pizza Rustica", type: { en: "Pizza", es: "Pizza" } },
    { name: "Berlingeri", type: { en: "Local Cuisine", es: "Cocina Local" } },
  ],
  "Isla Verde": [
    { name: "Mande Restaurant", type: { en: "Modern", es: "Moderno" } },
    { name: "Euphoria Restaurant", type: { en: "Fine Dining", es: "Alta Cocina" } },
    { name: "Piccolos", type: { en: "Italian", es: "Italiano" } },
    { name: "Bistro Cafe", type: { en: "Café & Brunch", es: "Café y Brunch" } },
    { name: "The New Ceviche", type: { en: "Seafood", es: "Mariscos" } },
  ],
};

const GETTING_AROUND = [
  { icon: Car, title: { en: "Uber & Lyft", es: "Uber y Lyft" }, desc: { en: "Widely available throughout San Juan metro. Best for short trips and airport transfers.", es: "Ampliamente disponible en San Juan. Ideal para trayectos cortos y traslados al aeropuerto." } },
  { icon: Car, title: { en: "Car Rental", es: "Alquiler de Auto" }, desc: { en: "Recommended for day trips to El Yunque, Ponce or the west coast beaches. SJU Airport has all major brands.", es: "Recomendado para excursiones a El Yunque, Ponce o las playas del oeste. SJU tiene todas las marcas principales." } },
  { icon: MapPin, title: { en: "Taxi", es: "Taxi" }, desc: { en: "Available at airport and hotels. Negotiate fare or request meter. Fixed rates to some areas.", es: "Disponibles en aeropuerto y hoteles. Negocie la tarifa o solicite taxímetro." } },
];

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary/70" />
        </div>
        <h2 className="font-serif text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function WelcomeGuidePage() {
  const { t, language } = useLanguage();
  const [propertyTab, setPropertyTab] = useState<PropertyTab>("both");
  const [expanded, setExpanded] = useState<number | null>(null);

  const ln = language === "ES" ? "es" : "en";

  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Welcome Guide", "Guía de Bienvenida")}
        badgeIcon={<Star className="w-3 h-3" />}
        title={t("Your Puerto Rico Guide", "Tu Guía de Puerto Rico")}
        description={t(
          "Everything you need for an unforgettable stay — restaurants, activities, seasons, and local tips.",
          "Todo lo que necesitas para una estadía inolvidable — restaurantes, actividades, temporadas y consejos locales."
        )}
        accentClass="from-amber-500/20 via-amber-500/5 to-transparent"
      />

      <div className="px-5 py-8 max-w-2xl mx-auto">

        {/* ── Essential Info ────────────────────────────────── */}
        <Section title={t("Essential Info", "Información Esencial")} icon={Info}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Wifi,         label: "Wi-Fi",                     value: "Rosalina Guest · RosalinaForever1!" },
              { icon: Clock,        label: t("Check-in", "Check-in"),   value: t("4:00 PM (code sent 11 AM)", "4:00 PM (código 11 AM)") },
              { icon: Clock,        label: t("Check-out", "Check-out"), value: "11:00 AM" },
              { icon: Thermometer,  label: t("Year-round temp", "Temp. todo el año"), value: "75–90°F / 24–32°C" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
                <p className="font-semibold text-sm leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-secondary/30 border border-border rounded-2xl px-4 py-3 text-xs text-muted-foreground leading-relaxed">
            ☕ {t("Self-service coffee station at the entrance — available for all guests.", "Estación de café self-service en la entrada — disponible para todos los huéspedes.")}
          </div>
        </Section>

        {/* ── Your Neighborhood ─────────────────────────────── */}
        <Section title={t("Your Neighborhood", "Tu Vecindario")} icon={MapPin}>
          <div className="flex gap-1.5 bg-secondary/30 p-1 rounded-xl mb-4">
            {(["Ocean Park", "Isla Verde", "both"] as PropertyTab[]).map((p) => (
              <button
                key={p}
                onClick={() => setPropertyTab(p)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${propertyTab === p ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {p === "both" ? t("Both", "Ambas") : p}
              </button>
            ))}
          </div>

          {(propertyTab === "Ocean Park" || propertyTab === "both") && (
            <div className="bg-card border border-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-blue-500" />
                <p className="font-semibold text-sm">Ocean Park · San Juan</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "A peaceful residential neighborhood beloved by locals, expats, and surfers. Palm-lined streets, colorful homes, and one of San Juan's most beautiful beaches just a 5-minute walk away. Perfect for those who want an authentic, community-feel Puerto Rico experience.",
                  "Un tranquilo barrio residencial amado por locales, expatriados y surfistas. Calles bordeadas de palmeras, casas coloridas y una de las playas más hermosas de San Juan a solo 5 minutos caminando. Ideal para quienes quieren una experiencia auténtica de Puerto Rico."
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  t("5 min to beach", "5 min a la playa"),
                  t("9 min to airport", "9 min al aeropuerto"),
                  t("2 pools on-site", "2 piscinas"),
                  t("10+ restaurants walking", "10+ restaurantes caminando"),
                ].map((tag) => (
                  <span key={tag} className="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {(propertyTab === "Isla Verde" || propertyTab === "both") && (
            <div className="bg-card border border-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-emerald-500" />
                <p className="font-semibold text-sm">Isla Verde · Carolina</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "A vibrant beach strip known for its nightlife, luxury hotels, and 4-minute walk to a stunning Atlantic beach. Ideal for guests arriving by air or wanting to be in the center of the action. Free access to Ocean Park pools (~8 min drive).",
                  "Una animada franja playera conocida por su vida nocturna y playa atlántica a 4 minutos caminando. Ideal para huéspedes que llegan en avión o quieren estar en el centro de la acción. Acceso gratuito a las piscinas de Ocean Park (~8 min en auto)."
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  t("4 min to beach", "4 min a la playa"),
                  t("6 min to airport", "6 min al aeropuerto"),
                  t("Free pool access OP", "Acceso gratis piscinas OP"),
                  t("Vibrant nightlife", "Vida nocturna"),
                ].map((tag) => (
                  <span key={tag} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Seasons ───────────────────────────────────────── */}
        <Section title={t("When to Visit", "Cuándo Visitar")} icon={Calendar}>
          <div className="space-y-3">
            {SEASONS.map((s, i) => (
              <div key={i} className={`border rounded-2xl p-4 ${s.color}`}>
                <div className="flex items-start gap-3">
                  <s.icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{language === "ES" ? s.name.es : s.name.en}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/40 border border-current/20">
                        {language === "ES" ? s.badge.es : s.badge.en}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed opacity-85">{language === "ES" ? s.desc.es : s.desc.en}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            🌊 {t("Ocean temperature year-round: 80–84°F (27–29°C). Always perfect for swimming.", "Temperatura del océano todo el año: 27–29°C. Siempre perfecto para nadar.")}
          </p>
        </Section>

        {/* ── Restaurants ───────────────────────────────────── */}
        <Section title={t("Restaurants Nearby", "Restaurantes Cercanos")} icon={Utensils}>
          <div className="flex gap-1.5 bg-secondary/30 p-1 rounded-xl mb-4">
            {(["Ocean Park", "Isla Verde"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPropertyTab(p)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${propertyTab === p ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {(propertyTab === "both" ? RESTAURANTS["Ocean Park"] : RESTAURANTS[propertyTab as "Ocean Park" | "Isla Verde"]).map((r, i) => (
              <div key={r.name} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-[10px] flex items-center justify-center font-bold text-primary">{i + 1}</span>
                  <p className="font-medium text-sm">{r.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{language === "ES" ? r.type.es : r.type.en}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {t("All within walking distance. Ask Rosa or our team for specific recommendations!", "Todos a distancia caminable. ¡Pregúntale a Rosa o a nuestro equipo por recomendaciones!")}
          </p>
        </Section>

        {/* ── Activities ────────────────────────────────────── */}
        <Section title={t("Activities & Experiences", "Actividades y Experiencias")} icon={Activity}>
          <div className="space-y-2">
            {ACTIVITIES.map((act, i) => (
              <motion.div
                key={act.name.en}
                initial={false}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className="text-2xl">{act.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{language === "ES" ? act.name.es : act.name.en}</p>
                  </div>
                  {expanded === i
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  }
                </button>
                {expanded === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {language === "ES" ? act.desc.es : act.desc.en}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Getting Around ────────────────────────────────── */}
        <Section title={t("Getting Around", "Cómo Moverse")} icon={Car}>
          <div className="space-y-3">
            {GETTING_AROUND.map((g) => (
              <div key={g.title.en} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
                <g.icon className="w-5 h-5 text-primary/60 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">{language === "ES" ? g.title.es : g.title.en}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{language === "ES" ? g.desc.es : g.desc.en}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-[#0D1B40] text-white rounded-2xl p-4 text-sm">
            <p className="font-medium mb-1">🗺️ {t("Between our properties", "Entre nuestras propiedades")}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t("Ocean Park ↔ Isla Verde: ~12 km · ~25 min via PR-26 highway. Taxi approx. $25–35.", "Ocean Park ↔ Isla Verde: ~12 km · ~25 min por PR-26. Taxi aprox. $25–35.")}
            </p>
          </div>
        </Section>

        {/* ── Beach Guide ───────────────────────────────────── */}
        <Section title={t("Beach Tips", "Consejos para la Playa")} icon={Waves}>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 leading-relaxed space-y-3">
            <p>🏊 {t("Use grey towels for the pool and ask our team about beach towels — they're the urban brand-color ones.", "Use toallas grises para la piscina. Para la playa, pregunte a nuestro equipo — son las de colores de marca Urbano.")}</p>
            <p>☀️ {t("Apply sunscreen before hitting the beach — Caribbean sun is intense year-round.", "Aplique protector solar antes de ir a la playa — el sol caribeño es intenso todo el año.")}</p>
            <p>🤿 {t("Ocean Park beach is calmer and ideal for swimming. Isla Verde beach has more energy and activity.", "La playa de Ocean Park es más tranquila e ideal para nadar. La de Isla Verde tiene más ambiente y actividad.")}</p>
            <p>🌅 {t("Sunrise and early morning are magical — the beach is nearly empty and the light is stunning.", "El amanecer y la mañana temprana son mágicos — la playa está casi vacía y la luz es espectacular.")}</p>
            <p>🚿 {t("Outdoor showers available at the beach access points.", "Duchas exteriores disponibles en los accesos a la playa.")}</p>
          </div>
        </Section>

        {/* ── Need help CTA ─────────────────────────────────── */}
        <div className="bg-[#0D1B40] text-white rounded-2xl p-5 text-center">
          <p className="font-serif text-xl mb-1.5">{t("Still have questions?", "¿Todavía tienes preguntas?")}</p>
          <p className="text-white/50 text-sm mb-4 leading-relaxed">
            {t("Chat with Rosa, our AI concierge, or reach our team directly.", "Chatea con Rosa, nuestra IA, o contacta directamente a nuestro equipo.")}
          </p>
          <div className="flex gap-2 justify-center">
            <a
              href="mailto:contact@rosalinapr.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm font-medium hover:bg-white/15 transition-colors"
            >
              📧 {t("Email us", "Escríbanos")}
            </a>
            <a
              href="tel:17873043335"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0D1B40] text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              📞 787-304-3335
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
