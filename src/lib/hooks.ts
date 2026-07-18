import { useState, useEffect, useCallback, useRef } from "react";

// Detects mobile via media query + touch; returns false during SSR to avoid hydration mismatch.
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
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

// True on mobile or when the user prefers reduced motion.
export function useShouldReduceMotion(): boolean {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return isMobile || prefersReducedMotion;
}

// rAF-throttled "scrolled past threshold" flag.
export function useScrollPosition(threshold: number = 0): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        const wasPast = lastScrollY.current > threshold;
        const isPast = currentScrollY > threshold;

        if (wasPast !== isPast) {
          setIsPastThreshold(isPast);
        }

        lastScrollY.current = currentScrollY;
        rafRef.current = null;
      });
    };

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

// Clipboard copy with transient "copied" flag; falls back to textarea + execCommand on insecure contexts.
export function useClipboard(resetMs: number = 2000): {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }

      if (ok) {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs);
      }
      return ok;
    },
    [resetMs]
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return { copied, copy };
}

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
