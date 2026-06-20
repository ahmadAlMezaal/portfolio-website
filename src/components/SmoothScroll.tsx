"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

// Buttery momentum/inertia scrolling (à la Webflow agency sites) via Lenis.
// Runs in `root` mode so it drives the real window scroll — native scroll
// events still fire, so IntersectionObserver and the scroll hooks keep working.
// Disabled entirely under prefers-reduced-motion.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09, // lower = more glide
        smoothWheel: true,
        anchors: true, // smooth-scroll in-page #anchor links
      }}
    >
      {children}
    </ReactLenis>
  );
}
