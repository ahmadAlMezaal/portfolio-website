// Pure-CSS animated hero background.
//
// Replaces the former three.js / WebGL particle scene (HeroBackground3D).
// Uses only GPU-friendly transform/opacity animations on a handful of blurred
// gradient orbs plus a subtle dot grid. No JavaScript runtime, no WebGL, and
// it ships zero client JS of its own. Motion is disabled automatically under
// `prefers-reduced-motion` via globals.css.
export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <span className="hero-orb hero-orb-1" />
      <span className="hero-orb hero-orb-2" />
      <span className="hero-orb hero-orb-3" />
      <span className="hero-orb hero-orb-4" />
      <div className="hero-grid" />
    </div>
  );
}
