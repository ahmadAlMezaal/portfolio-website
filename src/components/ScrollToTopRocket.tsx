"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Rocket } from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const SCROLL_THRESHOLD = 300; // px before button appears
const ANIMATION_DURATION = 800; // ms for rocket launch
const ROCKET_EXIT_DISTANCE = -200; // vh units to fly off screen
const BUTTON_SIZE = 48; // px
const BUTTON_OFFSET = 24; // px from edges

// ============================================================================
// TYPES
// ============================================================================

type RocketState = "idle" | "launching" | "launched";

// ============================================================================
// AUDIO UTILITY
// ============================================================================

function playRocketSound() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create a "whoosh" sound using oscillators and filters
    const duration = 0.6;
    const now = audioContext.currentTime;

    // Main whoosh oscillator (noise-like with rapid frequency sweep)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Configure filter for whoosh effect
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + duration * 0.3);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.value = 2;

    // Frequency sweep for rocket launch feel
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + duration * 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(1200, now + duration);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + duration * 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Add a subtle high-frequency hiss
    const noiseOsc = audioContext.createOscillator();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();

    noiseOsc.type = "square";
    noiseOsc.frequency.setValueAtTime(3000, now);
    noiseOsc.frequency.exponentialRampToValueAtTime(6000, now + duration);

    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 2000;

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseOsc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration);
    noiseOsc.start(now);
    noiseOsc.stop(now + duration);

    // Cleanup
    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
  } catch {
    // Audio not supported or blocked - fail silently
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ScrollToTopRocket() {
  const [isVisible, setIsVisible] = useState(false);
  const [rocketState, setRocketState] = useState<RocketState>("idle");
  const prefersReducedMotion = useReducedMotion();
  const isLaunchingRef = useRef(false);

  // Track scroll position to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      // Don't update visibility while launching
      if (isLaunchingRef.current) return;

      const shouldShow = window.scrollY > SCROLL_THRESHOLD;
      setIsVisible(shouldShow);

      // Reset to idle when becoming visible again
      if (shouldShow && rocketState === "launched") {
        setRocketState("idle");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [rocketState]);

  // Handle launch sequence
  const handleLaunch = useCallback(() => {
    if (isLaunchingRef.current || rocketState === "launching") return;

    // Lock launch state
    isLaunchingRef.current = true;
    setRocketState("launching");

    // Play sound (unless reduced motion)
    if (!prefersReducedMotion) {
      playRocketSound();
    }

    // Perform scroll
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    if (prefersReducedMotion) {
      // Reduced motion: instant scroll, simple fade
      scrollToTop();
      setIsVisible(false);
      setRocketState("launched");
      isLaunchingRef.current = false;
      return;
    }

    // Start scroll with slight delay to sync with animation
    setTimeout(scrollToTop, 50);

    // Complete animation sequence
    setTimeout(() => {
      setRocketState("launched");
      setIsVisible(false);
      isLaunchingRef.current = false;
    }, ANIMATION_DURATION + 100);
  }, [rocketState, prefersReducedMotion]);

  // Animation variants for the container
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for the rocket launch
  const rocketLaunchVariants = {
    idle: {
      y: 0,
      opacity: 1,
      rotate: 0,
    },
    launching: {
      y: `${ROCKET_EXIT_DISTANCE}vh`,
      opacity: [1, 1, 0.8, 0],
      rotate: [-2, 2, -1, 1, 0],
      transition: {
        duration: ANIMATION_DURATION / 1000,
        ease: [0.45, 0, 0.55, 1] as const,
        opacity: {
          times: [0, 0.5, 0.8, 1],
          duration: ANIMATION_DURATION / 1000,
        },
        rotate: {
          duration: 0.3,
          repeat: 2,
          ease: "easeInOut" as const,
        },
      },
    },
    launched: {
      y: `${ROCKET_EXIT_DISTANCE}vh`,
      opacity: 0,
    },
  };

  // Glow trail animation
  const glowTrailVariants = {
    idle: {
      opacity: 0,
      scaleY: 0,
      y: 0,
    },
    launching: {
      opacity: [0, 1, 0.8, 0.4, 0],
      scaleY: [0, 1, 1.5, 2, 3],
      y: [0, 5, 15, 30, 50],
      transition: {
        duration: ANIMATION_DURATION / 1000,
        ease: "easeOut" as const,
      },
    },
    launched: {
      opacity: 0,
      scaleY: 0,
    },
  };

  // Particle animation for exhaust effect
  const particleVariants = {
    idle: { opacity: 0, scale: 0 },
    launching: (i: number) => ({
      opacity: [0, 0.8, 0.4, 0],
      scale: [0, 1.2, 0.8, 0],
      y: [0, 15 + i * 12, 35 + i * 18, 60 + i * 25],
      x: [0, (i % 2 === 0 ? 1 : -1) * (4 + i * 2), (i % 2 === 0 ? -1 : 1) * 2, 0],
      transition: {
        duration: 0.6,
        delay: i * 0.04,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed z-50"
          style={{
            bottom: BUTTON_OFFSET,
            right: BUTTON_OFFSET,
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Glow backdrop effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-xl scale-150" />
          </div>

          {/* Main button */}
          <motion.button
            onClick={handleLaunch}
            disabled={rocketState === "launching"}
            className={`
              relative overflow-visible
              w-12 h-12 rounded-full
              bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500
              text-white
              shadow-lg shadow-purple-500/30
              dark:shadow-purple-400/20
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
              focus:ring-offset-transparent
              disabled:cursor-not-allowed
              transition-shadow duration-300
              hover:shadow-xl hover:shadow-purple-500/40
              dark:hover:shadow-purple-400/30
            `}
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
            }}
            whileHover={rocketState === "idle" ? { scale: 1.1 } : undefined}
            whileTap={rocketState === "idle" ? { scale: 0.95 } : undefined}
            aria-label="Scroll to top"
          >
            {/* Animated glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
              animate={rocketState === "idle" ? {
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.15, 1],
              } : { opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ filter: "blur(8px)" }}
            />

            {/* Glow trail during launch */}
            <motion.div
              className="absolute left-1/2 top-full -translate-x-1/2 w-4 h-16 origin-top"
              variants={glowTrailVariants}
              initial="idle"
              animate={rocketState}
            >
              <div className="w-full h-full bg-gradient-to-b from-orange-400 via-orange-500 to-transparent rounded-full blur-sm" />
            </motion.div>

            {/* Exhaust particles */}
            {rocketState === "launching" && (
              <div className="absolute left-1/2 top-full -translate-x-1/2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: -4,
                      top: 4,
                      background: i % 2 === 0
                        ? "linear-gradient(to bottom right, #fb923c, #f97316)"
                        : "linear-gradient(to bottom right, #fbbf24, #f59e0b)",
                      filter: "blur(0.5px)",
                    }}
                    variants={particleVariants}
                    initial="idle"
                    animate="launching"
                    custom={i}
                  />
                ))}
              </div>
            )}

            {/* Rocket icon container */}
            <motion.div
              className="relative z-10 flex items-center justify-center w-full h-full"
              variants={rocketLaunchVariants}
              initial="idle"
              animate={rocketState}
            >
              <Rocket
                className="w-5 h-5 -rotate-45"
                strokeWidth={2.5}
              />
            </motion.div>

            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/20 pointer-events-none" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
