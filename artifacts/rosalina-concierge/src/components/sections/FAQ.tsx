import { useLanguage } from "@/lib/language-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useLanguage();

  const faqs = [
    {
      id: "q1",
      q: t("I didn't get the lockbox code", "No recibí el código de la caja de seguridad"),
      a: t("Codes are sent at 11 AM on the day of arrival. If it's past 11 AM and you haven't received it, please start a live chat or call 787-304-3335.", "Los códigos se envían a las 11 AM el día de llegada. Si son más de las 11 AM y no lo ha recibido, inicie un chat en vivo o llame al 787-304-3335.")
    },
    {
      id: "q2",
      q: t("Can I check in early or check out late?", "¿Puedo hacer check-in temprano o check-out tarde?"),
      a: t("Early check-in (1 PM) and late check-out (1 PM) are $25 each, subject to availability. Please ask us first via the Service Request form.", "El check-in temprano (1 PM) y check-out tarde (1 PM) cuestan $25 cada uno, sujeto a disponibilidad. Por favor pregúntenos primero mediante el formulario de Solicitudes.")
    },
    {
      id: "q3",
      q: t("Is there breakfast or room service?", "¿Hay desayuno o servicio a la habitación?"),
      a: t("As a boutique hotel, we do not offer room service or a full breakfast. However, we have a complimentary coffee station at the main entrance, and there are over 10 restaurants within walking distance.", "Como hotel boutique, no ofrecemos servicio a la habitación ni desayuno completo. Sin embargo, tenemos una estación de café gratuita en la entrada y más de 10 restaurantes a poca distancia a pie.")
    },
    {
      id: "q4",
      q: t("Is there a kitchen in the room?", "¿Hay cocina en la habitación?"),
      a: t("Only 3 of our rooms feature a full kitchen. However, all rooms are equipped with a microwave and a mini-fridge for your convenience.", "Solo 3 de nuestras habitaciones tienen cocina completa. Sin embargo, todas las habitaciones están equipadas con microondas y mini-nevera.")
    },
    {
      id: "q5",
      q: t("Can I store my luggage before check-in or after check-out?", "¿Puedo guardar mi equipaje antes del check-in o después del check-out?"),
      a: t("Yes, at our Ocean Park location. Please call us when you arrive to arrange storage. Luggage storage is available until 4 PM.", "Sí, en nuestra ubicación de Ocean Park. Llámenos cuando llegue para coordinarlo. El almacenamiento de equipaje está disponible hasta las 4 PM.")
    },
    {
      id: "q6",
      q: t("The AC or TV is not working", "El aire acondicionado o la TV no funciona"),
      a: t("We treat AC issues as urgent. Please use the Live Assistance form or call 787-304-3335 immediately.", "Tratamos los problemas de A/C como urgentes. Por favor use el formulario de Asistencia en Vivo o llame al 787-304-3335 de inmediato.")
    },
    {
      id: "q7",
      q: t("Are pets allowed?", "¿Se permiten mascotas?"),
      a: t("No pets are allowed. The only exception is for certified service dogs as required by PR law (no proof can be requested).", "No se permiten mascotas. La única excepción son los perros de servicio certificados según lo requiere la ley de PR (no se puede solicitar prueba).")
    },
    {
      id: "q8",
      q: t("What are the quiet hours?", "¿Cuáles son las horas de silencio?"),
      a: t("Quiet hours are from 10 PM to 8 AM. To respect all guests, no gatherings are allowed in common areas after midnight.", "Las horas de silencio son de 10 PM a 8 AM. Para respetar a todos los huéspedes, no se permiten reuniones en áreas comunes después de la medianoche.")
    },
    {
      id: "q9",
      q: t("How do I access the pool?", "¿Cómo accedo a la piscina?"),
      a: t("Pools are located at our Ocean Park property. Please ask at reception for pool wristbands or access cards.", "Las piscinas están en nuestra propiedad de Ocean Park. Por favor pida en recepción las pulseras o tarjetas de acceso.")
    },
    {
      id: "q10",
      q: t("Is beach access included?", "¿El acceso a la playa está incluido?"),
      a: t("Yes! Both our Ocean Park and Isla Verde locations are just a 4-8 minute walk to beautiful beaches. Beach towels are available upon request.", "¡Sí! Nuestras ubicaciones de Ocean Park e Isla Verde están a solo 4-8 minutos a pie de hermosas playas. Tenemos toallas de playa disponibles si las solicita.")
    }
  ];

  return (
    <section id="faq" className="py-16 px-6 md:px-8">
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-foreground mb-3">
          {t("Frequently Asked Questions", "Preguntas Frecuentes")}
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="bg-white border border-border rounded-xl px-4 shadow-sm">
            <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-[15px] leading-snug">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
