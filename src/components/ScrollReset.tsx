"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ScrollReset = () => {
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
};

export default ScrollReset;
