import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Send, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackProps {
  pageMode?: boolean;
}

const FEEDBACK_TYPES = [
  { value: "suggestion", en: "Suggestion", es: "Sugerencia" },
  { value: "comment",    en: "Comment",    es: "Comentario" },
  { value: "congratulation", en: "Compliment", es: "Felicitación" },
  { value: "complaint",  en: "Complaint",  es: "Queja" },
];

export default function Feedback({ pageMode = false }: FeedbackProps) {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const entry = { type: "feedback", timestamp, feedbackType, name: name || "Anonymous", room: room || "—", message };
    const existing = JSON.parse(localStorage.getItem("rosalina_report") || "[]");
    localStorage.setItem("rosalina_report", JSON.stringify([...existing, entry]));
    const subject = encodeURIComponent(`[Rosalina Feedback] ${feedbackType} – Room ${room || "N/A"}`);
    const body = encodeURIComponent(`Feedback Type: ${feedbackType}\nName: ${name || "Anonymous"}\nRoom: ${room || "N/A"}\n\nMessage:\n${message}`);
    window.location.href = `mailto:contact@rosalinapr.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const reset = () => {
    setFeedbackType(""); setName(""); setRoom(""); setMessage(""); setSubmitted(false);
  };

  const inner = (
    <div className={`space-y-5 ${pageMode ? "max-w-xl mx-auto" : ""}`}>
      {/* Google Review Banner */}
      <a
        href="https://share.google/dMZZbAfY87Z3CDP7e"
        target="_blank"
        rel="noreferrer"
        data-testid="link-google-review"
        className="flex items-center justify-between gap-4 text-white px-5 py-4 rounded-2xl transition-colors group card-hover hover:opacity-90"
                    style={{ background: "var(--dark-navy, #0B1730)" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div>
            <p className="font-semibold text-sm">{t("Leave a Google Review", "Deja una reseña en Google")}</p>
            <p className="text-white/45 text-xs mt-0.5">{t("Help others discover Rosalina", "Ayuda a otros a descubrir Rosalina")}</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-white/35 group-hover:text-white/70 transition-colors shrink-0" />
      </a>

      {/* Form card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-10 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground mb-1">{t("Thank you!", "¡Gracias!")}</p>
                <p className="text-muted-foreground text-sm">{t("Your feedback has been sent to our team.", "Tu comentario ha sido enviado a nuestro equipo.")}</p>
              </div>
              <Button variant="outline" onClick={reset} className="mt-2 rounded-full px-6">
                {t("Send another", "Enviar otro")}
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <Label className="text-foreground/70 font-medium mb-3 block text-sm">{t("Type of feedback", "Tipo de comentario")}</Label>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TYPES.map((ft) => (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => setFeedbackType(t(ft.en, ft.es))}
                      data-testid={`chip-feedback-${ft.value}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        feedbackType === t(ft.en, ft.es)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60 border border-border/50"
                      }`}
                    >
                      {t(ft.en, ft.es)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fb-name" className="text-foreground/70 mb-1.5 block text-sm">{t("Name (optional)", "Nombre (opcional)")}</Label>
                  <Input id="fb-name" placeholder={t("Your name", "Tu nombre")} value={name} onChange={(e) => setName(e.target.value)} className="bg-background/50 h-11" data-testid="input-fb-name" />
                </div>
                <div>
                  <Label htmlFor="fb-room" className="text-foreground/70 mb-1.5 block text-sm">{t("Room (optional)", "Habitación (opcional)")}</Label>
                  <Input id="fb-room" placeholder="e.g. OP7" value={room} onChange={(e) => setRoom(e.target.value)} className="bg-background/50 h-11" data-testid="input-fb-room" />
                </div>
              </div>

              <div>
                <Label htmlFor="fb-message" className="text-foreground/70 mb-1.5 block text-sm">
                  {t("Your message", "Tu mensaje")} <span className="text-primary">*</span>
                </Label>
                <Textarea
                  id="fb-message"
                  placeholder={t("Share your thoughts or experience...", "Comparte tus pensamientos o experiencia...")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background/50 min-h-[110px] resize-none"
                  required
                  data-testid="textarea-fb-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-13 text-base font-semibold rounded-xl shadow-sm bg-primary hover:bg-primary/90"
                disabled={!message || !feedbackType}
                data-testid="button-submit-feedback"
              >
                <Send className="w-4 h-4 mr-2" />
                {t("Send Feedback", "Enviar Comentario")}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (pageMode) return inner;

  return (
    <section id="feedback" className="py-16 px-6 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[2.5px] uppercase text-primary mb-1">{t("Your Voice", "Tu Voz")}</p>
        <h2 className="font-serif text-4xl text-foreground mb-3">{t("Suggestions & Feedback", "Sugerencias y Comentarios")}</h2>
        <p className="text-muted-foreground">{t("Your experience matters. Share a thought, a compliment, or help us improve.", "Tu experiencia importa. Comparte un comentario, elogio o ayúdanos a mejorar.")}</p>
      </div>
      {inner}
    </section>
  );
}
