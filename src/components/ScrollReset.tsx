"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Lenis (root mode) keeps its scroll target across client navigations, so a
// link clicked mid-scroll carries momentum onto the next route and can land
// you partway down — or at the clamped bottom of a shorter page. Reset to the
// top on every path change, but leave hash navigations alone so in-page
// anchor links still reach their target.
export default function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (window.location.hash) return;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
