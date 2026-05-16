"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * HoverPrefetch is a global utility component that automatically triggers 
 * Next.js route prefetching when a user hovers over any link on the page.
 * 
 * While next/link does this by default, this global listener ensures that 
 * even dynamically injected links or standard <a> tags (within the same origin)
 * benefit from instant prefetching, making the application feel extremely snappy.
 */
export function HoverPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) &&
        !anchor.href.includes("#") &&
        !anchor.getAttribute("download") &&
        anchor.target !== "_blank"
      ) {
        try {
          const url = new URL(anchor.href);
          const path = url.pathname + url.search;
          
          // Trigger the prefetch
          router.prefetch(path);
        } catch (err) {
          // Ignore invalid URLs
        }
      }
    };

    // Use mouseover for event delegation
    document.addEventListener("mouseover", handleHover, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleHover);
    };
  }, [router]);

  return null;
}
