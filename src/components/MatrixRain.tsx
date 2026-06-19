"use client";

import { useEffect, useRef } from "react";

// Global "matrix" code-rain backdrop rendered on a single fixed canvas.
// Sits behind all page content (-z-10) at low opacity so headings stay crisp.
// Honors prefers-reduced-motion by painting one static dim glyph field.
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = canvas.offsetWidth;
      cssHeight = canvas.offsetHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(cssWidth / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * cssHeight) / fontSize) * -1
      );
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
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
      ctx.fillStyle = "rgba(5, 8, 6, 0.12)";
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      for (let i = 0; i < columns; i++) {
        const char = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Occasional bright "lead" glyph, otherwise phosphor green.
        ctx.fillStyle = Math.random() > 0.97 ? "#d6ffe0" : "#00ff9c";
        ctx.fillText(char, x, y);

        if (y > cssHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.fillStyle = "rgba(0, 255, 156, 0.12)";
      for (let i = 0; i < columns; i++) {
        const runs = 2 + ((Math.random() * 3) | 0);
        for (let r = 0; r < runs; r++) {
          const char = glyphs[(Math.random() * glyphs.length) | 0];
          const y = ((Math.random() * cssHeight) / fontSize | 0) * fontSize;
          ctx.fillText(char, i * fontSize, y);
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
