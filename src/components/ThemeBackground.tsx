"use client";

import { useTheme } from "./ThemeProvider";
import MatrixRain from "./MatrixRain";

// Swaps the whole background motif per theme:
//  - matrix    → falling code-rain canvas
//  - cyberpunk → synthwave perspective grid + horizon glow + soft scanlines
//  - amber     → CRT scanlines + flicker + roll bar + warm vignette
export default function ThemeBackground() {
  const { theme } = useTheme();

  if (theme === "cyberpunk") {
    return (
      <>
        <div className="synthwave-glow" aria-hidden="true" />
        <div className="synthwave-grid" aria-hidden="true" />
        <div className="crt-overlay crt-overlay-soft" aria-hidden="true" />
      </>
    );
  }

  if (theme === "amber") {
    return (
      <>
        <div className="amber-vignette" aria-hidden="true" />
        <div className="crt-overlay" aria-hidden="true" />
      </>
    );
  }

  // matrix (default)
  return <MatrixRain />;
}
