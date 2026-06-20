"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import { useTheme } from "./ThemeProvider";

type Props = { roleText: string };

const enter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// Accent-colored blinking caret (height tracks the line's font-size).
function Caret({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`blink-caret inline-block align-middle ${className}`}
      style={{
        width: "0.5ch",
        height: "1em",
        marginLeft: "2px",
        backgroundColor: "rgb(var(--accent-rgb))",
      }}
    />
  );
}

// --- matrix: classic mac-style terminal window ---
function MatrixIntro({ roleText }: Props) {
  return (
    <motion.div
      {...enter}
      className="terminal-window max-w-2xl mx-auto mb-10 text-left rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-purple-500/10 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gray-800/60">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-gray-400">ahmad@portfolio: ~</span>
      </div>

      <div className="p-5 sm:p-7 space-y-1.5">
        <p className="text-sm sm:text-base">
          <span className="text-gray-500">$</span>{" "}
          <span className="text-purple-400">whoami</span>
        </p>
        <p className="text-3xl sm:text-5xl font-bold font-display tracking-tight pb-2">
          <span className="theme-headline inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </p>

        <p className="text-sm sm:text-base pt-2">
          <span className="text-gray-500">$</span>{" "}
          <span className="text-purple-400">cat</span>{" "}
          <span className="text-gray-400">role.txt</span>
        </p>
        <p className="text-lg sm:text-2xl font-semibold text-gray-200 h-8 sm:h-9">
          <span>{roleText}</span>
          <Caret />
        </p>

        <p className="text-sm sm:text-base pt-2">
          <span className="text-gray-500">$</span>{" "}
          <span className="text-purple-400">echo</span>{" "}
          <span className="text-gray-400">$MISSION</span>
        </p>
        <p className="text-sm sm:text-base text-gray-400">{personalInfo.tagline}</p>
      </div>
    </motion.div>
  );
}

// --- cyberpunk: neon HUD nameplate ---
function CyberpunkIntro({ roleText }: Props) {
  return (
    <motion.div
      {...enter}
      className="hud-panel max-w-2xl mx-auto mb-10 text-left"
    >
      <div className="hud-status">System: Online</div>

      <h1 className="hud-name theme-headline bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        {personalInfo.name}
      </h1>

      <div className="hud-role">
        <span style={{ color: "rgb(var(--accent-rgb))" }}>▸</span> {roleText}
        <Caret />
      </div>

      <p className="hud-mission">{personalInfo.tagline}</p>
    </motion.div>
  );
}

// --- amber: retro CRT boot screen ---
function AmberIntro({ roleText }: Props) {
  return (
    <motion.div
      {...enter}
      className="crt-boot max-w-2xl mx-auto mb-10 text-left text-sm sm:text-base"
    >
      <p className="crt-dim">AHMAD.SYS [Version 2.6.2026]</p>
      <p className="crt-dim">(c) 2026 {personalInfo.name}. All rights reserved.</p>
      <p>&nbsp;</p>

      <p>
        <span className="crt-prompt">C:\&gt;</span> whoami
      </p>
      <p className="crt-name theme-headline">
        {personalInfo.name.toUpperCase()}
      </p>

      <p className="pt-2">
        <span className="crt-prompt">C:\&gt;</span> role
      </p>
      <p className="crt-out">
        {roleText}
        <Caret />
      </p>

      <p className="pt-2">
        <span className="crt-prompt">C:\&gt;</span> echo %MISSION%
      </p>
      <p className="crt-out">{personalInfo.tagline}</p>

      <p className="pt-2">
        <span className="crt-prompt">C:\&gt;</span> <Caret />
      </p>
    </motion.div>
  );
}

export default function HeroIntro({ roleText }: Props) {
  const { theme } = useTheme();
  if (theme === "cyberpunk") return <CyberpunkIntro roleText={roleText} />;
  if (theme === "amber") return <AmberIntro roleText={roleText} />;
  return <MatrixIntro roleText={roleText} />;
}
