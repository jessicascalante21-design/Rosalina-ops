import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHeader from "@/components/layout/PageHeader";
import Emergency from "@/components/sections/Emergency";

export default function EmergencyPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Emergency", "Emergencia")}
        badgeIcon={<AlertTriangle className="w-3 h-3" />}
        title={t("Emergency Contacts", "Contactos de Emergencia")}
        description={t(
          "Tap any number below to call immediately. After-hours emergency line is active from 2 AM to 8 AM.",
          "Toque cualquier número para llamar de inmediato. La línea de emergencia está activa de 2 AM a 8 AM."
        )}
        accentClass="from-red-500/22 via-red-500/5 to-transparent"
      />
      <div className="px-5 py-8">
        <Emergency pageMode />
      </div>
    </div>
  );
}
