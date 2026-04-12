import { Video } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHeader from "@/components/layout/PageHeader";
import LiveConcierge from "@/components/sections/LiveConcierge";

export default function ConciergePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Live Session", "Sesión en Vivo")}
        badgeIcon={<Video className="w-3 h-3" />}
        title={t("Connect With Our Team", "Conectar Con Nuestro Equipo")}
        description={t(
          "Real-time video support. Your concierge is one tap away.",
          "Soporte en video en tiempo real. Su concierge a un toque."
        )}
        accentClass="from-primary/22 via-primary/5 to-transparent"
      />
      <div className="px-4 py-8">
        <LiveConcierge pageMode />
      </div>
    </div>
  );
}
