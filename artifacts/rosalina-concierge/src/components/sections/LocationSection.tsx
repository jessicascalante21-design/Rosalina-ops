import { useState } from "react";
import { MapPin, Clock, Video, Mail, Phone, Instagram, AlertTriangle, MessageCircle, VideoOff, Navigation } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAfterHours } from "@/lib/use-after-hours";

const MAPS = {
  "Ocean Park": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.7016959460975!2d-66.052866!3d18.4518485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c036f3e09773363%3A0x3efca5b556132dcd!2sRosalina%20Ocean%20Park!5e0!3m2!1sen!2sco!4v1775965547418!5m2!1sen!2sco",
  "Isla Verde": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.7852440824804!2d-66.03789789999999!3d18.4480574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c0365fa50942f8b%3A0x446df453c38369dc!2sRosalina%20Isla%20Verde!5e0!3m2!1sen!2sco!4v1775965561419!5m2!1sen!2sco",
} as const;

const DIRECTIONS = {
  "Ocean Park": "https://www.google.com/maps/dir//Rosalina+Ocean+Park,+2018+%26+2020+Avenida+McLeary,+San+Juan,+PR+00911",
  "Isla Verde": "https://www.google.com/maps/dir//Rosalina+Isla+Verde,+84+Calle+J%C3%BApiter,+Carolina,+PR+00979",
} as const;

type MapTab = "Ocean Park" | "Isla Verde";

