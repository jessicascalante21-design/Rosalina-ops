import { Home, MessageSquare, ClipboardCheck, ClipboardList, Star, Phone, Globe, BarChart2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/image_1775935433037.png";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  const onHub = location === "/";

  const tabs = [
    { href: "/",            icon: Home,          label: t("Hub", "Inicio") },
    { href: "/pre-arrival", icon: ClipboardCheck, label: t("Pre-Arrival", "Pre-Llegada") },
    { href: "/concierge",   icon: MessageSquare,  label: "Concierge" },
    { href: "/feedback",    icon: Star,           label: t("Feedback", "Reseñas") },
    { href: "/emergency",   icon: Phone,          label: "SOS" },
  ];

  const desktopTabs = [
    ...tabs,
    { href: "/request", icon: ClipboardList, label: t("Request", "Pedir") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      {/* ── Desktop Top Nav ──────────────────────────────── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 items-center justify-between px-8 bg-background/96 backdrop-blur-lg border-b border-border/60 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <img src={logoUrl} alt="Rosalina" className="w-8 h-8 object-contain" />
          <div className="leading-none">
            <span className="font-serif text-xl font-semibold tracking-wide text-foreground">Rosalina</span>
            <span className="hidden lg:inline text-[11px] text-muted-foreground/70 ml-2 tracking-[0.18em] uppercase font-sans">LiveOps Concierge™</span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5">
          {desktopTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  active
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-foreground/60 hover:text-foreground hover:bg-black/4"
                }`}
                data-testid={`nav-desktop-${tab.href.replace("/", "") || "home"}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}

          <div className="w-px h-4 bg-border mx-2" />

          <button
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-[12px] font-semibold hover:bg-secondary transition-colors"
            data-testid="button-lang-toggle"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            {language}
          </button>

          <Link
            href="/staff/login"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ml-1 ${
              isActive("/staff")
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            data-testid="link-staff-report"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>
      </header>

      {/* ── Mobile Top Bar ───────────────────────────────── */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 transition-all duration-300 ${
          onHub
            ? "bg-transparent border-transparent"
            : "bg-background/95 border-b border-border/50 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img
            src={logoUrl}
            alt="Rosalina"
            className={`w-7 h-7 object-contain transition-all duration-300 ${onHub ? "brightness-0 invert" : ""}`}
          />
          <span className={`font-serif text-[17px] font-semibold tracking-wide transition-colors duration-300 ${onHub ? "text-white" : "text-foreground"}`}>
            Rosalina
          </span>
        </Link>

        <button
          onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold backdrop-blur-md transition-all duration-300 ${
            onHub
              ? "bg-white/10 border-white/18 text-white/80 hover:bg-white/15"
              : "bg-card border-border text-foreground hover:bg-secondary"
          }`}
          data-testid="button-lang-toggle-mobile"
        >
          <Globe className="w-3 h-3" />
          {language}
        </button>
      </header>

      {/* ── Mobile Bottom Tab Bar ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch h-[60px] bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
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
                  ? "text-red-500/70 hover:text-red-500"
                  : active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid={`nav-${tab.href.replace("/", "") || "home"}`}
            >
              {/* Active pill indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-primary rounded-b-full" />
              )}

              <tab.icon
                style={{ width: "1.15rem", height: "1.15rem" }}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className={`text-[9.5px] leading-none font-medium tracking-tight ${active ? "font-semibold" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
