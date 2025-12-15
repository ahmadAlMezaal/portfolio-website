// =============================================================================
// CUSTOM HOOKS FOR PERFORMANCE OPTIMIZATION
// =============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to detect if the user is on a mobile device.
 * Uses both media query and touch detection for reliability.
 * Returns false during SSR to avoid hydration mismatch.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check media query
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Also consider touch capability as a mobile indicator
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const checkMobile = () => {
      setIsMobile(mediaQuery.matches || (isTouchDevice && window.innerWidth <= breakpoint));
    };

    checkMobile();
    mediaQuery.addEventListener("change", checkMobile);

    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to detect if user prefers reduced motion.
 * Respects system accessibility settings.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Combined hook that returns true if animations should be reduced.
 * True when: on mobile OR user prefers reduced motion.
 */
export function useShouldReduceMotion(): boolean {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return isMobile || prefersReducedMotion;
}

/**
 * Hook for throttled scroll position tracking.
 * Uses requestAnimationFrame for optimal performance.
 * @param threshold - Scroll position threshold to track (default: 0)
 * @returns Whether scroll position is past the threshold
 */
export function useScrollPosition(threshold: number = 0): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current !== null) {
        return; // Already have a pending update
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update state if we crossed the threshold
        const wasPast = lastScrollY.current > threshold;
        const isPast = currentScrollY > threshold;

        if (wasPast !== isPast) {
          setIsPastThreshold(isPast);
        }

        lastScrollY.current = currentScrollY;
        rafRef.current = null;
      });
    };

    // Check initial position
    setIsPastThreshold(window.scrollY > threshold);
    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [threshold]);

  return isPastThreshold;
}

/**
 * Hook for throttled scroll tracking with callback.
 * Useful when you need more control over scroll handling.
 * @param callback - Function to call with scroll position
 * @param deps - Dependencies for the callback
 */
export function useThrottledScroll(
  callback: (scrollY: number) => void,
  deps: React.DependencyList = []
): void {
  const rafRef = useRef<number | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableCallback = useCallback(callback, deps);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        stableCallback(window.scrollY);
        rafRef.current = null;
      });
    };

    // Initial call
    stableCallback(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [stableCallback]);
}
