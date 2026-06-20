"use client";

import { useEffect, useRef } from "react";

// Matrix-only code-rain backdrop (rendered solely for the matrix theme by
// ThemeBackground). Fixed canvas behind content at low opacity; reads the
// matrix rain colors from CSS vars. Honors prefers-reduced-motion.
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pull the active theme's rain colors from CSS custom properties.
    const root = getComputedStyle(document.documentElement);
    const rainColor = root.getPropertyValue("--rain").trim() || "#00ff9c";
    const leadColor = root.getPropertyValue("--rain-lead").trim() || "#d6ffe0";
    const washColor = root.getPropertyValue("--rain-bg").trim() || "rgba(5, 8, 6, 0.12)";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Katakana + binary + a few operators read as "code".
    const glyphs =
      "01ｱｦｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎ{}[]<>=+*/".split("");
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];
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
          const char = glyphs[(Math.random() * glyphs.length) | 0];
          const y = ((Math.random() * cssHeight) / fontSize | 0) * fontSize;
          ctx.fillText(char, i * fontSize, y);
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
      columns = newColumns;

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      // Resizing clears the canvas; repaint the static field for reduced motion.
      if (reduceMotion) drawStatic();
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      // Throttle to ~18fps: cheaper and gives the deliberate terminal cadence.
      if (time - last < 55) return;
      last = time;

      // Translucent wash creates the trailing fade.
      ctx.fillStyle = washColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Only draw glyphs that are actually on-screen to save CPU.
        if (y >= 0 && y <= cssHeight) {
          const char = glyphs[(Math.random() * glyphs.length) | 0];
          // Occasional bright "lead" glyph, otherwise the theme rain color.
          ctx.fillStyle = Math.random() > 0.97 ? leadColor : rainColor;
          ctx.fillText(char, x, y);
        }

        if (y > cssHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-40"
    />
  );
}
