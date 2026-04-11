import { useLanguage } from "@/lib/language-context";
import { Star, BarChart2 } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 px-6 bg-background border-t border-border mt-8 mb-16 md:mb-0 text-center">
      <h2 className="font-serif text-3xl text-foreground mb-6 italic">Rosalina</h2>

      <div className="space-y-6 text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground mb-1">Ocean Park</p>
          <p>2020 Av. McLeary, San Juan PR 00911</p>
        </div>

        <div>
          <p className="font-medium text-foreground mb-1">Isla Verde</p>
          <p>84 Calle Júpiter, Carolina PR 00979</p>
        </div>

        <div className="pt-6 flex flex-col gap-2 border-t border-border w-3/4 mx-auto">
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

        {/* Google Review link */}
        <div className="pt-4">
          <a
            href="https://share.google/dMZZbAfY87Z3CDP7e"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary/30 transition-colors text-foreground/80"
            data-testid="footer-google-review"
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{t("Leave a Google Review", "Dejar reseña en Google")}</span>
          </a>
        </div>

        {/* Staff link */}
        <div>
          <Link
            href="/staff/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            data-testid="footer-staff-report"
          >
            <BarChart2 className="w-3 h-3" />
            {t("Staff Daily Report", "Reporte Diario del Personal")}
          </Link>
        </div>

        <p className="pt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Rosalina Boutique Hotels. {t("All rights reserved.", "Todos los derechos reservados.")}
        </p>
      </div>
    </footer>
  );
}
