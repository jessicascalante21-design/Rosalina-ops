import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import conciergeAvatar from "@assets/4536937_1775962091124.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const QUICK_QUESTIONS_EN = [
  "Where can I find the WiFi info?",
  "What time is check-in?",
  "Best restaurants nearby?",
  "How far is the beach?",
  "What can I do today?",
  "How do I get to Old San Juan?",
];

const QUICK_QUESTIONS_ES = [
  "Donde encuentro el WiFi?",
  "A que hora es el check-in?",
  "Mejores restaurantes cercanos?",
  "Que tan lejos esta la playa?",
  "Que puedo hacer hoy?",
  "Como llego al Viejo San Juan?",
];

function trackQuestion(question: string) {
  try {
    const data = JSON.parse(localStorage.getItem("rosalina_chat_faq") || "[]") as { q: string; ts: string }[];
    data.push({ q: question.trim().toLowerCase(), ts: new Date().toISOString() });
    if (data.length > 500) data.splice(0, data.length - 500);
    localStorage.setItem("rosalina_chat_faq", JSON.stringify(data));
  } catch {}
}

interface AIChatWidgetProps {
  property?: string;
}

export default function AIChatWidget({ property }: AIChatWidgetProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t(
        "Welcome to Rosalina. I'm here to make your stay unforgettable. What can I help you discover today?",
        "Bienvenido a Rosalina. Estoy aqui para hacer tu estadia inolvidable. Que puedo ayudarte a descubrir hoy?"
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = language === "ES" ? QUICK_QUESTIONS_ES : QUICK_QUESTIONS_EN;

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    trackQuestion(text);

    const assistantMessage: Message = { role: "assistant", content: "", streaming: true };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          property: property || null,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                    streaming: true,
                  };
                  return updated;
                });
              }
              if (data.done || data.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: data.error || fullContent,
                    streaming: false,
                  };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: t(
            "I'm having trouble connecting right now. Please call us at 787-304-3335.",
            "Tengo dificultades para conectarme. Por favor llame al 787-304-3335."
          ),
          streaming: false,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const showQuickReplies = messages.length <= 2;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[80px] right-4 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-[0_6px_32px_rgba(13,27,64,0.32)] flex items-center justify-center group overflow-hidden"
            style={{ background: "var(--mid-navy, #132350)" }}
            aria-label="Chat with AI concierge"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <MessageCircle className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--mid-navy)" }} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-[72px] right-3 md:bottom-6 md:right-6 z-50 w-[calc(100vw-24px)] max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(13,27,64,0.25),0_0_0_1px_rgba(13,27,64,0.08)]"
          >
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{ background: "var(--dark-navy, #0B1730)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                  <img src={conciergeAvatar} alt="Rosa" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm">Rosa</p>
                    <span className="flex items-center gap-1 text-white/50 text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" />
                      {t("Experience AI", "Experience AI")}
                    </span>
                  </div>
                  <p className="text-white/45 text-[10px]">
                    {property
                      ? `${property} · Rosalina`
                      : "Rosalina Boutique Hotels"
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto bg-[#F8F6F1] p-4 space-y-3 no-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-white/80 border border-border flex items-center justify-center shrink-0 mr-2 mt-0.5 overflow-hidden p-0.5">
                      <img src={conciergeAvatar} alt="Rosa" className="w-full h-full object-contain rounded-full" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-tr-sm shadow-sm"
                        : "bg-white text-foreground rounded-tl-sm border border-border/60 shadow-sm"
                    }`}
                    style={msg.role === "user" ? { background: "var(--mid-navy)" } : {}}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse rounded-sm align-middle" />
                    )}
                  </div>
                </div>
              ))}

              {showQuickReplies && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-border text-foreground/70 hover:border-primary/40 hover:text-primary hover:bg-primary/4 transition-all active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t border-border px-3 py-3 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder={t("Ask anything...", "Pregunta lo que quieras...")}
                className="flex-1 text-sm bg-[#F8F6F1] border border-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/60 font-sans"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-40"
                style={{ background: "var(--mid-navy)" }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
