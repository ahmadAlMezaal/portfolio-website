"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookText,
  Check,
  ChevronRight,
  Copy,
  FileText,
  Folder,
  FolderOpen,
  Github,
  Package,
  Play,
  Rss,
  Search,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Bookmark, BookmarkFolder, BookmarkKind } from "@/types";
import {
  bookmarkUrlLabel,
  countBookmarks,
  filterFolders,
  folderSlug,
} from "@/lib/bookmarks";
import { useClipboard, useHash } from "@/lib/hooks";
import { cardVariants, gridContainerVariants } from "@/lib/motion";
import { SectionHeading } from "./SectionHeading";

const ROOT = "";

const KIND_ICONS: Record<BookmarkKind, LucideIcon> = {
  article: FileText,
  blog: Rss,
  repo: Github,
  package: Package,
  docs: BookText,
  video: Play,
  tool: Wrench,
};

type Row = {
  folder: string;
  bookmark: Bookmark;
};

const BookmarkRow = ({ row, showFolder }: { row: Row; showFolder: boolean }) => {
  const { copied, copy } = useClipboard();
  const { bookmark } = row;
  const KindIcon = KIND_ICONS[bookmark.kind];

  return (
    <li className="group relative border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 px-4 py-3 pr-14 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/60"
      >
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[rgb(var(--accent-rgb)/0.12)] text-[rgb(var(--accent-rgb))]">
          <KindIcon className="h-3.5 w-3.5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
              {bookmark.title}
            </span>
            {showFolder && (
              <span className="shrink-0 font-mono text-[10px] text-gray-400 dark:text-gray-500">
                {row.folder}/
              </span>
            )}
          </span>

          <span className="mt-0.5 block truncate font-mono text-[11px] text-gray-400 dark:text-gray-500">
            {bookmarkUrlLabel(bookmark.url)}
          </span>

          {bookmark.note && (
            <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
              {bookmark.note}
            </span>
          )}
        </span>

        {bookmark.added && (
          <span className="hidden shrink-0 pt-0.5 font-mono text-[10px] text-gray-400 dark:text-gray-600 sm:block">
            {bookmark.added}
          </span>
        )}
      </a>

      <button
        onClick={() => copy(bookmark.url)}
        aria-label={`Copy link to ${bookmark.title}`}
        className="absolute right-4 top-3 rounded p-1.5 text-gray-400 opacity-0 transition-opacity hover:text-purple-500 focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </li>
  );
};

const SidebarItem = ({
  label,
  count,
  isActive,
  isRoot,
  onSelect,
}: {
  label: string;
  count: number;
  isActive: boolean;
  isRoot: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    aria-current={isActive ? "true" : undefined}
    className={`flex w-auto shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-left transition-colors md:w-full ${
      isActive
        ? "bg-[rgb(var(--accent-rgb)/0.14)] text-[rgb(var(--accent-rgb))]"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    {isRoot ? (
      <FolderOpen className="h-4 w-4 shrink-0" />
    ) : (
      <Folder className="h-4 w-4 shrink-0" />
    )}
    <span className="flex-1 truncate font-mono text-sm">{label}</span>
    <span className="shrink-0 font-mono text-[10px] opacity-60">{count}</span>
  </button>
);

export const Bookmarks = ({
  folders,
  owner,
}: {
  folders: BookmarkFolder[];
  owner: string;
}) => {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const hash = useHash();

  const searching = query.trim().length > 0;
  const total = countBookmarks(folders);

  const activeName = useMemo(() => {
    if (picked !== null) return picked;
    const fromHash = folders.find((f) => folderSlug(f.name) === hash);
    if (fromHash) return fromHash.name;
    return folders[0]?.name ?? ROOT;
  }, [picked, hash, folders]);

  const rows = useMemo<Row[]>(() => {
    const scope = searching
      ? folders
      : folders.filter((f) => activeName === ROOT || f.name === activeName);

    return filterFolders(scope, query).flatMap((folder) =>
      folder.bookmarks.map((bookmark) => ({ folder: folder.name, bookmark }))
    );
  }, [folders, query, searching, activeName]);

  const location = searching
    ? `bookmarks://${owner}/?q=${query.trim()}`
    : `bookmarks://${owner}/${activeName}`;

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants} className="text-center mb-10">
            <SectionHeading
              title="Bookmarks"
              subtitle="Things worth keeping — articles, repos and packages I keep coming back to, filed by topic."
              as="h1"
              cycle={3}
            />
          </motion.div>

          {folders.length === 0 ? (
            <motion.p
              variants={cardVariants}
              className="text-center font-mono text-sm text-gray-400"
            >
              {"// nothing here yet — add `bookmarks` to your portfolio data"}
            </motion.p>
          ) : (
            <motion.div
              variants={cardVariants}
              className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2.5">
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1">
                  <ChevronRight className="h-3 w-3 shrink-0 text-[rgb(var(--accent-rgb))]" />
                  <span className="truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                    {location}
                  </span>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 sm:flex">
                  <Search className="h-3 w-3 shrink-0 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search bookmarks"
                    aria-label="Search bookmarks"
                    className="w-36 bg-transparent font-mono text-[11px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none lg:w-48"
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 sm:hidden">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5">
                  <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search bookmarks"
                    aria-label="Search bookmarks"
                    className="w-full bg-transparent font-mono text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>

              <div className="md:grid md:grid-cols-[13rem_1fr]">
                <nav
                  aria-label="Bookmark folders"
                  className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:overflow-visible md:border-b-0 md:border-r"
                >
                  <SidebarItem
                    label="All bookmarks"
                    count={total}
                    isActive={!searching && activeName === ROOT}
                    isRoot
                    onSelect={() => {
                      setPicked(ROOT);
                      setQuery("");
                    }}
                  />
                  {folders.map((folder) => (
                    <SidebarItem
                      key={folder.name}
                      label={folder.name}
                      count={folder.bookmarks.length}
                      isActive={!searching && activeName === folder.name}
                      isRoot={false}
                      onSelect={() => {
                        setPicked(folder.name);
                        setQuery("");
                      }}
                    />
                  ))}
                </nav>

                <div className="min-w-0">
                  {rows.length === 0 ? (
                    <p className="px-4 py-16 text-center font-mono text-sm text-gray-400">
                      {"// no bookmark matches that"}
                    </p>
                  ) : (
                    <ul>
                      {rows.map((row) => (
                        <BookmarkRow
                          key={row.bookmark.url}
                          row={row}
                          showFolder={searching || activeName === ROOT}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 font-mono text-[10px] text-gray-400 dark:text-gray-500">
                <span>
                  {rows.length} of {total} bookmarks
                </span>
                <span>
                  {folders.length} {folders.length === 1 ? "folder" : "folders"}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
