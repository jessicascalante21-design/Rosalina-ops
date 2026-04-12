import { ClipboardList } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHeader from "@/components/layout/PageHeader";
import ServiceRequest from "@/components/sections/ServiceRequest";

export default function RequestPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Service Request", "Solicitud de Servicio")}
        badgeIcon={<ClipboardList className="w-3 h-3" />}
        title={t("Request a Service", "Solicitar un Servicio")}
        description={t(
          "Anything you need during your stay — just let us know.",
          "Todo lo que necesite durante su estadía, solo díganos."
        )}
        accentClass="from-amber-500/18 via-amber-500/5 to-transparent"
      />
      <ServiceRequest pageMode />
    </div>
  );
}
