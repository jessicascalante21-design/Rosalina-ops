import { useLanguage } from "@/lib/language-context";

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
        
        <p className="pt-8 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Rosalina Boutique Hotels. {t("All rights reserved.", "Todos los derechos reservados.")}
        </p>
      </div>
    </footer>
  );
}
