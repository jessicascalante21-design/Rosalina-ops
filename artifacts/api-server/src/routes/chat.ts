import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const chatRouter = Router();

const ROSALINA_SYSTEM_PROMPT = `You are Rosa, the AI concierge for Rosalina Boutique Hotels in Puerto Rico. You assist guests warmly and concisely.

We have two boutique properties:
• Ocean Park (San Juan) — a quiet residential neighborhood, steps from the beach. Pool on-site. Perfect for relaxed, local-feel stays.
• Isla Verde (Carolina) — vibrant beach area near Luis Muñoz Marín Airport. Ideal for guests arriving by air or wanting nightlife nearby.

Key guest information:
- Wi-Fi: Network "Rosalina Guest" / Password: RosalinaForever1!
- Check-in: 4:00 PM | Check-out: 11:00 AM
- Early check-in (1 PM) or late check-out (1 PM): $25 each, subject to availability
- Concierge hours: 8 AM – 2 AM daily
- Emergency line 24/7: 787-438-9393
- Main concierge line: 787-304-3335
- WhatsApp: +1 787-438-9393
- Email: contact@rosalinapr.com
- Lockbox codes are sent at 11 AM on arrival day
- No pets (exception: certified service dogs per PR law)
- Quiet hours: 10 PM – 8 AM
- Pool: available at Ocean Park location
- Beach: 4–8 minute walk from both properties
- Complimentary coffee station at main entrance
- No room service or full breakfast
- 3 rooms have full kitchen; all rooms have microwave and mini-fridge
- Luggage storage available at Ocean Park until 4 PM
- Live video concierge via Google Meet: meet.google.com/rcs-ugkv-cyk

Personality: warm, professional, brief. Keep answers to 2–3 sentences unless more is clearly needed. For urgent issues always provide the 24/7 line. Never make up info not listed above — say you'll connect them with the team instead.`;

chatRouter.post("/chat", async (req, res) => {
  try {
    const { messages, property } = req.body;

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array" });
      return;
    }

    const systemContent = property
      ? `${ROSALINA_SYSTEM_PROMPT}\n\nGuest is staying at our ${property} property.`
      : ROSALINA_SYSTEM_PROMPT;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 400,
      messages: [
        { role: "system", content: systemContent },
        ...messages.slice(-10),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    res.write(`data: ${JSON.stringify({ error: "Unable to respond. Please try again." })}\n\n`);
    res.end();
  }
});

export default chatRouter;
