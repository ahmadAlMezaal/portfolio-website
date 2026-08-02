"use client";

import { MapPin } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { useLocalTime } from "@/lib/hooks";

export const AvailabilityPanel = () => {
  const localTime = useLocalTime(personalInfo.timezone);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
        <span className="text-[rgb(var(--accent-rgb))]">$</span> whereami
      </p>

      <div className="mt-3 flex items-start gap-3">
        <span className="relative mt-[7px] flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--accent-rgb))] opacity-70 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--accent-rgb))]" />
        </span>

        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
            <MapPin className="w-4 h-4 shrink-0 text-[rgb(var(--accent-rgb))]" />
            {personalInfo.location}
          </p>
          {localTime && (
            <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400">
              {localTime.time} local · {localTime.offset}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
