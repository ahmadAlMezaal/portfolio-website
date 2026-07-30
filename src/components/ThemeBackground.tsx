"use client";

import { useTheme } from "./ThemeProvider";
import MatrixRain from "./MatrixRain";
import SynthwaveGrid from "./SynthwaveGrid";

export default function ThemeBackground() {
  const { theme } = useTheme();

  if (theme === "cyberpunk") {
    return <SynthwaveGrid />;
  }

  if (theme === "amber") {
    return (
      <>
        <div className="amber-vignette" aria-hidden="true" />
        <div className="crt-overlay" aria-hidden="true" />
      </>
    );
  }

  return <MatrixRain />;
}
