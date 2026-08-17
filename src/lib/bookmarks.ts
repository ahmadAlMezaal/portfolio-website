import {
  BookText,
  FileText,
  Github,
  Package,
  Play,
  Rss,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Bookmark, BookmarkFolder, BookmarkKind } from "@/types";
import { fieldScore, queryTokens, wordsOf } from "@/lib/search";

export const KIND_ICONS: Record<BookmarkKind, LucideIcon> = {
  article: FileText,
  blog: Rss,
  repo: Github,
  package: Package,
  docs: BookText,
  video: Play,
  tool: Wrench,
};

export const folderSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const bookmarkHost = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const bookmarkUrlLabel = (url: string): string =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const countBookmarks = (folders: BookmarkFolder[]): number =>
  folders.reduce((total, folder) => total + folder.bookmarks.length, 0);

export { queryTokens } from "@/lib/search";

const TITLE = 4;
const FOLDER = 3;
const HOST = 2;
const KIND = 2;
const NOTE = 1;

export type BookmarkHit = {
  folder: string;
  bookmark: Bookmark;
};

type Indexed = BookmarkHit & {
  fields: { words: string[]; weight: number }[];
};

const indexFolders = (folders: BookmarkFolder[]): Indexed[] =>
  folders.flatMap((folder) =>
    folder.bookmarks.map((bookmark) => ({
      folder: folder.name,
      bookmark,
      fields: [
        { words: wordsOf(bookmark.title), weight: TITLE },
        { words: wordsOf(folder.name), weight: FOLDER },
        { words: wordsOf(bookmarkHost(bookmark.url)), weight: HOST },
        { words: [bookmark.kind], weight: KIND },
        { words: wordsOf(bookmark.note ?? ""), weight: NOTE },
      ],
    }))
  );

export const searchBookmarks = (
  folders: BookmarkFolder[],
  query: string
): BookmarkHit[] => {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  const scored: { hit: Indexed; score: number; order: number }[] = [];

  indexFolders(folders).forEach((entry, order) => {
    let total = 0;
    for (const token of tokens) {
      let best = 0;
      for (const field of entry.fields) {
        best = Math.max(best, fieldScore(token, field.words, field.weight));
      }
      if (best === 0) return;
      total += best;
    }
    scored.push({ hit: entry, score: total, order });
  });

  return scored
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ hit }) => ({ folder: hit.folder, bookmark: hit.bookmark }));
};

export const recentBookmarks = (
  folders: BookmarkFolder[],
  limit: number
): BookmarkHit[] =>
  folders
    .flatMap((folder) =>
      folder.bookmarks.map((bookmark) => ({ folder: folder.name, bookmark }))
    )
    .sort((a, b) => (b.bookmark.added ?? "").localeCompare(a.bookmark.added ?? ""))
    .slice(0, limit);
