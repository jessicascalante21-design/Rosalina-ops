import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import logoUrl from "@assets/image_1775935433037.png";

export default function Splash() {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.img
          src={logoUrl}
          alt="Rosalina"
          className="w-24 h-24 object-contain opacity-90"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <div className="flex flex-col items-center gap-3">
          <h1 className="font-serif text-4xl text-foreground tracking-wide">
            Rosalina
          </h1>

          <div className="w-48 h-[2px] bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <p className="text-muted-foreground text-xs uppercase tracking-[3px] font-medium">
            {t('LiveOps Concierge™', 'Concierge en Vivo™')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
