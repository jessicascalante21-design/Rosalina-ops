import { useEffect } from "react";

interface PageHeadProps {
  title: string;
  description?: string;
}

export default function PageHead({ title, description }: PageHeadProps) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | Rosalina Boutique Hotels`;
    const meta = document.querySelector('meta[name="description"]');
    if (description && meta) {
      const prevDesc = meta.getAttribute("content");
      meta.setAttribute("content", description);
      return () => {
        document.title = prev;
        if (prevDesc) meta.setAttribute("content", prevDesc);
      };
    }
    return () => { document.title = prev; };
  }, [title, description]);

  return null;
}
