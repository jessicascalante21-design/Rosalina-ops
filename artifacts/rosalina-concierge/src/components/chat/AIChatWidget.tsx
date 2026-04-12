import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const QUICK_QUESTIONS_EN = [
  "What's the WiFi password?",
  "What time is check-in?",
  "Is there a pool?",
  "How far is the beach?",
  "Do you allow pets?",
  "What's the lockbox code?",
];

const QUICK_QUESTIONS_ES = [
  "¿Cuál es la contraseña de WiFi?",
  "¿A qué hora es el check-in?",
  "¿Hay piscina?",
  "¿Qué tan lejos está la playa?",
  "¿Se permiten mascotas?",
  "¿Cuál es el código del candado?",
];

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
        "Hello! I'm Rosa, your AI concierge. How can I help you today?",
        "¡Hola! Soy Rosa, tu concierge virtual. ¿En qué puedo ayudarte hoy?"
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
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[80px] right-4 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-[0_6px_32px_rgba(13,27,64,0.32)] flex items-center justify-center group overflow-hidden"
            style={{ background: "var(--mid-navy, #162B5E)" }}
            aria-label="Chat with AI concierge"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <MessageCircle className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--mid-navy)" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-[72px] right-3 md:bottom-6 md:right-6 z-50 w-[calc(100vw-24px)] max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(13,27,64,0.25),0_0_0_1px_rgba(13,27,64,0.08)]"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{ background: "var(--dark-navy, #0D1B40)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={logoUrl} alt="Rosalina" className="w-6 h-6 object-contain" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm">Rosa</p>
                    <span className="flex items-center gap-1 text-white/50 text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" />
                      {t("AI Concierge", "Concierge Virtual")}
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

            {/* Messages */}
            <div className="h-72 overflow-y-auto bg-[#F8F6F1] p-4 space-y-3 no-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center shrink-0 mr-2 mt-0.5 overflow-hidden">
                      <img src={logoUrl} alt="Rosa" className="w-4 h-4 object-contain" />
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

              {/* Quick replies */}
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

            {/* Input */}
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
