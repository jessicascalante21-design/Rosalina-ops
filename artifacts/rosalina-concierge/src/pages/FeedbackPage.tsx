import { Star } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import PageHeader from "@/components/layout/PageHeader";
import Feedback from "@/components/sections/Feedback";

export default function FeedbackPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <PageHeader
        badge={t("Your Voice", "Tu Voz")}
        badgeIcon={<Star className="w-3 h-3" />}
        title={t("Feedback & Reviews", "Comentarios y Reseñas")}
        description={t(
          "Share a thought, a compliment, or help us improve your experience.",
          "Comparte un comentario, un elogio o ayúdanos a mejorar tu experiencia."
        )}
        accentClass="from-amber-400/18 via-amber-400/5 to-transparent"
      />
      <div className="px-5 py-8">
        <Feedback pageMode />
      </div>
    </div>
  );
}
