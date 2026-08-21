"use client";

import { motion } from "motion/react";
import type { ProjectPlatform } from "@/types";
import { DecodeText } from "./DecodeText";

type Tab = {
  platform: ProjectPlatform;
  count: number;
};

export const PlatformTabs = ({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[];
  active: ProjectPlatform;
  onChange: (platform: ProjectPlatform) => void;
}) => (
  <div
    role="tablist"
    aria-label="Filter featured projects by platform"
    className="flex items-end mb-6 overflow-x-auto no-scrollbar"
  >
    <span className="shrink-0 pb-2 pr-3 font-mono text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
      $ cd ~/projects/
    </span>

    {tabs.map((tab) => {
      const isActive = tab.platform === active;
      return (
        <button
          key={tab.platform}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.platform)}
          className={`relative shrink-0 px-4 pb-2 font-mono text-sm transition-colors ${
            isActive
              ? "text-[rgb(var(--accent-rgb))] bg-gradient-to-b from-transparent to-[rgb(var(--accent-rgb)/0.1)]"
              : "text-gray-500 dark:text-gray-400 hover:text-[rgb(var(--accent-rgb)/0.8)]"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <DecodeText text={tab.platform} />
            <span className="text-xs opacity-60">{tab.count}</span>
          </span>

          {isActive && (
            <motion.span
              layoutId="platform-tab"
              className="absolute inset-x-0 bottom-0 h-px bg-[rgb(var(--accent-rgb))]"
              transition={{ duration: 0.25 }}
            />
          )}
          {!isActive && (
            <span className="absolute inset-x-0 bottom-0 h-px bg-gray-200 dark:bg-gray-700" />
          )}
        </button>
      );
    })}

    <span className="flex-1 border-b border-gray-200 dark:border-gray-700 pb-2" />
  </div>
);
