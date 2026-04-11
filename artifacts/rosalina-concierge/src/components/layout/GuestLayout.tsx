import { ReactNode } from "react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <main className="w-full max-w-2xl mx-auto md:max-w-4xl lg:max-w-5xl pt-0 md:pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
