import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/sections/Navigation";
import Splash from "@/components/sections/Splash";
import Hero from "@/components/sections/Hero";
import LiveConcierge from "@/components/sections/LiveConcierge";
import PropertyInfo from "@/components/sections/PropertyInfo";
import ServiceRequest from "@/components/sections/ServiceRequest";
import FAQ from "@/components/sections/FAQ";
import Emergency from "@/components/sections/Emergency";
import Feedback from "@/components/sections/Feedback";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-20 md:pb-0">
      <AnimatePresence>
        {showSplash && <Splash />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col"
        >
          <Navigation />

          <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl lg:max-w-5xl">
            <Hero />
            <LiveConcierge />
            <PropertyInfo />
            <ServiceRequest />
            <FAQ />
            <Feedback />
            <Emergency />
          </main>

          <Footer />
        </motion.div>
      )}
    </div>
  );
}
