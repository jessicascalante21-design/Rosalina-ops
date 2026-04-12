import { useState, useEffect } from "react";

/**
 * Returns true when it is the after-hours window: 2:00 AM – 8:00 AM.
 * During this window, the Video Meet is offline and the emergency
 * line (787-438-9393) becomes the primary contact channel.
 */
export function useAfterHours() {
  const [afterHours, setAfterHours] = useState(() => {
    const h = new Date().getHours();
    return h >= 2 && h < 8;
  });

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setAfterHours(h >= 2 && h < 8);
    };
    const iv = setInterval(check, 60_000);
    return () => clearInterval(iv);
  }, []);

  return afterHours;
}
