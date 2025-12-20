"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

// Store the click position globally so ThemeTransition can access it
let clickPosition = { x: 0, y: 0 };

export function setThemeClickPosition(x: number, y: number) {
  clickPosition = { x, y };
}

export default function ThemeTransition() {
  const { resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTheme, setTransitionTheme] = useState<string | undefined>(undefined);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const previousThemeRef = useRef<string | undefined>(undefined);
  const isFirstMount = useRef(true);

  // Calculate the maximum radius needed to cover the entire screen from click point
  const getMaxRadius = useCallback(() => {
    if (typeof window === "undefined") return 2000;
    const maxX = Math.max(origin.x, window.innerWidth - origin.x);
    const maxY = Math.max(origin.y, window.innerHeight - origin.y);
    return Math.sqrt(maxX * maxX + maxY * maxY) * 2.2;
  }, [origin]);

  useEffect(() => {
    // Skip the very first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      previousThemeRef.current = resolvedTheme;
      return;
    }

    // Only animate if theme actually changed
    if (
      resolvedTheme &&
      previousThemeRef.current &&
      previousThemeRef.current !== resolvedTheme
    ) {
      setOrigin({ x: clickPosition.x, y: clickPosition.y });
      setTransitionTheme(resolvedTheme);
      setIsTransitioning(true);

      previousThemeRef.current = resolvedTheme;
    } else {
      previousThemeRef.current = resolvedTheme;
    }
  }, [resolvedTheme]);

  const maxRadius = getMaxRadius();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="theme-bubble"
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{
            scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6, ease: "easeOut" },
          }}
          onAnimationComplete={() => setIsTransitioning(false)}
          className="fixed z-[9999] pointer-events-none rounded-full"
          style={{
            left: origin.x,
            top: origin.y,
            width: maxRadius,
            height: maxRadius,
            marginLeft: -maxRadius / 2,
            marginTop: -maxRadius / 2,
            background:
              transitionTheme === "dark"
                ? "radial-gradient(circle, rgba(125, 211, 252, 0.6) 0%, rgba(56, 189, 248, 0.4) 30%, rgba(14, 165, 233, 0.2) 60%, transparent 80%)"
                : "radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(252, 211, 77, 0.5) 30%, rgba(253, 224, 71, 0.3) 60%, transparent 80%)",
            boxShadow:
              transitionTheme === "dark"
                ? "0 0 100px 50px rgba(125, 211, 252, 0.3), inset 0 0 100px 20px rgba(56, 189, 248, 0.2)"
                : "0 0 100px 50px rgba(251, 191, 36, 0.4), inset 0 0 100px 20px rgba(252, 211, 77, 0.3)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
