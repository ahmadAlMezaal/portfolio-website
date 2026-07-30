"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { randomGlyph } from "@/lib/glyphs";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useTheme } from "./ThemeProvider";

type Trigger = "idle" | "view" | "hover";

const CHURN_MS = 45;
const REVEAL_MS = 50;
const SETTLE_MS = 240;
const IDLE_CYCLE_MS = 9000;

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  trigger?: Trigger;
  offsetMs?: number;
};

export const DecodeText = ({
  text,
  className,
  style,
  trigger = "hover",
  offsetMs = 0,
}: Props) => {
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrambled, setScrambled] = useState<string | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  const active = theme === "matrix" && !prefersReducedMotion;

  const pinWidth = useCallback(() => {
    const outer = ref.current;
    const inner = innerRef.current;
    if (!outer || !inner || inner.style.minWidth) return;
    const width = outer.offsetWidth || outer.getBoundingClientRect().width;
    if (!width) return;
    inner.style.display = "inline-block";
    inner.style.minWidth = `${width}px`;
  }, []);

  const releaseWidth = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.display = "";
    inner.style.minWidth = "";
  }, []);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pinWidth();
    const chars = [...text];
    const total = chars.length * REVEAL_MS + SETTLE_MS;
    const start = performance.now();
    let lastChurn = -CHURN_MS;

    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= total) {
        releaseWidth();
        setScrambled(null);
        return;
      }
      if (elapsed - lastChurn >= CHURN_MS) {
        lastChurn = elapsed;
        setScrambled(
          chars
            .map((char, i) =>
              char.trim() === "" || elapsed > i * REVEAL_MS + SETTLE_MS
                ? char
                : randomGlyph()
            )
            .join("")
        );
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, pinWidth, releaseWidth]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    releaseWidth();
    setScrambled(null);
  }, [releaseWidth]);

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return stop;

    if (trigger === "idle") {
      let loop: ReturnType<typeof setInterval>;
      const first = setTimeout(() => {
        run();
        loop = setInterval(run, IDLE_CYCLE_MS);
      }, 400 + offsetMs);
      return () => {
        clearTimeout(first);
        clearInterval(loop);
        stop();
      };
    }

    if (trigger === "view") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) run();
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
        stop();
      };
    }

    const target = el.closest(".glitch-box") ?? el;
    target.addEventListener("pointerenter", run);
    target.addEventListener("focusin", run);
    return () => {
      target.removeEventListener("pointerenter", run);
      target.removeEventListener("focusin", run);
      stop();
    };
  }, [active, trigger, offsetMs, run, stop]);

  return (
    <span ref={ref} className={className} style={style} data-text={text}>
      <span className="sr-only">{text}</span>
      <span ref={innerRef} aria-hidden="true">
        {scrambled ?? text}
      </span>
    </span>
  );
};
