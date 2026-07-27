"use client";

import { useEffect, useRef } from "react";
import { randomGlyph } from "@/lib/glyphs";
import { useScrollSurge } from "@/lib/hooks";

const WAKE_RADIUS = 190;
const GLOW_RADIUS = 240;
const REST_INTERVAL = 55;
const SURGE_INTERVAL = 26;

// Code-rain canvas (matrix theme only); reads rain colours from CSS vars, honours prefers-reduced-motion.
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surgeRef = useScrollSurge();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const rainColor = root.getPropertyValue("--rain").trim() || "#00ff9c";
    const leadColor = root.getPropertyValue("--rain-lead").trim() || "#d6ffe0";
    const washColor = root.getPropertyValue("--rain-bg").trim() || "rgba(5, 8, 6, 0.12)";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];
    let lastRows: number[] = [];
    let speeds: number[] = [];
    let heads: string[] = [];
    let cssWidth = 0;
    let cssHeight = 0;

    // Defined before resize() so resize can repaint it under reduced motion.
    const drawStatic = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = rainColor;
      for (let i = 0; i < columns; i++) {
        const runs = 2 + ((Math.random() * 3) | 0);
        for (let r = 0; r < runs; r++) {
          const y = ((Math.random() * cssHeight) / fontSize | 0) * fontSize;
          ctx.fillText(randomGlyph(), i * fontSize, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = canvas.offsetWidth;
      cssHeight = canvas.offsetHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const newColumns = Math.ceil(cssWidth / fontSize);
      // Preserve existing column positions so resizing doesn't reset the
      // animation (which would flicker); only seed newly-added columns.
      drops = Array.from({ length: newColumns }, (_, i) =>
        i < drops.length
          ? drops[i]
          : Math.floor((Math.random() * cssHeight) / fontSize) * -1
      );
      lastRows = Array.from({ length: newColumns }, (_, i) =>
        i < lastRows.length ? lastRows[i] : Math.floor(drops[i])
      );
      speeds = Array.from({ length: newColumns }, (_, i) =>
        i < speeds.length ? speeds[i] : 0.55 + Math.random() * 0.9
      );
      heads = Array.from({ length: newColumns }, (_, i) =>
        i < heads.length ? heads[i] : ""
      );
      columns = newColumns;

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      // Resizing clears the canvas; repaint the static field for reduced motion.
      if (reduceMotion) drawStatic();
    };

    resize();
    window.addEventListener("resize", resize);

    let pointerX = -1;
    let pointerY = -1;
    let pointerActive = false;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
    };

    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    let last = 0;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      // Throttle to ~18fps: cheaper and gives the deliberate terminal cadence.
      const interval =
        REST_INTERVAL - surgeRef.current * (REST_INTERVAL - SURGE_INTERVAL);
      if (time - last < interval) return;
      last = time;
      surgeRef.current *= 0.9;
      const surge = surgeRef.current;

      // Translucent wash creates the trailing fade.
      ctx.fillStyle = washColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;

        let wake = 0;
        let glow = 0;
        if (pointerActive) {
          const dx = Math.abs(pointerX - x);
          if (dx < WAKE_RADIUS) wake = 1 - dx / WAKE_RADIUS;
          const dy = pointerY - drops[i] * fontSize;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GLOW_RADIUS) glow = 1 - dist / GLOW_RADIUS;
        }

        const prevRow = lastRows[i];
        drops[i] += speeds[i] * (1 + surge * 2.2 + wake * 2.6);
        const row = Math.floor(drops[i]);

        if (row !== prevRow) {
          ctx.fillStyle = glow > 0.5 ? leadColor : rainColor;
          for (let r = Math.max(prevRow, row - 5); r < row; r++) {
            const y = r * fontSize;
            if (y < 0 || y > cssHeight) continue;
            ctx.fillText(r === prevRow && heads[i] ? heads[i] : randomGlyph(), x, y);
          }
          lastRows[i] = row;
        }

        const headY = row * fontSize;
        if (headY >= 0 && headY <= cssHeight) {
          const glyph = randomGlyph();
          heads[i] = glyph;
          ctx.fillStyle = leadColor;
          if (glow > 0) {
            ctx.shadowColor = leadColor;
            ctx.shadowBlur = 12 * glow;
          }
          ctx.fillText(glyph, x, headY);
          ctx.shadowBlur = 0;
        }

        if (headY > cssHeight && Math.random() > 0.975) {
          drops[i] = -(Math.random() * 18);
          lastRows[i] = Math.floor(drops[i]);
          speeds[i] = 0.55 + Math.random() * 0.9;
          heads[i] = "";
        }
      }
    };

    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [surgeRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-40"
    />
  );
}
