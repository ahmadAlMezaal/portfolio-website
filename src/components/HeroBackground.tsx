// Hero background accents that layer over the global <MatrixRain> canvas:
// a breathing green glow pool plus faint CRT scanlines. Pure CSS, zero JS,
// motion auto-disabled under `prefers-reduced-motion` via globals.css.
export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="hero-glow" />
      <div className="scanlines" />
    </div>
  );
}
