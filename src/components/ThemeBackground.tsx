"use client";

import { useTheme } from "./ThemeProvider";
import MatrixRain from "./MatrixRain";

// Swaps the whole background motif per theme, not just the palette.
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
