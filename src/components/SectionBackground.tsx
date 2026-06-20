// Section background accents layered over the global <MatrixRain> canvas:
// a soft green glow plus very faint CRT scanlines. The `type` prop is kept
// for call-site compatibility but the terminal motif is uniform site-wide.
type SceneType = "particles" | "nodes" | "wave";

interface SectionBackgroundProps {
  type?: SceneType;
  className?: string;
}

export default function SectionBackground({
  className = "",
}: SectionBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="section-glow" />
      <div className="scanlines scanlines-faint" />
    </div>
  );
}
