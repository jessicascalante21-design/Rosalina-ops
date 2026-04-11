import { Home, MessageSquare, ClipboardCheck, ClipboardList, Star, Phone, Globe, BarChart2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/image_1775935433037.png";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  const tabs = [
    { href: "/",           icon: Home,          label: t("Hub", "Inicio") },
    { href: "/pre-arrival",icon: ClipboardCheck, label: t("Pre-Arrival", "Pre-Llegada") },
    { href: "/concierge",  icon: MessageSquare,  label: "Concierge" },
    { href: "/feedback",   icon: Star,           label: t("Feedback", "Reseñas") },
    { href: "/emergency",  icon: Phone,          label: t("SOS", "SOS") },
  ];

  const desktopTabs = [
    ...tabs,
    { href: "/request", icon: ClipboardList, label: t("Request", "Pedir") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      {/* Desktop Top Nav */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border h-16 items-center px-8 justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src={logoUrl} alt="Rosalina" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-serif text-xl font-semibold tracking-wide text-foreground">Rosalina</span>
            <span className="hidden lg:inline text-xs text-muted-foreground ml-2 tracking-widest uppercase">LiveOps Concierge™</span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5">
          {desktopTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(tab.href)
                  ? "text-primary bg-primary/8 font-semibold"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
              }`}
              data-testid={`nav-desktop-${tab.href.replace("/", "") || "home"}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </Link>
          ))}

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-secondary transition-colors"
            data-testid="button-lang-toggle"
          >
            <Globe className="w-3.5 h-3.5" />
            {language}
          </button>

          <Link
            href="/staff/login"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium transition-colors ml-1 ${
              isActive("/staff")
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="link-staff-report"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>
      </header>

      {/* Mobile Top Bar (logo + lang) */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 border-b backdrop-blur-md transition-colors ${
        location === "/" ? "bg-transparent border-transparent" : "bg-background/95 border-border"
      }`}>
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img
            src={logoUrl}
            alt="Rosalina"
            className={`w-7 h-7 object-contain transition-all ${location === "/" ? "brightness-0 invert" : ""}`}
          />
          <span className={`font-serif text-lg font-semibold tracking-wide transition-colors ${location === "/" ? "text-white" : "text-foreground"}`}>
            Rosalina
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-colors ${
              location === "/"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-card border-border text-foreground"
            }`}
            data-testid="button-lang-toggle-mobile"
          >
            <Globe className="w-3.5 h-3.5" />
            {language}
          </button>
        </div>
      </header>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border pb-safe flex items-stretch h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors pt-1 ${
                active ? "text-primary" : "text-muted-foreground hover:text-primary active:text-primary"
              }`}
              data-testid={`nav-${tab.href.replace("/", "") || "home"}`}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" style={{ top: 0 }} />
              )}
              <tab.icon style={{ width: "1.1rem", height: "1.1rem" }} />
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
