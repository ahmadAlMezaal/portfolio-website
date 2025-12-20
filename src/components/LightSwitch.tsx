"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface LightBulbProps {
  isOn: boolean;
  className?: string;
}

export default function LightBulb({ isOn, className = "" }: LightBulbProps) {
  const cordControls = useAnimation();
  const beadControls = useAnimation();

  // Trigger pull animation when isOn changes
  useEffect(() => {
    const animatePull = async () => {
      // Pull down
      await Promise.all([
        cordControls.start({
          scaleY: 1.4,
          transition: { duration: 0.15, ease: "easeOut" },
        }),
        beadControls.start({
          y: 6,
          transition: { duration: 0.15, ease: "easeOut" },
        }),
      ]);
      // Bounce back
      await Promise.all([
        cordControls.start({
          scaleY: 1,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }),
        beadControls.start({
          y: 0,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }),
      ]);
    };

    animatePull();
  }, [isOn, cordControls, beadControls]);

  return (
    <div className={`relative w-6 h-10 ${className}`}>
      {/* Bulb glow effect when on */}
      {isOn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-1 -left-1 -right-1 h-7 rounded-full bg-yellow-400/40 blur-md"
        />
      )}

      {/* Light bulb SVG */}
      <svg
        viewBox="0 0 24 40"
        fill="none"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Light rays when on */}
        {isOn && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <line x1="12" y1="1" x2="12" y2="-1" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="4" x2="3.5" y2="2.5" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19" y1="4" x2="20.5" y2="2.5" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="10" x2="0" y2="10" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="10" x2="24" y2="10" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        )}

        {/* Bulb glass */}
        <motion.path
          d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
          initial={false}
          animate={{
            fill: isOn ? "#FDE047" : "#6B7280",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Bulb base/screw */}
        <motion.rect
          x="9"
          y="18"
          width="6"
          height="2"
          rx="0.5"
          initial={false}
          animate={{ fill: isOn ? "#A16207" : "#4B5563" }}
          transition={{ duration: 0.2 }}
        />
        <motion.rect
          x="9"
          y="20"
          width="6"
          height="2"
          rx="0.5"
          initial={false}
          animate={{ fill: isOn ? "#854D0E" : "#374151" }}
          transition={{ duration: 0.2 }}
        />

        {/* Pull cord */}
        <motion.line
          x1="12"
          y1="22"
          x2="12"
          y2="32"
          stroke={isOn ? "#854D0E" : "#374151"}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ scaleY: 1 }}
          animate={cordControls}
          style={{ originY: 0, originX: "50%" }}
        />

        {/* Pull cord bead/handle */}
        <motion.circle
          cx="12"
          cy="34"
          r="2.5"
          initial={{ y: 0 }}
          animate={beadControls}
          fill={isOn ? "#FDE047" : "#9CA3AF"}
          stroke={isOn ? "#A16207" : "#6B7280"}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
