"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Bookmark, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { bookmarks } from "@/lib/data";
import {
  KIND_ICONS,
  bookmarkHost,
  countBookmarks,
  folderSlug,
} from "@/lib/bookmarks";
import { useIsMobile } from "@/lib/hooks";
import type { BookmarkFolder } from "@/types";

const FolderLinks = ({
  folder,
  onNavigate,
}: {
  folder: BookmarkFolder;
  onNavigate: () => void;
}) => (
  <ul className="py-1">
    {folder.bookmarks.map((bookmark) => {
      const KindIcon = KIND_ICONS[bookmark.kind];
      return (
        <li key={bookmark.url}>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-2.5 px-3 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <KindIcon className="h-3.5 w-3.5 shrink-0 text-[rgb(var(--accent-rgb))]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs text-gray-700 dark:text-gray-200">
                {bookmark.title}
              </span>
              <span className="block truncate font-mono text-[10px] text-gray-400 dark:text-gray-500">
                {bookmarkHost(bookmark.url)}
              </span>
            </span>
          </a>
        </li>
      );
    })}
  </ul>
);

export const BookmarksMenu = () => {
  const [open, setOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (bookmarks.length === 0) return null;

  const active = bookmarks.find((f) => f.name === activeFolder) ?? null;

  const close = () => {
    setOpen(false);
    setActiveFolder(null);
  };

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Bookmarks"
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
          open
            ? "bg-[rgb(var(--accent-rgb)/0.14)] text-[rgb(var(--accent-rgb))]"
            : "text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
        }`}
      >
        <Bookmark size={18} className={open ? "fill-current" : ""} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(15rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Bookmarks
              </span>
              <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                {countBookmarks(bookmarks)}
              </span>
            </div>

            <ul className="py-1">
              {bookmarks.map((folder) => {
                const isActive = activeFolder === folder.name;
                return (
                  <li key={folder.name}>
                    <button
                      onMouseEnter={
                        isMobile ? undefined : () => setActiveFolder(folder.name)
                      }
                      onClick={() =>
                        setActiveFolder((current) =>
                          current === folder.name ? null : folder.name
                        )
                      }
                      aria-expanded={isActive}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-[rgb(var(--accent-rgb))]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {isActive ? (
                        <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <Folder className="h-3.5 w-3.5 shrink-0 text-[rgb(var(--accent-rgb))]" />
                      )}
                      <span className="flex-1 truncate font-mono text-xs">
                        {folder.name}
                      </span>
                      <span className="font-mono text-[10px] opacity-50">
                        {folder.bookmarks.length}
                      </span>
                      <ChevronRight
                        className={`h-3 w-3 shrink-0 opacity-60 transition-transform ${
                          isMobile && isActive ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isMobile && isActive && (
                      <div className="ml-4 border-l border-gray-200 dark:border-gray-700">
                        <FolderLinks folder={folder} onNavigate={close} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              href="/bookmarks"
              onClick={close}
              className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-3 py-2.5 font-mono text-[11px] text-[rgb(var(--accent-rgb))] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              All bookmarks
              <ChevronRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && !isMobile && active && (
          <motion.div
            key={active.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.12 }}
            className="absolute left-full top-full z-50 ml-1 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl"
          >
            {active.description && (
              <p className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 font-mono text-[10px] text-gray-400 dark:text-gray-500">
                {active.description}
              </p>
            )}

            <FolderLinks folder={active} onNavigate={close} />

            <Link
              href={`/bookmarks#${folderSlug(active.name)}`}
              onClick={close}
              className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-3 py-2 font-mono text-[10px] text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Open {active.name}/
              <ChevronRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
