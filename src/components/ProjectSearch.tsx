"use client";

import { Search, X } from "lucide-react";

export const ProjectSearch = ({
  value,
  onChange,
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (value: string) => void;
  resultCount: number | null;
  totalCount: number;
}) => (
  <div className="mb-6">
    <div className="flex justify-center">
      <label className="flex items-center gap-2 w-full max-w-lg px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-[rgb(var(--accent-rgb)/0.6)] transition-colors">
        <Search className="w-4 h-4 shrink-0 text-[rgb(var(--accent-rgb))]" />
        <span className="shrink-0 text-sm text-[rgb(var(--accent-rgb))] select-none">
          $ grep projects
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="name, tag or tech…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search projects"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 text-gray-400 hover:text-[rgb(var(--accent-rgb))] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </label>
    </div>

    <p className="h-5 mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
      {resultCount === null ? "" : `${resultCount} of ${totalCount} projects`}
    </p>
  </div>
);