export default function LocationSection() {
  const { t } = useLanguage();
  const afterHours = useAfterHours();
  const [mapTab, setMapTab] = useState<MapTab>("Ocean Park");

  return (
    <section className="px-5 py-8">
      {/* Section header */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
          {t("Location and Contact", "Ubicación y Contacto")}
        </p>
        <h2 className="font-serif text-2xl">{t("Find Us and Reach Us", "Encuéntrenos y Contáctenos")}</h2>
      </div>

      {/* Distance map visual */}
      <div className="bg-[#0B1730] rounded-2xl p-5 text-white mb-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(38,65,140,0.6),transparent)] pointer-events-none" />
        <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-4 relative z-10">
          {t("Puerto Rico, Caribbean", "Puerto Rico, Caribe")}
        </p>

        {/* Visual distance bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            {/* Ocean Park */}
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5 text-blue-300" />
              </div>
              <p className="font-semibold text-sm">Ocean Park</p>
              <p className="text-white/45 text-[11px] mt-0.5">San Juan</p>
              <p className="text-white/30 text-[10px]">00911</p>
            </div>

            {/* Distance connector */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-center gap-1">
                <div className="h-px flex-1 bg-white/10" />
                <div className="bg-white/8 border border-white/10 rounded-full px-3 py-1 text-center">
                  <p className="text-white/70 text-[11px] font-medium">approx. 12 km</p>
                  <p className="text-white/40 text-[10px]">25 min</p>
                </div>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>

            {/* Isla Verde */}
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5 text-emerald-300" />
              </div>
              <p className="font-semibold text-sm">Isla Verde</p>
              <p className="text-white/45 text-[11px] mt-0.5">Carolina</p>
              <p className="text-white/30 text-[10px]">00979</p>
            </div>
          </div>

          {/* Route tags */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[
              t("By car via PR-26", "En auto por PR-26"),
              t("Taxi approx. $25 to $35", "Taxi aprox. $25 a $35"),
              t("Uber available", "Uber disponible"),
            ].map((tag) => (
              <span key={tag} className="text-[10px] text-white/35 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div className="flex bg-secondary/30 p-1 m-3 mb-0 rounded-lg">
          {(["Ocean Park", "Isla Verde"] as MapTab[]).map((p) => (
            <button
              key={p}
              onClick={() => setMapTab(p)}
              className={`flex-1 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                mapTab === p ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="relative">
          <iframe
            src={MAPS[mapTab]}
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Rosalina ${mapTab} Map`}
            className="w-full"
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between border-t border-border">
          <div>
            <p className="text-sm font-medium">
              Rosalina {mapTab}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {mapTab === "Ocean Park"
                ? "2018 & 2020 Av. McLeary, San Juan 00911"
                : "84 Calle Jupiter, Carolina 00979"
              }
            </p>
          </div>
          <a
            href={DIRECTIONS[mapTab]}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 text-primary text-xs font-semibold hover:bg-primary/12 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            {t("Directions", "Cómo llegar")}
          </a>
        </div>
      </div>

      {/* Hours card */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary/60" />
          <p className="font-semibold text-sm">{t("Concierge Hours", "Horario de Concierge")}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[
            { label: t("Morning Shift", "Turno Mañana"),    value: "8 AM to 5 PM" },
            { label: t("Evening Shift", "Turno Tarde"),     value: "5 PM to 10 PM" },
            { label: t("Late Night", "Noche"),              value: "10 PM to 2 AM" },
            { label: t("After Hours", "Fuera de horario"),  value: t("Emergency line only", "Solo línea de emergencia") },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-muted-foreground text-[11px]">{row.label}</p>
              <p className="font-medium text-[13px]">{row.value}</p>
            </div>
          ))}
        </div>
        {afterHours && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
            <p className="text-[11px] text-red-600 font-medium">
              {t(
                "After-hours (2 AM to 8 AM) — concierge desk is closed. Use emergency line or WhatsApp alert below.",
                "Fuera de horario (2 AM a 8 AM) — el concierge está cerrado. Use la línea de emergencia o el alerta de WhatsApp."
              )}
            </p>
          </div>
        )}
      </div>

      {/* Contact options — time-aware */}
      {afterHours ? (
        /* ── AFTER HOURS (2 AM to 8 AM) ── */
        <div className="space-y-3">
          {/* Banner */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-700 leading-snug">
              {t(
                "Concierge is offline (2 AM to 8 AM). For emergencies, call or send a WhatsApp alert.",
                "El concierge está fuera de línea (2 AM a 8 AM). En caso de emergencia, llame o envíe alerta por WhatsApp."
              )}
            </p>
          </div>

          {/* Emergency call */}
          <a
            href="tel:17874389393"
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 hover:bg-red-100/80 transition-all active:scale-[0.97]"
            data-testid="link-emergency"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-red-700">{t("Emergency Line", "Línea de Emergencia")}</p>
              <p className="text-xs text-red-600/70 font-mono">787-438-9393</p>
            </div>
            <span className="text-[10px] text-red-400 font-medium uppercase tracking-wide">
              {t("Call now", "Llamar")}
            </span>
          </a>

          {/* WhatsApp alert to staff group */}
          <a
            href={`https://wa.me/19397938989?text=${encodeURIComponent("🚨 EMERGENCY ALERT — Rosalina guest needs immediate assistance. Please respond.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100/80 transition-all active:scale-[0.97]"
            data-testid="link-whatsapp-alert"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-green-800">{t("WhatsApp Alert to Staff", "Alerta WhatsApp al Personal")}</p>
              <p className="text-xs text-green-600/70">{t("Sends an alert to the Rosalina team group", "Envía una alerta al grupo del equipo Rosalina")}</p>
            </div>
            <span className="text-[10px] text-green-600 font-medium uppercase tracking-wide">
              {t("Alert", "Alertar")}
            </span>
          </a>

          {/* Video session offline notice */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <VideoOff className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              {t(
                "Video concierge is offline until 8 AM. Email anytime at contact@rosalinapr.com",
                "El video concierge está fuera de línea hasta las 8 AM. Escríbenos a contact@rosalinapr.com"
              )}
            </p>
          </div>
        </div>
      ) : (
        /* ── REGULAR HOURS (8 AM to 2 AM) ── */
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <a
              href="https://meet.google.com/rcs-ugkv-cyk"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/6 border border-primary/15 hover:bg-primary/10 transition-all active:scale-[0.97] text-center"
              data-testid="link-meet-session"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-primary">{t("Video Meet", "Video Meet")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Instant, no wait", "Inmediato, sin espera")}</p>
              </div>
            </a>

            <a
              href="mailto:contact@rosalinapr.com"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all active:scale-[0.97] text-center"
              data-testid="link-email"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-primary">{t("Email Us", "Escríbanos")}</p>
                <p className="text-[11px] text-muted-foreground">contact@rosalinapr.com</p>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href="tel:17873043335"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all active:scale-[0.97] text-center"
            >
              <Phone className="w-4 h-4 text-primary/60" />
              <p className="text-[11px] font-medium text-foreground/70">787-304-3335</p>
            </a>
            <a
              href="tel:17874389393"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-red-100 hover:border-red-300 transition-all active:scale-[0.97] text-center"
            >
              <Phone className="w-4 h-4 text-red-500/70" />
              <p className="text-[11px] font-medium text-red-600/70">{t("Emergency", "Emergencia")}</p>
            </a>
            <a
              href="https://www.instagram.com/rosalinaexperience"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border hover:border-pink-200 transition-all active:scale-[0.97] text-center"
              data-testid="link-instagram"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <p className="text-[11px] font-medium text-foreground/70">Instagram</p>
            </a>
          </div>
        </>
      )}
    </section>
  );
}
