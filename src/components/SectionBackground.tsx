// Pure-CSS animated section background.
//
// Replaces the former three.js / WebGL section scenes (Section3DBackground).
// Each `type` maps to a lightweight CSS motif:
//   - "particles" / "nodes" -> drifting blurred orbs + a soft dot grid
//   - "wave"                 -> drifting diagonal wave stripes
// All animation is transform/opacity only and is disabled under
// `prefers-reduced-motion` via globals.css. Ships zero client JS of its own.

type SceneType = "particles" | "nodes" | "wave";

interface SectionBackgroundProps {
  type: SceneType;
  className?: string;
}

export default function SectionBackground({
  type,
  className = "",
}: SectionBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span className="section-orb section-orb-1" />
      <span className="section-orb section-orb-2" />
      {type === "wave" ? (
        <div className="section-wave" />
      ) : (
        <div className="section-grid" />
      )}
    </div>
  );
}
