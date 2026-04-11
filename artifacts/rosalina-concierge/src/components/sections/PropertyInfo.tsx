import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Copy, Wifi, Clock, Waves, Car, MapPin, Coffee, Utensils } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PropertyInfo() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t("Copied to clipboard", "Copiado al portapapeles"),
      description: text,
      duration: 2000,
    });
  };

  return (
    <section id="info" className="py-16 px-6 md:px-8">
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-foreground mb-3">
          {t("Property Info", "Información de la Propiedad")}
        </h2>
        <p className="text-muted-foreground">
          {t("Everything you need to know during your stay.", "Todo lo que necesita saber durante su estancia.")}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        
        <AccordionItem value="wifi" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-wifi">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">Wi-Fi</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-3 pl-13">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Network Name", "Nombre de Red")}</p>
                <p className="font-medium">Rosalina Guest</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Password", "Contraseña")}</p>
                <div className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
                  <span className="font-mono tracking-wider">RosalinaForever1!</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy("RosalinaForever1!", "WiFi Password")}
                    className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    data-testid="button-copy-wifi"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="checkin" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-checkin">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">Check-in / Check-out</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-4 pl-13 text-secondary-foreground">
              <div>
                <p className="font-medium text-foreground">Check-in: 4:00 PM</p>
                <p className="text-sm">{t("(Code sent at 11 AM day of arrival)", "(Código enviado a las 11 AM el día de llegada)")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Check-out: 11:00 AM</p>
                <p className="text-sm">{t("(Return keys to lockbox)", "(Devuelva las llaves a la caja de seguridad)")}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm">
                  {t("Early check-in (1 PM) = $25", "Early check-in (1 PM) = $25")}<br/>
                  {t("Late check-out (1 PM) = $25", "Late check-out (1 PM) = $25")}<br/>
                  <span className="text-muted-foreground text-xs italic">{t("*Subject to availability", "*Sujeto a disponibilidad")}</span>
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pools" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-pools">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Waves className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("Pools & Quiet Hours", "Piscinas y Horas de Silencio")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-3 pl-13 text-secondary-foreground">
              <p>
                {t("2 pools at Ocean Park location. Isla Verde guests have free access (~8 min drive).", "2 piscinas en la ubicación de Ocean Park. Los huéspedes de Isla Verde tienen acceso gratuito (~8 min en auto).")}
              </p>
              <div className="bg-accent/10 text-accent-foreground p-3 rounded-lg mt-2">
                <p className="font-medium">{t("Quiet hours: 10 PM - 8 AM", "Horas de silencio: 10 PM - 8 AM")}</p>
                <p className="text-sm mt-1">{t("No gatherings in common areas after midnight.", "No se permiten reuniones en áreas comunes después de la medianoche.")}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="parking" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-parking">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("Parking & Transport", "Estacionamiento y Transporte")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-3 pl-13 text-secondary-foreground">
              <p>{t("Street parking is available. Ocean Park has limited paid parking nearby.", "Hay estacionamiento en la calle disponible. Ocean Park tiene estacionamiento pago limitado cerca.")}</p>
              <p>{t("Ride share (Uber/Lyft) is highly recommended for airport transport.", "Se recomienda encarecidamente el uso de transporte compartido (Uber/Lyft) para el aeropuerto.")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="address" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-address">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("Addresses", "Direcciones")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-4 pl-13">
              <div>
                <p className="font-medium text-foreground">Ocean Park</p>
                <p className="text-sm text-secondary-foreground mb-2">2020 Av. McLeary, San Juan PR 00911</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{t("5 min walk to beach", "5 min a pie de la playa")}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy("2020 Av. McLeary, San Juan PR 00911", "Ocean Park Address")}
                    className="h-8 text-xs border-border"
                    data-testid="button-copy-address-op"
                  >
                    <Copy className="w-3 h-3 mr-1.5" />
                    {t("Copy", "Copiar")}
                  </Button>
                </div>
              </div>
              
              <div className="h-px bg-border w-full"></div>
              
              <div>
                <p className="font-medium text-foreground">Isla Verde</p>
                <p className="text-sm text-secondary-foreground mb-2">84 Calle Júpiter, Carolina PR 00979</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{t("4 min walk to beach", "4 min a pie de la playa")}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy("84 Calle Júpiter, Carolina PR 00979", "Isla Verde Address")}
                    className="h-8 text-xs border-border"
                    data-testid="button-copy-address-iv"
                  >
                    <Copy className="w-3 h-3 mr-1.5" />
                    {t("Copy", "Copiar")}
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-amenities">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("Amenities", "Comodidades")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <ul className="space-y-2 pl-13 text-secondary-foreground list-disc ml-4 marker:text-primary">
              <li>{t("Self-serve coffee station at main entrance", "Estación de café de autoservicio en la entrada principal")}</li>
              <li>{t("Beach access (short walk)", "Acceso a la playa (corta caminata)")}</li>
              <li>{t("Outdoor seating & common areas", "Asientos al aire libre y áreas comunes")}</li>
              <li>{t("Beach towels available", "Toallas de playa disponibles")}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="restaurants" className="bg-white border border-border rounded-2xl px-2 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 px-2" data-testid="accordion-trigger-restaurants">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("Nearby Restaurants", "Restaurantes Cercanos")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-4 pt-1">
            <div className="space-y-4 pl-13">
              <div>
                <p className="font-medium text-foreground mb-2">Ocean Park (10 min walk)</p>
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  Acapulco Taqueria, Burger & Mayo Lab, Bocca Osteria, Pirilo Pizza, Berlingeri
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Isla Verde (10 min walk)</p>
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  Mande Restaurant, Euphoria, Piccolos, Bistro Café, The New Ceviche
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </section>
  );
}
