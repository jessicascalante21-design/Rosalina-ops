import { useLanguage } from "@/lib/language-context";
import { Star, BarChart2, Instagram, User } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-14 px-6 bg-background border-t border-border mt-8 mb-16 md:mb-0">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="font-serif text-2xl text-foreground mb-1.5">Rosalina</h2>
        <p className="text-[10px] font-sans font-medium tracking-[3px] uppercase text-muted-foreground/50 mb-8">Boutique Hotels</p>

        <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto text-left mb-8">
          <div>
            <p className="font-medium text-foreground text-[13px] mb-1">Ocean Park</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">2020 Av. McLeary,<br />San Juan PR 00911</p>
          </div>
          <div>
            <p className="font-medium text-foreground text-[13px] mb-1">Isla Verde</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">84 Calle Jupiter,<br />Carolina PR 00979</p>
          </div>
        </div>

        <div className="w-12 h-px bg-border mx-auto mb-8" />

        <div className="flex flex-col gap-2 mb-8 text-sm text-muted-foreground">
          <a href="https://rosalinapr.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            rosalinapr.com
          </a>
          <a href="mailto:contact@rosalinapr.com" className="hover:text-primary transition-colors">
            contact@rosalinapr.com
          </a>
          <a href="tel:17873043335" className="hover:text-primary transition-colors">
            787-304-3335
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <a
            href="https://share.google/dMZZbAfY87Z3CDP7e"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary/30 transition-colors text-foreground/70 text-xs font-medium"
            data-testid="footer-google-review"
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            {t("Google Review", "Resena en Google")}
          </a>
          <a
            href="https://www.instagram.com/rosalinaexperience"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-pink-50 hover:border-pink-200 transition-colors text-foreground/70 text-xs font-medium"
            data-testid="footer-instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            @rosalinaexperience
          </a>
        </div>

        <div className="flex items-center justify-center gap-5 mb-6">
          <Link
            href="/guest"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            data-testid="footer-guest-portal"
          >
            <User className="w-3 h-3" />
            {t("Guest Portal", "Portal del Huesped")}
          </Link>
          <Link
            href="/staff/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            data-testid="footer-staff-report"
          >
            <BarChart2 className="w-3 h-3" />
            {t("Staff Report", "Reporte del Personal")}
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground/40">
          &copy; {new Date().getFullYear()} Rosalina Boutique Hotels. {t("All rights reserved.", "Todos los derechos reservados.")}
        </p>
      </div>
    </footer>
  );
}
