"use client";

import type { ReactNode } from "react";
import DecodeText from "./DecodeText";

type Props = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: ReactNode;
};

export default function FilterPill({ label, isActive, onClick, badge }: Props) {
  return (
    <button
      onClick={onClick}
      className={`glitch-box px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 shadow-lg shadow-purple-500/25"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <DecodeText className="glitch-text" text={label} />
      {badge !== undefined && (
        <span className="ml-1.5 font-mono text-xs opacity-70">{badge}</span>
      )}
    </button>
  );
}
