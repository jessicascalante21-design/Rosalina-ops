import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mx-auto md:max-w-4xl lg:max-w-5xl pt-0 md:pt-16"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
