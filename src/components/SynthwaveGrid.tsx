"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion, useScrollSurge } from "@/lib/hooks";

const GRID_CELL = 44;
const GLOW_TRAVEL = 300;
const ADVANCE_PER_FRAME = 4;
const SURGE_DECAY = 0.93;

const SynthwaveGrid = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const advanceRef = useRef(0);
  const rafRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const startSurge = useCallback((surgeRef: React.RefObject<number>) => {
    if (rafRef.current) return;

    const step = () => {
      const grid = gridRef.current;
      surgeRef.current *= SURGE_DECAY;
      if (!grid || surgeRef.current < 0.01) {
        surgeRef.current = 0;
        rafRef.current = 0;
        return;
      }
      advanceRef.current =
        (advanceRef.current + surgeRef.current * ADVANCE_PER_FRAME) % GRID_CELL;
      grid.style.setProperty(
        "--grid-advance",
        `${advanceRef.current.toFixed(2)}px`
      );
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useScrollSurge({ enabled: !prefersReducedMotion, onSurge: startSurge });

  useEffect(() => {
    if (prefersReducedMotion) return;
    let pending = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (pending) return;
      const { clientX } = event;
      pending = requestAnimationFrame(() => {
        pending = 0;
        const shift = (clientX / window.innerWidth - 0.5) * GLOW_TRAVEL;
        glowRef.current?.style.setProperty("--glow-shift", `${shift.toFixed(1)}px`);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(pending);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div ref={glowRef} className="synthwave-glow" aria-hidden="true" />
      <div ref={gridRef} className="synthwave-grid" aria-hidden="true" />
      <div className="crt-overlay crt-overlay-soft" aria-hidden="true" />
    </>
  );
};

export default SynthwaveGrid;
