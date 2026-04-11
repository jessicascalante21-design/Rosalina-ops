import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export default function Splash() {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-8 tracking-wide">
          Rosalina
        </h1>
        
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        
        <p className="mt-4 text-muted-foreground text-sm uppercase tracking-widest font-medium">
          {t('Digital Concierge', 'Concierge Digital')}
        </p>
      </div>
    </motion.div>
  );
}
