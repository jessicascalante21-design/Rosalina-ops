import { Home, MessageSquare, ClipboardCheck, ClipboardList, Star, Phone, Globe, BarChart2, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  const onHub = location === "/";

  const tabs = [
    { href: "/",            icon: Home,          label: t("Hub", "Inicio") },
    { href: "/pre-arrival", icon: ClipboardCheck, label: t("Pre-Arrival", "Pre-Llegada") },
    { href: "/concierge",   icon: MessageSquare,  label: "Concierge" },
    { href: "/guide",       icon: BookOpen,       label: t("Guide", "Guia") },
    { href: "/emergency",   icon: Phone,          label: "SOS" },
  ];

  const desktopTabs = [
    { href: "/",            icon: Home,          label: t("Hub", "Inicio") },
    { href: "/pre-arrival", icon: ClipboardCheck, label: t("Pre-Arrival", "Pre-Llegada") },
    { href: "/concierge",   icon: MessageSquare,  label: "Concierge" },
    { href: "/guide",       icon: BookOpen,       label: t("Guide", "Guia") },
    { href: "/request",     icon: ClipboardList,  label: t("Request", "Pedir") },
    { href: "/feedback",    icon: Star,           label: t("Feedback", "Resenas") },
    { href: "/emergency",   icon: Phone,          label: "SOS" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-14 items-center justify-between px-8 bg-background/97 backdrop-blur-xl border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <span className="font-serif text-lg font-medium tracking-wide text-foreground">Rosalina</span>
          <span className="hidden lg:inline text-[10px] text-muted-foreground/50 tracking-[3px] uppercase font-sans ml-1">Boutique Hotels</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {desktopTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium tracking-wide transition-colors ${
                  active
                    ? "text-primary bg-primary/6"
                    : "text-foreground/50 hover:text-foreground hover:bg-black/3"
                }`}
                data-testid={`nav-desktop-${tab.href.replace("/", "") || "home"}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}

          <div className="w-px h-4 bg-border/60 mx-2" />

          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card text-[11px] font-medium hover:bg-secondary/50 transition-colors"
            data-testid="button-lang-toggle"
          >
            <Globe className="w-3 h-3 text-muted-foreground/60" />
            {language}
          </button>

          <Link
            href="/staff/login"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ml-1 ${
              isActive("/staff")
                ? "bg-primary/8 border-primary/25 text-primary"
                : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
            data-testid="link-staff-report"
          >
            <BarChart2 className="w-3 h-3" />
            Admin
          </Link>
        </nav>
      </header>

      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-13 transition-all duration-300 ${
          onHub
            ? "bg-transparent border-transparent"
            : "bg-background/96 border-b border-border/40 backdrop-blur-xl"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className={`font-serif text-[16px] font-medium tracking-wide transition-colors duration-300 ${onHub ? "text-white" : "text-foreground"}`}>
            Rosalina
          </span>
        </Link>

        <button
          onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-medium tracking-wider backdrop-blur-md transition-all duration-300 ${
            onHub
              ? "bg-white/8 border-white/12 text-white/70 hover:bg-white/12"
              : "bg-card border-border text-foreground hover:bg-secondary"
          }`}
          data-testid="button-lang-toggle-mobile"
        >
          <Globe className="w-3 h-3" />
          {language}
        </button>
      </header>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch h-[56px] bg-background/97 backdrop-blur-xl border-t border-border/30"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const isSOS = tab.href === "/emergency";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-all active:scale-90 ${
                isSOS && !active
                  ? "text-red-500/60 hover:text-red-500"
                  : active
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-primary"
              }`}
              data-testid={`nav-${tab.href.replace("/", "") || "home"}`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[2px] bg-primary rounded-b-full" />
              )}
              <tab.icon
                style={{ width: "1.1rem", height: "1.1rem" }}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className={`text-[9px] leading-none tracking-tight ${active ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
