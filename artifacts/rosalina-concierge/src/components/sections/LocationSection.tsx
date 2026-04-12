import { MapPin, Clock, Video, Mail, Phone, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function LocationSection() {
  const { t } = useLanguage();

  return (
    <section className="px-5 py-8">
      {/* Section header */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
          {t("Location & Contact", "Ubicación y Contacto")}
        </p>
        <h2 className="font-serif text-2xl">{t("Find Us · Reach Us", "Encuéntrenos · Contáctenos")}</h2>
      </div>

      {/* Distance map visual */}
      <div className="bg-[#0D1B40] rounded-2xl p-5 text-white mb-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(38,65,140,0.6),transparent)] pointer-events-none" />
        <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-4 relative z-10">
          {t("Puerto Rico · Caribbean", "Puerto Rico · Caribe")}
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
                  <p className="text-white/70 text-[11px] font-medium">≈ 12 km</p>
                  <p className="text-white/40 text-[10px]">~25 min</p>
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
              t("Taxi ~$25–35", "Taxi ~$25–35"),
              t("Uber available", "Uber disponible"),
            ].map((tag) => (
              <span key={tag} className="text-[10px] text-white/35 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
                {tag}
              </span>
            ))}
          </div>
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
            { label: t("Morning Shift", "Turno Mañana"), value: "8 AM – 5 PM" },
            { label: t("Evening Shift", "Turno Tarde"), value: "5 PM – 10 PM" },
            { label: t("Late Night", "Noche"), value: "10 PM – 2 AM" },
            { label: t("Emergency 24/7", "Emergencia 24/7"), value: "787-438-9393" },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-muted-foreground text-[11px]">{row.label}</p>
              <p className="font-medium text-[13px]">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact options */}
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
            <p className="text-[11px] text-muted-foreground">{t("Instant · No wait", "Inmediato · Sin espera")}</p>
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
    </section>
  );
}
