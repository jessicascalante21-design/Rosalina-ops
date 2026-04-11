import { Home, MessageSquare, Info, ClipboardList, HelpCircle, Phone, Globe, Star, BarChart2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Link } from "wouter";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: "home", icon: Home, label: t("Home", "Inicio") },
    { id: "concierge", icon: MessageSquare, label: "Concierge" },
    { id: "info", icon: Info, label: "Info" },
    { id: "request", icon: ClipboardList, label: t("Request", "Pedir") },
    { id: "faq", icon: HelpCircle, label: "FAQ" },
    { id: "feedback", icon: Star, label: t("Reviews", "Reseñas") },
    { id: "emergency", icon: Phone, label: t("SOS", "SOS") },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Top Nav */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border h-16 items-center px-8 justify-between">
        <div className="font-serif text-2xl font-semibold tracking-wide text-primary">Rosalina</div>

        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-semibold hover:bg-secondary transition-colors"
            data-testid="button-lang-toggle"
          >
            <Globe className="w-3.5 h-3.5" />
            {language}
          </button>

          <Link
            href="/staff/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-staff-report"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            {t("Staff", "Personal")}
          </Link>
        </nav>
      </header>

      {/* Mobile Top Nav (logo and lang toggle) */}
      <header className="md:hidden absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-6">
        <div className="font-serif text-2xl font-semibold tracking-wide text-white">Rosalina</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md"
            data-testid="button-lang-toggle-mobile"
          >
            <Globe className="w-3.5 h-3.5" />
            {language}
          </button>
          <Link
            href="/staff/login"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs backdrop-blur-md"
            data-testid="link-staff-report-mobile"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Mobile Sticky Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border pb-safe pt-1 px-1 flex justify-between items-center h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex flex-col items-center justify-center w-full gap-0.5 text-muted-foreground hover:text-primary active:text-primary transition-colors py-1"
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-4.5 h-4.5" style={{ width: "1.1rem", height: "1.1rem" }} />
            <span className="text-[9px] font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
