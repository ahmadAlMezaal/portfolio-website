export const HeroBackground = () => {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="hero-glow" />
      <div className="scanlines" />
    </div>
  );
};
