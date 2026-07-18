// CSS-only accents over the MatrixRain canvas; motion auto-disabled under prefers-reduced-motion via globals.css.
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
