"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

// ↑ ↑ ↓ ↓ ← → ← → B A
const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const GLYPHS = "01ｱｦｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ{}[]<>=+*/".split("");

type Glyph = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  char: string;
  size: number;
};

function makeGlyphs(count: number): Glyph[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.4 + Math.random() * 2.2,
    char: GLYPHS[(Math.random() * GLYPHS.length) | 0],
    size: 14 + Math.random() * 22,
  }));
}

export default function KonamiEasterEgg() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [color, setColor] = useState("#00ff9c");
  const progress = useRef(0);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
      if (key === SEQUENCE[progress.current]) {
        progress.current++;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          trigger();
        }
      } else {
        // Allow a mistake to restart cleanly if it matches the first key.
        progress.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    const trigger = () => {
      const rain = getComputedStyle(document.documentElement)
        .getPropertyValue("--rain")
        .trim();
      setColor(rain || "#00ff9c");
      setGlyphs(makeGlyphs(prefersReducedMotion ? 0 : 46));
      setActive(true);
      if (dismissRef.current) clearTimeout(dismissRef.current);
      dismissRef.current = setTimeout(() => setActive(false), 4500);
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Falling glyph confetti */}
          {glyphs.map((g) => (
            <motion.span
              key={g.id}
              className="absolute font-mono font-bold"
              style={{
                left: `${g.left}%`,
                top: 0,
                fontSize: g.size,
                color,
                textShadow: `0 0 8px ${color}`,
              }}
              initial={{ y: "-10vh", opacity: 0 }}
              animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: g.duration,
                delay: g.delay,
                ease: "linear",
              }}
            >
              {g.char}
            </motion.span>
          ))}

          {/* Banner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="rounded-xl border px-8 py-5 text-center font-mono backdrop-blur-sm"
              style={{
                borderColor: `${color}88`,
                backgroundColor: "rgba(0,0,0,0.7)",
                boxShadow: `0 0 30px ${color}55`,
              }}
            >
              <p
                className="text-2xl font-bold tracking-widest"
                style={{ color, textShadow: `0 0 12px ${color}` }}
              >
                ▓▒░ ACCESS GRANTED ░▒▓
              </p>
              <p className="mt-2 text-xs text-gray-300">
                {"// you found the secret"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
