import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  badgeIcon?: ReactNode;
  title: string;
  description?: string;
  accentClass?: string;
}

export default function PageHeader({
  badge,
  badgeIcon,
  title,
  description,
  accentClass = "from-primary/25 via-transparent to-transparent",
}: PageHeaderProps) {
  return (
    <div className={`relative overflow-hidden bg-[#161616] px-6 pt-20 md:pt-8 pb-10 text-white`}>
      {/* Radial accent glow */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,_var(--tw-gradient-stops))] ${accentClass} pointer-events-none`} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/12 text-white/60 text-xs font-medium tracking-widest uppercase mb-5">
          {badgeIcon && <span className="text-primary">{badgeIcon}</span>}
          {badge}
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-3 tracking-tight">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
